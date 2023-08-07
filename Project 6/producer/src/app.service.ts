import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq/rabbitmq.service";

@Injectable()
export class AppService {

  constructor(
    private readonly rabbitMQService: RabbitMQService) {
  }

  getHello(body: any): string {
    //this.rabbitMQService.sendMessageToExchange( "multicasting_exchange", "", body);
    this.rabbitMQService.sendMessageToQueue("tasks", body);
    return "Hello World!";
  }


}
