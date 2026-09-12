import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(
    private readonly registrationsService: RegistrationsService,
    private readonly authService: AuthService,
  ) { }

  @Get('competitions')
  async getCompetitions() {
    return this.registrationsService.getCompetitions();
  }

  @Get('list/:competitionId/:vereinId')
  async getRegistrations(
    @Req() request: Request,
    @Param('competitionId') competitionId: string,
    @Param('vereinId') vereinId: string,
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.getRegistrations(
      userId,
      Number(competitionId),
      Number(vereinId),
    );
  }
  @Get('members/:vereinId')
  async getMembers(
    @Req() request: Request,
    @Param('vereinId') vereinId: string,
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.getMembers(
      userId,
      Number(vereinId),
    );
  }

  @Post('einzel')
  async createEinzelkuer(
    @Req() request: Request,
    @Body()
    data: {
      competitionId: number;
      vereinId: number;
      titel: string;
      fahrerId: number;
    },
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.createEinzelkuer(
      userId,
      data.competitionId,
      data.vereinId,
      data.titel,
      data.fahrerId,
    );
  }

  @Post('paar')
  async createPaarkuer(
    @Req() request: Request,
    @Body()
    data: {
      competitionId: number;
      vereinId: number;
      titel: string;
      fahrerIds: number[];
    },
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.createPaarkuer(
      userId,
      data.competitionId,
      data.vereinId,
      data.titel,
      data.fahrerIds,
    );
  }

  @Post('kleingruppe')
  async createKleingruppenkuer(
    @Req() request: Request,
    @Body()
    data: {
      competitionId: number;
      vereinId: number;
      titel: string;
      fahrerIds: number[];
      ersatzfahrerIds: number[];
    },
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.createKleingruppenkuer(
      userId,
      data.competitionId,
      data.vereinId,
      data.titel,
      data.fahrerIds,
      data.ersatzfahrerIds,
    );
  }

  @Post('grossgruppe')
  async createGrossgruppenkuer(
    @Req() request: Request,
    @Body()
    data: {
      competitionId: number;
      vereinId: number;
      titel: string;
      fahrerIds: number[];
      ersatzfahrerIds: number[];
    },
  ) {
    const userId = await this.getUserId(request);

    return this.registrationsService.createGrossgruppenkuer(
      userId,
      data.competitionId,
      data.vereinId,
      data.titel,
      data.fahrerIds,
      data.ersatzfahrerIds,
    );
  }

  private async getUserId(
    request: Request,
  ): Promise<number> {
    const sessionId = request.cookies?.session;

    if (!sessionId) {
      throw new UnauthorizedException(
        'Nicht eingeloggt',
      );
    }

    const user =
      await this.authService.getUserFromSession(
        sessionId,
      );

    return user.id;
  }
}
