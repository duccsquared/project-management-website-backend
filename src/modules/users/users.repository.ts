import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserDTO } from './dto/users.dto';
import { BaseRepository } from 'src/common/classes/repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDTO> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'user');
  }
}
