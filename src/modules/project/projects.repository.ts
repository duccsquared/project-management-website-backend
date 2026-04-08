import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectDTO } from './dto/projects.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'project');
  }
}
