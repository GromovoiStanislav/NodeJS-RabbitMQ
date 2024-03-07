import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AnyModule } from "./any/any.module";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnyModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
