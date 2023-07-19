import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { initRabbitMQ } from "./rabbit";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}


  async onApplicationBootstrap() {
    await initRabbitMQ('tasks1');
    await initRabbitMQ('tasks2');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
