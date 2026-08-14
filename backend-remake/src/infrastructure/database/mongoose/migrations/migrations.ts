import {
  emptyMigrationReport,
  type MongoMigration,
  type MongoMigrationReport,
} from './migration';
import {
  ObjectId,
  type Collection,
  type Document,
  type IndexDescription,
} from 'mongodb';
import { backfillUserCourseFoundation } from './user-course-backfill';

const createInitialIndexes: MongoMigration = {
  id: '202608130001-create-auth-and-course-indexes',
  description: 'Create unique, TTL and deterministic pagination indexes.',
  kind: 'schema',
  checksumSource: 'phase-00-index-baseline-v1',
  async up({ database, dryRun }) {
    if (dryRun) return emptyMigrationReport();
    await ensureIndexes(database.collection('users'), [
      {
        key: { emailNormalized: 1 },
        name: 'users_email_normalized_unique',
        unique: true,
      },
    ]);
    await ensureIndexes(database.collection('auth_sessions'), [
      { key: { id: 1 }, name: 'auth_sessions_id_unique', unique: true },
      { key: { userId: 1 }, name: 'auth_sessions_user_id' },
      {
        key: { expiresAt: 1 },
        name: 'auth_sessions_expiry_ttl',
        expireAfterSeconds: 0,
      },
    ]);
    await ensureIndexes(database.collection('courses'), [
      {
        key: { codeNormalized: 1 },
        name: 'courses_code_normalized_unique',
        unique: true,
      },
      {
        key: { createdAt: -1, _id: -1 },
        name: 'courses_created_at_pagination',
      },
      {
        key: { ownerId: 1, createdAt: -1, _id: -1 },
        name: 'courses_owner_created_at',
      },
    ]);
    return emptyMigrationReport();
  },
};

const createV1ModelIndexes: MongoMigration = {
  id: '202608130002-create-v1-model-indexes',
  description:
    'Create V1 model indexes preserved by the clean architecture remake.',
  kind: 'schema',
  checksumSource: 'phase-00-v1-model-index-baseline-v1',
  async up({ database, dryRun }) {
    if (dryRun) return emptyMigrationReport();
    await ensureIndexes(database.collection('users'), [
      { key: { email: 1 }, name: 'users_email_unique', unique: true },
    ]);
    await ensureIndexes(database.collection('courses'), [
      { key: { code: 1 }, name: 'courses_code_unique', unique: true },
      {
        key: { title: 1 },
        name: 'courses_title_unique',
        unique: true,
        sparse: true,
      },
    ]);
    await ensureIndexes(database.collection('attendances'), [
      {
        key: { class: 1, student: 1, lesson: 1 },
        name: 'attendance_class_student_lesson_unique',
        unique: true,
      },
    ]);
    await ensureIndexes(database.collection('comments'), [
      {
        key: { post_id: 1, createdAt: -1 },
        name: 'comments_post_created_at',
      },
    ]);
    await ensureIndexes(database.collection('documents'), [
      { key: { title: 1 }, name: 'documents_title' },
      { key: { tags: 1 }, name: 'documents_tags' },
      { key: { level: 1 }, name: 'documents_level' },
    ]);
    await ensureIndexes(database.collection('materials'), [
      {
        key: { class: 1, createdAt: -1 },
        name: 'materials_class_created_at',
      },
    ]);
    await ensureIndexes(database.collection('posts'), [
      { key: { class_id: 1, topic_id: 1 }, name: 'posts_class_topic' },
      { key: { topic_id: 1, createdAt: -1 }, name: 'posts_topic_created_at' },
      { key: { created_by: 1 }, name: 'posts_created_by_legacy' },
    ]);
    await ensureIndexes(database.collection('recordlessonsummaries'), [
      { key: { roomName: 1 }, name: 'recordlessonsummaries_room_name' },
      { key: { classId: 1 }, name: 'recordlessonsummaries_class_id' },
      { key: { teacherId: 1 }, name: 'recordlessonsummaries_teacher_id' },
      { key: { createdBy: 1 }, name: 'recordlessonsummaries_created_by' },
      {
        key: { egressId: 1 },
        name: 'recordlessonsummaries_egress_id_unique',
        unique: true,
      },
      {
        key: { isPublished: 1 },
        name: 'recordlessonsummaries_is_published',
      },
    ]);
    await ensureIndexes(database.collection('rooms'), [
      { key: { roomName: 1 }, name: 'rooms_room_name_unique', unique: true },
      { key: { joinCode: 1 }, name: 'rooms_join_code_unique', unique: true },
    ]);
    await ensureIndexes(database.collection('semesters'), [
      { key: { name: 1 }, name: 'semesters_name_unique', unique: true },
    ]);
    return emptyMigrationReport();
  },
};

