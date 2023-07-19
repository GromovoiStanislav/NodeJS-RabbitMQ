import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQ } from './rabbit';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RabbitMQ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // await initRabbitMQ('consumer1');
    // await initRabbitMQ('consumer2');
  }
}
