import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config/services';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe = new Stripe(envs.stripeSecretKey);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async createPaymentSession(payload: CreatePaymentSessionDto) {
    const { items, currency, orderId } = payload;
    const paymentSession = await this.stripe.checkout.sessions.create({
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

    return {
      success_url: paymentSession.success_url,
      cancel_url: paymentSession.cancel_url,
      url: paymentSession.url,
    };
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
            const payload = {
              stripePaymentId: chargeSucceeded.id,
              orderId: chargeSucceeded.metadata.orderId,
              receipUrl: chargeSucceeded.receipt_url,
            };

            // Logger.log({ payload });
            // this just emit an event but is not waiting for response
            this.client.emit('payment.succeeded', payload);
          }
          break;
        default:
          console.log(`Unhandled event type ${stripeEvent.type}`);
      }
      return response.status(200).json({ signature });
    } catch (error) {
      return response.status(400).json({ message: `Webhook Error: ${error}` });
    }
  }
}
