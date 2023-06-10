import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { PaymentService } from './payment.service';
import { GetPaystackHeaders } from './decorator/get-paystack-header';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private config: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  paystackWebhook(
    @GetPaystackHeaders('x-paystack-signature') paystackHeader,
    @Body() body,
  ) {
    const hash = crypto
      .createHmac('sha512', this.config.get('PAYSTACK_SECRET_KEY'))
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash === paystackHeader) {
      if (body.event === 'charge.success') {
        this.paymentService.paystackWebhook(body.data);
      }
      return;
    }
    return;
  }
}
