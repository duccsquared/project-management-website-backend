import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { ProjectRepository } from './projects.repository';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectsModule {}