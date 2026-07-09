import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskAssignmentDTO } from './dto/taskAssignments.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class TaskAssignmentRepository extends BaseRepository<TaskAssignmentDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'taskAssignments');
  }
}
