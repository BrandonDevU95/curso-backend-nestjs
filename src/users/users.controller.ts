import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
  ];

  @Get()
  getAllUsers(): User[] {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }
    return user;
  }

  @Post()
  createUser(@Body() body: User) {
    const newUser = {
      ...body,
      id: (this.users.length + 1).toString(),
    };
    this.users.push(newUser);
    return {
      statusCode: 201,
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }
    this.users.splice(index, 1);
    return {
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: Partial<User>) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }
    Object.assign(user, body);
    return {
      statusCode: 200,
      message: 'User updated successfully',
      user,
    };
  }
}
