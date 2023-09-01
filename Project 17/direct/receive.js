require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: receive_logs_direct.js [info] [warning] [error]');
  process.exit(1);
}

const exchangeName = 'direct_logs';

const recieveMsg = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'direct', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  // channel.bindQueue(q.queue, exchangeName, 'info');
  // channel.bindQueue(q.queue, exchangeName, 'warning');
  // channel.bindQueue(q.queue, exchangeName, 'error');
  args.forEach((key) => {
    channel.bindQueue(q.queue, exchangeName, key);
  });

  console.log(`Waiting for messages in queue: ${q.queue}`);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `Routing Key: ${
            msg.fields.routingKey
          }, Message: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

recieveMsg();
