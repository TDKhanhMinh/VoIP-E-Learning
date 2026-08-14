import { randomUUID } from 'node:crypto';
import { Course } from '../../domain/courses/course.entity';
import { ApplicationError } from '../errors/application.error';
import type { CurrentActor } from '../auth/ports/token-service.port';
import type { CourseRepositoryPort } from './ports/course.repository.port';

export interface CreateCourseCommand {
  code: string;
  name: string;
}

export class CreateCourseUseCase {
  constructor(private readonly courses: CourseRepositoryPort) {}
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
    const now = new Date();
    const course = Course.create({
      id: randomUUID(),
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
