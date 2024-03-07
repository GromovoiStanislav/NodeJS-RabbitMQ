import { Controller, Post, Req } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request } from "express";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {
  }

  @Post("test")
  async test(@Req() request: Request) {
    // @ts-ignore
    return this.appService.test(request.correlationId());
  }

  @Post("test2")
  async test2(@Req() request: Request) {
    // @ts-ignore
    return this.appService.test2(request.correlationId());
  }
}
