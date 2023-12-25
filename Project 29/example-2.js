require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

async function sendMessage() {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  const mainExchange = 'main_exchange';
  const mainQueue = 'main_queue';
  const deadLetterExchange = 'dead_letter_exchange';
  const deadLetterQueue = 'dead_letter_queue';
  const rightRoutingKey = 'rightkey';
  const invalidRoutingKey = 'invalidKey';

  // Объявление обмена для основных сообщений
  await channel.assertExchange(mainExchange, 'direct', {
    durable: false,
    alternateExchange: deadLetterExchange,
  });

  // Объявление основной очереди
  await channel.assertQueue(mainQueue, { durable: false });

  // Привязка "main_queue" к обмену для отложенных сообщений
  await channel.bindQueue(mainQueue, mainExchange, rightRoutingKey);

  // Объявление обмена для отложенных сообщений
  await channel.assertExchange(deadLetterExchange, 'fanout', {
    durable: false,
  });

  //
  // Объявление "Dead Letter Queue"
  await channel.assertQueue(deadLetterQueue, { durable: false });

  // Привязка "Dead Letter Queue" к обмену для отложенных сообщений
  await channel.bindQueue(deadLetterQueue, deadLetterExchange);

  console.log('Exchanges and queues created successfully.');

  const message = 'Hello, World!';

  // Отправка сообщения с правильным ключом маршрутизации
  channel.publish(mainExchange, rightRoutingKey, Buffer.from(message));
  console.log(`Sent message: ${message} with routing key: ${rightRoutingKey}`);

  // Отправка сообщения с неправильным ключом маршрутизации
  channel.publish(mainExchange, invalidRoutingKey, Buffer.from(message));
  console.log(
    `Sent message: ${message} with routing key: ${invalidRoutingKey}`
  );

  // Закрытие соединения
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMessage();
