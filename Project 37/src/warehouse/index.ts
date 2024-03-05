import 'dotenv/config';
import amqplib, { Channel, Connection } from 'amqplib';
import express, { Request, Response } from 'express';

const PORT = process.env.PORT ?? 3001;
const amqpServer = process.env.AMQP_URL || 'amqp://localhost:5672';
let channel: Channel, connection: Connection;

const connectAmqp = async () => {
  try {
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();
    // consume all the orders that are not acknowledged
    await channel.consume('order', (data) => {
      console.log(`Received ${Buffer.from(data!.content)}`);
      channel.ack(data!);
    });
  } catch (error) {
    console.log(error);
  }
};

const app = express();
app.use(express.json());

app.get('*', (req: Request, res: Response) => {
  res.status(404).send('Not found');
});

app.listen(PORT, async () => {
  await connectAmqp();
  console.log(`Server running on ${PORT}`);
});
