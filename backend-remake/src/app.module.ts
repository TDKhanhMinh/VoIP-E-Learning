import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { GetSystemReadinessUseCase } from './application/health/get-system-readiness.use-case';
import {
  SYSTEM_READINESS_PORT,
  type SystemReadinessPort,
} from './application/health/system-readiness.port';
import { CLOCK_PORT } from './application/ports/clock.port';
import type { ClockPort } from './application/ports/clock.port';
import { GetSystemHealthUseCase } from './application/use-cases/get-system-health.use-case';
import { environmentValidationSchema } from './infrastructure/config/environment.schema';
import { loadEnvironment } from './infrastructure/config/load-environment';
import { DatabaseModule } from './infrastructure/database/mongoose/database.module';
import { createLoggerConfig } from './infrastructure/logging/logger.config';
import { SystemClockAdapter } from './infrastructure/time/system-clock.adapter';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CourseModule } from './infrastructure/database/mongoose/courses/course.module';
import { LegacyModelsModule } from './infrastructure/database/mongoose/legacy-models/legacy-models.module';
import { GlobalExceptionFilter } from './interface-adapters/http/filters/global-exception.filter';
import { HealthController } from './interface-adapters/http/health.controller';
import { ResponseEnvelopeInterceptor } from './interface-adapters/http/interceptors/response-envelope.interceptor';

loadEnvironment();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      validationSchema: environmentValidationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createLoggerConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow<number>('RATE_LIMIT_TTL_MS'),
          limit: config.getOrThrow<number>('RATE_LIMIT_MAX'),
        },
      ],
    }),
    DatabaseModule.register(),
    AuthModule.register(),
    CourseModule.register(),
    LegacyModelsModule.register(),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: CLOCK_PORT,
      useClass: SystemClockAdapter,
    },
    {
      provide: GetSystemHealthUseCase,
      inject: [CLOCK_PORT],
      useFactory: (clock: ClockPort) => new GetSystemHealthUseCase(clock),
    },
    {
      provide: GetSystemReadinessUseCase,
      inject: [SYSTEM_READINESS_PORT],
      useFactory: (readiness: SystemReadinessPort) =>
        new GetSystemReadinessUseCase(readiness),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
