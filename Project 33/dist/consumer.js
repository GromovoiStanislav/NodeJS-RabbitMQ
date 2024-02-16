import amqplib from 'amqplib';
export class MyRabbitMqConsumer {
    queueName;
    queueUrl;
    constructor(queueName, queueUrl) {
        this.queueName = queueName;
        this.queueUrl = queueUrl;
    }
    async createRabbitConnection() {
        const connection = await amqplib.connect(this.queueUrl);
        const channel = await connection.createChannel();
        channel.assertQueue(this.queueName, { durable: true });
        return channel;
    }
    async consumeMessages(channel) {
        await channel.consume(this.queueName, (message) => {
            if (message) {
                console.log(` [/] Message successfully received from RabbitMQ`);
                console.log(JSON.parse(message.content.toString()));
            }
        }, { noAck: true });
    }
}
