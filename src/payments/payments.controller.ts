import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { Request, Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @MessagePattern({ cmd: 'create.payment.session' })
  createPaymentSession(@Body() payload: CreatePaymentSessionDto) {
    return this.paymentsService.createPaymentSession(payload);
  }

  @Post('webhook')
  stripeWebhook(@Req() request: Request, @Res() response: Response) {
    return this.paymentsService.webhook(request, response);
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
