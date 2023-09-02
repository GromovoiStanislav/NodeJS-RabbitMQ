//Dependencies
import { AMQPClient } from '@cloudamqp/amqp-client';
import {} from 'dotenv/config';

const LAVINMQ_URL = process.env.CLOUDAMQP_URL;

async function startProducer() {
  try {
    //Setup a connection to the LavinMQ server
    const connection = new AMQPClient(LAVINMQ_URL);
    await connection.connect();
    const channel = await connection.channel();

    console.log('[✅] Connection over channel established');

    const q = await channel.queue(
      'test_stream',
      { durable: true },
      { 'x-queue-type': 'stream' }
    );

    //Publish a message to the exchange
    async function sendToQueue(routingKey, body) {
      await channel.basicPublish('', routingKey, body);
      console.log('[📥] Message sent to stream: ', body);
    }

    //Send some messages to the queue
    sendToQueue('test_stream', 'Hello World 1');
    sendToQueue('test_stream', 'Hello World 2');
    sendToQueue('test_stream', 'Hello World 3');
    sendToQueue('test_stream', 'Hello World 4');
    sendToQueue('test_stream', 'Hello World 5');

    setTimeout(() => {
      //Close the connection
      connection.close();
      console.log('[❎] Connection closed');
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
    //Retry after 3 second
    setTimeout(() => {
      startProducer();
    }, 3000);
  }
}

startProducer();