const backfillUserCourse: MongoMigration = {
  id: '202608140001-backfill-user-course-foundation',
  description:
    'Backfill canonical User and Course fields without changing ObjectId identifiers.',
  kind: 'data',
  checksumSource: 'phase-01-user-course-backfill-v1',
  blockingWarnings: [
    'userNonObjectId',
    'courseNonObjectId',
    'duplicateEmailNormalized',
    'duplicateCourseCodeNormalized',
    'duplicateCourseTitle',
    'userMissingEmail',
    'userInvalidRole',
    'userMissingBcryptHash',
    'courseMissingCodeOrTitle',
    'courseMalformedOwnerId',
  ],
  up: backfillUserCourseFoundation,
};

const normalizeSingleUserRole: MongoMigration = {
  id: '202608140002-normalize-user-single-role',
  description:
    'Normalize legacy role arrays into the Phase 02 single-role User contract.',
  kind: 'data',
  checksumSource: 'phase-02-single-role-v1',
  blockingWarnings: ['userMissingCanonicalRole'],
  async up(context) {
    const { database, dryRun, batchSize, checkpoint } = context;
    const report: MongoMigrationReport = emptyMigrationReport();
    const users = database.collection('users');
    const resumeAfter = checkpoint?.startsWith('users:')
      ? new ObjectId(checkpoint.slice('users:'.length))
      : undefined;
    const cursor = users
      .find({
        $or: [{ roles: { $exists: true } }, { role: { $exists: false } }],
        ...(resumeAfter ? { _id: { $gt: resumeAfter } } : {}),
      })
      .sort({ _id: 1 });
    for await (const document of cursor) {
      report.scanned += 1;
      const role = canonicalRole(document);
      if (!role) {
        report.warnings.userMissingCanonicalRole =
          (report.warnings.userMissingCanonicalRole ?? 0) + 1;
        report.skipped += 1;
        continue;
      }
      if (!dryRun) {
        const result = await users.updateOne(
          { _id: document._id },
          { $set: { role }, $unset: { roles: '' } },
        );
        report.changed += result.modifiedCount;
      } else report.changed += 1;
      if (report.scanned % batchSize === 0) {
        report.checkpoint = `users:${String(document._id)}`;
        await context.reportCheckpoint({
          ...report,
          warnings: { ...report.warnings },
        });
      }
    }
    report.checkpoint = 'complete';
    return report;
  },
};

