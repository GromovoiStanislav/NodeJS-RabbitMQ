require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(amqpUrl);
    const channel = await connection.createConfirmChannel();

    const { exchange } = await channel.assertExchange('rpc_exchange', 'direct'); //topic
    const { queue } = await channel.assertQueue();

    await channel.bindQueue(queue, exchange, 'whatever');

    for (var i = 0; i < 20; i++) {
      channel.publish(exchange, 'whatever', Buffer.from('blah'));
    }

    await channel.waitForConfirms();
    console.log('All messages done');
    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
})();
