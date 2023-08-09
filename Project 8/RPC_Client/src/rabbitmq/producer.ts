import { Channel } from 'amqplib';
import config from '../config';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';

export default class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async produceMessages(data: any) {
    const uuid = randomUUID();
    console.log('the corr id is ', uuid);
    this.channel.sendToQueue(
      config.rabbitMQ.queues.rpcQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName, // Это имя очереди, на которую ожидается ответ
        correlationId: uuid,
        expiration: 10, // milliseconds
        headers: {
          function: data.operation,
        }, //любые дополнительные пользовательские заголовки к сообщению
      }
    );

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        console.log('eventEmitter.once', reply);
        resolve(reply);
      });
    });
  }
}
