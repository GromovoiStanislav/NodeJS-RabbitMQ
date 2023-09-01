require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = 'header_logs';

const recieveMsg = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'headers', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });

  channel.bindQueue(q.queue, exchangeName, '', {
    account: 'new',
    method: 'facebook',
    'x-match': 'any',
  });

  console.log(`Waiting for messages in queue: ${q.queue}`);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `Routing Key: ${JSON.stringify(
            msg.properties.headers
          )}, Message: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

recieveMsg();
