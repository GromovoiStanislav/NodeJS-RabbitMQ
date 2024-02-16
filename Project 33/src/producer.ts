import amqplib, { Channel } from 'amqplib';

export class MyRabbitMqProducer {
  private queueName: string;
  private queueUrl: string;
  private queue!: Channel;

  constructor(queueName: string, queueUrl: string) {
    this.queueName = queueName;
    this.queueUrl = queueUrl;
  }

  async connect() {
    console.log('BEGINNING OF CONNECT FUNCTION');
    const connection = await amqplib.connect(
      this.queueUrl ?? 'amqp://localhost'
    );

    const channel = await connection.createChannel();

    channel.assertQueue(this.queueName, { durable: true });

    this.queue = channel;
  }

  async sendMessage(msg: string): Promise<void> {
    this.queue.sendToQueue(this.queueName, Buffer.from(msg));
  }
}
