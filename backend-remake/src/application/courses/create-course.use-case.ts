import { Course } from '../../domain/courses/course.entity';
import type { ClockPort } from '../ports/clock.port';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import { ApplicationError } from '../errors/application.error';
import type { CurrentActor } from '../auth/ports/token-service.port';
import type { CourseRepositoryPort } from './ports/course.repository.port';

export interface CreateCourseCommand {
  code: string;
  name: string;
}

export class CreateCourseUseCase {
  constructor(
    private readonly courses: CourseRepositoryPort,
    private readonly ids: IdGeneratorPort,
    private readonly clock: ClockPort,
  ) {}
  async execute(
    actor: CurrentActor,
    command: CreateCourseCommand,
  ): Promise<Course> {
    const codeNormalized = command.code.trim().toLowerCase();
    if (await this.courses.findByCodeNormalized(codeNormalized)) {
      throw new ApplicationError('Course code already exists', {
        code: 'COURSE_CODE_ALREADY_EXISTS',
        kind: 'conflict',
      });
    }
    const now = this.clock.now();
    const course = Course.create({
      id: this.ids.generate(),
      code: command.code,
      codeNormalized,
      name: command.name,
      ownerId: actor.userId,
      createdAt: now,
      updatedAt: now,
    });
    await this.courses.save(course);
    return course;
  }
}
