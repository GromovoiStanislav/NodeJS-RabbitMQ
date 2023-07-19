import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { initRabbitMQ } from './rabbit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  //await initRabbitMQ();
}
bootstrap();
