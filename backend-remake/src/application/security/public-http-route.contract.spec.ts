import { PUBLIC_HTTP_ROUTES } from './public-http-route.contract';

describe('public HTTP route contract', () => {
  it('contains only the infrastructure and credential anonymous allowlist', () => {
    expect(PUBLIC_HTTP_ROUTES).toEqual([
      expect.objectContaining({
        id: 'health.liveness',
        method: 'GET',
        path: '/api/v1/health/live',
      }),
      expect.objectContaining({
        id: 'health.readiness',
        method: 'GET',
        path: '/api/v1/health/ready',
      }),
      expect.objectContaining({
        id: 'auth.login',
        method: 'POST',
        path: '/api/v1/auth/login',
      }),
      expect.objectContaining({
        id: 'auth.refresh',
        method: 'POST',
        path: '/api/v1/auth/refresh',
      }),
      expect.objectContaining({
        id: 'auth.password-reset.request',
        method: 'POST',
        path: '/api/v1/auth/password-reset/request',
      }),
      expect.objectContaining({
        id: 'auth.password-reset.confirm',
        method: 'POST',
        path: '/api/v1/auth/password-reset/confirm',
      }),
      expect.objectContaining({
        id: 'auth.email-verification.confirm',
        method: 'POST',
        path: '/api/v1/auth/email-verification/confirm',
      }),
    ]);
  });

  it('does not allow anonymous registration or business reads', () => {
    const paths = PUBLIC_HTTP_ROUTES.map((route) => route.path);
    expect(paths).not.toContain('/api/v1/auth/register');
    expect(paths.some((path) => path.includes('/courses'))).toBe(false);
    expect(new Set(PUBLIC_HTTP_ROUTES.map((route) => route.id)).size).toBe(
      PUBLIC_HTTP_ROUTES.length,
    );
  });
});
