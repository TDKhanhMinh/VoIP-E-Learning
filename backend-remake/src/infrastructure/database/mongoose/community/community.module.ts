import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 discussion persistence; no use cases are exposed yet. */
@Module({})
export class CommunityModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: CommunityModule };
    }

    return {
      module: CommunityModule,
      imports: [
        MongooseModule.forFeature(
          v1ModelDefinitionsFor(['Comment', 'Post', 'Topic']),
        ),
      ],
    };
  }
}
