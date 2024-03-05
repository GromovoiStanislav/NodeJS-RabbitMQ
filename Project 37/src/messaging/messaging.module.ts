import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic'
        }
      ],
      uri: process.env.AMQP_URL
    }),
  ],
  providers: [MessagingService],
  controllers: [MessagingController]
})
export class MessagingModule {}