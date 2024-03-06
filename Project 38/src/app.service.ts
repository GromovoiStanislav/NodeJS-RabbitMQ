import { Injectable } from "@nestjs/common";
import RabbitMQClient from "./rabbitmq/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {

  constructor(
    private config: ConfigService,
    private readonly rabbitMQClient: RabbitMQClient
  ) {
  }


  async getHello(correlationId: string) {
    // this.rabbitMQClient.produce({ msg: "Hello" }, this.config.get("rabbitMQ.queues.testRequestQueue"), correlationId)

    this.rabbitMQClient.produce({ msg: "Hello" }, this.config.get("rabbitMQ.queues.testRequestQueue"), correlationId,true)
      .then(response=>response().then(reply=>console.log('AppService',reply)))
    return "Hello World!";
  }
}
