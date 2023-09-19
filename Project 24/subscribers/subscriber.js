require('dotenv').config();
const amqp = require('amqplib/callback_api');
const fibonacci = require('../math-logic/fibonacci-series');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    process.once('SIGINT', () => {
      channel.close(() => {
        connection.close();
      });
    });

    const queueName = 'fib-queue';
    channel.assertQueue(queueName, { durable: false }, (err) => {
      if (err) return fail(err, connection);

      channel.consume(
        queueName,
        async (message) => {
          if (message) {
            const num = message.content.toString();
            const fibNum = await fibonacci(parseInt(num));
            console.log("Received '%s' - Fibonacci '%d'", num, fibNum);

            channel.ack(message);
            // or channel.nack(message);
          } else {
            console.warn('[x] Consumer cancelled');
          }
        },
        { noAck: false },
        (err) => {
          if (err) return fail(err, connection);

          console.log('[*] Waiting for messages. To exit press CTRL+C');
        }
      );
    });
  });
});

function fail(err, connection) {
  console.error(err);
  if (connection)
    connection.close(() => {
      process.exit(1);
    });
}
