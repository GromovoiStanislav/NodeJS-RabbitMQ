require('dotenv').config();
//const express = require('express');

const mongoose = require('mongoose');
const Order = require('./Order');

const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

// const app = express();
// app.use(express.json());

let channel, connection;

mongoose
  .connect('mongodb://127.0.0.1:27017/order-service')
  .then(() => console.log('Order-Service DB Connected!'));

async function createOrder(products, userEmail) {
  let total = 0;
  for (let t = 0; t < products.length; ++t) {
    total += products[t].price;
  }
  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
  await newOrder.save();
  return newOrder;
}

async function connect() {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('ORDER');
  await channel.assertQueue('PRODUCT');
  console.log(' [x] To exit press CTRL+C.');
}

connect().then(() => {
  channel.consume('ORDER', async (msg) => {
    console.log('Consuming ORDER service');
    const { products, userEmail } = JSON.parse(msg.content.toString());

    const newOrder = await createOrder(products, userEmail);
    channel.ack(msg);

    channel.sendToQueue('PRODUCT', Buffer.from(JSON.stringify({ newOrder })), {
      correlationId: msg.properties.correlationId,
    });
  });
});

// const PORT = process.env.PORT || 3001;
// app.listen(3000, () => {
//   console.log(`Order-Service at ${PORT}`);
// });

process.once('SIGINT', async () => {
  await channel.close();
  await connection.close();
});
