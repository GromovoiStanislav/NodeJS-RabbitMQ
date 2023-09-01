require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'task_queue';

amqp.connect(amqpUrl, (err, connection) => {
  if (err) return fail(err);

  connection.createChannel((err, channel) => {
    if (err) return fail(err, connection);

    process.once('SIGINT', () => {
      channel.close(() => {
        connection.close();
      });
    });

    channel.assertQueue(queueName, { durable: true }, (err, { queue }) => {
      if (err) return fail(err, connection);

      // channel.prefetch(1);
      channel.consume(
        queueName,
        (message) => {
          const text = message.content.toString();
          console.log("[x] Received '%s'", text);

          const seconds = text.split('.').length - 1;
          setTimeout(() => {
            console.log('[x] Done');
            channel.ack(message);
          }, seconds * 1000);
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
