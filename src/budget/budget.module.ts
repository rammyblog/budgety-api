import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [PaymentModule],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule {}
