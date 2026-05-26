import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/project/projects.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [UsersModule, ProjectsModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}