require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = 'header_logs';

const args = process.argv.slice(2);
const msg = args[0] || 'Subscribe, Like, Comment';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    channel.assertExchange(
      exchangeName,
      'headers',
      { durable: false },
      (err, { exchange }) => {
        if (err) return fail(err, connection);

        channel.publish(exchange, '', Buffer.from('old github'), {
          headers: { account: 'old', method: 'github' },
        });
        console.log('Sent: ', 'old github');
        channel.publish(exchange, '', Buffer.from('new github'), {
          headers: { account: 'new', method: 'github' },
        });
        console.log('Sent: ', 'new github');
        channel.publish(exchange, '', Buffer.from('new google'), {
          headers: { account: 'new', method: 'google' },
        });
        console.log('Sent: ', 'new google');
        channel.publish(exchange, '', Buffer.from('old facebook'), {
          headers: { account: 'old', method: 'facebook' },
        });
        console.log('Sent: ', 'old facebook');

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
