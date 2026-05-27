import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/project/projects.module';
import { ProjectMembersModule } from './modules/projectMembers/projectMembers.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [TestModule, UsersModule, ProjectsModule, ProjectMembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}