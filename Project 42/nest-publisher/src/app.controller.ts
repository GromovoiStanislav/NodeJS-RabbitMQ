import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
export class AppController {

  constructor(
    private amqpConnection: AmqpConnection
  ) {
  }

  @Post("rabbit-publish")
  publisherRabbitMQ(@Body() body) {
    this.amqpConnection.publish("amq.direct", "payments", body);
    return { message: "message published" };
  }

}