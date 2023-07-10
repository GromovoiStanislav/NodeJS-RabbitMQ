import 'dotenv/config';
import express from 'express';
import RabbitMQConfig from './config.js';

const app = express();

//  consume
const queue = 'my-queue';
const rabbitMQConfig = new RabbitMQConfig();
await rabbitMQConfig.connect();
await rabbitMQConfig.createQueue(queue, { durable: true });
await rabbitMQConfig.subscribeToQueue(queue, (message) => {
  console.log('Received message:', message);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
