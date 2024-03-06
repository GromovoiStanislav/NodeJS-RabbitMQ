import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() request: Request) {
    // @ts-ignore
    return this.appService.getHello(request.correlationId());
  }
}
