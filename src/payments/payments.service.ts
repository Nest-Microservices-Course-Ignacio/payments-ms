import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from 'src/config/envs';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe = new Stripe(envs.stripeSecretKey);
}
