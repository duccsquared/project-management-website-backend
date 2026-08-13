import { Body, Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RoleService } from './roles.service';
import { RoleDTO } from './dto/roles.dto';
import { BaseController } from 'src/common/classes/controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/roles')
@UseGuards(JwtAuthGuard)
export class RoleController extends BaseController<RoleDTO> {
  constructor(protected readonly service: RoleService, protected prisma: PrismaService) {
    super(service, prisma, 'roles');
  }
}
