import { Body, Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectService } from './projects.service';
import { ProjectDTO } from './dto/projects.dto';
import { BaseController } from 'src/common/classes/controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/projects')
@UseGuards(JwtAuthGuard)
export class ProjectController extends BaseController<ProjectDTO> {
  constructor(protected readonly service: ProjectService, protected prisma: PrismaService) {
    super(service, prisma, 'projects');
  }
}
