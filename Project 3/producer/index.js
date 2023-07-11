require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

async function publishMessage() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queueName = 'test';
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from('Hello World 1'));
    channel.sendToQueue(queueName, Buffer.from('Hello World 2'));
    channel.sendToQueue(queueName, Buffer.from('Hello World 3'));

    console.log('Message sent');

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

publishMessage();
