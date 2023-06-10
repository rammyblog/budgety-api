import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { PaystackModule } from '../lib/paystack/paystack.module';

@Module({
  imports: [PaystackModule],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
