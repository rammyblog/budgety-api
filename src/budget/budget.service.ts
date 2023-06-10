import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto';
import { PaymentService } from 'src/payment/payment.service';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Budget } from '@prisma/client';
import { BankService } from 'src/bank/bank.service';

@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);
  constructor(
    private prisma: PrismaService,
    private bankService: BankService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    @InjectQueue('budgets') private budgetQueue: Queue,
  ) {}

  async createBudget(userId: number, dto: CreateBudgetDto) {
    const totalBudgetItemsAmount = dto.budgetItems.reduce(
      (accumulator, { amount }) => accumulator + amount,
      0,
    );
    if (totalBudgetItemsAmount !== dto.amount) {
      throw new BadRequestException('Amount not equals');
    }
    const budget = await this.prisma.budget.create({
      data: {
        amount: dto.amount,
        name: dto.name,
        userId: userId,
      },
    });

    const budgetItemsPayload = dto.budgetItems.map((items) => {
      return { ...items, budgetId: budget.id };
    });

    await this.prisma.budgetItem.createMany({
      data: budgetItemsPayload,
    });
    return { budget, budgetItems: budgetItemsPayload };
  }

  fetchBudgets(userId: number) {
    return this.prisma.budget.findMany({
      where: {
        userId,
      },
      include: {
        budgetItems: true,
      },
    });
  }

  async payForBudget(userId: number, budgetId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
    });
    const amount = String(budget.amount * 100);
    return this.paymentService.initTransactionService(budgetId, userId, amount);
  }

  async activateBudget(budgetId: number) {
    const { id } = await this.prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
    });

    return this.prisma.budget.update({
      where: {
        id,
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Interval(10000)
  async fetchBudgetsForProcessing() {
    // fetch all budgets
    const budgets = await this.prisma.budget.findMany({
      include: { budgetItems: true },
    });
    budgets.map((_) => this.budgetQueue.add('budgets', _));
    // console.log(this)
    this.logger.debug('Called every 10 seconds');
  }

  async processIndividualJob(budget: Budget, job: Job<Budget>) {
    // it processes at midnight, but just to be sure
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const recurringExpenses = await this.prisma.budgetItem.findMany({
      where: { budgetId: budget.id, type: 'RECURRING', date: today },
    });
    await job.log(`Daily Expenses fetched, count: ${recurringExpenses.length}`);
    const oneTimeExpenses = await this.prisma.budgetItem.findMany({
      where: {
        budgetId: budget.id,
        type: 'NON_RECURRING',
        date: {
          gte: today,
          lte: tomorrow,
        },
      },
    });
    await job.log(
      `One time Expenses fetched, count: ${oneTimeExpenses.length}`,
    );
    const expenses = [...recurringExpenses, ...oneTimeExpenses];
    const totalMoneyToPayOutNow = expenses.reduce(
      (accumulator, { amount }) => accumulator + amount,
      0,
    );
    await job.log(`Total amount to reinburse: ${totalMoneyToPayOutNow}`);
    const userBank = await this.bankService.findBanks(budget.userId);
    if (!userBank) {
      throw new Error('This user has no bank');
    }
    // pay to bank
    await this.paymentService.payToBank(userBank, totalMoneyToPayOutNow * 100);
  }
}
