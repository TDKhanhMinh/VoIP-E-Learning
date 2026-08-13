import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import {
  AuthService,
  type AuthenticatedSession,
  type PublicUser,
} from '../../../application/auth/auth.service';
import type { CurrentActor } from '../../../application/auth/ports/token-service.port';
import { ApplicationError } from '../../../application/errors/application.error';
import { CurrentActorDecorator } from './decorators/current-actor.decorator';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    return this.withRefreshCookie(
      response,
      await this.authService.register(body.email, body.password),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    return this.withRefreshCookie(
      response,
      await this.authService.login(body.email, body.password),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    const request = response.req as {
      cookies?: Record<string, string | undefined>;
    };
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      throw new ApplicationError('Refresh token cookie is required', {
        code: 'INVALID_REFRESH_TOKEN',
        kind: 'unauthenticated',
      });
    }
    return this.withRefreshCookie(
      response,
      await this.authService.refresh(refreshToken),
    );
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentActorDecorator() actor: CurrentActor,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(actor.sessionId);
    response.clearCookie('refresh_token', this.cookieOptions());
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  me(@CurrentActorDecorator() actor: CurrentActor): Promise<PublicUser> {
    return this.authService.currentUser(actor);
  }

  private withRefreshCookie(
    response: Response,
    session: AuthenticatedSession,
  ): { user: PublicUser; accessToken: string } {
    response.cookie('refresh_token', session.refreshToken, {
      ...this.cookieOptions(),
      maxAge: Math.max(0, session.refreshTokenExpiresAt.getTime() - Date.now()),
    });
    return { user: session.user, accessToken: session.accessToken };
  }

  private cookieOptions() {
    const apiPrefix = this.config.getOrThrow<string>('API_PREFIX');
    const apiVersion = this.config.getOrThrow<string>('API_VERSION');
    return {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      path: `/${apiPrefix}/v${apiVersion}/auth`,
    };
  }
}
