require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

const publish = async () => {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  console.log('Publishing...');
  channel.publish(
    'email_exchange',
    'email',
    Buffer.from(
      JSON.stringify({
        message: 'Hello',
        maxRetries: 3,
        retries: 0,
      })
    )
  );
};

publish();
