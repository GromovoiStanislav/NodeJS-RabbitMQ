import { Module, OnModuleInit } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RabbitModule } from "./rabbitModule/rabbit.module";

@Module({
  imports: [RabbitModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // await initRabbitMQ('Sender1', 3000);
    // await initRabbitMQ('Sender2', 5000);
  }
}
