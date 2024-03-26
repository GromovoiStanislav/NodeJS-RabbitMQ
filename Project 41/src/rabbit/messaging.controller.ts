import {Controller, Post} from '@nestjs/common';
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Controller()
export class MessagingController {
    constructor(
        private readonly amqpConnection: AmqpConnection
    ) {}

    @Post()
    sendMessage(): string {
        this.amqpConnection.publish('exchange1', 'subscribe-route', { msg: 'hello world' });
        return 'OK';
    }
}
