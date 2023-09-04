import 'dotenv/config';
import { connect } from 'amqplib';
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

import { randomBytes } from 'crypto';

import express, { json } from 'express';
const app = express();
app.use(json());

let channel, connection;

const _connect = async (exchangeName) => {
  try {
    connection = await connect(amqpUrl);
    channel = await connection.createChannel();

    const { exchange } = await channel.assertExchange(exchangeName, 'topic', {
      durable: false,
    });
    console.error('Connected to RabbitMQ');
    return exchange;
  } catch (error) {
    console.error('Error occurred:', error);
  }
};
const exchange = await _connect('topic_logs');

let count = 1;

app.post('/order', async (req, res) => {
  const newOrder = {
    id: randomBytes(4).toString('hex'),
    title: `Order # ${count++}`,
  };

  channel.publish(exchange, 'order.add', Buffer.from(JSON.stringify(newOrder)));
  res.status(201).json(newOrder);
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
