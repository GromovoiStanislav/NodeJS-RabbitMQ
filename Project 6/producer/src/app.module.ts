import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { RabbitmqModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitmqModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
