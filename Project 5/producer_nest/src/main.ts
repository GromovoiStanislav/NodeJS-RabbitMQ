import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { initRabbitMQ } from './rabbit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  // await initRabbitMQ('Sender1', 3000);
  // await initRabbitMQ('Sender2', 5000);
}
bootstrap();
