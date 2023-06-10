import { Module, forwardRef } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { BankModule } from 'src/bank/bank.module';
import { BudgetProcessor } from './budget.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
      name: 'budgets',
    }),
    BankModule,
  ],
  providers: [BudgetService, BudgetProcessor],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetModule {}
