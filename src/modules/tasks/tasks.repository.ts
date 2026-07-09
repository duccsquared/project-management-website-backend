import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskDTO } from './dto/tasks.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class TaskRepository extends BaseRepository<TaskDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'task');
  }
}
