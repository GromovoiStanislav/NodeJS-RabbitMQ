import { randomUUID } from 'crypto';
import config from '../config.js';
export default class Producer {
    channel;
    replyQueueName;
    eventEmitter;
    constructor(channel, replyQueueName, eventEmitter) {
        this.channel = channel;
        this.replyQueueName = replyQueueName;
        this.eventEmitter = eventEmitter;
    }
    async produceMessages(data) {
        const uuid = randomUUID();
        console.log('the corr id is ', uuid);
        this.channel.sendToQueue(config.rabbitMQ.queues.rpcQueue, Buffer.from(JSON.stringify(data)), {
            replyTo: this.replyQueueName,
            correlationId: uuid,
            expiration: 10,
            headers: {
                function: data.operation,
            },
        });
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });
    }
}