const normalizeSemesterCatalog: MongoMigration = {
  id: '202608140003-normalize-semester-catalog',
  description:
    'Backfill canonical Semester date and normalized-name fields without changing ObjectId identifiers.',
  kind: 'data',
  checksumSource: 'phase-03-semester-catalog-v2',
  blockingWarnings: [
    'semesterNonObjectId',
    'semesterMissingName',
    'semesterMissingDates',
    'semesterInvalidDateInvariant',
    'duplicateSemesterNameNormalized',
  ],
  async up(context) {
    const { database, dryRun, batchSize, checkpoint } = context;
    const report: MongoMigrationReport = emptyMigrationReport();
    const semesters = database.collection('semesters');
    report.warnings.semesterNonObjectId = await semesters.countDocuments({
      $expr: { $ne: [{ $type: '$_id' }, 'objectId'] },
    });
    report.warnings.duplicateSemesterNameNormalized =
      await duplicateNormalizedSemesterNames(semesters);
    const parsedCheckpoint = parseSemesterCheckpoint(checkpoint);
    if (parsedCheckpoint.complete) {
      report.checkpoint = 'complete';
      return report;
    }
    const cursor = semesters
      .find({
        $expr: { $eq: [{ $type: '$_id' }, 'objectId'] },
        ...(parsedCheckpoint.resumeAfter
          ? { _id: { $gt: parsedCheckpoint.resumeAfter } }
          : {}),
      })
      .sort({ _id: 1 })
      .batchSize(batchSize);
    let processedInBatch = 0;
    let lastProcessedId: ObjectId | undefined;
    for await (const document of cursor) {
      report.scanned += 1;
      const name =
        typeof document.name === 'string' ? document.name.trim() : undefined;
      const startDate = toDate(document.startDate ?? document.start_date);
      const endDate = toDate(document.endDate ?? document.end_date);
      const midTerm = (document.midTerm ?? document.mid_term) as
        Document | undefined;
      const midTermStartDate = toDate(
        midTerm?.startDate ?? midTerm?.start_date,
      );
      const midTermEndDate = toDate(midTerm?.endDate ?? midTerm?.end_date);
      let valid = true;
      if (!name) {
        report.warnings.semesterMissingName =
          (report.warnings.semesterMissingName ?? 0) + 1;
        valid = false;
      } else if (!startDate || !endDate) {
        report.warnings.semesterMissingDates =
          (report.warnings.semesterMissingDates ?? 0) + 1;
        valid = false;
      } else if (
        startDate >= endDate ||
        (midTermStartDate && !midTermEndDate) ||
        (!midTermStartDate && midTermEndDate) ||
        (midTermStartDate &&
          midTermEndDate &&
          (midTermStartDate >= midTermEndDate ||
            midTermStartDate < startDate ||
            midTermEndDate > endDate))
      ) {
        report.warnings.semesterInvalidDateInvariant =
          (report.warnings.semesterInvalidDateInvariant ?? 0) + 1;
        valid = false;
      }
      if (!valid) {
        report.skipped += 1;
      } else if (!dryRun) {
        const result = await semesters.updateOne(
          { _id: document._id },
          {
            $set: {
              name,
              nameNormalized: name!.toLowerCase(),
              startDate,
              endDate,
              midTermStartDate: midTermStartDate ?? null,
              midTermEndDate: midTermEndDate ?? null,
            },
          },
        );
        report.changed += result.modifiedCount;
      } else report.changed += 1;

      if (!(document._id instanceof ObjectId))
        throw new Error(
          'Semester migration cursor returned a non-ObjectId identifier.',
        );
      lastProcessedId = document._id;
      processedInBatch += 1;
      if (processedInBatch === batchSize) {
        await reportSemesterCheckpoint(context, report, lastProcessedId);
        processedInBatch = 0;
      }
    }
    if (processedInBatch > 0 && lastProcessedId)
      await reportSemesterCheckpoint(context, report, lastProcessedId);
    report.checkpoint = 'complete';
    return report;
  },
};

async function reportSemesterCheckpoint(
  context: Parameters<MongoMigration['up']>[0],
  report: MongoMigrationReport,
  id: ObjectId,
): Promise<void> {
  report.checkpoint = `semesters:${id.toHexString()}`;
  await context.reportCheckpoint({
    ...report,
    warnings: { ...report.warnings },
  });
}

function parseSemesterCheckpoint(checkpoint: string | undefined): {
  complete: boolean;
  resumeAfter?: ObjectId;
} {
  if (!checkpoint) return { complete: false };
  if (checkpoint === 'complete') return { complete: true };
  const match = /^semesters:([a-fA-F0-9]{24})$/u.exec(checkpoint);
  if (!match) throw new Error('Semester migration checkpoint is invalid.');
  return { complete: false, resumeAfter: new ObjectId(match[1]) };
}

