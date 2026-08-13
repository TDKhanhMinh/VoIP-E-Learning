import type { MongoMigration } from './migration';

const createInitialIndexes: MongoMigration = {
  id: '202608130001-create-auth-and-course-indexes',
  description: 'Create unique, TTL and deterministic pagination indexes.',
  async up(database) {
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
  },
};

export const mongoMigrations: readonly MongoMigration[] = [
  createInitialIndexes,
];
