require('dotenv').config();
const amqp = require('amqplib');
const amqp_url = process.env.AMQP_URL || 'amqp://localhost:5672';

const exch = 'test_exchange';
const q = 'test_queue';
const rkey = 'test_route';

async function produce() {
  const connection = await amqp.connect(amqp_url, 'heartbeat=60');
  const channel = await connection.createChannel();

  await channel.assertExchange(exch, 'direct', { durable: true });
  await channel.assertQueue(q, { durable: true });
  await channel.bindQueue(q, exch, rkey);

  channel.publish(exch, rkey, Buffer.from('Hello amqplib World! - 1'));
  channel.publish(exch, rkey, Buffer.from('Hello amqplib World! - 2'));
  channel.publish(exch, rkey, Buffer.from('Hello amqplib World! - 3'));
  channel.publish(exch, rkey, Buffer.from('Hello amqplib World! - 4'));
  channel.publish(exch, rkey, Buffer.from('Hello amqplib World! - 5'));

  setTimeout(function () {
    channel.close();
    connection.close();
  }, 500);
}

async function consume() {
  const connection = await amqp.connect(amqp_url, 'heartbeat=60');
  const channel = await connection.createChannel();

  await channel.assertQueue(q, { durable: true });
  await channel.bindQueue(q, exch, rkey);

  channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    q,
    async (msg) => {
      console.log('myconsumer: consumed message: ' + msg.content.toString());
      await channel.cancel('myconsumer');
      channel.ack(msg);

      // Проверяем условие, при котором нужно отменить потребление сообщений
      if (true) {
        //await channel.cancel('myconsumer');
        await channel.cancel(consumerTag);
      }
    },
    {
      consumerTag: 'myconsumer',
    }
  );

  await channel.consume(q, async (msg) => {
    console.log('amqplib: consumed message: ' + msg.content.toString());
    channel.ack(msg);
  });

  setTimeout(function () {
    channel.close();
    connection.close();
  }, 500);
}

async function main() {
  await produce().catch(console.error);
  await consume().catch(console.error);
}

main();
