require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const { randomUUID } = require('crypto');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: rpc/client.js num');
  process.exit(1);
}

const num = parseInt(args[0]);

const getFib = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  const q = await channel.assertQueue('', { exclusive: true });

  console.log('[x] Requesting fib(%d)', num);
  const uuid = randomUUID();
  channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.properties.correlationId == uuid) {
        console.log('[.] Got %s', msg.content.toString());

        setTimeout(() => {
          connection.close();
          process.exit(0);
        }, 500);
      }
    },
    { noAck: true }
  );
};

getFib();
