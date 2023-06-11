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
        // redis: {
        //   username: configService.get('REDIS_USER'),
        //   password: configService.get('REDIS_PASSWORD'),
        //   host: configService.get('REDIS_HOST'),
        //   family: 6,
        //   port: 6379,
        // },
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
