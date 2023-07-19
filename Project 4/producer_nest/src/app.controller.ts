import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { RabbitService } from "./rabbit/rabbit.service";
import { Channel } from "amqplib";

@Controller()
export class AppController {

  exchangeName: string;
  chanel: Channel;

  constructor(
    private readonly appService: AppService,
    private readonly rabbitService: RabbitService
  ) {
    this.exchangeName = "multicasting-exchange";
  }


  async onApplicationBootstrap() {
    this.chanel = await this.rabbitService.initRabbitMQ(this.exchangeName);
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getMessage(): string {
    this.rabbitService.publish(this.chanel, this.exchangeName, "Sender1 : getHello");
    return "OK";
  }

}
