import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { buildPrismaQuery } from 'src/common/utils/buildPrismaQuery';
import { QueryDTO } from 'src/common/dto/query.dto';

interface PrismaDelegate {
  findMany(args?: any): Promise<any[]>;
  findUnique(args: any): Promise<any>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  updateMany(args: any): Promise<any>;
  delete(args: any): Promise<any>;
  deleteMany(args: any): Promise<any>;
}

@Injectable()
export class BaseRepository<T> {
    entityName: string;

  constructor(protected prisma: PrismaService, entityName: string) {
    this.entityName = entityName;
  }

  async getAll(query: QueryDTO): Promise<any[]> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).findMany(prismaQuery);
  }

  async getById(id: number): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).findUnique({ where: { id } });
  }

  async create(data: T): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).create({ data });
  }

  async update(id: number, data: T): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).update({ where: { id }, data });
  }

  async updateMany(query: QueryDTO, data: T): Promise<any> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).updateMany({ where: prismaQuery.where, data });
  }

  async delete(id: number): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).delete({ where: { id } });
  }

  async deleteMany(query: QueryDTO): Promise<any> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).deleteMany({ where: prismaQuery.where });
  }
}
