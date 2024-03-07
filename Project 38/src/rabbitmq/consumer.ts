import { Channel } from "amqplib";
import { EventEmitter } from "events";
import Producer from "./producer";

export default class Consumer {
  constructor(
    private channel: Channel,
    private eventEmitter: EventEmitter,
    private requestQueueName: string,
    private replyQueue: string,
    private producer: Producer
  ) {
  }

  consumeMessages() {
    //Consume the reply message that arrives on the queue
    this.channel.consume(
      this.replyQueue,
      (message) => {
        console.log("consume replyQueue", JSON.parse(message.content.toString()));
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true
      }
    );

    // //Consume the messages that arrives on the queue
    // this.channel.consume(
    //   this.requestQueueName,
    //   (message) => {
    //     //TODO: Create switch case to perform different functions
    //
    //     console.log("consume requestQueueName", JSON.parse(message.content.toString()));
    //
    //     // this.eventEmitter.emit(
    //     //   message.properties.correlationId.toString(),
    //     //   message
    //     // );
    //
    //     this.producer.publishMessage(
    //       JSON.parse(message.content.toString()),
    //       this.replyQueue,
    //       message.properties.correlationId.toString()
    //     );
    //
    //   },
    //   {
    //     noAck: true
    //   }
    // );

  }
}