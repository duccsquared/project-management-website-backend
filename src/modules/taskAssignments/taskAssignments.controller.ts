import { Body, Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskAssignmentService } from './taskAssignments.service';
import { TaskAssignmentDTO } from './dto/taskAssignments.dto';
import { BaseController } from 'src/common/classes/controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/task-assignments')
@UseGuards(JwtAuthGuard)
export class TaskAssignmentController extends BaseController<TaskAssignmentDTO> {
  constructor(protected readonly service: TaskAssignmentService, protected prisma: PrismaService) {
    super(service, prisma, 'taskAssignments');
  }
}
