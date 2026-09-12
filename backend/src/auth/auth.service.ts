import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        trainer: true,
        juror: true,
        juryleitung: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Ungültige E-Mail oder Passwort');
    }

    const passwordMatches = await argon2.verify(
      user.password,
      password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Ungültige E-Mail oder Passwort');
    }

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: {
          trainer: !!user.trainer,
          juror: !!user.juror,
          juryleitung: !!user.juryleitung,
          admin: user.isAdmin,
        },
      },
      sessionId: session.id,
    };
  }

  async getUserFromSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          include: {
            trainer: true,
            juror: true,
            juryleitung: true,
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Ungültige Session');
    }

    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      throw new UnauthorizedException('Session abgelaufen');
    }

    const { password, trainer, juror, juryleitung, ...user } = session.user;

    return {
      ...user,
      roles: {
        trainer: !!trainer,
        juror: !!juror,
        juryleitung: !!juryleitung,
        admin: user.isAdmin,
      },
    };
  }
  async logout(sessionId: string) {
    await this.prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }
}
