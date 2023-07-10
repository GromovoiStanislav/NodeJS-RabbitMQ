import 'dotenv/config';
import express from 'express';
import constrollers from './controller.js';
import RabbitMQConfig from './config.js';

const app = express();
app.use(express.json());

app.post('/api/send', constrollers.sendMessageToRedis);

//  consume
const queue = 'my-queue';
const rabbitMQConfig = new RabbitMQConfig();
await rabbitMQConfig.connect();
await rabbitMQConfig.createQueue(queue, { durable: true });
await rabbitMQConfig.subscribeToQueue(queue, (message) => {
  console.log('Received message:', message);
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
