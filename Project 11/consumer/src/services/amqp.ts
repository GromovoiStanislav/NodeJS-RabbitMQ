import amqplib from 'amqplib';

const QUEUE = 'tasks';
let chan: amqplib.Channel;

(async () => {
  try {
    const conn = await amqplib.connect(<string>process.env.AMQP_URL);

    chan = await conn.createChannel();
    await chan.assertQueue(QUEUE, { durable: true });

    console.log(`Consuming queue ${QUEUE}`);

    chan.consume(QUEUE, (msg) => {
      if (msg !== null) {
        console.log(`Received: ${msg.content.toString()}`);
        // do something....
        chan.ack(msg);
      } else {
        console.log('Consumer canceled');
      }
    });
  } catch (e) {
    console.log('Error', e);
  }
})();
