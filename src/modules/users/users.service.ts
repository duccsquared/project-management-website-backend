import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserDTO } from './dto/users.dto';
import { QueryDTO } from 'src/common/dto/query.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getById(id: number): Promise<any> {
    return this.userRepository.getById(id);
  }

  getAll(query: QueryDTO): Promise<any[]> {
    return this.userRepository.getAll(query);
  }

  create(data: UserDTO): Promise<any> {
    return this.userRepository.create(data);
  }

  update(id: number, data: UserDTO): Promise<any> {
    return this.userRepository.update(id, data);
  }

  updateMany(query: QueryDTO, data: UserDTO): Promise<any> {
    return this.userRepository.updateMany(query, data);
  }

  delete(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  deleteMany(query: QueryDTO): Promise<any> {
    return this.userRepository.deleteMany(query);
  }
}
