import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   uri: process.env.AMQP_URL,
    // }),

    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("AMQP_URL")
      }),
      inject: [ConfigService],
      imports: []
    })

  ],
  controllers: [],
  providers: [AppService]
})
export class AppModule {
}
