require('dotenv').config();
const amqp = require('amqplib');
const constant = require('./constant');

const producer = async () => {
  const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';
  const exchange = constant.TASK_EXCHANGE;

  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  console.log('Publishing...');
  setInterval(() => {
    channel.publish(exchange, '', Buffer.from('hi, world'));
  }, 5000);
};

producer();
