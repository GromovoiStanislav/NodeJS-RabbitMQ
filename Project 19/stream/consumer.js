import { AMQPClient } from '@cloudamqp/amqp-client';
import {} from 'dotenv/config';

const LAVINMQ_URL = process.env.CLOUDAMQP_URL;

async function startConsumer() {
  //Setup a connection to the RabbitMQ server
  const connection = new AMQPClient(LAVINMQ_URL);
  await connection.connect();
  const channel = await connection.channel();

  console.log('[✅] Connection over channel established');
  console.log('[❎] Waiting for messages. To exit press CTRL+C ');

  await channel.prefetch(5);

  const q = await channel.queue(
    'test_stream',
    { durable: true },
    { 'x-queue-type': 'stream' }
  );

  let counter = 0;

  await q.subscribe(
    { noAck: false, args: { 'x-stream-offset': 'first' } },
    async (msg) => {
      try {
        console.log(`[📤] Message received (${++counter})`, msg.bodyToString());
        msg.ack();
      } catch (error) {
        console.error(error);
      }
    }
  );

  //When the process is terminated, close the connection
  process.on('SIGINT', () => {
    channel.close();
    connection.close();
    console.log('[❎] Connection closed');
    process.exit(0);
  });
}

startConsumer().catch(console.error);
