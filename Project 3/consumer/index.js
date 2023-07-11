require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

async function consumeMessage() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queueName = 'test';
    await channel.assertQueue(queueName, { durable: true });

    console.log('Waiting for messages...');

    channel.consume(
      queueName,
      (message) => {
        console.log('Message received:', message.content.toString());
        //channel.ack(message);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(error);
  }
}

consumeMessage();

// detect when Ctrl+C in pressed
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    console.log('Application closed');
    process.exit(0);
  });
});
