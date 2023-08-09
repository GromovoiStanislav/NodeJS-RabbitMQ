require('dotenv').config();
const amqp = require('amqplib');
const config = require('./config');

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

async function consumeMessages() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();

  await channel.assertExchange(config.rabbitMQ.exchangeName, 'direct');

  const q = await channel.assertQueue(config.rabbitMQ.queues.infoQueue);

  await channel.bindQueue(q.queue, config.rabbitMQ.exchangeName, 'Info');

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}

consumeMessages();
