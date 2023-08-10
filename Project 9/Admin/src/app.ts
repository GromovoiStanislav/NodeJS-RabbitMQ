import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { Product } from './entity/product.js';
import dataSource from './db/data-source.js';

import amqp, { Channel, Connection } from 'amqplib';
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

const app = express();
app.use(express.json());

app.get('/api/products', async (req: Request, res: Response) => {
  const products = await productRepository.find();
  res.json(products);
});

app.post('/api/products', async (req: Request, res: Response) => {
  const product = productRepository.create(req.body);
  const result = await productRepository.save(product);
  channel.sendToQueue('product_created', Buffer.from(JSON.stringify(result)));
  return res.send(result);
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  const product = await productRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(product);
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  const product = await productRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  productRepository.merge(product, req.body);
  const result = await productRepository.save(product);
  channel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)));
  return res.send(result);
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const result = await productRepository.delete(req.params.id);
  channel.sendToQueue('product_deleted', Buffer.from(req.params.id));
  return res.send(result);
});

app.post('/api/products/:id/like', async (req: Request, res: Response) => {
  const product = await productRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  product.likes++;
  const result = await productRepository.save(product);
  channel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)));
  return res.send(result);
});

app.listen(3000);
console.log('Listening to port: 3000');

process.on('beforeExit', () => {
  console.log('closing');
  connection.close();
});
