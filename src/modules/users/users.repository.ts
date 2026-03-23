import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserDTO } from './dto/users.dto';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async getById(id: number): Promise<any> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: UserDTO): Promise<any> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: UserDTO): Promise<any> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.user.delete({ where: { id } });
  }
}
