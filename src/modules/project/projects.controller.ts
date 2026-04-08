import { Body, Controller } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectService } from './projects.service';
import { ProjectDTO } from './dto/projects.dto';
import { BaseController } from 'src/common/classes/controller';

@Controller('/project')
export class ProjectController extends BaseController<ProjectDTO> {
  constructor(protected readonly service: ProjectService, protected prisma: PrismaService) {
    super(service, prisma, 'project');
  }
}
