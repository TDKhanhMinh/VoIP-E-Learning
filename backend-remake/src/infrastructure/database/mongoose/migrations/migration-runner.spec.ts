import { emptyMigrationReport, type MongoMigration } from './migration';
import { migrationChecksum } from './migration-runner';

describe('migration runner contracts', () => {
  const migration: MongoMigration = {
    id: '202608140000-test',
    description: 'Test checksum contract.',
    kind: 'data',
    checksumSource: 'v1',
    up() {
      return Promise.resolve(emptyMigrationReport());
    },
  };

  it('creates stable checksums and detects an implementation version change', () => {
    expect(migrationChecksum(migration)).toMatch(/^[a-f0-9]{64}$/u);
    expect(migrationChecksum(migration)).toBe(migrationChecksum(migration));
    expect(migrationChecksum({ ...migration, checksumSource: 'v2' })).not.toBe(
      migrationChecksum(migration),
    );
  });
});
