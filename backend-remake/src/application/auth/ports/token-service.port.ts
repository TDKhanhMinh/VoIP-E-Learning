import type { UserRole } from '../../../domain/users/user.entity';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface CurrentActor {
  userId: string;
  sessionId: string;
  role: UserRole;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface TokenServicePort {
  issue(actor: CurrentActor): Promise<IssuedTokens>;
  verifyAccess(token: string): Promise<CurrentActor>;
  verifyRefresh(token: string): Promise<CurrentActor>;
}
