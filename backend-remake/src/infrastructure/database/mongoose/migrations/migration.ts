import type { Db } from 'mongodb';

export interface MongoMigration {
  id: string;
  description: string;
  up(database: Db): Promise<void>;
}
