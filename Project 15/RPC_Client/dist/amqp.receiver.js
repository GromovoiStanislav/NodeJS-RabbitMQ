import { connect } from 'amqplib';
export class AmqpReceiver {
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
    subscribe(fn) {
        this.channel?.prefetch(1);
        this.channel?.consume(this.queueName, (msg) => {
            const ack = fn(Buffer.from(msg.content).toString());
            if (ack)
                this.channel?.ack(msg);
            else
                this.channel?.nack(msg);
        });
    }
}
