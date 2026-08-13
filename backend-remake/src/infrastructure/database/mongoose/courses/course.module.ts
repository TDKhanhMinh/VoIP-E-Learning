import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateCourseUseCase } from '../../../../application/courses/create-course.use-case';
import { ListCoursesUseCase } from '../../../../application/courses/list-courses.use-case';
import {
  COURSE_REPOSITORY,
  type CourseRepositoryPort,
} from '../../../../application/courses/ports/course.repository.port';
import { CourseController } from '../../../../interface-adapters/http/courses/course.controller';
import { MongooseCourseRepository } from './mongoose-course.repository';
import { CoursePersistenceModel, CourseSchema } from './course.schema';

@Module({})
export class CourseModule {
  static register(): DynamicModule {
    if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true')
      return { module: CourseModule };
    return {
      module: CourseModule,
      imports: [
        MongooseModule.forFeature([
          { name: CoursePersistenceModel.name, schema: CourseSchema },
        ]),
      ],
      controllers: [CourseController],
      providers: [
        MongooseCourseRepository,
        { provide: COURSE_REPOSITORY, useExisting: MongooseCourseRepository },
        {
          provide: CreateCourseUseCase,
          inject: [COURSE_REPOSITORY],
          useFactory: (courses: CourseRepositoryPort) =>
            new CreateCourseUseCase(courses),
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
