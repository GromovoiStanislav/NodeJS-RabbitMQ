import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.AMQP_URL
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
