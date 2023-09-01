require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'hello_queue';
const text = 'Hello World!';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    channel.assertQueue(queueName, { durable: false }, (err) => {
      if (err) return fail(err, connection);

      channel.sendToQueue(queueName, Buffer.from(text));
      console.log("[x] Sent '%s'", text);

      channel.close(() => {
        connection.close();
        process.exit(0);
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
