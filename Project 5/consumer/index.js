import 'dotenv/config';
import { initRabbitMQ } from './rabbit.js';

await initRabbitMQ('consumer1');
await initRabbitMQ('consumer2');
