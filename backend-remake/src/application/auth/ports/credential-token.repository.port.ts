export const CREDENTIAL_TOKEN_REPOSITORY = Symbol(
  'CREDENTIAL_TOKEN_REPOSITORY',
);

export const CREDENTIAL_TOKEN_PURPOSES = [
  'password_reset',
  'email_verification',
] as const;
export type CredentialTokenPurpose = (typeof CREDENTIAL_TOKEN_PURPOSES)[number];

export interface CredentialTokenRecord {
  id: string;
  userId: string;
  purpose: CredentialTokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}

export interface CredentialTokenRepositoryPort {
  create(token: CredentialTokenRecord): Promise<void>;
  findActiveByHash(
    purpose: CredentialTokenPurpose,
    tokenHash: string,
    now: Date,
  ): Promise<CredentialTokenRecord | null>;
  consumeIfActive(id: string, now: Date): Promise<boolean>;
  countIssuedSince(
    userId: string,
    purpose: CredentialTokenPurpose,
    since: Date,
  ): Promise<number>;
}
