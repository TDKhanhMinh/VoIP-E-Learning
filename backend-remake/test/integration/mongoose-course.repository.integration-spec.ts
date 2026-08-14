import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { type Model, Types } from 'mongoose';
import { AppModule } from '../../src/app.module';
import {
  COURSE_REPOSITORY,
  type CourseRepositoryPort,
} from '../../src/application/courses/ports/course.repository.port';
import { Course } from '../../src/domain/courses/course.entity';
import { CoursePersistenceModel } from '../../src/infrastructure/database/mongoose/courses/course.schema';
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
    const connection = testDatabaseConnection(moduleFixture);
    await moduleFixture
      .get<Model<CoursePersistenceModel>>(getModelToken('Course'))
      .createIndexes();
    await clearTestDatabase(connection);
  });

  afterEach(async () =>
    clearTestDatabase(testDatabaseConnection(moduleFixture)),
  );
  afterAll(async () => moduleFixture.close());

  it('persists a domain course and returns deterministically paginated results', async () => {
    const first = createCourse(
      '507f191e810c19729de860e1',
      'CS-101',
      new Date('2026-01-01T00:00:00.000Z'),
    );
    const second = createCourse(
      '507f191e810c19729de860e2',
      'CS-102',
      new Date('2026-01-02T00:00:00.000Z'),
    );
    await courses.save(first);
    await courses.save(second);
    const page = await courses.list(createPageRequest(1, 1));
    expect(page.items.map((course) => course.id)).toEqual([
      '507f191e810c19729de860e2',
    ]);
    expect(page.pagination).toMatchObject({
      totalItems: 2,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('maps MongoDB duplicate keys to the application conflict contract', async () => {
    await courses.save(
      createCourse('507f191e810c19729de860e1', 'CS-101', new Date()),
    );
    await expect(
      courses.save(
        createCourse('507f191e810c19729de860e2', 'cs-101', new Date()),
      ),
    ).rejects.toMatchObject({
      code: 'COURSE_CODE_ALREADY_EXISTS',
      kind: 'conflict',
    });
  });

  it('reads a reconciled legacy ObjectId course with the golden V1 fields', async () => {
    const connection = testDatabaseConnection(moduleFixture);
    const courseId = new Types.ObjectId('507f191e810c19729de860f1');
    const now = new Date('2026-08-14T00:00:00.000Z');
    await connection.db?.collection('courses').insertOne({
      _id: courseId,
      code: 'CS-LEGACY',
      codeNormalized: 'cs-legacy',
      name: 'Legacy Catalog Course',
      title: 'Legacy Catalog Course',
      credit: 4,
      description: 'Preserved legacy description',
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      courses.findById(courseId.toHexString()),
    ).resolves.toMatchObject({
      id: courseId.toHexString(),
      code: 'CS-LEGACY',
      title: 'Legacy Catalog Course',
      credit: 4,
      description: 'Preserved legacy description',
    });
  });

  it('applies an exact normalized code filter before pagination', async () => {
    await courses.save(
      createCourse('507f191e810c19729de860e1', 'CS-101', new Date()),
    );
    await courses.save(
      createCourse('507f191e810c19729de860e2', 'CS-102', new Date()),
    );

    const page = await courses.list(createPageRequest(1, 1), {
      codeNormalized: 'cs-102',
    });

    expect(page.items.map((course) => course.code)).toEqual(['CS-102']);
    expect(page.pagination).toMatchObject({
      page: 1,
      limit: 1,
      totalItems: 1,
      totalPages: 1,
    });
  });

  it('excludes archived courses from by-ID and list reads', async () => {
    const course = createCourse(
      '507f191e810c19729de860e1',
      'CS-101',
      new Date(),
    );
    await courses.save(course);
    await courses.update(course.id, { archivedAt: new Date() });

    await expect(courses.findById(course.id)).resolves.toBeNull();
    await expect(courses.list(createPageRequest(1, 20))).resolves.toMatchObject(
      {
        items: [],
        pagination: { totalItems: 0 },
      },
    );
  });

  it('counts both legacy and canonical Class reference shapes', async () => {
    const connection = testDatabaseConnection(moduleFixture);
    const courseId = new Types.ObjectId('507f191e810c19729de860e1');
    const classes = connection.db!.collection('classes');

    await classes.insertOne({ course: courseId });
    await expect(courses.countReferences(courseId.toHexString())).resolves.toBe(
      1,
    );
    await classes.deleteMany({});
    await classes.insertOne({ courseId });
    await expect(courses.countReferences(courseId.toHexString())).resolves.toBe(
      1,
    );
  });
});

function createCourse(id: string, code: string, createdAt: Date): Course {
  return Course.create({
    id,
    code,
    codeNormalized: code.toLowerCase(),
    name: `Course ${code}`,
    title: `Course ${code}`,
    credit: 3,
    description: `Description ${code}`,
    ownerId: '507f1f77bcf86cd799439011',
    createdAt,
    updatedAt: createdAt,
  });
}
