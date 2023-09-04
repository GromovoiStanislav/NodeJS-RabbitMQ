import 'dotenv/config';
import { connect } from 'amqplib';
import express from 'express';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const app = express();
app.use(express.json());

const orders = [];

const processOrder = async (msg) => {
  const order = JSON.parse(msg.content.toString());
  orders.push(order);
};

const _connect = async (exchangeName, queueName) => {
  const connection = await connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'topic', { durable: false });

  const q = await channel.assertQueue(queueName);

  const key = 'order.*';
  await channel.bindQueue(q.queue, exchangeName, key);

  channel.consume(
    q.queue,
    async (msg) => {
      if (msg.content)
        console.log(
          `Routing Key: ${
            msg.fields.routingKey
          }, Message: ${msg.content.toString()}`
        );

      await processOrder(msg);
      channel.ack(msg);
    },
    { noAck: false }
  );
};
await _connect('topic_logs', 'topic_queue');

app.get('/orders', async (req, res) => {
  res.status(200).json(orders);
});

app.listen(3001, () => {
  console.log('Listening on http://localhost:3001');
});
