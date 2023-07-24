import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from './rabbit-m-q.service';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  onModuleInit() {
    this.rabbitMQService.init();
  }


   getHello(): string {
    this.rabbitMQService.sendMessageToExchange( "multicasting_exchange", "", 'Hello World!');
    return 'Hello World!';
  }
}
