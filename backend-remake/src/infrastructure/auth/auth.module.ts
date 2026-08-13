import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../application/auth/auth.service';
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
import { MongooseAuthSessionRepository } from '../database/mongoose/auth/mongoose-auth-session.repository';
import { MongooseUserRepository } from '../database/mongoose/auth/mongoose-user.repository';
import {
  AuthSessionPersistenceModel,
  AuthSessionSchema,
} from '../database/mongoose/auth/auth-session.schema';
import {
  UserPersistenceModel,
  UserSchema,
} from '../database/mongoose/auth/user.schema';
import { AuthController } from '../../interface-adapters/http/auth/auth.controller';
import { JwtAccessGuard } from '../../interface-adapters/http/auth/guards/jwt-access.guard';
import { RolesGuard } from '../../interface-adapters/http/auth/guards/roles.guard';
import { BcryptPasswordHasherAdapter } from './bcrypt-password-hasher.adapter';
import { JwtTokenServiceAdapter } from './jwt-token-service.adapter';

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
          { name: UserPersistenceModel.name, schema: UserSchema },
          { name: AuthSessionPersistenceModel.name, schema: AuthSessionSchema },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        BcryptPasswordHasherAdapter,
        JwtTokenServiceAdapter,
        MongooseUserRepository,
        MongooseAuthSessionRepository,
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
          ],
          useFactory: (
            users: UserRepositoryPort,
            sessions: AuthSessionRepositoryPort,
            passwordHasher: PasswordHasherPort,
            tokenService: TokenServicePort,
          ) =>
            new AuthService({ users, sessions, passwordHasher, tokenService }),
        },
      ],
      exports: [JwtAccessGuard, RolesGuard, TOKEN_SERVICE],
    };
  }
}
