import { AMQPClient } from '@cloudamqp/amqp-client';
import {} from 'dotenv/config';

const lavinmqUrl = process.env.CLOUDAMQP_URL;

async function startConsumer() {
  //Setup a connection to the RabbitMQ server
  const connection = new AMQPClient(lavinmqUrl);
  await connection.connect();
  const channel = await connection.channel();

  console.log('[✅] Connection over channel established');
  console.log('[❎] Waiting for messages. To exit press CTRL+C');

  const q = await channel.queue('hello_queue', { durable: false });

  let counter = 0;

  await q.subscribe({ noAck: true }, async (msg) => {
    try {
      console.log(`[📤] Message received (${++counter})`, msg.bodyToString());
    } catch (error) {
      console.error(error);
    }
  });

  //When the process is terminated, close the connection
  process.on('SIGINT', () => {
    channel.close();
    connection.close();
    console.log('[❎] Connection closed');
    process.exit(0);
  });
}

startConsumer().catch(console.error);
