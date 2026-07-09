import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RoleDTO } from './dto/roles.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class RoleRepository extends BaseRepository<RoleDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'roles');
  }
}
