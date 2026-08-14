import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  COURSE_REPOSITORY,
  type CourseRepositoryPort,
} from '../../src/application/courses/ports/course.repository.port';
import { Course } from '../../src/domain/courses/course.entity';
import { createPageRequest } from '../../src/application/pagination/page-request';
import {
  clearTestDatabase,
  testDatabaseConnection,
} from '../support/mongo-test-database';

describe('MongooseCourseRepository (integration)', () => {
  let moduleFixture: TestingModule;
  let courses: CourseRepositoryPort;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    courses = moduleFixture.get<CourseRepositoryPort>(COURSE_REPOSITORY);
    await clearTestDatabase(testDatabaseConnection(moduleFixture));
  });

  afterEach(async () =>
    clearTestDatabase(testDatabaseConnection(moduleFixture)),
  );
  afterAll(async () => moduleFixture.close());

  it('persists a domain course and returns deterministically paginated results', async () => {
    const first = createCourse(
      'course-1',
      'CS-101',
      new Date('2026-01-01T00:00:00.000Z'),
    );
    const second = createCourse(
      'course-2',
      'CS-102',
      new Date('2026-01-02T00:00:00.000Z'),
    );
    await courses.save(first);
    await courses.save(second);
    const page = await courses.list(createPageRequest(1, 1));
    expect(page.items.map((course) => course.id)).toEqual(['course-2']);
    expect(page.pagination).toMatchObject({
      totalItems: 2,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('maps MongoDB duplicate keys to the application conflict contract', async () => {
    await courses.save(createCourse('course-1', 'CS-101', new Date()));
    await expect(
      courses.save(createCourse('course-2', 'cs-101', new Date())),
    ).rejects.toMatchObject({
      code: 'COURSE_CODE_ALREADY_EXISTS',
      kind: 'conflict',
    });
  });
});

function createCourse(id: string, code: string, createdAt: Date): Course {
  return Course.create({
    id,
    code,
    codeNormalized: code.toLowerCase(),
    name: `Course ${code}`,
    ownerId: 'teacher-1',
    createdAt,
    updatedAt: createdAt,
  });
}
