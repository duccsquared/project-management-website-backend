import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDTO } from './dto/users.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getAll(): Promise<any[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Body('id') id: number): Promise<any> {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body() data: UserDTO): Promise<any> {
    return this.service.create(data);
  }
}
