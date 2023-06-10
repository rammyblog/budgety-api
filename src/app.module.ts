import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BankModule } from './bank/bank.module';
import { PaystackModule } from './lib/paystack/paystack.module';
import { BudgetModule } from './budget/budget.module';
import { PaymentModule } from './payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({}),

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
