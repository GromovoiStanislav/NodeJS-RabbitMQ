const amqp = require('amqplib');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

let connection = null;
let channel = null;

async function connectToRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect(amqpUrl);
  }
  if (!channel) {
    channel = await connection.createChannel();
  }
  return channel;
}

async function closeConnection() {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}

module.exports = { connectToRabbitMQ, closeConnection };
