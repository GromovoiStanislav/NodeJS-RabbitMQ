import 'dotenv/config';
import amqp from 'amqplib';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

let channel, connection;
const queueName = 'chat_messages';
const exchangeName = 'direct_exchange';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

try {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'direct', { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, exchangeName, 'chat');
} catch (error) {
  console.error('Error connecting to RabbitMQ', error);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Real-Time Application');
});

app.post('/message', (req, res) => {
  const message = req.body.message;

  // Publish the message to RabbitMQ
  channel.publish('direct_exchange', 'chat', Buffer.from(message));
  res.sendStatus(200);
});

io.on('connection', async (socket) => {
  console.log('A user connected');

  // Consume messages from RabbitMQ
  const consumeInfo = await channel.consume(
    'chat_messages',
    (message) => {
      socket.emit('new_message', message.content.toString());
    },
    { noAck: true }
  );

  socket.on('disconnect', () => {
    // Отменить потребление сообщений при отключении пользователя
    channel.cancel(consumeInfo.consumerTag);
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
