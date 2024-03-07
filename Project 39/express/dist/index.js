import 'dotenv/config';
import express from 'express';
import rabbitmqTestRouter from './routes/rabbitmq-test.js';
import RabbitmqServer from './rabbitmq-server.js';
const consumer = async () => {
    const server = new RabbitmqServer(process.env.AMQP_URL);
    await server.start();
    await server.consume('express', (message) => console.log(message.content.toString()));
};
consumer();
var app = express();
app.use(express.json());
app.use('/', rabbitmqTestRouter);
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, async () => {
    console.log(`Server running on ${PORT}`);
});
