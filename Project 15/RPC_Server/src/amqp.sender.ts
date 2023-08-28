import { connect, Connection, Channel } from 'amqplib';

export class AmqpSender {
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

  public async send(data: any) {
    const buf = Buffer.from(JSON.stringify(data));
    this.channel?.sendToQueue(this.queueName, buf);
  }
}
