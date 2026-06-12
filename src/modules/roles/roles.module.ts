import { Module } from '@nestjs/common';
import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';
import { RoleRepository } from './roles.repository';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RolesModule {}