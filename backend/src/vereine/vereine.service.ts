import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VereineService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll() {
    return this.prisma.verein.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(
    name: string,
    email: string,
    userId: number,
  ) {
    const verein = await this.prisma.verein.create({
      data: {
        name,
        email,
      },
    });

    await this.prisma.userIsInVerein.create({
      data: {
        user_id: userId,
        verein_id: verein.id,
      },
    });

    return verein;
  }

  async join(userId: number, vereinId: number) {
    const verein = await this.prisma.verein.findUnique({
      where: {
        id: vereinId,
      },
    });

    if (!verein) {
      throw new NotFoundException('Verein nicht gefunden');
    }

    const existingMembership =
      await this.prisma.userIsInVerein.findUnique({
        where: {
          user_id_verein_id: {
            user_id: userId,
            verein_id: vereinId,
          },
        },
      });

    if (existingMembership) {
      throw new ConflictException(
        'Du bist bereits Mitglied in diesem Verein',
      );
    }

    await this.prisma.userIsInVerein.create({
      data: {
        user_id: userId,
        verein_id: vereinId,
      },
    });

    return verein;
  }

  async getUserVereine(userId: number) {
    const memberships =
      await this.prisma.userIsInVerein.findMany({
        where: {
          user_id: userId,
        },
        include: {
          verein: true,
        },
        orderBy: {
          verein: {
            name: 'asc',
          },
        },
      });

    return memberships.map((membership) => membership.verein);
  }
}
