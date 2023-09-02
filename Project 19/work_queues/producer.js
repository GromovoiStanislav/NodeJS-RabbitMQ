import { AMQPClient } from '@cloudamqp/amqp-client';
import {} from 'dotenv/config';

const cloudAMQPURL = process.env.CLOUDAMQP_URL;

async function startProducer() {
  try {
    //Setup a connection to the RabbitMQ server
    const connection = new AMQPClient(cloudAMQPURL);
    await connection.connect();
    const channel = await connection.channel();

    console.log('[✅] Connection over channel established');

    const q = await channel.queue('image_resize_queue', { durable: false });

    //Publish a message to the exchange
    async function sendToQueue(routingKey, body) {
      //amqp-client function expects: exchange, routingKey, message, options
      await q.publish(body, { routingKey });
      console.log('[📥] Message sent to queue', body);
    }

    //Send some messages to the queue
    sendToQueue('image_resize_queue', 'Resize an image - 1');
    sendToQueue('image_resize_queue', 'Resize an image - 2');
    sendToQueue('image_resize_queue', 'Resize an image - 3');
    sendToQueue('image_resize_queue', 'Resize an image - 4');
    sendToQueue('image_resize_queue', 'Resize an image - 5');
    sendToQueue('image_resize_queue', 'Resize an image - 6');

    setTimeout(() => {
      //Close the connection
      connection.close();
      console.log('[❎] Connection closed');
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
    //Retry after 3 seconds
    setTimeout(() => {
      startProducer();
    }, 3000);
  }
}

startProducer();
