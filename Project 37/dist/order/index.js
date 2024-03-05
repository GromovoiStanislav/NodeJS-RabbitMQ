import 'dotenv/config';
import amqplib from 'amqplib';
import express from 'express';
const PORT = process.env.PORT ?? 3000;
const amqpServer = process.env.AMQP_URL || 'amqp://localhost:5672';
let channel, connection;
// connect to rabbitmq
const connectAmqp = async () => {
    try {
        connection = await amqplib.connect(amqpServer);
        channel = await connection.createChannel();
        // make sure that the order channel is created, if not this statement will create it
        await channel.assertQueue('order');
    }
    catch (error) {
        console.log(error);
    }
};
const app = express();
app.use(express.json());
app.post('/orders', (req, res) => {
    const data = req.body;
    // send a message to all the services connected to 'order' queue, add the date to differentiate between them
    channel.sendToQueue('order', Buffer.from(JSON.stringify({
        ...data,
        date: new Date(),
    })));
    res.send('Order submitted');
});
app.get('*', (req, res) => {
    res.status(404).send('Not found');
});
app.listen(PORT, async () => {
    await connectAmqp();
    console.log(`Server running on ${PORT}`);
});
