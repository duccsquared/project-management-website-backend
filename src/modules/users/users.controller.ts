import { Body, Param, Controller, Get, Post } from '@nestjs/common';
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
  async getById(@Param('id') id: string): Promise<any> {
    return this.service.getById(parseInt(id));
  }


  @Post()
  async create(@Body() data: UserDTO): Promise<any> {
    return this.service.create(data);
  }
}
