import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './modules/test/test.controller';
import { TestService } from './modules/test/test.service';
import { UserController } from './modules/users/users.controller';
import { UserService } from './modules/users/users.service';
import { UserRepository } from './modules/users/users.repository';
import { PrismaService } from 'prisma/prisma.service';
@Module({
  imports: [],
  controllers: [AppController, TestController, UserController],
  // eslint-disable-next-line prettier/prettier
  providers: [AppService, TestService, UserService, UserRepository, PrismaService],
})
export class AppModule {}
