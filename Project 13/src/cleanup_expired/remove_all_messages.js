require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

(async () => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = 'my_queue';

    // Удаление всех сообщений из очереди
    const { messageCount } = await channel.purgeQueue(queue);
    console.log(`${messageCount} messages removed`);

    await channel.close();
    // Close connection
    connection.close();
  } catch (err) {
    console.warn(err);
  }
})();
