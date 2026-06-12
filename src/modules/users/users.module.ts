import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}