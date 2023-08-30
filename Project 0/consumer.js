require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'test';
let channel, connection;

async function connect() {
  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    console.log('Waiting for messages...');

    channel.consume(
      queueName,
      (msg) => {
        const { message } = JSON.parse(msg.content.toString());
        console.log('Message received:', message);
        //channel.ack(message);
      },
      { noAck: true }
    );

    console.log(' [x] To exit press CTRL+C.');
    console.log('Listening for messages...');
  } catch (error) {
    console.error(error);
  }
}

connect();

process.once('SIGINT', async () => {
  await channel.close();
  await connection.close();
});
