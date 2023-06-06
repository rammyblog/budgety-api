import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaystackService],
  exports: [PaystackService],
})
export class PaystackModule {}
