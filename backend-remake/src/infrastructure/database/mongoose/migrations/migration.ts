import type { Db } from 'mongodb';

export interface MongoMigrationReport {
  scanned: number;
  changed: number;
  skipped: number;
  warnings: Record<string, number>;
  checkpoint?: string;
}

export interface MongoMigrationContext {
  database: Db;
  dryRun: boolean;
  batchSize: number;
  checkpoint?: string;
  reportCheckpoint(report: MongoMigrationReport): Promise<void>;
}

export interface MongoMigration {
  id: string;
  description: string;
  kind: 'schema' | 'data';
  /** Bump whenever the forward migration implementation changes. */
  checksumSource: string;
  /** Count-only preflight warnings that must be zero before writes begin. */
  blockingWarnings?: readonly string[];
  up(context: MongoMigrationContext): Promise<MongoMigrationReport>;
}

export function emptyMigrationReport(): MongoMigrationReport {
  return { scanned: 0, changed: 0, skipped: 0, warnings: {} };
}
