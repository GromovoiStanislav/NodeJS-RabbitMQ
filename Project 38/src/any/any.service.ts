import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import RabbitMQClient from "../rabbitmq/client";

@Injectable()
export class AnyService implements OnModuleInit {

  constructor(
    private config: ConfigService,
    private readonly rabbitMQClient: RabbitMQClient
  ) {
  }

  onModuleInit() {
    const channel = this.rabbitMQClient.getConsumerChannel();

    //Consume the messages that arrives on the queue
    channel.consume(
      this.config.get("rabbitMQ.queues.test2RequestQueue"),
      (message) => {
        //TODO: Create switch case to perform different functions
        console.log("consume ", JSON.parse(message.content.toString()));
      },
      {
        noAck: true
      }
    );
  }
}
