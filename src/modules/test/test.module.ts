import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}