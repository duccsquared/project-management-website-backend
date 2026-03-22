import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: any): Promise<any> {
    return this.userRepository.create(data);
  }
}
