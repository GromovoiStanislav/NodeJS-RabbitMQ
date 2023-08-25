require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queue = 'rpc_queue';

(async () => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });

    channel.prefetch(1);

    await channel.consume(queue, (message) => {
      const n = parseInt(message.content.toString(), 10);
      console.log(' [.] fib(%d)', n);
      const response = fib(n);
      channel.sendToQueue(
        message.properties.replyTo,
        Buffer.from(response.toString()),
        {
          correlationId: message.properties.correlationId,
        }
      );
      channel.ack(message);
    });

    console.log(' [x] Awaiting RPC requests. To exit press CTRL+C.');
  } catch (err) {
    console.warn(err);
  }
})();

function fib(n) {
  // Do it the ridiculous, but not most ridiculous, way. For better,
  // see http://nayuki.eigenstate.org/page/fast-fibonacci-algorithms
  let a = 0,
    b = 1;
  for (let i = 0; i < n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return a;
}

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
