import { AMQPClient } from '@cloudamqp/amqp-client';
import {} from 'dotenv/config';

const lavinmqUrl = process.env.CLOUDAMQP_URL;

async function run() {
  try {
    const amqp = new AMQPClient(lavinmqUrl);
    const connection = await amqp.connect();
    const channel = await connection.channel();

    const queue = await channel.queue();

    const consumer = await queue.subscribe({ noAck: true }, async (msg) => {
      console.log(msg.bodyToString());
      await consumer.cancel();
    });

    await queue.publish('Hello World', { deliveryMode: 2 });

    await consumer.wait(); // will block until consumer is canceled or throw an error if server closed channel/connection

    await connection.close();
  } catch (e) {
    console.error('ERROR', e);
    e.connection.close();
    setTimeout(run, 1000); // will try to reconnect in 1s
  }
}

run();
