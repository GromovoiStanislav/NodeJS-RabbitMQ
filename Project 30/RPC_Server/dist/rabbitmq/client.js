import { connect } from 'amqplib';
import config from '../config.js';
import Consumer from './consumer.js';
import Producer from './producer.js';
class RabbitMQClient {
    constructor() { }
    static instance;
    isInitialized = false;
    producer;
    consumer;
    connection;
    producerChannel;
    consumerChannel;
    static getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await connect(config.rabbitMQ.url);
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();
            const { queue: rpcQueue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.rpcQueue, {
                exclusive: true,
            });
            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel, rpcQueue);
            this.consumer.consumeMessages();
            this.isInitialized = true;
        }
        catch (error) {
            console.log('rabbitmq error...', error);
        }
    }
    async produce(data, correlationId, replyToQueue) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return await this.producer.produceMessages(data, correlationId, replyToQueue);
    }
}
export default RabbitMQClient.getInstance();