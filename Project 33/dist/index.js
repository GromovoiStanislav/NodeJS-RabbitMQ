import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MyRabbitMqProducer } from './producer.js';
import { MyRabbitMqConsumer } from './consumer.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT ?? 3000;
const queueName = process.env.QUEUE_NAME ?? 'test';
const queueUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
// RABBIT MQ
const messageQueue = new MyRabbitMqProducer(queueName, queueUrl);
async function connectToRabbitQueue() {
    await messageQueue.connect();
    console.log('RabbitMQ connected successfully');
}
await connectToRabbitQueue();
// RABBITMQ CONSUMER
async function connectToRabbit() {
    const rabbit = new MyRabbitMqConsumer(queueName, queueUrl);
    const channel = await rabbit.createRabbitConnection();
    await rabbit.consumeMessages(channel);
}
await connectToRabbit();
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/', (req, res) => {
    const { message } = req.body;
    const log = { sentAt: new Date(Date.now()), message };
    messageQueue.sendMessage(JSON.stringify(log));
    return res.redirect('/');
});
app.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}/`);
});
