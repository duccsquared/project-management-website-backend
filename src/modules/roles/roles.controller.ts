import { Body, Controller } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RoleService } from './roles.service';
import { RoleDTO } from './dto/roles.dto';
import { BaseController } from 'src/common/classes/controller';

@Controller('/role')
export class RoleController extends BaseController<RoleDTO> {
  constructor(protected readonly service: RoleService, protected prisma: PrismaService) {
    super(service, prisma, 'role');
  }
}
