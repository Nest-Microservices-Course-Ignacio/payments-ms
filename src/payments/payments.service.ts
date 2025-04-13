import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe = new Stripe(envs.stripeSecretKey);

  async createPaymentSession(payload: CreatePaymentSessionDto) {
    const { items, currency, orderId } = payload;
    return await this.stripe.checkout.sessions.create({
      // add id of the order
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${envs.apiGateway}/payments/success`,
      cancel_url: `${envs.apiGateway}/payments/cancel`,
    });
  }

  webhook(request: Request, response: Response) {
    const signature = request.headers['stripe-signature'];
    const endpointSecret = envs.webhookSecret;

    /* testing */
    // const endpointSecret =
    //   'whsec_478f217ebedee318f7c6d357475320f349d9eb7ec0b6cda109c019a6571acc9c';

    try {
      const stripeEvent: Stripe.Event = this.stripe.webhooks.constructEvent(
        request['rawBody'],
        signature,
        endpointSecret,
      );
      // call microservice
      switch (stripeEvent.type) {
        case 'charge.succeeded':
          {
            const chargeSucceeded = stripeEvent.data.object;
            const metadata = chargeSucceeded.metadata;
            console.log(metadata);
          }
          break;
        default:
          console.log(`Unhandled event type ${stripeEvent.type}`);
      }
    } catch (error) {
      return response.status(400).json({ message: `Webhook Error: ${error}` });
    }
  }
}
