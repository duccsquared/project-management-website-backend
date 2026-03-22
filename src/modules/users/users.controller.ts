import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDTO } from './dto/users.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() data: UserDTO): Promise<any> {
    return this.service.create(data);
  }
}
