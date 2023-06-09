import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from 'src/lib/paystack/paystack.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private paystackService: PaystackService,
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
}
