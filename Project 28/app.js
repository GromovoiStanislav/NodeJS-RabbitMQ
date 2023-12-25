require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

async function sendMessage() {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  // Объявление очереди для отложенных сообщений (Dead Letter Queue)
  const deadLetterQueue = 'dead_letter_queue';
  await channel.assertQueue(deadLetterQueue, {
    durable: false,
  });

  // Объявление обмена для отложенных сообщений
  const deadLetterExchange = 'dead_letter_exchange';
  await channel.assertExchange(deadLetterExchange, 'direct', {
    durable: false,
  });

  // Привязка отложенной очереди к обмену
  await channel.bindQueue(
    deadLetterQueue,
    deadLetterExchange,
    'dead_letter_routing_key'
  );

  console.log('Queues and exchanges created successfully.');

  // Объявление основной очереди
  const mainQueue = 'main_queue';
  await channel.assertQueue(mainQueue, {
    durable: false,
    deadLetterExchange: 'dead_letter_exchange', // Обмен для отложенных сообщений
    deadLetterRoutingKey: 'dead_letter_routing_key', // Маршрут для отложенных сообщений

    // messageTtl: 1000 * 60, // Установка TTL сообщений по умолчанию
    // Или:
    arguments: {
      'x-message-ttl': 1000 * 60, // Установка TTL сообщений по умолчанию
    },
  });

  const message = 'Hello, RabbitMQ!';

  // Установка TTL для конкретного сообщения
  const expirationTimeInMillis = 1000 * 10; // Время жизни сообщения в миллисекундах (например, 10 секунд)
  channel.sendToQueue(mainQueue, Buffer.from(message), {
    expiration: expirationTimeInMillis,
  });
  console.log(`Sent message: ${message} with TTL ${expirationTimeInMillis} ms`);

  // Установка TTL по умолчанию
  channel.sendToQueue(mainQueue, Buffer.from(message));
  console.log(`Sent message: ${message} with common TTL`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMessage();
