import mongoose from 'mongoose';
import { loadEnvironment } from '../../../config/load-environment';
import { migrationChecksum, runMongoMigrations } from './migration-runner';
import { mongoMigrations } from './migrations';

loadEnvironment();

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true' || !uri)
    throw new Error(
      'Set MONGO_ENABLED=true and MONGO_URI before running migrations.',
    );

  const connection = await mongoose
    .createConnection(uri, { serverSelectionTimeoutMS: 5000 })
    .asPromise();
  try {
    const database = connection.db;
    if (!database)
      throw new Error('MongoDB connection has no database handle.');
    if (process.argv.includes('--status')) {
      const ledger = database.collection<{
        _id: string;
        state?: string;
        checksum?: string;
        checkpoint?: string;
      }>('schema_migrations');
      for (const migration of mongoMigrations) {
        const applied = await ledger.findOne({ _id: migration.id });
        const checksum = migrationChecksum(migration);
        const state = !applied
          ? 'pending'
          : applied.checksum !== checksum
            ? 'checksum-mismatch'
            : (applied.state ?? 'legacy-applied');
        process.stdout.write(
          `${JSON.stringify({ id: migration.id, state, checksum, checkpoint: applied?.checkpoint })}\n`,
        );
      }
      return;
    }

    const results = await runMongoMigrations(database, mongoMigrations, {
      dryRun: process.argv.includes('--dry-run'),
      resume: process.argv.includes('--resume'),
      batchSize: parseBatchSize(process.argv),
    });
    for (const result of results)
      process.stdout.write(`${JSON.stringify(result)}\n`);
  } finally {
    await connection.close();
  }
}

function parseBatchSize(arguments_: readonly string[]): number | undefined {
  const argument = arguments_.find((value) =>
    value.startsWith('--batch-size='),
  );
  if (!argument) return undefined;
  const batchSize = Number(argument.slice('--batch-size='.length));
  if (!Number.isSafeInteger(batchSize))
    throw new Error('Migration batch size must be an integer.');
  return batchSize;
}

void run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Migration failed'}\n`,
  );
  process.exitCode = 1;
});
