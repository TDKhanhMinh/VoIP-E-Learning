import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Patch,
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
import { CredentialLifecycleService } from '../../../application/auth/credential-lifecycle.service';
import type { CurrentActor } from '../../../application/auth/ports/token-service.port';
import { ApplicationError } from '../../../application/errors/application.error';
import { CurrentActorDecorator } from './decorators/current-actor.decorator';
import { AllowUnverified } from './decorators/allow-unverified.decorator';
import { PublicRoute } from './decorators/public-route.decorator';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import {
  ChangePasswordDto,
  EmailVerificationConfirmDto,
  LoginDto,
  PasswordResetConfirmDto,
  PasswordResetRequestDto,
} from './dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
@AllowUnverified()
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly credentialLifecycle: CredentialLifecycleService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @PublicRoute('auth.login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    return this.withRefreshCookie(
      response,
      await this.authService.login(body.email, body.password, {
        userAgent: this.requestUserAgent(response),
        ipAddress: this.requestIp(response),
      }),
    );
  }

  @Post('refresh')
  @PublicRoute('auth.refresh')
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

  @Patch('password')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentActorDecorator() actor: CurrentActor,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.changePassword(
      actor,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Post('password-reset/request')
  @PublicRoute('auth.password-reset.request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestPasswordReset(
    @Body() body: PasswordResetRequestDto,
  ): Promise<void> {
    await this.credentialLifecycle.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  @PublicRoute('auth.password-reset.confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordReset(
    @Body() body: PasswordResetConfirmDto,
  ): Promise<void> {
    await this.credentialLifecycle.resetPassword(body.token, body.newPassword);
  }

  @Post('email-verification/confirm')
  @PublicRoute('auth.email-verification.confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmailVerification(
    @Body() body: EmailVerificationConfirmDto,
  ): Promise<void> {
    await this.credentialLifecycle.verifyEmail(body.token);
  }

  @Post('email-verification/request')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestEmailVerification(
    @CurrentActorDecorator() actor: CurrentActor,
  ): Promise<void> {
    await this.credentialLifecycle.requestEmailVerification(actor.userId);
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

  private requestUserAgent(response: Response): string | undefined {
    const value = this.request(response).headers['user-agent'];
    return Array.isArray(value) ? value[0] : value;
  }

  private requestIp(response: Response): string | undefined {
    return this.request(response).ip;
  }

  private request(response: Response): {
    headers: Record<string, string | string[] | undefined>;
    ip?: string;
  } {
    return response.req;
  }
}
