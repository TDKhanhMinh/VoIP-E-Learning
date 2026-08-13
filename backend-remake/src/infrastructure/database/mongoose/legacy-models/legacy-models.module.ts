import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LEGACY_MODEL_DEFINITIONS } from './legacy-models.schemas';

/** Registers data shapes only; feature repositories/use cases are added per migrated slice. */
@Module({})
export class LegacyModelsModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: LegacyModelsModule };
    }

    return {
      module: LegacyModelsModule,
      imports: [MongooseModule.forFeature([...LEGACY_MODEL_DEFINITIONS])],
      exports: [MongooseModule],
    };
  }
}
