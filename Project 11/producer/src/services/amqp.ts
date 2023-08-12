import amqplib from 'amqplib';

const QUEUE = 'tasks';
let chan: amqplib.Channel;
let i = 1;

(async () => {
  try {
    const conn = await amqplib.connect(<string>process.env.AMQP_URL);

    chan = await conn.createChannel();
    await chan.assertQueue(QUEUE, { durable: true });

    setInterval(async () => {
      try {
        send(`Message ${i++}`);
      } catch (e) {
        console.log(e);
      }
    }, 2000);
  } catch (e) {
    console.log('Error', e);
  }
})();

export function send(msg: string) {
  if (!chan) {
    throw new Error('Channel does not exist');
  }

  console.log(`Sending AMQP message: ${msg}`);
  chan.sendToQueue(QUEUE, Buffer.from(msg), {
    persistent: true,
  });
}
