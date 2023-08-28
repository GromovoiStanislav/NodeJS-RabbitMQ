require('dotenv').config();
//const express = require('express');
const amqp = require('amqplib');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
//const PORT = process.env.PORT || 3002;

let connection, channel;

async function connect() {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('PROFILE');
  console.log(`PROFILE started`);
  console.log(' [x] To exit press CTRL+C.');
}

const fakeUser = {
  name: 'Mano',
  userId: 'mano1234',
  lastLoggedIn: '03-09-2021',
};

connect().then(async () => {
  channel.consume('PROFILE', (msg) => {
    channel.ack(msg);

    let data = JSON.parse(msg.content.toString());

    if (data.call === 'ORDER_WITH_USER') {
      data.user = fakeUser;
      channel.sendToQueue('ORDER', Buffer.from(JSON.stringify(data)), {
        correlationId: msg.properties.correlationId,
      });
    } else {
      channel.sendToQueue('GATEWAY', Buffer.from(JSON.stringify(fakeUser)), {
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
