import { EventEmitter } from "node:events";
import { Connection, connect, Channel } from "amqplib";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Consumer from "./consumer";
import Producer from "./producer";

@Injectable()
export default class RabbitMQClient {

  constructor(
    private config: ConfigService
  ) {
  }

  private logger = new Logger(this.constructor.name);
  private eventEmitter: EventEmitter = new EventEmitter();

  private producer: Producer;
  private consumer: Consumer;

  private connection: Connection;
  private producerChannel: Channel;
  private consumerChannel: Channel;

  async initialize() {
    try {
      //Connect to rabbitMQ
      this.connection = await connect(this.config.get("rabbitMQ.host"));

      //Create producer and consumer channels
      await this.createChannels();

      //Create reply queue (unique for every pod)
      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        {
          autoDelete: true
        }
      );

      const { queue: requestQueueName } =
        await this.consumerChannel.assertQueue(
          this.config.get("rabbitMQ.queues.testRequestQueue"),
          {
            durable: true
          }
        );

      //Create the producer and consumer
      this.producer = new Producer(
        this.producerChannel,
        this.eventEmitter,
        replyQueueName,
        this.config
      );

      this.consumer = new Consumer(
        this.consumerChannel,
        this.eventEmitter,
        requestQueueName,
        replyQueueName,
      this.producer
      );

      //Run consumers
      this.consumer.consumeMessages();
    } catch (error) {
      this.logger.error(`RabbitMQ error:  ${error}`);
    }
  }

  async createChannels() {
    this.producerChannel = await this.connection.createChannel();
    this.consumerChannel = await this.connection.createChannel();
  }

  async produce(
    data,
    queueName: string,
    correlationId: string,
    waitForResponse = false,
    needToAssertQueue = false,
    headers = {},
    hasExpirationTime = true
  ) {
    if (!this.connection || !this.producerChannel) {
      await this.initialize();
    }

    return this.producer.publishMessage(
      data,
      queueName,
      correlationId,
      waitForResponse,
      needToAssertQueue,
      headers,
      hasExpirationTime
    );
  }

  async closeConnection() {
    try {
      this.connection.close();
    } catch (error) {
      this.logger.error(`RabbitMQ error:  ${error}`);
    }
  }
}