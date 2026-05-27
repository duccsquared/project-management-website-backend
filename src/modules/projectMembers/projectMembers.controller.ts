import { Body, Controller } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectMemberService } from './projectMembers.service';
import { ProjectMemberDTO } from './dto/projectMembers.dto';
import { BaseController } from 'src/common/classes/controller';

@Controller('/projectMember')
export class ProjectMemberController extends BaseController<ProjectMemberDTO> {
  constructor(protected readonly service: ProjectMemberService, protected prisma: PrismaService) {
    super(service, prisma, 'projectMember');
  }
}
