import 'dotenv/config';
import express from 'express';
import { initRabbitMQ } from './rabbit.js';

const app = express();

await initRabbitMQ('tasks1');
await initRabbitMQ('tasks2');

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
