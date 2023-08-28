import { connect, Connection, Channel } from 'amqplib';

export class AmqpReceiver {
  private connection?: Connection;
  private channel?: Channel;

  constructor(private readonly queueName: string) {}

  public async connect() {
    this.connection = await connect(
      process.env.AMQP_URL || 'amqp://localhost:6572'
    );
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName);
  }

  public async close() {
    await this.channel?.close();
    await this.connection?.close();
  }

  public subscribe(fn: (data: any) => boolean) {
    this.channel?.prefetch(1);
    this.channel?.consume(this.queueName, (msg) => {
      const ack = fn(Buffer.from(msg.content).toString());
      if (ack) this.channel?.ack(msg);
      else this.channel?.nack(msg);
    });
  }
}
