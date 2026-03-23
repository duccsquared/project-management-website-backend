import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async getById(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<any> {
    return this.prisma.user.create({
      data,
    });
  }
}
