import express from 'express';
import RabbitMQClient from './rabbitmq/client';

const server = express();
server.use(express.json());

server.post('/operate', async (req, res, next) => {
  console.log(req.body);
  const response = await RabbitMQClient.produce(req.body);
  res.send({ response });
});

server.listen(3000, async () => {
  console.log('Server running...');
  RabbitMQClient.initialize();
});
