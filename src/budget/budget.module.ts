import { Module, forwardRef } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetModule {}
