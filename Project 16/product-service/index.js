require('dotenv').config();
const express = require('express');
const { randomUUID } = require('node:crypto');
const mongoose = require('mongoose');
const Product = require('./Product');
const isAuthenticated = require('./isAuthenticated');

const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

let channel, connection;

mongoose
  .connect('mongodb://127.0.0.1:27017/product-service')
  .then(() => console.log('Product-Service DB Connected!'));

async function connect() {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('ORDER');
  await channel.assertQueue('PRODUCT');
}
connect();

function consumeProductQueue(correlationId) {
  return new Promise(async (resolve, reject) => {
    const consumer = await channel.consume('PRODUCT', (msg) => {
      if (!msg) {
        reject(new Error('No message received'));
        return;
      }

      // Проверяем корреляционный ID
      if (msg.properties.correlationId === correlationId) {
        const data = JSON.parse(msg.content.toString());

        resolve(data);

        // Подтверждаем получение сообщения и отменяем прослушивание
        channel.ack(msg);
        channel.cancel(consumer.consumerTag); //{ consumerTag: 'amq.ctag-UCOosGZAjctXsgDGsQPN-Q' }
      }
    });
  });
}

const app = express();
app.use(express.json());

app.post('/product/buy', isAuthenticated, async (req, res) => {
  const correlationId = randomUUID(); // Создаем новый корреляционный ID
  const { ids } = req.body;

  const products = await Product.find({ _id: { $in: ids } });

  channel.sendToQueue(
    'ORDER',
    Buffer.from(
      JSON.stringify({
        products,
        userEmail: req.user.email,
      })
    ),
    { correlationId }
  );

  // channel.consume('PRODUCT', (data) => {
  //   order = JSON.parse(data.content);
  // });

  const order = await consumeProductQueue(correlationId);
  return res.json(order);
});

app.post('/product/create', isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });
  await newProduct.save();
  return res.json(newProduct);
});

app.get('/products', async (req, res) => {
  const products = await Product.find({});
  return res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Product-Service at ${PORT}`);
});
