require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = 'direct_logs';

const args = process.argv.slice(2);
const routingKey = args.length > 0 ? args[0] : 'info';
const text = args.slice(1).join(' ') || 'Hello World!';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    channel.assertExchange(
      exchangeName,
      'direct',
      { durable: false },
      (err, { exchange }) => {
        if (err) return fail(err, connection);

        channel.publish(exchange, routingKey, Buffer.from(text));
        console.log(" [x] Sent '%s'", text);

        channel.close(() => {
          connection.close();
          process.exit(1);
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
