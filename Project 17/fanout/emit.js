require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';


const exchangeName = "logs";
const msg = process.argv.slice(2).join(' ') || 'Subscribe, Like, & Comment';

const sendMsg = async () => {
	const connection = await amqp.connect(amqpUrl);
	const channel = await connection.createChannel();
	await channel.assertExchange(exchangeName, 'fanout', { durable: false });
	channel.publish(exchangeName, '', Buffer.from(msg));
	console.log('Sent: ', msg);
	setTimeout(() => {
		connection.close();
		process.exit(0);
	}, 500)
}

sendMsg();