import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectMemberRepository } from './projectMembers.repository';
import { ProjectMemberDTO } from './dto/projectMembers.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class ProjectMemberService extends BaseService<ProjectMemberDTO> {
  constructor(protected projectMemberRepository: ProjectMemberRepository, protected prisma: PrismaService) {
    super(projectMemberRepository,prisma,'projectMember');
  }
}
