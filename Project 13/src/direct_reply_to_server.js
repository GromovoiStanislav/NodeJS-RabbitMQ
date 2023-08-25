require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queue = 'rpc_queue';

(async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });

  await channel.assertQueue(queue, { durable: false });

  await channel.consume(
    queue,
    (message) => {
      console.log(message.content.toString());
      channel.sendToQueue(message.properties.replyTo, Buffer.from(' [.] pong'));
    },
    { noAck: true }
  );

  console.log(' [x] To exit press CTRL+C.');
})();
