export type HealthStatus = 'ok';

export class SystemHealth {
  constructor(
    public readonly status: HealthStatus,
    public readonly checkedAt: Date,
  ) {}
}
