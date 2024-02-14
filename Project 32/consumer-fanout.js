import 'dotenv/config';
import { connect } from 'amqplib';

const connection = await connect(
  process.env.AMQP_URL || 'amqp://localhost:5672'
);
const channel = await connection.createChannel();

await channel.assertExchange('order.dlx', 'fanout', { durable: false });
await channel.assertQueue('order.add.dlx');
await channel.bindQueue('order.add.dlx', 'order.dlx');

await channel.assertQueue('order.add', {
  arguments: { 'x-dead-letter-exchange': 'order.dlx' },
});

channel.consume(
  'order.add',
  async (msg) => {
    if (msg.content)
      console.log(`order.add: Message: ${msg.content.toString()}`);
    channel.nack(msg, false, false); // !!!!
  },
  { noAck: false }
);

channel.consume(
  'order.add.dlx',
  async (msg) => {
    if (msg.content)
      console.log(`order.add.dlx: Message: ${msg.content.toString()}`);
  },
  { noAck: false }
);
