import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async register(data: RegisterUserDto) {
    const passwordHash = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
      },
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
