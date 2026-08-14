import mongoose, { type Connection } from 'mongoose';
import { backfillUserCourseFoundation } from '../../src/infrastructure/database/mongoose/migrations/user-course-backfill';
import { runMongoMigrations } from '../../src/infrastructure/database/mongoose/migrations/migration-runner';
import { mongoMigrations } from '../../src/infrastructure/database/mongoose/migrations/migrations';
import type { MongoMigrationReport } from '../../src/infrastructure/database/mongoose/migrations/migration';
import {
  LEGACY_COURSE_ID,
  LEGACY_USER_ID,
  legacyCourseFixture,
  legacyUserFixture,
} from '../fixtures/legacy-user-course.fixture';
import { assertTestDatabaseUri } from '../support/mongo-test-database';

describe('User/Course migration foundation (integration)', () => {
  let connection: Connection;

  beforeAll(async () => {
    assertTestDatabaseUri(process.env.MONGO_URI);
    connection = await mongoose
      .createConnection(process.env.MONGO_URI!, {
        serverSelectionTimeoutMS: 5_000,
      })
      .asPromise();
  });
  beforeEach(async () => connection.db?.dropDatabase());
  afterAll(async () => connection.close());

  it('backfills synthetic legacy fixtures without changing ObjectId identities', async () => {
    const database = connection.db!;
    await database.collection('users').insertMany([
      legacyUserFixture(),
      {
        _id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'pilot@example.com',
      },
    ]);
    await database.collection('courses').insertOne(legacyCourseFixture());

    const checkpoints: string[] = [];
    const report = await backfillUserCourseFoundation({
      database,
      dryRun: false,
      batchSize: 1,
      reportCheckpoint: (value) => {
        if (value.checkpoint) checkpoints.push(value.checkpoint);
        return Promise.resolve();
      },
    });
    expect(report).toMatchObject({
      scanned: 2,
      changed: 2,
      skipped: 0,
      checkpoint: 'complete',
      warnings: { userNonObjectId: 1, courseNonObjectId: 0 },
    });
    expect(checkpoints).toEqual([
      `users:${LEGACY_USER_ID.toHexString()}`,
      `courses:${LEGACY_COURSE_ID.toHexString()}`,
    ]);

    await expect(
      database.collection('users').findOne({ _id: LEGACY_USER_ID }),
    ).resolves.toMatchObject({
      _id: LEGACY_USER_ID,
      fullName: 'Legacy Teacher',
      email: 'Teacher@Example.COM',
      emailNormalized: 'teacher@example.com',
      passwordHash: expect.stringMatching(/^\$2b\$/u) as string,
      role: 'teacher',
      accountStatus: 'inactive',
    });
    await expect(
      database.collection('courses').findOne({ _id: LEGACY_COURSE_ID }),
    ).resolves.toMatchObject({
      _id: LEGACY_COURSE_ID,
      code: 'CS-101',
      codeNormalized: 'cs-101',
      name: 'Introduction to Computer Science',
      title: 'Introduction to Computer Science',
      credit: 3,
      description: 'Legacy description',
    });

    const secondReport = await runAgain(database);
    expect(secondReport.changed).toBe(0);
    expect(secondReport.scanned).toBe(2);
  });

  it('blocks writes when preflight finds UUID/string persistence drift', async () => {
    const database = connection.db!;
    const pilotUsers = database.collection<{ _id: string; email: string }>(
      'users',
    );
    await pilotUsers.insertOne({
      _id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'pilot@example.com',
    });
    await expect(
      runMongoMigrations(database, [mongoMigrations[0]], { batchSize: 1 }),
    ).rejects.toThrow('blocking preflight warnings');
    await expect(
      database.collection('schema_migrations').countDocuments(),
    ).resolves.toBe(0);
    await expect(
      pilotUsers.findOne({ email: 'pilot@example.com' }),
    ).resolves.not.toHaveProperty('emailNormalized');
  });
});

async function runAgain(
  database: NonNullable<Connection['db']>,
): Promise<MongoMigrationReport> {
  return backfillUserCourseFoundation({
    database,
    dryRun: false,
    batchSize: 10,
    reportCheckpoint: () => Promise.resolve(),
  });
}
