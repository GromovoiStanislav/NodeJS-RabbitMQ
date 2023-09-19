require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const { basename } = require('node:path');
const { randomUUID } = require('node:crypto');

const queueName = 'rpc_queue';

const n = parseInt(process.argv[2], 10);
if (isNaN(n)) {
  console.warn('Usage: %s number', basename(process.argv[1]));
  process.exit(1);
}

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return bail(err);

  connection.createChannel((err, channel) => {
    if (err) return bail(err, connection);

    channel.assertQueue('', { exclusive: true }, (err, { queue: replyTo }) => {
      if (err) return fail(err, connection);

      const correlationId = randomUUID();
      channel.consume(
        replyTo,
        (message) => {
          if (!message) console.warn('[x] Consumer cancelled');
          else if (message.properties.correlationId === correlationId) {
            console.log('[.] Got %d', message.content.toString());

            channel.close(() => {
              connection.close();
              process.exit(1);
            });
          }
        },
        { noAck: true }
      );

      channel.assertQueue(queueName, { durable: false }, (err) => {
        if (err) return fail(err, connection);

        console.log('[x] Requesting fib(%d)', n);
        channel.sendToQueue(queueName, Buffer.from(n.toString()), {
          correlationId,
          replyTo,
        });
      });
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
