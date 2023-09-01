require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'test_queue';

const msg = 'Hello World!';

const sendMsg = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log('Sent: ', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
