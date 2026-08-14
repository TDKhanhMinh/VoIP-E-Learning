import { CourseCatalogService } from './course-catalog.service';
import type {
  CreateCourseInput,
  UpdateCourseInput,
} from './course-catalog.service';
import type { CourseRepositoryPort } from './ports/course.repository.port';
import { Course } from '../../domain/courses/course.entity';
import { createPageRequest } from '../pagination/page-request';
import { PaginatedResult } from '../pagination/paginated-result';

describe('CourseCatalogService', () => {
  const actor = {
    userId: '507f1f77bcf86cd799439011',
    sessionId: 'session-1',
    role: 'admin' as const,
  };
  let courses: jest.Mocked<CourseRepositoryPort>;
  let service: CourseCatalogService;
  const ids = { generate: jest.fn(() => '507f1f77bcf86cd799439012') };
  const clock = { now: jest.fn(() => new Date('2026-08-14T00:00:00.000Z')) };

  beforeEach(() => {
    courses = {
      findById: jest.fn(),
      findByCodeNormalized: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      countReferences: jest.fn(),
    };
    service = new CourseCatalogService(courses, ids, clock);
  });

  it('creates a global catalog course with V1-compatible fields', async () => {
    courses.findByCodeNormalized.mockResolvedValue(null);
    const course = await service.create(actor, {
      code: ' cs-301 ',
      title: ' Distributed Systems ',
      credit: 3,
      description: 'Catalog course',
    });
    expect(course).toMatchObject({
      code: 'CS-301',
      name: 'Distributed Systems',
      title: 'Distributed Systems',
      credit: 3,
      ownerId: undefined,
    });
    expect(courses.save.mock.calls).toContainEqual([course]);
  });

  it('normalizes the HTTP code filter before calling the repository', async () => {
    const pageRequest = createPageRequest(2, 5);
    courses.list.mockResolvedValue(
      PaginatedResult.create({ items: [], totalItems: 0, pageRequest }),
    );

    await service.list(pageRequest, { code: ' CS-301 ' });

    expect(courses.list.mock.calls).toEqual([
      [pageRequest, { codeNormalized: 'cs-301' }],
    ]);
  });

  it.each([
    ['title', { code: 'CS-301', credit: 3, description: 'Catalog course' }],
    [
      'credit',
      {
        code: 'CS-301',
        title: 'Distributed Systems',
        description: 'Catalog course',
      },
    ],
    [
      'description',
      { code: 'CS-301', title: 'Distributed Systems', credit: 3 },
    ],
  ])('rejects create input missing required %s data', async (_field, input) => {
    await expect(
      service.create(actor, input as unknown as CreateCourseInput),
    ).rejects.toMatchObject({ kind: 'validation' });
    expect(courses.save.mock.calls).toHaveLength(0);
  });

  it('rejects a duplicate Course code on create', async () => {
    courses.findByCodeNormalized.mockResolvedValue(createCourse());

    await expect(
      service.create(actor, {
        code: 'cs-301',
        title: 'Another title',
        credit: 4,
        description: 'Another course',
      }),
    ).rejects.toMatchObject({ code: 'COURSE_CODE_ALREADY_EXISTS' });
    expect(courses.save.mock.calls).toHaveLength(0);
  });

  it('rejects a duplicate Course code on update', async () => {
    const existing = createCourse();
    courses.findById.mockResolvedValue(existing);
    courses.findByCodeNormalized.mockResolvedValue(
      Course.create({
        ...courseProperties(),
        id: '507f1f77bcf86cd799439099',
        code: 'CS-302',
        codeNormalized: 'cs-302',
      }),
    );

    await expect(
      service.update(existing.id, {
        code: 'cs-302',
      } satisfies UpdateCourseInput),
    ).rejects.toMatchObject({ code: 'COURSE_CODE_ALREADY_EXISTS' });
    expect(courses.update.mock.calls).toHaveLength(0);
  });

  it('refuses archive when a Class references the course', async () => {
    const course = createCourse();
    courses.findById.mockResolvedValue(course);
    courses.countReferences.mockResolvedValue(1);
    await expect(service.archive(course.id)).rejects.toMatchObject({
      code: 'COURSE_HAS_DEPENDENCIES',
    });
    expect(courses.update.mock.calls).toHaveLength(0);
  });

  function createCourse(): Course {
    return Course.create(courseProperties());
  }

  function courseProperties() {
    return {
      id: '507f1f77bcf86cd799439012',
      code: 'CS-301',
      codeNormalized: 'cs-301',
      name: 'Distributed Systems',
      title: 'Distributed Systems',
      credit: 3,
      description: 'Catalog course',
      createdAt: new Date('2026-08-01'),
      updatedAt: new Date('2026-08-01'),
    };
  }
});
