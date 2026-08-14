import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConnectionStates, type Connection } from 'mongoose';
import type { SystemReadinessPort } from '../../../application/health/system-readiness.port';
import { SystemReadiness } from '../../../domain/health/system-readiness';

@Injectable()
export class MongoReadinessAdapter implements SystemReadinessPort {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check(): Promise<SystemReadiness> {
    if (this.connection.readyState === ConnectionStates.connected) {
      try {
        const database = this.connection.db;
        if (!database) {
          throw new Error('MongoDB connection has no database handle');
        }

        await database.admin().ping();
        return new SystemReadiness(true, new Date(), {
          mongodb: { status: 'up' },
        });
      } catch {
        // The readiness response below intentionally contains no driver details.
      }
    }

    return new SystemReadiness(false, new Date(), {
      mongodb: { status: 'down' },
    });
  }
}
