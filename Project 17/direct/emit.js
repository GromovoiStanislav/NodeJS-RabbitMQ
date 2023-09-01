require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchangeName = "direct_logs";
const args = process.argv.slice(2);
const msg = args[1] || 'Subscribe, Like, Comment';
const key = args[0]

console.log(args, msg);

const sendMsg = async () => {
	const connection = await amqp.connect(amqpUrl);
	const channel = await connection.createChannel();

	await channel.assertExchange(exchangeName, 'direct', { durable: false });

	channel.publish(exchangeName, key, Buffer.from(msg));
	console.log('Sent: ', msg);

	setTimeout(() => {
		connection.close();
		process.exit(0);
	}, 500)
}

sendMsg();