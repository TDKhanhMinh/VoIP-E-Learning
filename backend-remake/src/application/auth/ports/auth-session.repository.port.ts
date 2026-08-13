export const AUTH_SESSION_REPOSITORY = Symbol('AUTH_SESSION_REPOSITORY');

export interface AuthSession {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuthSessionRepositoryPort {
  create(session: AuthSession): Promise<void>;
  findById(id: string): Promise<AuthSession | null>;
  rotateRefreshToken(
    id: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ): Promise<void>;
  revoke(id: string): Promise<void>;
}
