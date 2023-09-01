require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'task';

const msg = process.argv.slice(2).join(' ') || 'comment';

const sendTask = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  console.log('Sent: ', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendTask();
