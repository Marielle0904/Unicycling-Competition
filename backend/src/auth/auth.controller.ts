import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Body()
    data: {
      email: string;
      password: string;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      data.email,
      data.password,
    );

    response.cookie('session', result.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result.user;
  }

  @Get('me')
  async me(@Req() request: Request) {
    const sessionId = request.cookies?.session;

    if (!sessionId) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    return this.authService.getUserFromSession(sessionId);
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies?.session;

    if (sessionId) {
      await this.authService.logout(sessionId);
    }

    response.clearCookie('session', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      message: 'Erfolgreich ausgeloggt',
    };
  }
}
