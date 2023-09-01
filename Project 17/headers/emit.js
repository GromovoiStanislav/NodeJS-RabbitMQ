require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = 'header_logs';

const args = process.argv.slice(2);
const msg = args[0] || 'Subscribe, Like, Comment';

const sendMsg = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'headers', { durable: false });

  channel.publish(exchangeName, '', Buffer.from('old github'), {
    headers: { account: 'old', method: 'github' },
  });
  console.log('Sent: ', 'old github');

  channel.publish(exchangeName, '', Buffer.from('new github'), {
    headers: { account: 'new', method: 'github' },
  });
  console.log('Sent: ', 'new github');

  channel.publish(exchangeName, '', Buffer.from('new google'), {
    headers: { account: 'new', method: 'google' },
  });
  console.log('Sent: ', 'new google');

  channel.publish(exchangeName, '', Buffer.from('old facebook'), {
    headers: { account: 'old', method: 'facebook' },
  });
  console.log('Sent: ', 'old facebook');

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
