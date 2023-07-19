import { Injectable } from "@nestjs/common";
import * as amqplib from "amqplib";

@Injectable()
export class RabbitService {

  initRabbitMQ = async (queueName) => {
    const conn = await amqplib.connect(process.env.AMQP_URL);
    const chanel = await conn.createChannel();
    await chanel.assertQueue(queueName, { durable: false });
    return chanel
  };

  send = async (chanel, queueName, payload) => {
    await chanel.sendToQueue(queueName, Buffer.from(payload));
  };

}