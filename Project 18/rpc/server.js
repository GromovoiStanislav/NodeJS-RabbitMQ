require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'rpc_queue';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    process.once('SIGINT', () => {
      channel.close(() => {
        connection.close();
      });
    });

    channel.assertQueue(queueName, { durable: false }, (err) => {
      if (err) return fail(err, connection);

      channel.prefetch(1);
      channel.consume(
        queueName,
        (message) => {
          const n = parseInt(message.content.toString(), 10);
          console.log('[.] fib(%d)', n);

          const response = fib(n);

          channel.sendToQueue(
            message.properties.replyTo,
            Buffer.from(response.toString()),
            {
              correlationId: message.properties.correlationId,
            }
          );

          channel.ack(message);
        },
        { noAck: false },
        (err) => {
          if (err) return fail(err, connection);

          console.log('[x] Waiting RPC requests. To exit press CTRL+C');
        }
      );
    });
  });
});

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

function fail(err, connection) {
  console.error(err);
  if (connection)
    connection.close(() => {
      process.exit(1);
    });
}
