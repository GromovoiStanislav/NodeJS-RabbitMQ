const { connectToRabbitMQ, closeConnection } = require('./amqpConnection');

async function sendValueInFabQueue(num) {
  try {
    const channel = await connectToRabbitMQ();

    const queueName = 'fib-queue';
    await channel.assertQueue(queueName, { durable: false });

    await channel.sendToQueue(queueName, Buffer.from(num.toString()));
    console.log(`Message in ${queueName}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    // Не закрываем соединение, оставляем его открытым для повторного использования
    // Если вы хотите закрыть соединение, то вызовите closeConnection()
  }
}

module.exports = sendValueInFabQueue;
