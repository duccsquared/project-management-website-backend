import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseRepository } from './repository';
import { QueryDTO } from 'src/common/dto/query.dto';

@Injectable()
export class BaseService<T> {
  entityName: string;

  constructor(protected baseRepository: BaseRepository<T>, protected prisma: PrismaService, entityName: string) {
    this.entityName = entityName;
  }

  getById(id: number): Promise<any> {
    return this.baseRepository.getById(id);
  }

  getAll(query: QueryDTO): Promise<any[]> {
    return this.baseRepository.getAll(query);
  }

  create(data: T): Promise<any> {
    return this.baseRepository.create(data);
  }

  update(id: number, data: T): Promise<any> {
    return this.baseRepository.update(id, data);
  }

  updateMany(query: QueryDTO, data: T): Promise<any> {
    return this.baseRepository.updateMany(query, data);
  }

  delete(id: number): Promise<any> {
    return this.baseRepository.delete(id);
  }

  deleteMany(query: QueryDTO): Promise<any> {
    return this.baseRepository.deleteMany(query);
  }
}
