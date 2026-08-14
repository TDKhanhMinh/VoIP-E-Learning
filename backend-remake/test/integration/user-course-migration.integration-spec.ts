import mongoose, { type Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
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

  it('normalizes legacy Semester dates and preserves the ObjectId', async () => {
    const database = connection.db!;
    const semesterId = new mongoose.Types.ObjectId();
    await database.collection('semesters').insertOne({
      _id: semesterId,
      name: ' Fall 2026 ',
      start_date: '2026-09-01T00:00:00.000Z',
      end_date: '2026-12-20T00:00:00.000Z',
      mid_term: {
        start_date: '2026-10-15T00:00:00.000Z',
        end_date: '2026-10-25T00:00:00.000Z',
      },
    });

    const report = await mongoMigrations[2].up({
      database,
      dryRun: false,
      batchSize: 100,
      reportCheckpoint: () => Promise.resolve(),
    });
    expect(report).toMatchObject({
      scanned: 1,
      changed: 1,
      skipped: 0,
      warnings: {
        semesterNonObjectId: 0,
        duplicateSemesterNameNormalized: 0,
      },
      checkpoint: 'complete',
    });
    await expect(
      database.collection('semesters').findOne({ _id: semesterId }),
    ).resolves.toMatchObject({
      _id: semesterId,
      name: 'Fall 2026',
      nameNormalized: 'fall 2026',
      startDate: new Date('2026-09-01T00:00:00.000Z'),
      endDate: new Date('2026-12-20T00:00:00.000Z'),
      midTermStartDate: new Date('2026-10-15T00:00:00.000Z'),
      midTermEndDate: new Date('2026-10-25T00:00:00.000Z'),
    });
  });

  it('checkpoints Semester batches, resumes after ObjectId, and reconciles idempotently', async () => {
    const database = connection.db!;
    const semesterIds = [
      new ObjectId('000000000000000000000011'),
      new ObjectId('000000000000000000000012'),
      new ObjectId('000000000000000000000013'),
    ];
    await database
      .collection('semesters')
      .insertMany([
        legacySemester(semesterIds[0], ' Fall 2026 '),
        legacySemester(semesterIds[1], '   '),
        legacySemester(semesterIds[2], ' Spring 2027 '),
      ]);

    let crashCheckpoint: string | undefined;
    await expect(
      mongoMigrations[2].up({
        database,
        dryRun: false,
        batchSize: 1,
        reportCheckpoint: (report) => {
          crashCheckpoint = report.checkpoint;
          return Promise.reject(new Error('simulated checkpoint crash'));
        },
      }),
    ).rejects.toThrow('simulated checkpoint crash');
    expect(crashCheckpoint).toBe(`semesters:${semesterIds[0].toHexString()}`);
    await expect(
      database.collection('semesters').findOne({ _id: semesterIds[0] }),
    ).resolves.toMatchObject({
      name: 'Fall 2026',
      nameNormalized: 'fall 2026',
    });

    const resumedCheckpoints: MongoMigrationReport[] = [];
    const resumed = await mongoMigrations[2].up({
      database,
      dryRun: false,
      batchSize: 1,
      checkpoint: crashCheckpoint,
      reportCheckpoint: (report) => {
        resumedCheckpoints.push({
          ...report,
          warnings: { ...report.warnings },
        });
        return Promise.resolve();
      },
    });
    expect(resumed).toMatchObject({
      scanned: 2,
      changed: 1,
      skipped: 1,
      checkpoint: 'complete',
      warnings: { semesterMissingName: 1 },
    });
    expect(resumedCheckpoints).toEqual([
      expect.objectContaining({
        scanned: 1,
        changed: 0,
        skipped: 1,
        checkpoint: `semesters:${semesterIds[1].toHexString()}`,
      }),
      expect.objectContaining({
        scanned: 2,
        changed: 1,
        skipped: 1,
        checkpoint: `semesters:${semesterIds[2].toHexString()}`,
      }),
    ]);
    await expect(
      database.collection('semesters').findOne({ _id: semesterIds[2] }),
    ).resolves.toMatchObject({
      name: 'Spring 2027',
      nameNormalized: 'spring 2027',
    });

    const reconciled = await mongoMigrations[2].up({
      database,
      dryRun: false,
      batchSize: 2,
      reportCheckpoint: () => Promise.resolve(),
    });
    expect(reconciled).toMatchObject({
      scanned: 3,
      changed: 0,
      skipped: 1,
      checkpoint: 'complete',
    });
  });

  it('rejects an invalid Semester checkpoint before changing records', async () => {
    const database = connection.db!;
    const semesterId = new ObjectId('000000000000000000000021');
    await database
      .collection('semesters')
      .insertOne(legacySemester(semesterId, ' Fall 2026 '));

    await expect(
      mongoMigrations[2].up({
        database,
        dryRun: false,
        batchSize: 1,
        checkpoint: 'semesters:not-an-object-id',
        reportCheckpoint: () => Promise.resolve(),
      }),
    ).rejects.toThrow('Semester migration checkpoint is invalid');
    await expect(
      database.collection('semesters').findOne({ _id: semesterId }),
    ).resolves.not.toHaveProperty('nameNormalized');
  });
});

function legacySemester(_id: ObjectId, name: string) {
  return {
    _id,
    name,
    start_date: '2026-09-01T00:00:00.000Z',
    end_date: '2026-12-20T00:00:00.000Z',
  };
}

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
