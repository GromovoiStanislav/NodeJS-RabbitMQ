import { Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }
}
