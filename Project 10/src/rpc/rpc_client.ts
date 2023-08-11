import { randomUUID } from 'node:crypto';
import { Channel, Connection, ConsumeMessage, Replies } from 'amqplib';

export class RpcClient {
  private readonly connection: Connection;
  private channel!: Channel;
  private queue!: string;
  private queueName: string;

  constructor({
    queueName,
    connection,
    channel,
  }: {
    queueName: string;
    connection: Connection;
    channel: Channel;
  }) {
    this.queueName = queueName;
    this.connection = connection;
    this.channel = channel;
  }

  async assert(): Promise<Replies.AssertQueue> {
    const assert = await this.channel.assertQueue('', { exclusive: true });
    this.queue = assert.queue;
    return assert;
  }

  async consume(correlationId: string): Promise<Replies.Consume> {
    const options = { noAck: true };

    return await this.channel.consume(
      this.queue,
      (message) => this.handleMessages(message, correlationId),
      options
    );
  }

  async sendMessage(message: string, correlationId: string): Promise<void> {
    const content = Buffer.from(JSON.stringify(message));
    const options = { correlationId, replyTo: this.queue };

    this.channel.sendToQueue(this.queueName, content, options);

    console.log(`<- Message sent successfully: ${message}`);
  }

  async run(message: string): Promise<void> {
    await this.assert();

    const correlationId = randomUUID();
    await this.consume(correlationId);
    await this.sendMessage(message, correlationId);
  }

  private handleMessages(
    message: ConsumeMessage | null,
    correlationId: string
  ): void {
    if (!message) return;

    if (message.properties.correlationId == correlationId) {
      const content = message.content.toString();

      console.log(`-> Callback message received successfully: ${content}`);

      this.closeProcess();
    }
  }

  private closeProcess(): void {
    setTimeout(() => {
      this.connection.close();
      process.exit(0);
    }, 200);
  }
}
