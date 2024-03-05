require('dotenv').config();
const amqp = require('amqplib');
const constant = require('./constant');

const consumer = async () => {
  const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

  const deadLetterExchange = constant.TASK_EXCHANGE_DLX;
  const deadLetterQueue = constant.TASK_QUEUE_DLQ;
  const deadLetterRoutingKey = constant.TASK_ROUTING_KEY_DLQ;

  const exchange = constant.TASK_EXCHANGE;
  const queue = constant.TASK_QUEUE;

  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  await channel.assertExchange(deadLetterExchange, 'direct'); // Create DEAD LETTER QUEUE exchange
  await channel.assertQueue(deadLetterQueue); // Create DEAD LETTER QUEUE to store message coming DLQ exchange
  await channel.bindQueue(
    deadLetterQueue,
    deadLetterExchange,
    deadLetterRoutingKey
  ); // Bind DEAD LETTER QUEUE to exchange

  await channel.assertExchange(exchange, 'direct'); // Create exchange
  await channel.assertQueue(queue, {
    deadLetterExchange: deadLetterExchange,
    deadLetterRoutingKey: deadLetterRoutingKey,
  }); // Create queue
  await channel.bindQueue(queue, exchange, ''); // Bind queue to exchange

  channel.consume(queue, (msg) => {
    try {
      console.log(JSON.parse(msg.content.toString())); // Error
      channel.ack(msg);
    } catch (error) {
      channel.nack(msg, false, false);
    }
  });
};

consumer();
