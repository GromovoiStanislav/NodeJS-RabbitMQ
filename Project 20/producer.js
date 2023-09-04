require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

let channel, connection;
const queueName = 'test';

async function connect() {
  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    console.log('[x] To exit press CTRL+C or type "exit"');
    console.log('Type a message...');
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
connect();

process.stdin.on('data', (chunk) => {
  const str = chunk.toString().trim();
  if (str === 'exit') {
    process.exit(0);
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ message: str })));
});

process.once('SIGINT', async () => {
  await channel.close();
  await connection.close();
});
