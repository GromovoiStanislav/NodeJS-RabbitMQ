import * as amqplib from 'amqplib';

let counter = 0;

export const initRabbitMQ = async (senderName, ms) => {
  const queueName = 'tasks';
  const conn = await amqplib.connect(process.env.AMQP_URL);

  const chanel = await conn.createChannel();
  await chanel.assertQueue(queueName, { durable: false });

  setInterval(() => {
    counter++;
    chanel.sendToQueue(
      queueName,
      Buffer.from(senderName + ' : something to do ' + counter)
    );
  }, ms);
};
