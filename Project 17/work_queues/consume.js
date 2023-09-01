require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const queueName = "task";

const consumeTask = async () => {
	const connection = await amqp.connect(amqpUrl);
	const channel = await connection.createChannel();

	await channel.assertQueue(queueName, { durable: true });

	console.log(`Waiting for messages in queue: ${queueName}`);
	channel.prefetch(1);
	channel.consume(queueName, msg => {
		const secs = msg.content.toString().split('.').length - 1;
		console.log("[X] Received:", msg.content.toString());

		setTimeout(() => {
			console.log("Done task:", msg.content.toString());
			channel.ack(msg);
		}, secs * 1000);
	}, { noAck: false })
}

consumeTask();