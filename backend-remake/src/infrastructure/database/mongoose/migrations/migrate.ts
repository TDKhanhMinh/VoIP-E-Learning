import mongoose from 'mongoose';
import { loadEnvironment } from '../../../config/load-environment';
import { mongoMigrations } from './migrations';

loadEnvironment();

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true' || !uri) {
    throw new Error(
      'Set MONGO_ENABLED=true and MONGO_URI before running migrations.',
    );
  }

  const connection = await mongoose
    .createConnection(uri, { serverSelectionTimeoutMS: 5000 })
    .asPromise();
  const database = connection.db;
  if (!database) throw new Error('MongoDB connection has no database handle.');
  const migrationCollection = database.collection<{
    _id: string;
    description: string;
    appliedAt: Date;
  }>('schema_migrations');
  const applied = new Set(
    (
      await migrationCollection.find({}, { projection: { _id: 1 } }).toArray()
    ).map((migration) => migration._id),
  );

  if (process.argv.includes('--status')) {
    for (const migration of mongoMigrations)
      process.stdout.write(
        `${applied.has(migration.id) ? 'applied' : 'pending'} ${migration.id} ${migration.description}\n`,
      );
    await connection.close();
    return;
  }

  for (const migration of mongoMigrations) {
    if (applied.has(migration.id)) continue;
    await migration.up(database);
    await migrationCollection.insertOne({
      _id: migration.id,
      description: migration.description,
      appliedAt: new Date(),
    });
    process.stdout.write(`applied ${migration.id} ${migration.description}\n`);
  }
  await connection.close();
}

void run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Migration failed'}\n`,
  );
  process.exitCode = 1;
});
