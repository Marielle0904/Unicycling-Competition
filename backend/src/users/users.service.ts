import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
      },
    });
  }
}
