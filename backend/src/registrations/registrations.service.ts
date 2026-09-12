import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getCompetitions() {
    return this.prisma.competition.findMany({
      orderBy: {
        startDate: 'asc',
      },
      include: {
        verein: true,
      },
    });
  }

  async getMembers(
    trainerId: number,
    vereinId: number,
  ) {
    await this.checkTrainerForVerein(
      trainerId,
      vereinId,
    );

    const memberships =
      await this.prisma.userIsInVerein.findMany({
        where: {
          verein_id: vereinId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          user: {
            lastName: 'asc',
          },
        },
      });

    return memberships.map(
      (membership) => membership.user,
    );
  }

  private async checkTrainerForVerein(
    userId: number,
    vereinId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(
        'Benutzer nicht gefunden.',
      );
    }

    // Admins dürfen Anmeldungen für jeden Verein verwalten.
    if (user.isAdmin) {
      return;
    }

    // Alle anderen müssen Trainer sein.
    const trainer =
      await this.prisma.trainer.findUnique({
        where: {
          user_id: userId,
        },
      });

    if (!trainer) {
      throw new ForbiddenException(
        'Nur Trainer können Anmeldungen verwalten.',
      );
    }

    // Trainer dürfen nur Vereine verwalten,
    // in denen sie selbst Mitglied sind.
    const membership =
      await this.prisma.userIsInVerein.findUnique({
        where: {
          user_id_verein_id: {
            user_id: userId,
            verein_id: vereinId,
          },
        },
      });

    if (!membership) {
      throw new ForbiddenException(
        'Du bist kein Mitglied dieses Vereins.',
      );
    }
  }

  private async checkCompetition(
    competitionId: number,
  ) {
    const competition =
      await this.prisma.competition.findUnique({
        where: {
          id: competitionId,
        },
      });

    if (!competition) {
      throw new NotFoundException(
        'Wettkampf nicht gefunden.',
      );
    }

    return competition;
  }

  private async checkMembers(
    vereinId: number,
    userIds: number[],
  ) {
    const uniqueUserIds = [...new Set(userIds)];

    if (uniqueUserIds.length !== userIds.length) {
      throw new BadRequestException(
        'Ein Fahrer wurde mehrfach ausgewählt.',
      );
    }

    const memberships =
      await this.prisma.userIsInVerein.findMany({
        where: {
          verein_id: vereinId,
          user_id: {
            in: uniqueUserIds,
          },
        },
      });

    if (memberships.length !== uniqueUserIds.length) {
      throw new BadRequestException(
        'Mindestens ein ausgewählter Fahrer ist kein Mitglied dieses Vereins.',
      );
    }
  }

  async getRegistrations(
    userId: number,
    competitionId: number,
    vereinId: number,
  ) {
    await this.checkTrainerForVerein(
      userId,
      vereinId,
    );

    await this.checkCompetition(
      competitionId,
    );

    const [
      einzel,
      paar,
      kleingruppe,
      grossgruppe,
    ] = await Promise.all([
      this.prisma.einzelkuer.findMany({
        where: {
          competition_id: competitionId,
          verein_id: vereinId,
        },
        include: {
          fahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      this.prisma.paarkuer.findMany({
        where: {
          competition_id: competitionId,
          verein_id: vereinId,
        },
        include: {
          fahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      this.prisma.kleingruppenkuer.findMany({
        where: {
          competition_id: competitionId,
          verein_id: vereinId,
        },
        include: {
          fahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          ersatzfahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      this.prisma.grossgruppenkuer.findMany({
        where: {
          competition_id: competitionId,
          verein_id: vereinId,
        },
        include: {
          fahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          ersatzfahrer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

    ]);

    return {
      einzel,
      paar,
      kleingruppe,
      grossgruppe,
    };
  }


  async createEinzelkuer(
    trainerId: number,
    competitionId: number,
    vereinId: number,
    titel: string,
    fahrerId: number,
  ) {
    await this.checkTrainerForVerein(
      trainerId,
      vereinId,
    );

    await this.checkCompetition(
      competitionId,
    );

    await this.checkMembers(
      vereinId,
      [fahrerId],
    );

    return this.prisma.einzelkuer.create({
      data: {
        competition_id: competitionId,
        verein_id: vereinId,
        titel,
        fahrer: {
          create: {
            user_id: fahrerId,
          },
        },
      },
      include: {
        fahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async createPaarkuer(
    trainerId: number,
    competitionId: number,
    vereinId: number,
    titel: string,
    fahrerIds: number[],
  ) {
    if (fahrerIds.length !== 2) {
      throw new BadRequestException(
        'Eine Paarkür benötigt genau 2 Fahrer.',
      );
    }

    await this.checkTrainerForVerein(
      trainerId,
      vereinId,
    );

    await this.checkCompetition(
      competitionId,
    );

    await this.checkMembers(
      vereinId,
      fahrerIds,
    );

    return this.prisma.paarkuer.create({
      data: {
        competition_id: competitionId,
        verein_id: vereinId,
        titel,
        fahrer: {
          create: fahrerIds.map((userId) => ({
            user_id: userId,
          })),
        },
      },
      include: {
        fahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async createKleingruppenkuer(
    trainerId: number,
    competitionId: number,
    vereinId: number,
    titel: string,
    fahrerIds: number[],
    ersatzfahrerIds: number[],
  ) {
    if (
      fahrerIds.length < 3 ||
      fahrerIds.length > 8
    ) {
      throw new BadRequestException(
        'Eine Kleingruppe benötigt 3 bis 8 Fahrer.',
      );
    }

    if (ersatzfahrerIds.length > 2) {
      throw new BadRequestException(
        'Es dürfen maximal 2 Ersatzfahrer angegeben werden.',
      );
    }

    const allIds = [
      ...fahrerIds,
      ...ersatzfahrerIds,
    ];

    await this.checkTrainerForVerein(
      trainerId,
      vereinId,
    );

    await this.checkCompetition(
      competitionId,
    );

    await this.checkMembers(
      vereinId,
      allIds,
    );

    if (
      new Set(allIds).size !== allIds.length
    ) {
      throw new BadRequestException(
        'Ein Fahrer kann nicht gleichzeitig Fahrer und Ersatzfahrer sein.',
      );
    }

    return this.prisma.kleingruppenkuer.create({
      data: {
        competition_id: competitionId,
        verein_id: vereinId,
        titel,
        fahrer_anzahl: fahrerIds.length,
        ersatzfahrer_anzahl:
          ersatzfahrerIds.length,

        fahrer: {
          create: fahrerIds.map((userId) => ({
            user_id: userId,
          })),
        },

        ersatzfahrer: {
          create: ersatzfahrerIds.map(
            (userId) => ({
              user_id: userId,
            }),
          ),
        },
      },

      include: {
        fahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        ersatzfahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async createGrossgruppenkuer(
    trainerId: number,
    competitionId: number,
    vereinId: number,
    titel: string,
    fahrerIds: number[],
    ersatzfahrerIds: number[],
  ) {
    if (fahrerIds.length < 9) {
      throw new BadRequestException(
        'Eine Großgruppe benötigt mindestens 9 Fahrer.',
      );
    }

    if (ersatzfahrerIds.length > 2) {
      throw new BadRequestException(
        'Es dürfen maximal 2 Ersatzfahrer angegeben werden.',
      );
    }

    const allIds = [
      ...fahrerIds,
      ...ersatzfahrerIds,
    ];

    await this.checkTrainerForVerein(
      trainerId,
      vereinId,
    );

    await this.checkCompetition(
      competitionId,
    );

    await this.checkMembers(
      vereinId,
      allIds,
    );

    if (
      new Set(allIds).size !== allIds.length
    ) {
      throw new BadRequestException(
        'Ein Fahrer kann nicht gleichzeitig Fahrer und Ersatzfahrer sein.',
      );
    }

    return this.prisma.grossgruppenkuer.create({
      data: {
        competition_id: competitionId,
        verein_id: vereinId,
        titel,
        fahrer_anzahl: fahrerIds.length,
        ersatzfahrer_anzahl:
          ersatzfahrerIds.length,

        fahrer: {
          create: fahrerIds.map((userId) => ({
            user_id: userId,
          })),
        },

        ersatzfahrer: {
          create: ersatzfahrerIds.map(
            (userId) => ({
              user_id: userId,
            }),
          ),
        },
      },

      include: {
        fahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        ersatzfahrer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}

