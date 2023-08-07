import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";


@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMQModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
