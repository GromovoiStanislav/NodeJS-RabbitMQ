import 'dotenv/config';
import { connect } from 'amqplib';

const connection = await connect(
  process.env.AMQP_URL || 'amqp://localhost:5672'
);
const channel = await connection.createChannel();

await channel.assertExchange('order.dlx', 'topic', { durable: false });

await channel.assertQueue('order.add.dlx');
await channel.bindQueue('order.add.dlx', 'order.dlx', 'add-routing-key');

await channel.assertQueue('order.process.dlx');
await channel.bindQueue(
  'order.process.dlx',
  'order.dlx',
  'process-routing-key'
);

await channel.assertQueue('order.add', {
  arguments: {
    'x-dead-letter-exchange': 'order.dlx',
    'x-dead-letter-routing-key': 'add-routing-key',
  },
});

await channel.assertQueue('order.process', {
  arguments: {
    'x-dead-letter-exchange': 'order.dlx',
    'x-dead-letter-routing-key': 'process-routing-key',
  },
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

channel.consume(
  'order.process',
  async (msg) => {
    if (msg.content)
      console.log(`order.process: Message: ${msg.content.toString()}`);
    channel.nack(msg, false, false); // !!!!
  },
  { noAck: false }
);

channel.consume(
  'order.process.dlx',
  async (msg) => {
    if (msg.content)
      console.log(`order.process.dlx: Message: ${msg.content.toString()}`);
  },
  { noAck: false }
);
