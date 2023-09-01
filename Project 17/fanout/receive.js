require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';


const exchangeName = "logs";

const recieveMsg = async () => {
	const connection = await amqp.connect(amqpUrl);
	const channel = await connection.createChannel();
	await channel.assertExchange(exchangeName, 'fanout', { durable: false });
	const q = await channel.assertQueue('', { exclusive: true });
	console.log(`Waiting for messages in queue: ${q.queue}`);
	channel.bindQueue(q.queue, exchangeName, '');
	channel.consume(q.queue, msg => {
		if (msg.content) console.log("THe message is: ", msg.content.toString());
	}, { noAck: true })
}

recieveMsg();