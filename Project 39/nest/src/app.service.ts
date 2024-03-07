import { Injectable } from "@nestjs/common";
import RabbitmqServer from "./rabbitmq-server";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {

  constructor(
    private config: ConfigService
  ) {
  }

  getHello(): string {
    return "Hello World!";
  }

  async nest(body) {
    const server = new RabbitmqServer(this.config.get("AMQP_URL"));
    await server.start();
    await server.publishInQueue("express", JSON.stringify(body));
    await server.publishInExchange("amq.direct", "routing-key-1", JSON.stringify(body));
    return body;
  }
}