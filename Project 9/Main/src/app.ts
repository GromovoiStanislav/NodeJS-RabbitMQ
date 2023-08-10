import 'dotenv/config';
import express, { Request, Response } from 'express';
import amqp, { Channel, Connection } from 'amqplib';
import axios from 'axios';

import { Product } from './entity/product.js';
import dataSource from './db/data-source.js';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

await dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });

const productRepository = dataSource.getRepository(Product);

let connection: Connection;
let channel: Channel;

try {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
} catch (err) {
  console.error('Error during RabbitMQ initialization:', err);
  process.exit(1);
}

channel.assertQueue('product_created', { durable: false });
channel.assertQueue('product_updated', { durable: false });
channel.assertQueue('product_deleted', { durable: false });

channel.consume(
  'product_created',
  async (msg) => {
    const eventProduct: Product = JSON.parse(msg.content.toString());
    const product = new Product();
    product.admin_id = parseInt(eventProduct.id);
    product.title = eventProduct.title;
    product.image = eventProduct.image;
    product.likes = eventProduct.likes;
    await productRepository.save(product);
    console.log('product created');
  },
  { noAck: true }
);

channel.consume(
  'product_updated',
  async (msg) => {
    const eventProduct: Product = JSON.parse(msg.content.toString());
    const product = await productRepository.findOneBy({
      admin_id: parseInt(eventProduct.id),
    });
    productRepository.merge(product, {
      title: eventProduct.title,
      image: eventProduct.image,
      likes: eventProduct.likes,
    });
    await productRepository.save(product);
    console.log('product updated');
  },
  { noAck: true }
);

channel.consume('product_deleted', async (msg) => {
  const admin_id = parseInt(msg.content.toString());
  await productRepository.delete({ admin_id });
  console.log('product deleted');
});

const app = express();
app.use(express.json());

app.get('/api/products', async (req: Request, res: Response) => {
  const products = await productRepository.find();
  return res.send(products);
});

app.post('/api/products/:id/like', async (req: Request, res: Response) => {
  const product = await productRepository.findOneBy({ id: req.params.id });
  await axios.post(
    `http://localhost:3000/api/products/${product.admin_id}/like`,
    {}
  );
  product.likes++;
  await productRepository.save(product);
  return res.send(product);
});

app.listen(3001);
console.log('Listening to port: 3001');

process.on('beforeExit', () => {
  console.log('closing');
  connection.close();
});
