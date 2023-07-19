import 'dotenv/config';
import { initRabbitMQ } from './rabbit.js';

await initRabbitMQ('tasks1');
await initRabbitMQ('tasks2');
