import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {

  private connection: amqp.Connection;
  private channel: amqp.Channel;


  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.AMQP_URL); // URI вашего RabbitMQ сервера
      this.channel = await this.connection.createChannel();
    } catch (error) {
      throw new Error("Ошибка при подключении к RabbitMQ");
    }
  }


  getChannel(): amqp.Channel {
    return this.channel;
  }


  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

}
