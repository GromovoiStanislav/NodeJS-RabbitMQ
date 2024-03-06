import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as correlationId from "express-correlation-id";
import { ConfigService } from "@nestjs/config";
import RabbitMQClient from "./rabbitmq/client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(correlationId());

  //Connect to rabbitMQ to produce/consume messages
  const rabbitClient = app.get(RabbitMQClient);
  await rabbitClient.initialize();

  process.on("SIGINT", async () => {
    await rabbitClient.closeConnection();
    process.exit(1);
  });

  await app.listen(config.get("server.port"));
}

bootstrap();
