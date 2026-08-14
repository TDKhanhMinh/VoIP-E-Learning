import { createHash, randomUUID } from 'node:crypto';
import type { Collection, Db } from 'mongodb';
import type { MongoMigration, MongoMigrationReport } from './migration';

type MigrationState = 'running' | 'applied' | 'failed';

interface MigrationLedgerDocument {
  _id: string;
  description: string;
  checksum: string;
  state: MigrationState;
  owner: string;
  startedAt: Date;
  updatedAt: Date;
  appliedAt?: Date;
  checkpoint?: string;
  report?: MongoMigrationReport;
  errorCode?: string;
}

export interface RunMongoMigrationsOptions {
  dryRun?: boolean;
  resume?: boolean;
  batchSize?: number;
}

export interface MigrationExecutionResult {
  id: string;
  checksum: string;
  state: 'applied' | 'dry-run' | 'already-applied';
  report?: MongoMigrationReport;
}

export function migrationChecksum(migration: MongoMigration): string {
  return createHash('sha256')
    .update(
      [
        migration.id,
        migration.description,
        migration.kind,
        migration.checksumSource,
        JSON.stringify(migration.blockingWarnings ?? []),
      ].join('\n'),
    )
    .digest('hex');
}

export async function runMongoMigrations(
  database: Db,
  migrations: readonly MongoMigration[],
  options: RunMongoMigrationsOptions = {},
): Promise<MigrationExecutionResult[]> {
  const batchSize = options.batchSize ?? 100;
  if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 10_000)
    throw new Error('Migration batch size must be between 1 and 10000.');

  assertUniqueMigrationIds(migrations);
  const ledger =
    database.collection<MigrationLedgerDocument>('schema_migrations');
  const owner = randomUUID();
  const results: MigrationExecutionResult[] = [];

  for (const migration of migrations) {
    const checksum = migrationChecksum(migration);
    const existing = await ledger.findOne({ _id: migration.id });
    if (existing?.checksum !== undefined && existing.checksum !== checksum)
      throw new Error(`Checksum mismatch for migration ${migration.id}.`);
    if (existing?.state === 'applied') {
      results.push({ id: migration.id, checksum, state: 'already-applied' });
      continue;
    }
    if (existing && !options.resume)
      throw new Error(
        `Migration ${migration.id} is ${existing.state}; rerun with --resume after review.`,
      );

    if (!options.dryRun && migration.blockingWarnings?.length) {
      const preflight = await migration.up({
        database,
        dryRun: true,
        batchSize,
        reportCheckpoint: () => Promise.resolve(),
      });
      const blockers = Object.fromEntries(
        migration.blockingWarnings
          .map(
            (warning) => [warning, preflight.warnings[warning] ?? 0] as const,
          )
          .filter(([, count]) => count > 0),
      );
      if (Object.keys(blockers).length > 0)
        throw new Error(
          `Migration ${migration.id} has blocking preflight warnings: ${JSON.stringify(blockers)}.`,
        );
    }

    if (!options.dryRun) {
      const now = new Date();
      await ledger.updateOne(
        { _id: migration.id },
        {
          $set: {
            description: migration.description,
            checksum,
            state: 'running',
            owner,
            updatedAt: now,
          },
          $setOnInsert: { startedAt: now },
          $unset: { appliedAt: '', errorCode: '' },
        },
        { upsert: true },
      );
    }

    try {
      const report = await migration.up({
        database,
        dryRun: options.dryRun ?? false,
        batchSize,
        checkpoint: existing?.checkpoint,
        reportCheckpoint: async (checkpointReport) => {
          if (options.dryRun) return;
          await persistCheckpoint(
            ledger,
            migration.id,
            owner,
            checkpointReport,
          );
        },
      });
      if (!options.dryRun) {
        const appliedAt = new Date();
        await ledger.updateOne(
          { _id: migration.id, owner, state: 'running' },
          {
            $set: {
              state: 'applied',
              report,
              checkpoint: report.checkpoint,
              appliedAt,
              updatedAt: appliedAt,
            },
          },
        );
      }
      results.push({
        id: migration.id,
        checksum,
        state: options.dryRun ? 'dry-run' : 'applied',
        report,
      });
    } catch (error: unknown) {
      if (!options.dryRun)
        await ledger.updateOne(
          { _id: migration.id, owner },
          {
            $set: {
              state: 'failed',
              errorCode: 'MIGRATION_EXECUTION_FAILED',
              updatedAt: new Date(),
            },
          },
        );
      throw error;
    }
  }
  return results;
}

async function persistCheckpoint(
  ledger: Collection<MigrationLedgerDocument>,
  migrationId: string,
  owner: string,
  report: MongoMigrationReport,
): Promise<void> {
  const result = await ledger.updateOne(
    { _id: migrationId, owner, state: 'running' },
    {
      $set: {
        checkpoint: report.checkpoint,
        report,
        updatedAt: new Date(),
      },
    },
  );
  if (result.matchedCount !== 1)
    throw new Error(`Migration ${migrationId} lost its ledger ownership.`);
}

function assertUniqueMigrationIds(migrations: readonly MongoMigration[]): void {
  const ids = new Set<string>();
  for (const migration of migrations) {
    if (ids.has(migration.id))
      throw new Error(`Duplicate migration id ${migration.id}.`);
    ids.add(migration.id);
  }
}
