require('dotenv').config();
const express = require('express');
const app = express();
const amqp = require('amqplib');

var channel, connection;

app.use(express.json());

async function connect() {
  try {
    const amqpServer = process.env.AMQP_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('session');
  } catch (error) {
    console.error(error);
  }
}

const createSession = async (user) => {
  await channel.sendToQueue('session', Buffer.from(JSON.stringify(user)));
};

app.post('/login', (req, res) => {
  const { user } = req.body;
  createSession(user);
  res.send(user);
});

const PORT = 3000;
app.listen(PORT, async () => {
  await connect();
  console.log(`Server srarted at ${PORT}`);
});
