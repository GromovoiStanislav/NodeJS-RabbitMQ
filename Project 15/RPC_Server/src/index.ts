import 'dotenv/config.js';
import inquirer from 'inquirer';
import { AmqpSender } from './amqp.sender.js';

const queueName = process.env.QUEUE_NAME || 'test-queue';

const start = async () => {
  const rabbit = new AmqpSender(queueName);
  await rabbit.connect();

  console.log('Now type something to send to rabbit or "exit" to stop');
  while (true) {
    const data = await inquirer.prompt([{ name: 'text', message: '=>' }]);
    if (data.text === 'exit') break;
    await rabbit.send(data.text);
  }

  await rabbit.close();
};

start();
