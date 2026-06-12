import { Module } from '@nestjs/common';
import { ProjectMemberController } from './projectMembers.controller';
import { ProjectMemberService } from './projectMembers.service';
import { ProjectMemberRepository } from './projectMembers.repository';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, ProjectMemberRepository],
  exports: [ProjectMemberService, ProjectMemberRepository],
})
export class ProjectMembersModule {}