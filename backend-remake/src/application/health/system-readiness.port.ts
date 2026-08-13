import type { SystemReadiness } from '../../domain/health/system-readiness';

export const SYSTEM_READINESS_PORT = Symbol('SYSTEM_READINESS_PORT');

export interface SystemReadinessPort {
  check(): Promise<SystemReadiness>;
}
