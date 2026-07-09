import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskRepository } from './tasks.repository';
import { TaskDTO } from './dto/tasks.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class TaskService extends BaseService<TaskDTO> {
  constructor(protected taskRepository: TaskRepository, protected prisma: PrismaService) {
    super(taskRepository,prisma,'tasks');
  }
}
