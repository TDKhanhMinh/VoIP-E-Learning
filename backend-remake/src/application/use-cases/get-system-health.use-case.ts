import { SystemHealth } from '../../domain/entities/system-health.entity';
import type { ClockPort } from '../ports/clock.port';

export class GetSystemHealthUseCase {
  constructor(private readonly clock: ClockPort) {}

  execute(): SystemHealth {
    return new SystemHealth('ok', this.clock.now());
  }
}
