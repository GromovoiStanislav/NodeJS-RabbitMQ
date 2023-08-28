require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const { randomUUID } = require('node:crypto');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
const PORT = process.env.PORT || 3000;

let connection, channel;

async function connect() {
  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();
  await channel.assertQueue('GATEWAY');
}
connect();

const fakeOrder = {
  name: 'Order1',
  price: 2500,
};

function consumeGatewayQueue(correlationId) {
  return new Promise(async (resolve, reject) => {
    const consumer = await channel.consume('GATEWAY', (msg) => {
      if (!msg) {
        reject(new Error('No message received'));
        return;
      }

      // Проверяем корреляционный ID
      if (msg.properties.correlationId === correlationId) {
        const data = JSON.parse(msg.content.toString());

        if (data.call === 'ORDER_WITH_USER') {
          // Order Service
          delete data.call;
          resolve(data);
        } else {
          // Profile Service
          resolve(data);
        }

        // Подтверждаем получение сообщения и отменяем прослушивание
        channel.ack(msg);
        channel.cancel(consumer.consumerTag); //{ consumerTag: 'amq.ctag-UCOosGZAjctXsgDGsQPN-Q' }
      }
    });
  });
}

const app = express();

//let order, fakeUser;
app.get('/', async (req, res) => {
  const { call } = req.query;

  const correlationId = randomUUID(); // Создаем новый корреляционный ID

  if (call === 'ORDER') {
    const message = {
      ...fakeOrder,
    };

    const options = {
      correlationId, // Добавляем корреляционный ID в заголовок
    };

    channel.sendToQueue('ORDER', Buffer.from(JSON.stringify(message)), options);

    const order = await consumeGatewayQueue(correlationId);

    return res.json(order);
  } else if (call === 'PROFILE') {
    const message = {
      call: 'USER_PROFILE',
    };

    const options = {
      correlationId, // Добавляем корреляционный ID в заголовок
    };

    channel.sendToQueue(
      'PROFILE',
      Buffer.from(JSON.stringify(message)),
      options
    );

    const fakeUser = await consumeGatewayQueue(correlationId);
    return res.json(fakeUser);
  }
});

app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
  console.log(' [x] To exit press CTRL+C.');
});
