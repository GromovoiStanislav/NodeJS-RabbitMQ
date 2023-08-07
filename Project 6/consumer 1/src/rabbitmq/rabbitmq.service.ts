import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {

  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private queueName: string = "tasks"; // Замените на имя вашей очереди

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.AMQP_URL); // URI вашего RabbitMQ сервера
      this.channel = await this.connection.createChannel();

      this.channel.consume(this.queueName, (message) => {
        if (message) {
          console.log("Получено сообщение из очереди:");
          console.log(message.content.toString());
          // Здесь вы можете обработать полученное сообщение как вам необходимо
          this.channel.ack(message); // Подтверждение обработки сообщения (можно не использовать, если не требуется подтверждение)
        }
      });

    } catch (error) {
      throw new Error("Ошибка при подключении к RabbitMQ");
    }
  }


  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

}
