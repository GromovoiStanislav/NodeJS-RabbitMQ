import * as amqplib from "amqplib";

let counter = 0;

export const initRabbitMQ = async () => {
  //const queueName = "tasks";
  const conn = await amqplib.connect(process.env.AMQP_URL);

  const chanel = await conn.createChannel();
  //await chanel.assertQueue(queueName, { durable: false });

  await chanel.assertExchange("multicasting-exchange", "fanout");


  setInterval(() => {
    counter++;
    chanel.publish(
      "multicasting-exchange",
      "",
      Buffer.from("Sender1: something to do " + counter)
    );
  }, 3000);
};
