import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../application/auth/auth.service';
import { CredentialLifecycleService } from '../../application/auth/credential-lifecycle.service';
import { UserManagementService } from '../../application/auth/user-management.service';
import {
  CREDENTIAL_TOKEN_REPOSITORY,
  type CredentialTokenRepositoryPort,
} from '../../application/auth/ports/credential-token.repository.port';
import {
  EMAIL_DELIVERY,
  type EmailDeliveryPort,
} from '../../application/auth/ports/email-delivery.port';
import {
  AUTH_SESSION_REPOSITORY,
  type AuthSessionRepositoryPort,
} from '../../application/auth/ports/auth-session.repository.port';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../../application/auth/ports/password-hasher.port';
import {
  TOKEN_SERVICE,
  type TokenServicePort,
} from '../../application/auth/ports/token-service.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../application/auth/ports/user.repository.port';
import {
  USER_MANAGEMENT_SERVICE,
  type UserManagementServicePort,
} from '../../application/auth/ports/user-management.service.port';
import {
  REALTIME_SESSION_REVOCATION,
  type RealtimeSessionRevocationPort,
} from '../../application/auth/ports/realtime-session-revocation.port';
import {
  ID_GENERATOR,
  type IdGeneratorPort,
} from '../../application/ports/id-generator.port';
import { MongooseAuthSessionRepository } from '../database/mongoose/auth/mongoose-auth-session.repository';
import { MongooseCredentialTokenRepository } from '../database/mongoose/auth/mongoose-credential-token.repository';
import { MongooseUserRepository } from '../database/mongoose/auth/mongoose-user.repository';
import {
  AuthSessionPersistenceModel,
  AuthSessionSchema,
} from '../database/mongoose/auth/auth-session.schema';
import {
  CredentialTokenPersistenceModel,
  CredentialTokenSchema,
} from '../database/mongoose/auth/credential-token.schema';
import { UserSchema } from '../database/mongoose/auth/user.schema';
import { AuthController } from '../../interface-adapters/http/auth/auth.controller';
import { UserController } from '../../interface-adapters/http/users/user.controller';
import { JwtAccessGuard } from '../../interface-adapters/http/auth/guards/jwt-access.guard';
import { RolesGuard } from '../../interface-adapters/http/auth/guards/roles.guard';
import { BcryptPasswordHasherAdapter } from './bcrypt-password-hasher.adapter';
import { JwtTokenServiceAdapter } from './jwt-token-service.adapter';
import { UnavailableEmailDeliveryAdapter } from './unavailable-email-delivery.adapter';
import { NoopRealtimeSessionRevocationAdapter } from './noop-realtime-session-revocation.adapter';
import { parseDurationInMilliseconds } from './duration';

@Global()
@Module({})
export class AuthModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true')
      return { module: AuthModule };
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema },
          { name: AuthSessionPersistenceModel.name, schema: AuthSessionSchema },
          {
            name: CredentialTokenPersistenceModel.name,
            schema: CredentialTokenSchema,
          },
        ]),
      ],
      controllers: [AuthController, UserController],
      providers: [
        BcryptPasswordHasherAdapter,
        JwtTokenServiceAdapter,
        MongooseUserRepository,
        MongooseAuthSessionRepository,
        MongooseCredentialTokenRepository,
        UnavailableEmailDeliveryAdapter,
        NoopRealtimeSessionRevocationAdapter,
        JwtAccessGuard,
        RolesGuard,
        { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasherAdapter },
        { provide: TOKEN_SERVICE, useExisting: JwtTokenServiceAdapter },
        { provide: USER_REPOSITORY, useExisting: MongooseUserRepository },
        {
          provide: AUTH_SESSION_REPOSITORY,
          useExisting: MongooseAuthSessionRepository,
        },
        {
          provide: AuthService,
          inject: [
            USER_REPOSITORY,
            AUTH_SESSION_REPOSITORY,
            PASSWORD_HASHER,
            TOKEN_SERVICE,
            REALTIME_SESSION_REVOCATION,
          ],
          useFactory: (
            users: UserRepositoryPort,
            sessions: AuthSessionRepositoryPort,
            passwordHasher: PasswordHasherPort,
            tokenService: TokenServicePort,
            realtimeRevocation: RealtimeSessionRevocationPort,
          ) =>
            new AuthService({
              users,
              sessions,
              passwordHasher,
              tokenService,
              realtimeRevocation,
            }),
        },
        {
          provide: USER_MANAGEMENT_SERVICE,
          inject: [
            USER_REPOSITORY,
            AUTH_SESSION_REPOSITORY,
            PASSWORD_HASHER,
            ID_GENERATOR,
            REALTIME_SESSION_REVOCATION,
          ],
          useFactory: (
            users: UserRepositoryPort,
            sessions: AuthSessionRepositoryPort,
            passwordHasher: PasswordHasherPort,
            idGenerator: IdGeneratorPort,
            realtimeRevocation: RealtimeSessionRevocationPort,
          ): UserManagementServicePort =>
            new UserManagementService({
              users,
              sessions,
              passwordHasher,
              idGenerator,
              realtimeRevocation,
            }),
        },
        {
          provide: CREDENTIAL_TOKEN_REPOSITORY,
          useExisting: MongooseCredentialTokenRepository,
        },
        {
          provide: EMAIL_DELIVERY,
          useExisting: UnavailableEmailDeliveryAdapter,
        },
        {
          provide: REALTIME_SESSION_REVOCATION,
          useExisting: NoopRealtimeSessionRevocationAdapter,
        },
        {
          provide: CredentialLifecycleService,
          inject: [
            USER_REPOSITORY,
            AUTH_SESSION_REPOSITORY,
            CREDENTIAL_TOKEN_REPOSITORY,
            PASSWORD_HASHER,
            EMAIL_DELIVERY,
            ID_GENERATOR,
            ConfigService,
            REALTIME_SESSION_REVOCATION,
          ],
          useFactory: (
            users: UserRepositoryPort,
            sessions: AuthSessionRepositoryPort,
            tokens: CredentialTokenRepositoryPort,
            passwordHasher: PasswordHasherPort,
            email: EmailDeliveryPort,
            idGenerator: IdGeneratorPort,
            config: ConfigService,
            realtimeRevocation: RealtimeSessionRevocationPort,
          ) =>
            new CredentialLifecycleService({
              users,
              sessions,
              tokens,
              passwordHasher,
              email,
              idGenerator,
              config: {
                passwordResetTtlMs: parseDurationInMilliseconds(
                  config.getOrThrow<string>('PASSWORD_RESET_TOKEN_TTL'),
                ),
                emailVerificationTtlMs: parseDurationInMilliseconds(
                  config.getOrThrow<string>('EMAIL_VERIFICATION_TOKEN_TTL'),
                ),
                rateWindowMs: config.getOrThrow<number>(
                  'CREDENTIAL_TOKEN_RATE_WINDOW_MS',
                ),
                rateMax: config.getOrThrow<number>('CREDENTIAL_TOKEN_RATE_MAX'),
              },
              realtimeRevocation,
            }),
        },
      ],
      exports: [
        JwtAccessGuard,
        RolesGuard,
        TOKEN_SERVICE,
        USER_REPOSITORY,
        AUTH_SESSION_REPOSITORY,
        CredentialLifecycleService,
        REALTIME_SESSION_REVOCATION,
      ],
    };
  }
}
