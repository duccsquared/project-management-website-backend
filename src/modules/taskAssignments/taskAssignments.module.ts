import { Module } from '@nestjs/common';
import { TaskAssignmentController } from './taskAssignments.controller';
import { TaskAssignmentService } from './taskAssignments.service';
import { TaskAssignmentRepository } from './taskAssignments.repository';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService, TaskAssignmentRepository],
  exports: [TaskAssignmentService, TaskAssignmentRepository],
})
export class TaskAssignmentsModule {}