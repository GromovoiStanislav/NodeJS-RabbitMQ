import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { initRabbitMQ } from './rabbit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
  
  // await initRabbitMQ('tasks1');
  // await initRabbitMQ('tasks2');
}
bootstrap();
