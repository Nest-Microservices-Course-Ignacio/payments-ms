import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from 'src/config/envs';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe = new Stripe(envs.stripeSecretKey);

  async createPaymentSession(payload: CreatePaymentSessionDto) {
    const { items, currency } = payload;
    return await this.stripe.checkout.sessions.create({
      // add id of the order
      payment_intent_data: {
        metadata: {},
      },
      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/api/payments/success',
      cancel_url: 'http://localhost:3000/api/payments/cancel',
    });
  }
}
