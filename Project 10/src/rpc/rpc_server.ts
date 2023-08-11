import { Channel, Replies, ConsumeMessage } from 'amqplib';

export class RpcServer {
  private channel!: Channel;
  private queue!: string;
  private queueName: string;

  constructor({ queueName, channel }: { queueName: string; channel: Channel }) {
    this.queueName = queueName;
    this.channel = channel;
  }

  async assert(): Promise<Replies.AssertQueue | undefined> {
    const assert = await this.channel.assertQueue(this.queueName, {
      durable: false,
    });
    await this.channel.prefetch(1);

    this.queue = assert.queue;
    return assert;
  }

  async sendMessage(
    replyToQueueName: string,
    message: Buffer,
    correlationId: string
  ): Promise<void> {
    this.channel.sendToQueue(replyToQueueName, message, { correlationId });
    console.log(`-> Callback message sent successfully: ${message}\n`);
  }

  async consume(): Promise<Replies.Consume> {
    return await this.channel.consume(
      this.queue,
      (msg) => this.handleMessage(msg),
      { noAck: true }
    );
  }

  async run(): Promise<void> {
    await this.assert();
    await this.consume();
    console.log('RPC Server is running...\n');
  }

  private handleMessage(msg: ConsumeMessage | null): void {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log(`<- Message received successfully: ${data}`);

    this.sendMessage(
      msg.properties.replyTo,
      msg.content,
      msg.properties.correlationId
    );
  }
}
