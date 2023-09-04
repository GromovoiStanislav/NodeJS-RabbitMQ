require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'test';

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

      channel.consume(
        queueName,
        (message) => {
          if (message)
            console.log(
              "[x] Received '%s'",
              JSON.parse(message.content.toString()).message
            );
          else console.warn('[x] Consumer cancelled');
        },
        { noAck: true },
        (err) => {
          if (err) return fail(err, connection);

          console.log('[*] Waiting for messages... To exit press CTRL+C');
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
