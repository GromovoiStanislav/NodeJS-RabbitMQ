require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

async function sendMessage() {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();
  const queue = 'test_ttl_queue';

  const message = 'Hello, RabbitMQ!';

  await channel.assertQueue(queue, {
    durable: false,

    // messageTtl: 1000 * 60, // Установка TTL сообщений по умолчанию в миллисекундах (60 секунд)
    // expires: 1000 * 60*2, // Установка TTL самой очереди в миллисекундах (2 мин)

    // Или:
    arguments: {
      'x-message-ttl': 1000 * 60, // Установка TTL сообщений по умолчанию в миллисекундах (60 секунд)
      'x-expires': 1000 * 60 * 2, // Установка TTL самой очереди в миллисекундах (2 мин)
    },
  });

  // Установка TTL для конкретного сообщения
  const expirationTimeInMillis = 1000 * 30; // Установка TTL конкретного сообщения в миллисекундах (30 секунд)
  channel.sendToQueue(queue, Buffer.from(message), {
    expiration: expirationTimeInMillis,
  });
  console.log(`Sent message: ${message} with TTL ${expirationTimeInMillis} ms`);

  // Установка TTL по умолчанию
  channel.sendToQueue(queue, Buffer.from(message));
  console.log(`Sent message: ${message} with common TTL`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMessage();
