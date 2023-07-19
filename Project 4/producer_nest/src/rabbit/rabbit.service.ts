import { Injectable } from "@nestjs/common";
import * as amqplib from "amqplib";

@Injectable()
export class RabbitService {

  initRabbitMQ = async (exchangeName) => {
    const conn = await amqplib.connect(process.env.AMQP_URL);
    const chanel = await conn.createChannel();
    await chanel.assertExchange(exchangeName, "fanout");
    return chanel;
  };

  publish = async (chanel, exchangeName, payload) => {
    await chanel.publish(exchangeName, "", Buffer.from(payload));
  };

}