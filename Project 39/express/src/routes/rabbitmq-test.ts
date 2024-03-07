import express from 'express';
import RabbitmqServer from '../rabbitmq-server.js';
const router = express.Router();

router.post('/express', async function (req, res, next) {
  const server = new RabbitmqServer(process.env.AMQP_URL);
  await server.start();
  await server.publishInQueue('nest', JSON.stringify(req.body));
  await server.publishInExchange(
    'amq.direct',
    'routing-key-2',
    JSON.stringify(req.body)
  );
  res.send(req.body);
});

export default router;
