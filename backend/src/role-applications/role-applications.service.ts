import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from '../generated/prisma/client';

import { CreateRoleApplicationDto } from './dto/create-role-application.dto';

@Injectable()
export class RoleApplicationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, dto: CreateRoleApplicationDto) {
    // Prüfen, ob der User existiert
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        trainer: true,
        juror: true,
        juryleitung: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Benutzer nicht gefunden.');
    }

    // Prüfen, ob die Rolle bereits vorhanden ist
    if (dto.role === RoleType.TRAINER && user.trainer) {
      throw new BadRequestException(
        'Du bist bereits als Trainer registriert.',
      );
    }

    if (dto.role === RoleType.JUROR && user.juror) {
      throw new BadRequestException(
        'Du bist bereits als Juror registriert.',
      );
    }

    if (dto.role === RoleType.JURYLEITUNG && user.juryleitung) {
      throw new BadRequestException(
        'Du bist bereits als Juryleitung registriert.',
      );
    }

    // Juror benötigt einen Verein
    if (dto.role === RoleType.JUROR && !dto.vereinId) {
      throw new BadRequestException(
        'Für eine Juror-Bewerbung muss ein Verein angegeben werden.',
      );
    }

    // Trainer und Juryleitung benötigen keinen Verein
    if (
      (dto.role === RoleType.TRAINER ||
        dto.role === RoleType.JURYLEITUNG) &&
      dto.vereinId
    ) {
      throw new BadRequestException(
        'Für diese Rolle darf kein Verein angegeben werden.',
      );
    }

    // Verein bei Juror überprüfen
    if (dto.role === RoleType.JUROR && dto.vereinId) {
      const verein = await this.prisma.verein.findUnique({
        where: { id: dto.vereinId },
      });

      if (!verein) {
        throw new NotFoundException('Verein nicht gefunden.');
      }
    }

    // Prüfen, ob bereits ein offener Antrag existiert
    const existingApplication =
      await this.prisma.roleApplication.findFirst({
        where: {
          user_id: userId,
          role: dto.role,
          status: 'PENDING',
        },
      });

    if (existingApplication) {
      throw new BadRequestException(
        'Für diese Rolle existiert bereits eine offene Bewerbung.',
      );
    }

    // Antrag erstellen
    return this.prisma.roleApplication.create({
      data: {
        user_id: userId,
        role: dto.role,
        verein_id: dto.vereinId,
        reason: dto.reason,
      },
    });
  }

  async findMyApplications(userId: number) {
    return this.prisma.roleApplication.findMany({
      where: {
        user_id: userId,
      },
      include: {
        verein: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
