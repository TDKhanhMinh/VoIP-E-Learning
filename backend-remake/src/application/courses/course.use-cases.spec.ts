import { Course } from '../../domain/courses/course.entity';
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
    userId: '507f1f77bcf86cd799439011',
    sessionId: 'session-1',
    role: 'teacher' as const,
  };

  beforeEach(() => jest.clearAllMocks());

  const ids = { generate: jest.fn(() => '507f191e810c19729de860ea') };
  const clock = { now: jest.fn(() => new Date('2026-08-14T00:00:00.000Z')) };

  it('creates normalized courses and rejects duplicate codes', async () => {
    courses.findByCodeNormalized.mockResolvedValue(null);
    const useCase = new CreateCourseUseCase(courses, ids, clock);
    const course = await useCase.execute(actor, {
      code: ' cs-101 ',
      name: ' Introduction to CS ',
    });
    expect(course).toMatchObject({
      code: 'CS-101',
      codeNormalized: 'cs-101',
      name: 'Introduction to CS',
      ownerId: actor.userId,
      id: '507f191e810c19729de860ea',
      createdAt: new Date('2026-08-14T00:00:00.000Z'),
    });
    expect(courses.save.mock.calls).toContainEqual([course]);
    courses.findByCodeNormalized.mockResolvedValue(course);
    await expect(
      useCase.execute(actor, { code: 'CS-101', name: 'Duplicate' }),
    ).rejects.toMatchObject({
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
