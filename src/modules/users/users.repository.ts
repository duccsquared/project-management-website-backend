import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    return this.prisma.user.create({
      data,
    });
  }
}
