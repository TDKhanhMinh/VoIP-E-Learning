import type { SystemReadinessPort } from '../../../application/health/system-readiness.port';
import { SystemReadiness } from '../../../domain/health/system-readiness';

export class DisabledMongoReadinessAdapter implements SystemReadinessPort {
  async check(): Promise<SystemReadiness> {
    return Promise.resolve(
      new SystemReadiness(true, new Date(), {
        mongodb: { status: 'disabled' },
      }),
    );
  }
}
