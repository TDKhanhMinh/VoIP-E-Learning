import {
  ObjectId,
  type Collection,
  type Document,
  type Filter,
  type UpdateFilter,
} from 'mongodb';
import type { MongoMigrationContext, MongoMigrationReport } from './migration';

const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/u;
const ROLES = new Set(['admin', 'teacher', 'student']);
type CollectionName = 'users' | 'courses';

export async function backfillUserCourseFoundation(
  context: MongoMigrationContext,
): Promise<MongoMigrationReport> {
  const report: MongoMigrationReport = {
    scanned: 0,
    changed: 0,
    skipped: 0,
    warnings: {},
    checkpoint: context.checkpoint,
  };

  await addProfileWarnings(context, report);
  const start = parseCheckpoint(context.checkpoint);
  if (start.collection !== 'courses')
    await backfillCollection(
      context,
      'users',
      start.collection === 'users' ? start.id : undefined,
      report,
      buildUserUpdate,
    );
  await backfillCollection(
    context,
    'courses',
    start.collection === 'courses' ? start.id : undefined,
    report,
    buildCourseUpdate,
  );
  report.checkpoint = 'complete';
  return report;
}

async function backfillCollection(
  context: MongoMigrationContext,
  collectionName: CollectionName,
  resumeAfter: ObjectId | undefined,
  report: MongoMigrationReport,
  buildUpdate: (
    document: Document,
    report: MongoMigrationReport,
  ) => UpdateFilter<Document> | null,
): Promise<void> {
  const collection = context.database.collection(collectionName);
  let checkpoint = resumeAfter;
  for (;;) {
    const filter: Filter<Document> = {
      $expr: { $eq: [{ $type: '$_id' }, 'objectId'] },
      ...(checkpoint ? { _id: { $gt: checkpoint } } : {}),
    };
    const documents = await collection
      .find(filter)
      .sort({ _id: 1 })
      .limit(context.batchSize)
      .toArray();
    if (documents.length === 0) break;

    for (const document of documents) {
      report.scanned += 1;
      const update = buildUpdate(document, report);
      if (!update) {
        report.skipped += 1;
        continue;
      }
      if (context.dryRun) report.changed += 1;
      else {
        const result = await collection.updateOne(
          { _id: document._id },
          update,
        );
        report.changed += result.modifiedCount;
      }
    }
    const lastId = documents.at(-1)?._id;
    if (!(lastId instanceof ObjectId))
      throw new Error('Migration batch ended with a non-ObjectId identifier.');
    checkpoint = lastId;
    report.checkpoint = `${collectionName}:${checkpoint.toHexString()}`;
    await context.reportCheckpoint({
      ...report,
      warnings: { ...report.warnings },
    });
  }
}

function buildUserUpdate(
  document: Document,
  report: MongoMigrationReport,
): UpdateFilter<Document> | null {
  const email = typeof document.email === 'string' ? document.email.trim() : '';
  if (!email) {
    incrementWarning(report, 'userMissingEmail');
    return null;
  }
  const role = canonicalRole(document);
  if (!role) incrementWarning(report, 'userInvalidRole');
  const passwordHash = validPasswordHash(document.passwordHash)
    ? document.passwordHash
    : validPasswordHash(document.password)
      ? document.password
      : undefined;
  if (!passwordHash) incrementWarning(report, 'userMissingBcryptHash');

  const set: Document = {
    email,
    emailNormalized: email.toLowerCase(),
    accountStatus: document.available === false ? 'inactive' : 'active',
  };
  const fullName =
    typeof document.fullName === 'string'
      ? document.fullName.trim()
      : typeof document.full_name === 'string'
        ? document.full_name.trim()
        : undefined;
  if (fullName) set.fullName = fullName;
  if (role) set.role = role;
  if (passwordHash) set.passwordHash = passwordHash;
  return { $set: set };
}

function buildCourseUpdate(
  document: Document,
  report: MongoMigrationReport,
): UpdateFilter<Document> | null {
  const code = typeof document.code === 'string' ? document.code.trim() : '';
  const title =
    typeof document.title === 'string' ? document.title.trim() : undefined;
  const name =
    typeof document.name === 'string' && document.name.trim()
      ? document.name.trim()
      : title;
  if (!code || !name) {
    incrementWarning(report, 'courseMissingCodeOrTitle');
    return null;
  }
  const set: Document = {
    code: code.toUpperCase(),
    codeNormalized: code.toLowerCase(),
    name,
  };
  if (title) set.title = title;
  if (typeof document.ownerId === 'string') {
    if (ObjectId.isValid(document.ownerId))
      set.ownerId = new ObjectId(document.ownerId);
    else incrementWarning(report, 'courseMalformedOwnerId');
  }
  return { $set: set };
}

async function addProfileWarnings(
  context: MongoMigrationContext,
  report: MongoMigrationReport,
): Promise<void> {
  const users = context.database.collection('users');
  const courses = context.database.collection('courses');
  report.warnings.userNonObjectId = await users.countDocuments({
    $expr: { $ne: [{ $type: '$_id' }, 'objectId'] },
  });
  report.warnings.courseNonObjectId = await courses.countDocuments({
    $expr: { $ne: [{ $type: '$_id' }, 'objectId'] },
  });
  report.warnings.duplicateEmailNormalized = await duplicateGroupCount(
    users,
    'email',
  );
  report.warnings.duplicateCourseCodeNormalized = await duplicateGroupCount(
    courses,
    'code',
  );
  report.warnings.duplicateCourseTitle = await duplicateGroupCount(
    courses,
    'title',
  );
}

async function duplicateGroupCount(
  collection: Collection<Document>,
  fieldName: string,
): Promise<number> {
  const field = `$${fieldName}`;
  const valueExpression = { $toLower: { $trim: { input: field } } };
  const [result] = await collection
    .aggregate<{ count: number }>([
      { $match: { [fieldName]: { $type: 'string' } } },
      { $group: { _id: valueExpression, count: { $sum: 1 } } },
      { $match: { _id: { $ne: '' }, count: { $gt: 1 } } },
      { $count: 'count' },
    ])
    .toArray();
  return result?.count ?? 0;
}

function canonicalRole(document: Document): string | undefined {
  if (typeof document.role === 'string' && ROLES.has(document.role))
    return document.role;
  if (Array.isArray(document.roles)) {
    const roles = document.roles.filter(
      (role): role is string => typeof role === 'string' && ROLES.has(role),
    );
    if (roles.length === 1) return roles[0];
  }
  return undefined;
}

function validPasswordHash(value: unknown): value is string {
  return typeof value === 'string' && BCRYPT_HASH.test(value);
}

function incrementWarning(report: MongoMigrationReport, key: string): void {
  report.warnings[key] = (report.warnings[key] ?? 0) + 1;
}

function parseCheckpoint(checkpoint: string | undefined): {
  collection?: CollectionName;
  id?: ObjectId;
} {
  if (!checkpoint || checkpoint === 'complete') return {};
  const [collection, id] = checkpoint.split(':');
  if (
    (collection !== 'users' && collection !== 'courses') ||
    !ObjectId.isValid(id)
  )
    throw new Error('Migration checkpoint is invalid.');
  return { collection, id: new ObjectId(id) };
}
