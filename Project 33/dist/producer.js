import amqplib from 'amqplib';
export class MyRabbitMqProducer {
    queueName;
    queueUrl;
    queue;
    constructor(queueName, queueUrl) {
        this.queueName = queueName;
        this.queueUrl = queueUrl;
    }
    async connect() {
        console.log('BEGINNING OF CONNECT FUNCTION');
        const connection = await amqplib.connect(this.queueUrl ?? 'amqp://localhost');
        const channel = await connection.createChannel();
        channel.assertQueue(this.queueName, { durable: true });
        this.queue = channel;
    }
    async sendMessage(msg) {
        this.queue.sendToQueue(this.queueName, Buffer.from(msg));
    }
}
