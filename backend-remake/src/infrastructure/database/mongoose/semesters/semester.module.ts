import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SemesterCatalogService } from '../../../../application/semesters/semester-catalog.service';
import {
  SEMESTER_REPOSITORY,
  type SemesterRepositoryPort,
} from '../../../../application/semesters/ports/semester.repository.port';
import {
  ID_GENERATOR,
  type IdGeneratorPort,
} from '../../../../application/ports/id-generator.port';
import {
  CLOCK_PORT,
  type ClockPort,
} from '../../../../application/ports/clock.port';
import { SemesterController } from '../../../../interface-adapters/http/semesters/semester.controller';
import { SemesterPersistenceModel, SemesterSchema } from './semester.schema';
import { MongooseSemesterRepository } from './mongoose-semester.repository';

@Module({})
export class SemesterModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true')
      return { module: SemesterModule };
    return {
      module: SemesterModule,
      imports: [
        MongooseModule.forFeature([
          { name: SemesterPersistenceModel.name, schema: SemesterSchema },
        ]),
      ],
      controllers: [SemesterController],
      providers: [
        MongooseSemesterRepository,
        {
          provide: SEMESTER_REPOSITORY,
          useExisting: MongooseSemesterRepository,
        },
        {
          provide: SemesterCatalogService,
          inject: [SEMESTER_REPOSITORY, ID_GENERATOR, CLOCK_PORT],
          useFactory: (
            semesters: SemesterRepositoryPort,
            ids: IdGeneratorPort,
            clock: ClockPort,
          ) => new SemesterCatalogService(semesters, ids, clock),
        },
      ],
    };
  }
}
