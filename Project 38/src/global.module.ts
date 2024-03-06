import { Global, Module } from "@nestjs/common";
import RabbitMQClient from "./rabbitmq/client";

@Global()
@Module({
  providers: [RabbitMQClient],
  exports: [RabbitMQClient]
})
export class GlobalModule {
}