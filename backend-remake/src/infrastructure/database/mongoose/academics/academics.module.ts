import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { v1ModelDefinitionsFor } from '../model-contracts/v1-model-definitions.schemas';

/** V1 academic roster and timetable persistence; no use cases are exposed yet. */
@Module({})
export class AcademicsModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true') {
      return { module: AcademicsModule };
    }

    return {
      module: AcademicsModule,
      imports: [
        MongooseModule.forFeature(
          v1ModelDefinitionsFor([
            'Attendance',
            'Class',
            'ClassStudent',
            'Semester',
            'TeachingSchedule',
          ]),
        ),
      ],
    };
  }
}
