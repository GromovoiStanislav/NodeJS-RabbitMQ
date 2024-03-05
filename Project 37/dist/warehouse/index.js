import 'dotenv/config';
import amqplib from 'amqplib';
import express from 'express';
const PORT = process.env.PORT ?? 3001;
const amqpServer = process.env.AMQP_URL || 'amqp://localhost:5672';
let channel, connection;
const connectAmqp = async () => {
    try {
        connection = await amqplib.connect(amqpServer);
        channel = await connection.createChannel();
        // consume all the orders that are not acknowledged
        await channel.consume('order', (data) => {
            console.log(`Received ${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    }
    catch (error) {
        console.log(error);
    }
};
const app = express();
app.use(express.json());
app.get('*', (req, res) => {
    res.status(404).send('Not found');
});
app.listen(PORT, async () => {
    await connectAmqp();
    console.log(`Server running on ${PORT}`);
});
