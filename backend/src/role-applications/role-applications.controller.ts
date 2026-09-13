import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../auth/auth.service';
import { CreateRoleApplicationDto } from './dto/create-role-application.dto';
import { RoleApplicationsService } from './role-applications.service';

@Controller('role-applications')
export class RoleApplicationsController {
  constructor(
    private readonly roleApplicationsService: RoleApplicationsService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  async create(
    @Req() request: Request,
    @Body() dto: CreateRoleApplicationDto,
  ) {
    const sessionId = request.cookies?.session;

    if (!sessionId) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    const user = await this.authService.getUserFromSession(sessionId);

    return this.roleApplicationsService.create(user.id, dto);
  }

  @Get('me')
  async findMine(@Req() request: Request) {
    const sessionId = request.cookies?.session;

    if (!sessionId) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    const user = await this.authService.getUserFromSession(sessionId);

    return this.roleApplicationsService.findMyApplications(user.id);
  }
}
