import type { SystemReadiness } from '../../domain/health/system-readiness';
import type { SystemReadinessPort } from './system-readiness.port';

export class GetSystemReadinessUseCase {
  constructor(private readonly readiness: SystemReadinessPort) {}

  execute(): Promise<SystemReadiness> {
    return this.readiness.check();
  }
}