/**
 * Make index migrations safe against indexes created by Mongoose's schema
 * bootstrap. MongoDB rejects a second index with the same key pattern but a
 * different name, and it will not upgrade a plain expiry index to a TTL index
 * implicitly. Same-key indexes with equivalent options are retained; an
 * option mismatch is replaced in place when it is an upgrade (for example,
 * adding TTL); attempts to weaken an existing unique/sparse/TTL constraint
 * fail closed.
 */
async function ensureIndexes(
  collection: Collection<Document>,
  desired: readonly IndexDescription[],
): Promise<void> {
  let existing: IndexDescription[];
  try {
    const rawIndexes: unknown = await collection.listIndexes().toArray();
    existing = rawIndexes as IndexDescription[];
  } catch (error: unknown) {
    if (!hasMongoCode(error, 26)) throw error;
    existing = [];
  }
  for (const index of desired) {
    const sameKey = existing.filter((candidate) =>
      sameIndexKey(candidate.key, index.key),
    );
    const compatible = sameKey.find((candidate) =>
      compatibleIndexOptions(candidate, index),
    );
    if (compatible) continue;
    for (const conflicting of sameKey) {
      assertSafeIndexReplacement(conflicting, index);
      if (conflicting.name) await collection.dropIndex(conflicting.name);
    }
    await collection.createIndex(index.key, index);
    existing.push({
      ...index,
      name: index.name ?? JSON.stringify(index.key),
    });
  }
}

function hasMongoCode(error: unknown, code: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

function assertSafeIndexReplacement(
  existing: IndexDescription,
  desired: IndexDescription,
): void {
  if (
    (existing.unique === true && desired.unique !== true) ||
    (existing.sparse === true && desired.sparse !== true) ||
    (existing.expireAfterSeconds !== undefined &&
      desired.expireAfterSeconds === undefined)
  )
    throw new Error(
      `Refusing to weaken existing index ${existing.name ?? '<unnamed>'}.`,
    );
}

function sameIndexKey(
  left: Document | undefined,
  right: Document | undefined,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function compatibleIndexOptions(
  existing: IndexDescription,
  desired: IndexDescription,
): boolean {
  return (
    Boolean(existing.unique) === Boolean(desired.unique) &&
    Boolean(existing.sparse) === Boolean(desired.sparse) &&
    (existing.expireAfterSeconds ?? null) ===
      (desired.expireAfterSeconds ?? null)
  );
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function duplicateNormalizedSemesterNames(
  collection: Collection<Document>,
): Promise<number> {
  const [result] = await collection
    .aggregate<{ count: number }>([
      { $match: { name: { $type: 'string' } } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: '$name' } } },
          count: { $sum: 1 },
        },
      },
      { $match: { _id: { $ne: '' }, count: { $gt: 1 } } },
      { $count: 'count' },
    ])
    .toArray();
  return result?.count ?? 0;
}

function canonicalRole(document: Document): string | undefined {
  const supported = new Set(['admin', 'teacher', 'student', 'guest']);
  if (typeof document.role === 'string' && supported.has(document.role))
    return document.role;
  if (Array.isArray(document.roles)) {
    const roles = document.roles.filter(
      (role): role is string => typeof role === 'string' && supported.has(role),
    );
    if (roles.length === 1) return roles[0];
  }
  return undefined;
}

export const mongoMigrations: readonly MongoMigration[] = [
  // Fresh clones backfill and reconcile before unique indexes are built. Sites
  // with the two Phase 00 index migrations already applied retain their ledger.
  backfillUserCourse,
  normalizeSingleUserRole,
  normalizeSemesterCatalog,
  createInitialIndexes,
  createV1ModelIndexes,
];
