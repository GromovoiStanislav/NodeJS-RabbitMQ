import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RabbitMQ, initRabbitMQ } from './rabbit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
  // await initRabbitMQ('consumer1');
  // await initRabbitMQ('consumer2');
}
bootstrap();
