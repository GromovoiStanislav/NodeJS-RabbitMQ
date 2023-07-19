import amqplib from 'amqplib';
import { todoSomething } from './servise.js';

export const initRabbitMQ = async (queueName) => {
  const conn = await amqplib.connect(process.env.AMQP_URL);

  const chanel = await conn.createChannel();
  await chanel.assertQueue(queueName, { durable: false });

  chanel.assertExchange('multicasting-exchange', 'fanout');
  chanel.bindQueue(queueName, 'multicasting-exchange', '', {});

  chanel.consume(queueName, async (msg) => {
    try {
      const payload = msg.content.toString();
      console.log(queueName + ' - Recieveed:', payload);
      // TODO something...
      todoSomething(queueName, payload);
      chanel.ack(msg);
      // chanel.nack(msg)
    } catch (err) {
      console.log(err);
    }
  });
};
