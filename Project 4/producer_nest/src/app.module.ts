import { Module, OnModuleInit } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitModule } from "./rabbit/rabbit.module";
// import { initRabbitMQ } from "./rabbit";

@Module({
  imports: [RabbitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements  OnModuleInit {
  async onModuleInit() {
    // await initRabbitMQ();
  }
}
