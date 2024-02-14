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
  const q = await channel.assertQueue('HostelAndSchoolQueue');
  await channel.bindQueue(q.queue, 'feeExchange', 'Hostel');
  await channel.bindQueue(q.queue, 'feeExchange', 'School');

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
};

server.get('/', async (_, res, __) => {
  res.send({ message: 'Welcome to the school and hostel fee service' });
});

const port = 3003;

server.listen(port, () => {
  consumeMessages();
  console.log(`Server running on port: ${port}`);
});
