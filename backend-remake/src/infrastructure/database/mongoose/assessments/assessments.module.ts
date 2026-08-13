import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 online-testing persistence; no use cases are exposed yet. */
@Module({})
export class AssessmentsModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: AssessmentsModule };
    }

    return {
      module: AssessmentsModule,
      imports: [
        MongooseModule.forFeature(
          v1ModelDefinitionsFor([
            'OnlineTest',
            'TestAttempt',
            'TestQuestion',
            'TestSession',
          ]),
        ),
      ],
    };
  }
}
