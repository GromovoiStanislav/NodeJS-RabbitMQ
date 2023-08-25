require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queue = 'task_queue';

const text = process.argv.slice(2).join(' ') || 'Hello World!';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    const sended = channel.sendToQueue(queue, Buffer.from(text), {
      persistent: true,
    });

    if (sended) {
      console.log(" [x] Sent '%s'", text);
    }

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    await connection.close();
  }
})();
