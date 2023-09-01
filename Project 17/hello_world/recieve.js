require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = 'test_queue';

const recieveMsg = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log(`Waiting for messages in queue: ${queueName}`);
  channel.consume(
    queueName,
    (msg) => {
      console.log('[X] Received:', msg.content.toString());
    },
    { noAck: true }
  );
};

recieveMsg();
