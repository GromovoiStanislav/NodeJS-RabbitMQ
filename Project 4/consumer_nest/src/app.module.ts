import { Module, OnModuleInit } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { initRabbitMQ } from "./rabbit";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{
  async onModuleInit() {
    // await initRabbitMQ('tasks1');
    // await initRabbitMQ('tasks2');
  }
}
