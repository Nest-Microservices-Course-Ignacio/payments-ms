import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NatsClientModule } from 'src/transports/nats-client.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [NatsClientModule],
})
export class PaymentsModule {}
