require('dotenv').config();
const amqp = require('amqplib');
const express = require('express');

const server = express();

const consumeMessages = async () => {
  const connection = await amqp.connect(
    process.env.AMQP_URL || 'amqp://localhost:5672'
  );

  const channel = await connection.createChannel();
  await channel.assertExchange('feeExchange', 'direct');
  const q = await channel.assertQueue('AcceptanceQueue');
  await channel.bindQueue(q.queue, 'feeExchange', 'Acceptance');

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
};

server.get('/', async (_, res, __) => {
  res.send({ message: 'Welcome to the acceptance fee service' });
});

const port = 3002;
server.listen(port, () => {
  consumeMessages();
  console.log(`Server running on port: ${port}`);
});
