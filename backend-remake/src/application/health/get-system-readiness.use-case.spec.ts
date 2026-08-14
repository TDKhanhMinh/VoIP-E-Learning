import { SystemReadiness } from '../../domain/health/system-readiness';
import { GetSystemReadinessUseCase } from './get-system-readiness.use-case';
import type { SystemReadinessPort } from './system-readiness.port';

describe('GetSystemReadinessUseCase', () => {
  it('delegates dependency checks through the application port', async () => {
    const readiness = new SystemReadiness(true, new Date(), {
      mongodb: { status: 'disabled' },
    });
    const check = jest.fn<
      ReturnType<SystemReadinessPort['check']>,
      Parameters<SystemReadinessPort['check']>
    >();
    check.mockResolvedValue(readiness);
    const port: SystemReadinessPort = { check };
    const useCase = new GetSystemReadinessUseCase(port);

    await expect(useCase.execute()).resolves.toBe(readiness);
    expect(check).toHaveBeenCalledTimes(1);
  });
});
