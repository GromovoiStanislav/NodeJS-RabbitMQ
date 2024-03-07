import { Module } from '@nestjs/common';
import { AnyService } from './any.service';

@Module({
  providers: [AnyService]
})
export class AnyModule {}
