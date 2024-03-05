require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

const publish = async () => {
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();

  const msg = process.argv.slice(2).join(' ') || 'Hello World!';

  const exchange = 'messages';

  // Объявление  обменник
  await channel.assertExchange(exchange, 'fanout', {
    durable: false,
  });

  // Отправка сообщения
  channel.publish(exchange, '', Buffer.from(msg));
  console.log(' [x] Sent %s', msg);

  setTimeout(() => {
    process.exit(0);
  }, 500);
};

publish();
