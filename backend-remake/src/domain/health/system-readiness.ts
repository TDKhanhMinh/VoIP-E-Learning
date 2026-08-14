export type DependencyHealthStatus = 'up' | 'down' | 'disabled';

export interface DependencyHealth {
  status: DependencyHealthStatus;
}

export class SystemReadiness {
  constructor(
    public readonly ready: boolean,
    public readonly checkedAt: Date,
    public readonly dependencies: Record<string, DependencyHealth>,
  ) {}
}
