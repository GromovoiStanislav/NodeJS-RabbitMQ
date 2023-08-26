require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

(async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });

  const { exchange } = await channel.assertExchange(
    'matching exchange',
    'headers'
  );
  const { queue } = await channel.assertQueue();

  // When using a headers exchange, the headers to be matched go in
  // the binding arguments. The routing key is ignore, so best left
  // empty.

  // 'x-match' is 'all' or 'any', meaning "all fields must match" or
  // "at least one field must match", respectively. The values to be
  // matched go in subsequent fields.
  await channel.bindQueue(queue, exchange, '', {
    'x-match': 'any',
    foo: 'bar',
    baz: 'boo',
  });

  await channel.consume(
    queue,
    (message) => {
      console.log(message.content.toString());
      if (message.properties.headers) {
        console.log('Headers:', message.properties.headers);
      }
    },
    { noAck: true }
  );

  ///// другая очередь
  const { queue: myNewQueue } = await channel.assertQueue();
  await channel.bindQueue(myNewQueue, exchange, '', {
    'x-match': 'all',
    meh: 'nah',
  });
  await channel.consume(
    myNewQueue,
    (message) => {
      console.log(message.content.toString());
      if (message.properties.headers) {
        console.log('Headers:', message.properties.headers);
      }
    },
    { noAck: true }
  );

  channel.publish(exchange, '', Buffer.from('hello'), {
    headers: { baz: 'boo' },
  }); // будет получено
  channel.publish(exchange, '', Buffer.from('hello'), {
    headers: { foo: 'bar' },
  }); // будет получено
  channel.publish(exchange, '', Buffer.from('lost'), {
    headers: { meh: 'nah' },
  }); // будет проигнорировано // или в myNewQueueName

  console.log(' [x] To exit press CTRL+C.');
})();
