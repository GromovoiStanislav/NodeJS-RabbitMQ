import 'dotenv/config.js';
import express from 'express';
import RabbitMQClient from './rabbitmq/client.js';

const server = express();
server.use(express.json());

server.post('/operate', async (req, res, next) => {
  const response = await RabbitMQClient.produce(req.body);
  res.send({ response });
});

server.listen(3000, async () => {
  console.log('Server running on port: 3000');
  RabbitMQClient.initialize();
});
