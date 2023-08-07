import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {

  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.AMQP_URL); // Замените URL на вашу конфигурацию RabbitMQ
      this.channel = await this.connection.createChannel();
    } catch (error) {
      throw new Error("Ошибка при подключении к RabbitMQ");
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }


  async sendMessageToExchange(exchangeName: string, routingKey: string, message: any) {
    try {
      // Публикация сообщения в обменник
      this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
      console.log(`Сообщение отправлено в обменник ${exchangeName} с ключом маршрутизации ${routingKey}`);
    } catch (error) {
      throw new Error("Ошибка при отправке сообщения в обменник");
    }
  }

  async sendMessageToQueue(queueName: string, message: any) {
    try {
      //await this.channel.assertQueue(queueName);

      // Опубликовать сообщение в очереди
      this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log(`Сообщение отправлено в очередь ${queueName}`);
    } catch (error) {
      throw new Error("Ошибка при отправке сообщения в очередь");
    }
  }


}
