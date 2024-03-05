require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

const subscribe = async () => {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  const exchange = 'messages';

  await channel.assertExchange(exchange, 'fanout', {
    durable: false,
  });

  const q = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(q.queue, exchange, '');

  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log(' [x] %s', msg.content.toString());
      }
    },
    { noAck: true }
  );
};

subscribe();
