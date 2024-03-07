import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";


@Controller()
export class AppController {

  constructor(
    private appService: AppService
  ) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("nest")
  async nest(@Body() body) {
    return this.appService.nest(body);

  }
}