require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

(async () => {
  try {
    const connection = await amqp.connect(amqpUrl);

    const channel = await connection.createChannel();
    const queue = 'my_queue';
    const msg = `Hello World! ${Date.now()}`;

    await channel.assertQueue(queue, {
      // durable: true,// долгострочное хранение
      // durable: false,// временное хранение
      arguments: {
        'x-message-ttl': 60000, // Настройка TTL для очереди в миллисекундах (60 секунд)
        'x-expires': 3600000, //Время жизни самой очереди без активности в миллисекундах (1 час)
      },
    });

    // Send the message to the queue
    channel.sendToQueue(queue, Buffer.from(msg), {
      expiration: 15_000, // Настройка TTL для отделного сообщения в миллисекундах (15 секунд)
      // persistent: true, // долгострочное хранение даже при durable: false
      // persistent: false, // временное хранение даже при durable: true
    });
    console.log(" [x] Sent '%s'", msg);
    await channel.close();

    // Close connection
    connection.close();
  } catch (e) {
    // Catch and display any errors in the console
    console.log(e);
  }
})();
