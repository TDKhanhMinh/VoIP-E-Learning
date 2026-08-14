import type { SystemHealth } from '../../domain/entities/system-health.entity';
import type {
  DependencyHealth,
  SystemReadiness,
} from '../../domain/health/system-readiness';

export interface HealthResponse {
  status: 'ok';
  checkedAt: string;
}

export interface ReadinessResponse {
  status: 'ready';
  checkedAt: string;
  dependencies: Record<string, DependencyHealth>;
}

export class HealthPresenter {
  static toHttp(health: SystemHealth): HealthResponse {
    return {
      status: health.status,
      checkedAt: health.checkedAt.toISOString(),
    };
  }

  static readinessToHttp(readiness: SystemReadiness): ReadinessResponse {
    return {
      status: 'ready',
      checkedAt: readiness.checkedAt.toISOString(),
      dependencies: readiness.dependencies,
    };
  }
}
