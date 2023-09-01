require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = 'fanout_logs';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    process.once('SIGINT', () => {
      channel.close(() => {
        connection.close();
      });
    });

    channel.assertExchange(
      exchangeName,
      'fanout',
      { durable: false },
      (err, { exchange }) => {
        if (err) return fail(err, connection);

        channel.assertQueue('', { exclusive: true }, (err, { queue }) => {
          if (err) return fail(err, connection);

          channel.bindQueue(queue, exchange, '', {}, (err) => {
            if (err) return fail(err, connection);

            channel.consume(
              queue,
              (message) => {
                if (message)
                  console.log("[x] '%s'", message.content.toString());
                else console.warn('[x] Consumer cancelled');
              },
              { noAck: true },
              (err) => {
                if (err) return fail(err, connection);

                console.log('[*] Waiting for logs. To exit press CTRL+C');
              }
            );
          });
        });
      }
    );
  });
});

function fail(err, connection) {
  console.error(err);
  if (connection)
    connection.close(() => {
      process.exit(1);
    });
}
