require('dotenv').config();
const amqp = require('amqplib');

const userIds = process.argv.slice(2);
if (!userIds.length) {
	console.error('Не указаны пользовательские идентификаторы.');
	process.exit(0);
}


let channel, connection;
const queueName = 'notifications';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
async function connectToRabbitMQ() {
	try {
		connection = await amqp.connect(amqpUrl);
		connection.on('error', (err) => {
			console.error('Ошибка соединения с RabbitMQ:', err.message);
		});
		connection.on('close', () => {
			console.warn('Соединение с RabbitMQ закрыто');
			// Здесь можно попробовать повторно установить соединение.
			setTimeout(connectToRabbitMQ, 1000)
		});


		channel = await connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });

		console.log('Service connected to RabbitMQ');
		console.log('[x] To exit print "exit"');
		console.log('Type a message...');
	} catch (err) {
		console.error('Произошла ошибка при установке соединения с RabbitMQ:', err.message);
	}
}
connectToRabbitMQ();

function getRandomUser() {
	const randomIndex = Math.floor(Math.random() * userIds.length);
	return userIds[randomIndex];
}


process.stdin.on('data', (chunk) => {
	const str = chunk.toString().trim();
	if (str === 'exit') {
		process.exit(0);
	}
	message = { user_id: getRandomUser(), message: str }
	channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
});
