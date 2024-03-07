import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import RabbitmqServer from "../rabbitmq-server";


@Injectable()
export class AnyService implements OnModuleInit {

  constructor(
    private config: ConfigService,
  ) {
  }

  async onModuleInit() {
    const server = new RabbitmqServer(this.config.get("AMQP_URL"));
    await server.start();
    await server.consume('nest', message =>
      console.log(message.content.toString()),
    );
  }
}
