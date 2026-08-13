import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SYSTEM_READINESS_PORT } from '../../../application/health/system-readiness.port';
import { DisabledMongoReadinessAdapter } from './disabled-mongo-readiness.adapter';
import { MongoReadinessAdapter } from './mongo-readiness.adapter';
import { loadEnvironment } from '../../config/load-environment';

loadEnvironment();

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const enabled = process.env.MONGO_ENABLED?.toLowerCase() === 'true';

    if (!enabled) {
      return {
        module: DatabaseModule,
        providers: [
          {
            provide: SYSTEM_READINESS_PORT,
            useClass: DisabledMongoReadinessAdapter,
          },
        ],
        exports: [SYSTEM_READINESS_PORT],
      };
    }

    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.getOrThrow<string>('MONGO_URI'),
            autoIndex: config.getOrThrow<boolean>('MONGO_AUTO_INDEX'),
            maxPoolSize: 10,
            minPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            retryAttempts: 3,
            retryDelay: 1000,
            verboseRetryLog: true,
          }),
        }),
      ],
      providers: [
        {
          provide: SYSTEM_READINESS_PORT,
          useClass: MongoReadinessAdapter,
        },
      ],
      exports: [MongooseModule, SYSTEM_READINESS_PORT],
    };
  }
}
