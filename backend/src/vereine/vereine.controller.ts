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
import { VereineService } from './vereine.service';

@Controller('vereine')
export class VereineController {
  constructor(
    private readonly vereineService: VereineService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  async getAll() {
    return this.vereineService.getAll();
  }

  @Get('meine')
  async getMyVereine(@Req() request: Request) {
    const user = await this.getCurrentUser(request);

    return this.vereineService.getUserVereine(user.id);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body()
    data: {
      name: string;
      email: string;
    },
  ) {
    const user = await this.getCurrentUser(request);

    return this.vereineService.create(
      data.name,
      data.email,
      user.id,
    );
  }

  @Post(':vereinId/join')
  async join(
    @Req() request: Request,
    @Param('vereinId') vereinId: string,
  ) {
    const user = await this.getCurrentUser(request);

    return this.vereineService.join(
      user.id,
      Number(vereinId),
    );
  }

  private async getCurrentUser(request: Request) {
    const sessionId = request.cookies?.session;

    if (!sessionId) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    return this.authService.getUserFromSession(sessionId);
  }
}
