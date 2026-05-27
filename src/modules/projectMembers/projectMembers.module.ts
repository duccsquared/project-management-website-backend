import { Module } from '@nestjs/common';
import { ProjectMemberController } from './projectMembers.controller';
import { ProjectMemberService } from './projectMembers.service';
import { ProjectMemberRepository } from './projectMembers.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, ProjectMemberRepository, PrismaService],
  exports: [ProjectMemberService, ProjectMemberRepository], // if other modules need these
})
export class ProjectMembersModule {}