require('dotenv').config();
//const express = require('express');
const amqp = require('amqplib');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
//const PORT = process.env.PORT || 3001;

let connection, channel;

async function connect() {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('ORDER');
  console.log(`GATEWAY started`);
  console.log(' [x] To exit press CTRL+C.');
}

connect().then(async () => {
  channel.consume('ORDER', (msg) => {
    channel.ack(msg);
    const { name, price, user } = JSON.parse(msg.content.toString());

    let newOrder = {
      name,
      price,
      orderId: '123abc',
    };

    console.log('newOrder', newOrder);
    console.log('user', user);

    if (user) {
      newOrder.user = user;
      newOrder.call = 'ORDER_WITH_USER';
      channel.sendToQueue('GATEWAY', Buffer.from(JSON.stringify(newOrder)), {
        correlationId: msg.properties.correlationId,
      });
    } else {
      newOrder.call = 'ORDER_WITH_USER';
      channel.sendToQueue('PROFILE', Buffer.from(JSON.stringify(newOrder)), {
        correlationId: msg.properties.correlationId,
      });
    }
  });
});

// const app = express();
// app.listen(PORT, () => {
//   console.log(`Server at ${PORT}`);
// });

process.once('SIGINT', async () => {
  await channel.close();
  await connection.close();
});
