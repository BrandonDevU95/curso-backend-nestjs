import { CreateUserDto, UpdateUserDto } from './user.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);

    //Como ejemplo de uso de ForbiddenException
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }

  async create(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error creating user');
    }
  }

  async update(id: number, updatedUser: UpdateUserDto) {
    const user = await this.findOne(id);
    const updated = this.usersRepository.merge(user, updatedUser);
    return this.usersRepository.save(updated);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user.id);
    return { message: 'User deleted successfully' };
  }

  private async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
