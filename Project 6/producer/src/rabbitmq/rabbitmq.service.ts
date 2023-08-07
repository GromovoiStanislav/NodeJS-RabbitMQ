import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class RabbitmqService {

  private connection: amqp.Connection;
  private channel: amqp.Channel;


  async init() {
    try {
      this.connection = await amqp.connect(process.env.AMQP_URL); // Замените URL на вашу конфигурацию RabbitMQ
      this.channel = await this.connection.createChannel();

      // Возможно, вы также захотите декларировать обменник здесь
      // Пример декларации обменника:
      //await this.channel.assertExchange(exchangeName, 'fanout');
    } catch (error) {
      throw new Error("Ошибка при подключении к RabbitMQ");
    }
  }


  async sendMessageToExchange(exchangeName: string, routingKey: string, message: any) {
    try {
      // Публикация сообщения в обменник
      this.channel.publish(exchangeName, routingKey, Buffer.from(message));
      console.log(`Сообщение отправлено в обменник ${exchangeName} с ключом маршрутизации ${routingKey}`);
    } catch (error) {
      throw new Error("Ошибка при отправке сообщения в обменник");
    }
  }


  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }

}
