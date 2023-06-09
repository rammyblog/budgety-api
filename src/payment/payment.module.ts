import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaystackModule } from '../lib/paystack/paystack.module';
import { BudgetModule } from '../budget/budget.module';

@Module({
  imports: [forwardRef(() => BudgetModule), PaystackModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
