import { Body, Param, Query, Get, Post, Put, Delete } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BaseService } from './service';
import { QueryDTO } from 'src/common/dto/query.dto';

export class BaseController<T> {

  entityName: string;

  constructor(protected baseService: BaseService<T>, protected prisma: PrismaService, entityName: string) {
    this.entityName = entityName;
  }

  @Get()
  async getAll(@Query() query: QueryDTO): Promise<any[]> {
    return this.baseService.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return this.baseService.getById(parseInt(id));
  }

  @Post()
  async create(@Body() data: T): Promise<any> {
    return this.baseService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: T): Promise<any> {
    return this.baseService.update(parseInt(id), data);
  }

  @Put()
  async updateMany(@Query() query: QueryDTO, @Body() data: T): Promise<any> {
    return this.baseService.updateMany(query, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.baseService.delete(parseInt(id));
  }

  @Delete()
  async deleteMany(@Query() query: QueryDTO): Promise<any> {
    return this.baseService.deleteMany(query);
  }
}
