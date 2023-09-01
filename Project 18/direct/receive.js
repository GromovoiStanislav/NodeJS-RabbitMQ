require('dotenv').config();
const amqp = require('amqplib/callback_api');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const { basename } = require('node:path');
const severities = process.argv.slice(2);
if (severities.length < 1) {
  console.log('Usage %s [info] [warning] [error]', basename(process.argv[1]));
  process.exit(1);
}

const exchangeName = 'direct_logs';

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
      'direct',
      { durable: false },
      (err, { exchange }) => {
        if (err) return fail(err, connection);

        channel.assertQueue('', { exclusive: true }, (err, { queue }) => {
          if (err) return fail(err, connection);

          channel.consume(
            queue,
            (message) => {
              if (message)
                console.log(
                  "[x] %s:'%s'",
                  message.fields.routingKey,
                  message.content.toString()
                );
              else console.warn(' [x] Consumer cancelled');
            },
            { noAck: true },
            (err) => {
              if (err) return fail(err, connection);

              console.log('[*] Waiting for logs. To exit press CTRL+C');

              //   severities.forEach((severity) => {
              //     channel.bindQueue(queue, exchange, severity);
              //   });

              subscribeAll(channel, exchange, queue, severities, (err) => {
                if (err) return fail(err, connection);
              });
            }
          );
        });
      }
    );
  });
});

function subscribeAll(channel, exchange, queue, bindingKeys, cb) {
  if (bindingKeys.length === 0) return cb();

  const bindingKey = bindingKeys.shift();

  channel.bindQueue(queue, exchange, bindingKey, {}, (err) => {
    if (err) return cb(err);

    subscribeAll(channel, exchange, queue, bindingKeys, cb);
  });
}

function fail(err, connection) {
  console.error(err);
  if (connection)
    connection.close(() => {
      process.exit(1);
    });
}
