import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 class learning content and delivery persistence; no use cases are exposed yet. */
@Module({})
export class LearningModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: LearningModule };
    }

    return {
      module: LearningModule,
      imports: [
        MongooseModule.forFeature(
          v1ModelDefinitionsFor([
            'Announcement',
            'Assignment',
            'Material',
            'Submission',
          ]),
        ),
      ],
    };
  }
}
