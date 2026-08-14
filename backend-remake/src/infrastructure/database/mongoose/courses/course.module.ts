import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CLOCK_PORT,
  type ClockPort,
} from '../../../../application/ports/clock.port';
import {
  ID_GENERATOR,
  type IdGeneratorPort,
} from '../../../../application/ports/id-generator.port';
import { CreateCourseUseCase } from '../../../../application/courses/create-course.use-case';
import { ListCoursesUseCase } from '../../../../application/courses/list-courses.use-case';
import { CourseCatalogService } from '../../../../application/courses/course-catalog.service';
import {
  COURSE_REPOSITORY,
  type CourseRepositoryPort,
} from '../../../../application/courses/ports/course.repository.port';
import { CourseController } from '../../../../interface-adapters/http/courses/course.controller';
import { MongooseCourseRepository } from './mongoose-course.repository';
import { CourseSchema } from './course.schema';

@Module({})
export class CourseModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true')
      return { module: CourseModule };
    return {
      module: CourseModule,
      imports: [
        MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
      ],
      controllers: [CourseController],
      providers: [
        MongooseCourseRepository,
        {
          provide: CourseCatalogService,
          inject: [COURSE_REPOSITORY, ID_GENERATOR, CLOCK_PORT],
          useFactory: (
            courses: CourseRepositoryPort,
            ids: IdGeneratorPort,
            clock: ClockPort,
          ) => new CourseCatalogService(courses, ids, clock),
        },
        { provide: COURSE_REPOSITORY, useExisting: MongooseCourseRepository },
        {
          provide: CreateCourseUseCase,
          inject: [COURSE_REPOSITORY, ID_GENERATOR, CLOCK_PORT],
          useFactory: (
            courses: CourseRepositoryPort,
            ids: IdGeneratorPort,
            clock: ClockPort,
          ) => new CreateCourseUseCase(courses, ids, clock),
        },
        {
          provide: ListCoursesUseCase,
          inject: [COURSE_REPOSITORY],
          useFactory: (courses: CourseRepositoryPort) =>
            new ListCoursesUseCase(courses),
        },
      ],
    };
  }
}
