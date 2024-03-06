import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import config from "./config/config";
import { GlobalModule } from "./global.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    GlobalModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
