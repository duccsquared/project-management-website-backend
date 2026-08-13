import { Body, Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from './users.service';
import { UserDTO } from './dto/users.dto';
import { BaseController } from 'src/common/classes/controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController extends BaseController<UserDTO> {
  constructor(protected readonly service: UserService, protected prisma: PrismaService) {
    super(service, prisma, 'users');
  }
}
