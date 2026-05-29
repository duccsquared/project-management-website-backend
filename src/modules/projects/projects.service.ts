import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectRepository } from './projects.repository';
import { ProjectDTO } from './dto/projects.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class ProjectService extends BaseService<ProjectDTO> {
  constructor(protected projectRepository: ProjectRepository, protected prisma: PrismaService) {
    super(projectRepository,prisma,'project');
  }
}
