import 'dotenv/config.js';
import { AmqpReceiver } from './amqp.receiver.js';
const queueName = process.env.QUEUE_NAME || 'test-queue';
const print = (data) => {
    console.log(data);
    return true;
};
const start = async () => {
    const rabbit = new AmqpReceiver(queueName);
    await rabbit.connect();
    console.log('Waiting for messages from rabbit...');
    rabbit.subscribe(print);
};
start();
