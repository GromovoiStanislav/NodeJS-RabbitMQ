import {Module} from '@nestjs/common';
import {AmqpConnection, RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import * as process from "process";
import {MessagingService} from "./messaging.service";
import {MessagingController} from "./messaging.controller";

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'exchange1',
                    type: 'topic',
                },
            ],
            uri: process.env.AMQP_URL,
            connectionInitOptions: {wait: false},
        }),
    ],
    providers: [MessagingService],
    controllers: [MessagingController]
})
export class RabbitModule {
}
