import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectMembersModule } from './modules/projectMembers/projectMembers.module';
import { RolesModule } from './modules/roles/roles.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskAssignmentsModule } from './modules/taskAssignments/taskAssignments.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [CoreModule, TestModule, UsersModule, ProjectsModule, ProjectMembersModule, RolesModule, TasksModule, TaskAssignmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}