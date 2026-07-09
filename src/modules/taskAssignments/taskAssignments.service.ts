import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskAssignmentRepository } from './taskAssignments.repository';
import { TaskAssignmentDTO } from './dto/taskAssignments.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class TaskAssignmentService extends BaseService<TaskAssignmentDTO> {
  constructor(protected taskAssignmentRepository: TaskAssignmentRepository, protected prisma: PrismaService) {
    super(taskAssignmentRepository, prisma, 'taskAssignments');
  }
}
