require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

const consumer = async () => {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  // Create DEAD LETTER QUEUE exchange
  await channel.assertExchange('email_dead_letter_exchange', 'direct', {
    durable: true,
  });

  // Create QUEUE to store message coming DLQ exchange
  await channel.assertQueue('email_dlq_queue', { durable: true });

  // Bind queue to exchange
  await channel.bindQueue(
    'email_dlq_queue',
    'email_dead_letter_exchange',
    'email_dlq'
  );

  // Create exchange
  await channel.assertExchange('email_exchange', 'direct', {
    durable: true,
  });

  // Create queue
  await channel.assertQueue('email_queue', {
    arguments: {
      'x-dead-letter-exchange': 'email_dead_letter_exchange',
      'x-dead-letter-routing-key': 'email_dlq',
      'x-queue-type': 'classic',
    },
    durable: true,
  });
  // Bind queue to exchange
  await channel.bindQueue('email_queue', 'email_exchange', 'email');

  // Consume queue
  console.log('Consuming...');
  await channel.consume('email_queue', async (message) => {
    try {
      if (!message) {
        throw new Error("Don't have message");
      }

      // do something...
      throw new Error('Error teste');
    } catch (error) {
      console.log('Error:', error.message);

      const body = JSON.parse(message.content.toString());

      if (body.retries >= body.maxRetries) {
        // Case no necessary retry use channel.reject(message, false)
        channel.reject(message, false);
        return;
      }

      body.retries += 1;

      channel.ack(message, false, false);

      channel.publish(
        message.fields.exchange,
        message.fields.routingKey,
        Buffer.from(JSON.stringify(body))
      );
    }
  });
};

consumer();
