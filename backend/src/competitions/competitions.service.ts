import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll() {
    return this.prisma.competition.findMany({
      include: {
        verein: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getUpcoming() {
    return this.prisma.competition.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        verein: true,
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 3,
    });
  }

  async getOne(id: number) {
    const competition =
      await this.prisma.competition.findUnique({
        where: {
          id,
        },
        include: {
          verein: true,
        },
      });

    if (!competition) {
      throw new NotFoundException(
        'Wettkampf nicht gefunden',
      );
    }

    return competition;
  }

  async create(
    name: string,
    description: string | undefined,
    startDate: string,
    endDate: string,
    location: string,
    vereinId: number,
  ) {
    return this.prisma.competition.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        verein_id: vereinId,
      },
      include: {
        verein: true,
      },
    });
  }

  async update(
    id: number,
    name: string,
    description: string | undefined,
    startDate: string,
    endDate: string,
    location: string,
    vereinId: number,
  ) {
    const existing =
      await this.prisma.competition.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        'Wettkampf nicht gefunden',
      );
    }

    return this.prisma.competition.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        verein_id: vereinId,
      },
      include: {
        verein: true,
      },
    });
  }
}
