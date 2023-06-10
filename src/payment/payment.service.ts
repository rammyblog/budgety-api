import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BudgetService } from '../budget/budget.service';
import { PaystackService } from '../lib/paystack/paystack.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private paystackService: PaystackService,
    @Inject(forwardRef(() => BudgetService))
    private budgetService: BudgetService,
  ) {}

  async initTransactionService(
    budgetId: number,
    userId: number,
    amount: string,
  ) {
    const { email } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const { data } = await this.paystackService.initTransaction({
      email,
      amount,
    });
    await this.prisma.payment.create({
      data: {
        reference: data.reference,
        budgetId,
        userId,
      },
    });
    return {
      authorization_url: data.authorization_url,
      reference: data.reference,
    };
  }

  async paystackWebhook(body) {
    const paymentObj = await this.prisma.payment.findUnique({
      where: { reference: body.reference },
    });
    console.log(body)
    if (body.status === 'success') {
      // activate budget
      await this.budgetService.activateBudget(paymentObj.budgetId);
    }
    return this.prisma.payment.update({
      where: {
        id: paymentObj.id,
      },
      data: {
        status: body.status,
      },
    });
  }
}
