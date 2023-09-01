require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'task_queue';
const text = process.argv.slice(2).join(' ') || 'Hello World!';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    channel.assertQueue(queueName, { durable: true }, (err) => {
      if (err) return fail(err, connection);

      channel.sendToQueue(queueName, Buffer.from(text), { persistent: true });
      console.log("[x] Sent '%s'", text);

      channel.close(() => {
        connection.close();
        process.exit(1);
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
