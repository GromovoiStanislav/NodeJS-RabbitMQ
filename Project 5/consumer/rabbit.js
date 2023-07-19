import amqplib from 'amqplib';

export const initRabbitMQ = async (consumerName) => {
  const queueName = 'tasks';

  const conn = await amqplib.connect(process.env.AMQP_URL);

  const chanel = await conn.createChannel();
  await chanel.assertQueue(queueName, { durable: false });

  // chanel.prefetch(1); //consumer принимает только по 1 сообщению из очереди

  chanel.consume(
    queueName,
    async (msg) => {
      try {
        const payload = msg.content.toString();

        console.log(consumerName + ' Recieveed:', payload);

        if (consumerName === 'consumer1') {
          chanel.nack(msg);
        } else if (consumerName === 'consumer2') {
          // await wait(2000);
          console.log(consumerName + ' Continue processing:', payload);
          // TODO something...
          chanel.ack(msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
  );
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
