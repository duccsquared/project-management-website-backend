import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserDTO } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getById(id: number): Promise<any> {
    return this.userRepository.getById(id);
  }

  getAll(): Promise<any[]> {
    return this.userRepository.getAll();
  }

  async create(data: UserDTO): Promise<any> {
    return this.userRepository.create(data);
  }

  update(id: number, data: UserDTO): Promise<any> {
    return this.userRepository.update(id, data);
  }

  delete(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
}
