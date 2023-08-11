import 'dotenv/config';
import amqp, { Channel, Connection } from 'amqplib';

export class AmqpConnection {
  private readonly amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
  private connection!: Connection;

  async createChannel(): Promise<Channel> {
    return await this.connection.createChannel();
  }

  async connect(): Promise<Connection | undefined> {
    try {
      const connection = await amqp.connect(this.amqpUrl);
      this.connection = connection;
      return connection;
    } catch (err) {
      console.error(`Connection error - ${err}`);
    }
  }
}
