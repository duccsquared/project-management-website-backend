import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from './users.repository';
import { UserDTO } from './dto/users.dto';
import { BaseService } from 'src/common/classes/service';

@Injectable()
export class UserService extends BaseService<UserDTO> {
  constructor(protected userRepository: UserRepository, protected prisma: PrismaService) {
    super(userRepository,prisma,'user');
  }
}
