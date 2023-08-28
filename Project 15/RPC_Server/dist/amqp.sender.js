import { connect } from 'amqplib';
export class AmqpSender {
    queueName;
    connection;
    channel;
    constructor(queueName) {
        this.queueName = queueName;
    }
    async connect() {
        this.connection = await connect(process.env.AMQP_URL || 'amqp://localhost:6572');
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queueName);
    }
    async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
    async send(data) {
        const buf = Buffer.from(JSON.stringify(data));
        this.channel?.sendToQueue(this.queueName, buf);
    }
}
