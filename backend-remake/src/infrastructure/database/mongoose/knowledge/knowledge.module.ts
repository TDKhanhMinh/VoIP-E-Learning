import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 knowledge-document persistence; embeddings and recommendations are not implemented here. */
@Module({})
export class KnowledgeModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: KnowledgeModule };
    }

    return {
      module: KnowledgeModule,
      imports: [MongooseModule.forFeature(v1ModelDefinitionsFor(['Document']))],
    };
  }
}
