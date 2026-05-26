import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { ProjectRepository } from './projects.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, PrismaService],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectsModule {}