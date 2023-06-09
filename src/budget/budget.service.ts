import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class BudgetService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
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

    this.prisma.budget.update({
      where: {
        id,
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }
}
