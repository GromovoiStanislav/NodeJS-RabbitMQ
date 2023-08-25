require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

/*
сообщения с expiration удаляются из очереди автоматически. 
Этими функциями можно проверять другие реквизиты из message.content
*/

///////////////////  Интервальное ////////////////////
async function cleanExpiredMessages() {
  const connection = await amqp.connect(amqpUrl);

  const channel = await connection.createChannel();

  // Настройка параметров очереди:
  const queueName = 'my_queue';
  await channel.assertQueue(queueName, {
    durable: true, // Очередь будет сохраняться даже после перезапуска брокера
    autoDelete: false, // Очередь не будет автоматически удаляться при отсутствии потребителей
  });

  const idInterval = setInterval(async () => {
    const { messageCount, consumerCount } = await channel.checkQueue(queueName);
    console.log(
      `Queue has ${messageCount} messages and ${consumerCount} consumers.`
    );

    for (let i = 0; i < messageCount; i++) {
      const message = await channel.get(queueName);
      if (message && message.properties.expiration) {
        const expirationTime = new Date(
          message.properties.expiration
        ).getTime();
        const currentTime = Date.now();
        if (currentTime > expirationTime) {
          console.log('Deleting expired message:', message.content.toString());
          channel.ack(message);
        } else {
          console.log('Message still valid:', message.content.toString());
          channel.nack(message);
        }
      }
    }
  }, 5000); // Период проверки в миллисекундах (5 секунд)

  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
    clearInterval(idInterval);
  });
}

cleanExpiredMessages().catch(console.error);

/////////////////////// Постоянное ////////////////////////////
async function consumeMessages() {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  // Настройка параметров очереди:
  const queueName = 'my_queue';
  // await channel.assertQueue(queue, {
  //   durable: true, // Очередь будет сохраняться даже после перезапуска брокера
  //   autoDelete: false, // Очередь не будет автоматически удаляться при отсутствии потребителей
  // });

  const processMessage = async (message) => {
    const expirationTime = new Date(message.properties.expiration).getTime();
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      console.log('Deleting expired message:', message.content.toString());
      channel.ack(message);
    } else {
      console.log('Message still valid:', message.content.toString());
      channel.nack(message);
    }
  };

  channel.consume(queueName, processMessage, { noAck: false });
}

// consumeMessages().catch(console.error);
