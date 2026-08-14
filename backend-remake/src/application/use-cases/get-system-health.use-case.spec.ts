import type { ClockPort } from '../ports/clock.port';
import { GetSystemHealthUseCase } from './get-system-health.use-case';

describe('GetSystemHealthUseCase', () => {
  it('returns the current health status without framework dependencies', () => {
    const checkedAt = new Date('2026-08-13T00:00:00.000Z');
    const clock: ClockPort = { now: () => checkedAt };
    const useCase = new GetSystemHealthUseCase(clock);

    expect(useCase.execute()).toEqual({ status: 'ok', checkedAt });
  });
});
