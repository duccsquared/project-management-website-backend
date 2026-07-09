import { Body, Controller } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TaskService } from './tasks.service';
import { TaskDTO } from './dto/tasks.dto';
import { BaseController } from 'src/common/classes/controller';

@Controller('/tasks')
export class TaskController extends BaseController<TaskDTO> {
  constructor(protected readonly service: TaskService, protected prisma: PrismaService) {
    super(service, prisma, 'tasks');
  }
}
