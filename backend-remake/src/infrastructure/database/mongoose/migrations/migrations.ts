import { emptyMigrationReport, type MongoMigration } from './migration';
import { backfillUserCourseFoundation } from './user-course-backfill';

const createInitialIndexes: MongoMigration = {
  id: '202608130001-create-auth-and-course-indexes',
  description: 'Create unique, TTL and deterministic pagination indexes.',
  kind: 'schema',
  checksumSource: 'phase-00-index-baseline-v1',
  async up({ database, dryRun }) {
    if (dryRun) return emptyMigrationReport();
    await database.collection('users').createIndexes([
      {
        key: { emailNormalized: 1 },
        name: 'users_email_normalized_unique',
        unique: true,
      },
    ]);
    await database.collection('auth_sessions').createIndexes([
      { key: { id: 1 }, name: 'auth_sessions_id_unique', unique: true },
      { key: { userId: 1 }, name: 'auth_sessions_user_id' },
      {
        key: { expiresAt: 1 },
        name: 'auth_sessions_expiry_ttl',
        expireAfterSeconds: 0,
      },
    ]);
    await database.collection('courses').createIndexes([
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
    await database
      .collection('users')
      .createIndexes([
        { key: { email: 1 }, name: 'users_email_unique', unique: true },
      ]);
    await database.collection('courses').createIndexes([
      { key: { code: 1 }, name: 'courses_code_unique', unique: true },
      {
        key: { title: 1 },
        name: 'courses_title_unique',
        unique: true,
        sparse: true,
      },
    ]);
    await database.collection('attendances').createIndexes([
      {
        key: { class: 1, student: 1, lesson: 1 },
        name: 'attendance_class_student_lesson_unique',
        unique: true,
      },
    ]);
    await database.collection('comments').createIndexes([
      {
        key: { post_id: 1, createdAt: -1 },
        name: 'comments_post_created_at',
      },
    ]);
    await database.collection('documents').createIndexes([
      { key: { title: 1 }, name: 'documents_title' },
      { key: { tags: 1 }, name: 'documents_tags' },
      { key: { level: 1 }, name: 'documents_level' },
    ]);
    await database.collection('materials').createIndexes([
      {
        key: { class: 1, createdAt: -1 },
        name: 'materials_class_created_at',
      },
    ]);
    await database.collection('posts').createIndexes([
      { key: { class_id: 1, topic_id: 1 }, name: 'posts_class_topic' },
      { key: { topic_id: 1, createdAt: -1 }, name: 'posts_topic_created_at' },
      { key: { created_by: 1 }, name: 'posts_created_by_legacy' },
    ]);
    await database.collection('recordlessonsummaries').createIndexes([
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
    await database.collection('rooms').createIndexes([
      { key: { roomName: 1 }, name: 'rooms_room_name_unique', unique: true },
      { key: { joinCode: 1 }, name: 'rooms_join_code_unique', unique: true },
    ]);
    await database
      .collection('semesters')
      .createIndexes([
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

export const mongoMigrations: readonly MongoMigration[] = [
  // Fresh clones backfill and reconcile before unique indexes are built. Sites
  // with the two Phase 00 index migrations already applied retain their ledger.
  backfillUserCourse,
  createInitialIndexes,
  createV1ModelIndexes,
];
