import amqplib from 'amqplib';

export const initRabbitMQ = async (queueName) => {
  const conn = await amqplib.connect(process.env.AMQP_URL);

  const chanel = await conn.createChannel();
  await chanel.assertQueue(queueName, { durable: false });

  chanel.assertExchange('multicasting-exchange', 'fanout');
  chanel.bindQueue(queueName, 'multicasting-exchange', '', {});

  chanel.consume(queueName, async (msg) => {
    try {
      console.log(queueName + ' - Recieveed:', msg.content.toString());
      // TODO something...
      chanel.ack(msg);
      // chanel.nack(msg)
    } catch (err) {
      console.log(err);
    }
  });
};
