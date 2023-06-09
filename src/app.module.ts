import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BankModule } from './bank/bank.module';
import { PaystackModule } from './lib/paystack/paystack.module';
import { BudgetModule } from './budget/budget.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    BankModule,
    PaystackModule,
    BudgetModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
