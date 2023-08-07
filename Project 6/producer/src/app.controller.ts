import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post()
  getHello(@Body() body: any): string {
    return this.appService.getHello(body);
  }
}
