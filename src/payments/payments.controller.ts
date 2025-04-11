import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() payload: CreatePaymentSessionDto) {
    return this.paymentsService.createPaymentSession(payload);
  }

  @Post('webhook')
  stripeWebhook() {
    return 'stripe webhook';
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }
}
