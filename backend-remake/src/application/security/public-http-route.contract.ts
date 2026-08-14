export const PUBLIC_HTTP_ROUTES = [
  {
    id: 'health.liveness',
    method: 'GET',
    path: '/api/v1/health/live',
    availability: 'production',
    rationale: 'Infrastructure liveness probe with no business data.',
  },
  {
    id: 'health.readiness',
    method: 'GET',
    path: '/api/v1/health/ready',
    availability: 'production',
    rationale: 'Infrastructure readiness probe with dependency status only.',
  },
  {
    id: 'auth.login',
    method: 'POST',
    path: '/api/v1/auth/login',
    availability: 'production',
    rationale: 'Credential exchange required before an access token exists.',
  },
  {
    id: 'auth.refresh',
    method: 'POST',
    path: '/api/v1/auth/refresh',
    availability: 'production',
    rationale:
      'Refresh-cookie exchange required after an access token expires.',
  },
  {
    id: 'auth.password-reset.request',
    method: 'POST',
    path: '/api/v1/auth/password-reset/request',
    availability: 'production',
    rationale: 'Password reset request cannot require an existing session.',
  },
  {
    id: 'auth.password-reset.confirm',
    method: 'POST',
    path: '/api/v1/auth/password-reset/confirm',
    availability: 'production',
    rationale: 'Password reset confirmation uses a one-time credential token.',
  },
  {
    id: 'auth.email-verification.confirm',
    method: 'POST',
    path: '/api/v1/auth/email-verification/confirm',
    availability: 'production',
    rationale: 'Email verification confirmation uses a one-time token.',
  },
] as const;

export type PublicHttpRouteId = (typeof PUBLIC_HTTP_ROUTES)[number]['id'];

export function isPublicHttpRouteId(
  candidate: string,
): candidate is PublicHttpRouteId {
  return PUBLIC_HTTP_ROUTES.some((route) => route.id === candidate);
}
