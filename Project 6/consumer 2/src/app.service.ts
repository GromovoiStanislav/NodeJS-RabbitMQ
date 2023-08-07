import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq/rabbitmq.service";

@Injectable()
export class AppService implements OnModuleInit {

  constructor(private readonly rabbitMQService: RabbitMQService) {
  }

  async onModuleInit() {
    const queueName = 'tasks'; // Замените на имя вашей очереди

    const channel = this.rabbitMQService.getChannel();
    //await channel.assertQueue(queueName);

    channel.consume(queueName, (message) => {
      if (message) {
        console.log("Получено сообщение из очереди:");
        console.log(message.content.toString());
        // Здесь вы можете обработать полученное сообщение как вам необходимо
        channel.ack(message); // Подтверждение обработки сообщения (можно не использовать, если не требуется подтверждение)
      }
    });

  }

  getHello(): string {
    return "Hello World!";
  }


}
