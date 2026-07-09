import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectMemberDTO } from './dto/projectMembers.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class ProjectMemberRepository extends BaseRepository<ProjectMemberDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'projectMembers');
  }
}
