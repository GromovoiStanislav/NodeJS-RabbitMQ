require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

let count = 1;

app.post('/order', async (req, res) => {
  const { customerId, orderId } = req.body;
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  channel.assertQueue('order.shipped', { durable: true });
  channel.sendToQueue(
    'order.shipped',
    Buffer.from(
      JSON.stringify({
        customerId,
        orderId,
        count: count++,
      })
    )
  );
  res.status(204).json('OK');
});

app.listen(3000, () => {
  console.log('ORDERS API listening on port 3000');
});
