require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

(async () => {
  try {
    const connection = await amqp.connect(amqpUrl);

    const channel = await connection.createChannel();
    const queue = 'my_first_stream';
    const msg = `Hello World! ${Date.now()}`;

    // Define the queue stream
    // Mandatory: exclusive: false, durable: true  autoDelete: false
    await channel.assertQueue(queue, {
      exclusive: false,
      durable: true,
      autoDelete: false,
      arguments: {
        'x-queue-type': 'stream', // Mandatory to define stream queue
        'x-max-length-bytes': 2_000_000_000, // Set the queue retention to 2GB else the stream doesn't have any limit
      },
    });

    // Send the message to the stream queue
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);
    await channel.close();

    // Close connection
    connection.close();
  } catch (e) {
    // Catch and display any errors in the console
    console.log(e);
  }
})();
