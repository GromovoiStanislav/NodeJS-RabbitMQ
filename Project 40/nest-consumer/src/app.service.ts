import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'payments',
    queue: 'test',
  })
  consumerRabbit(msg) {
    console.log(`${JSON.stringify(msg)}`);
  }

}