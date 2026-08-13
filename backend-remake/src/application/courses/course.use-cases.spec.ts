import { Course } from '../../domain/courses/course.entity';
import { ApplicationError } from '../errors/application.error';
import { createPageRequest } from '../pagination/page-request';
import { PaginatedResult } from '../pagination/paginated-result';
import { CreateCourseUseCase } from './create-course.use-case';
import { ListCoursesUseCase } from './list-courses.use-case';
import type { CourseRepositoryPort } from './ports/course.repository.port';

describe('Course use cases', () => {
  const courses: jest.Mocked<CourseRepositoryPort> = {
    findByCodeNormalized: jest.fn(),
    save: jest.fn(),
    list: jest.fn(),
  };
  const actor = {
    userId: 'teacher-1',
    sessionId: 'session-1',
    roles: ['teacher'] as const,
  };

  beforeEach(() => jest.resetAllMocks());

  it('creates normalized courses and rejects duplicate codes', async () => {
    courses.findByCodeNormalized.mockResolvedValue(null);
    const useCase = new CreateCourseUseCase(courses);
    const course = await useCase.execute(actor, {
      code: ' cs-101 ',
      name: ' Introduction to CS ',
    });
    expect(course).toMatchObject({
      code: 'CS-101',
      codeNormalized: 'cs-101',
      name: 'Introduction to CS',
      ownerId: actor.userId,
    });
    expect(courses.save.mock.calls).toContainEqual([course]);
    courses.findByCodeNormalized.mockResolvedValue(course);
    await expect(
      useCase.execute(actor, { code: 'CS-101', name: 'Duplicate' }),
    ).rejects.toMatchObject<ApplicationError>({
      code: 'COURSE_CODE_ALREADY_EXISTS',
    });
  });

  it('delegates list pagination to the repository', async () => {
    const course = Course.create({
      id: 'course-1',
      code: 'CS-101',
      codeNormalized: 'cs-101',
      name: 'Intro',
      ownerId: actor.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const pageRequest = createPageRequest(1, 20);
    const result = PaginatedResult.create({
      items: [course],
      totalItems: 1,
      pageRequest,
    });
    courses.list.mockResolvedValue(result);
    await expect(
      new ListCoursesUseCase(courses).execute(pageRequest),
    ).resolves.toBe(result);
  });
});
