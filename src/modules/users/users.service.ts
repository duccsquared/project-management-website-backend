import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getById(id: number): Promise<any> {
    return this.userRepository.getById(id);
  }

  getAll(): Promise<any[]> {
    return this.userRepository.getAll();
  }

  async create(data: any): Promise<any> {
    return this.userRepository.create(data);
  }
}
