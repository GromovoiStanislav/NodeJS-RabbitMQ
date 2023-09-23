const dotenv = require('dotenv').config();
const WebSocket = require('ws');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');

const server = new WebSocket.Server({ port: 8000 });
const jwtKey = fs.readFileSync(process.env.WS_JWT_PUBLIC_KEY, 'utf8');

server.on('connection', function (ws, request) {
  console.log('connected: %s', request.remoteAddress);

  ws.on('message', function (message) {
    const data = JSON.parse(message);
    if (data.type && data.type === 'auth') {
      try {
        const token = jwt.verify(data.token, jwtKey, { algorithms: ['RS256'] });
        console.log('user_id: %s', token.sub);
        ws.user_id = token.sub;
      } catch (err) {
        console.log(err);
      }
    }
  });
});

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
amqp.connect(amqpUrl, function (err, conn) {
  if (err) return fail(err);

  conn.createChannel(function (err, ch) {
    if (err) return fail(err);

    const queueName = 'notifications';
    ch.assertQueue(queueName, { durable: true }, (err, { queue }) => {
      if (err) return fail(err, connection);

      ch.consume(
        queueName,
        function (message) {
          console.log('consumed: %s', message.content);
          const value = JSON.parse(message.content);

          server.clients.forEach((ws) => {
            if (ws.user_id === value.user_id) {
              ws.send(value.message);
            } else if (value.user_id === 'ALL') {
              ws.send(value.message);
            }
          });

          ch.ack(message);
        },
        { noAck: false },
        (err) => {
          if (err) return fail(err, connection);

          console.log('Service connected to RabbitMQ');
        }
      );
    });
  });
});

function fail(err, connection) {
  console.error(err);
  if (connection)
    connection.close(() => {
      process.exit(1);
    });
}
