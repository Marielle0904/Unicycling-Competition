import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  register(@Body() data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }) {
    return this.usersService.register(data);
  }
}
