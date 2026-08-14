import { getConnectionToken } from '@nestjs/mongoose';
import type { TestingModule } from '@nestjs/testing';
import type { Connection } from 'mongoose';

export function assertTestDatabaseUri(uri: string | undefined): void {
  if (!uri)
    throw new Error('MONGO_URI is required for MongoDB integration tests.');
  const databaseName = new URL(uri).pathname.replace(/^\//, '');
  if (!databaseName.endsWith('_test'))
    throw new Error(
      `Refusing to run tests against non-test database "${databaseName}".`,
    );
}

export function testDatabaseConnection(module: TestingModule): Connection {
  assertTestDatabaseUri(process.env.MONGO_URI);
  return module.get<Connection>(getConnectionToken());
}

export async function clearTestDatabase(connection: Connection): Promise<void> {
  assertTestDatabaseUri(process.env.MONGO_URI);
  const database = connection.db;
  if (!database)
    throw new Error('MongoDB test connection has no database handle.');
  const collections = await database.collections();
  await Promise.all(
    collections
      .filter((collection) => collection.collectionName !== 'system.views')
      .map((collection) => collection.deleteMany({})),
  );
}
