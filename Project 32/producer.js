import 'dotenv/config';
import { connect } from 'amqplib';
import { randomUUID } from 'crypto';
import express, { json } from 'express';

const app = express();
app.use(json());

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await connect(process.env.AMQP_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    console.error('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

let count = 1;

app.post('/order', async (req, res) => {
  const newOrder = {
    id: randomUUID(),
    title: `Order # ${count++}`,
  };

  channel.publish('', 'order.add', Buffer.from(JSON.stringify(newOrder)));
  res.status(201).json(newOrder);
});

app.listen(3000, async () => {
  await connectRabbitMQ();
  console.log('Listening on http://localhost:3000');
});
