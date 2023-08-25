require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchange = 'logs';
const text = process.argv.slice(2).join(' ') || 'info: Hello World!';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const sended = channel.publish(exchange, '', Buffer.from(text));
    if (sended) {
      console.log(" [x] Sent '%s'", text);
    }

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
})();
