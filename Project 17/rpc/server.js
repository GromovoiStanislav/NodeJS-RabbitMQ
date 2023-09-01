require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'rpc_queue';

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}

const processTask = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log('[x] Awaiting RPC requests');
  channel.prefetch(1);
  channel.consume(
    queueName,
    (msg) => {
      const n = parseInt(msg.content.toString());
      console.log('[.] fib(%d)', n);

      const fibNum = fibonacci(n);

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(fibNum.toString()),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      channel.ack(msg);
    },
    { noAck: false }
  );
};

processTask();
