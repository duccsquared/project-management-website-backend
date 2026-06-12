import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RoleRepository } from './roles.repository';
import { RoleDTO } from './dto/roles.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class RoleService extends BaseService<RoleDTO> {
  constructor(protected roleRepository: RoleRepository, protected prisma: PrismaService) {
    super(roleRepository,prisma,'role');
  }
}
