import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 chat, room and recording persistence; no realtime or recording logic is exposed yet. */
@Module({})
export class CollaborationModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: CollaborationModule };
    }

    return {
      module: CollaborationModule,
      imports: [
        MongooseModule.forFeature(
          v1ModelDefinitionsFor([
            'Conversation',
            'Message',
            'RecordLessonSummary',
            'Room',
          ]),
        ),
      ],
    };
  }
}
