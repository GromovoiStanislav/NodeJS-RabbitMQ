require('dotenv').config();
const express = require('express');
const app = express();
const amqp = require('amqplib');

var channel, connection;
const PORT = 3001;

async function connect() {
  try {
    const amqpServer = process.env.AMQP_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('session');
    channel.consume('session', (data) => {
      console.log(`Received data at ${PORT}: ${Buffer.from(data.content)}`);
      channel.ack(data);
    });
  } catch (ex) {
    console.error(ex);
  }
}

app.listen(PORT, async () => {
  await connect();
  console.log(`Server srarted at ${PORT}`);
});
