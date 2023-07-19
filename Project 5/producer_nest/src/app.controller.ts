import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { RabbitService } from "./rabbitModule/rabbit.service";
import { Channel } from "amqplib";

@Controller()
export class AppController {

  queueName: string;
  chanel: Channel;

  constructor(
    private readonly appService: AppService,
    private readonly rabbitService: RabbitService
  ) {
    this.queueName = "tasks";
  }


  async onApplicationBootstrap() {
    this.chanel = await this.rabbitService.initRabbitMQ(this.queueName);
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getMessage(): string {
    this.rabbitService.send(this.chanel, this.queueName, "Sender1 : getHello");
    return "OK";
  }

}
