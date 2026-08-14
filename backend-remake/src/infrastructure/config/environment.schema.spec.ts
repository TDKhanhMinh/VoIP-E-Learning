import { environmentValidationSchema } from './environment.schema';

describe('environmentValidationSchema', () => {
  it('provides safe defaults while optional integrations are disabled', () => {
    const result = environmentValidationSchema.validate(
      {},
      { abortEarly: false },
    );

    expect(result.error).toBeUndefined();
    expect(result.value).toMatchObject({
      PORT: 3000,
      API_PREFIX: 'api',
      API_VERSION: '1',
      LOG_FILE_ENABLED: false,
      MONGO_ENABLED: false,
      SWAGGER_ENABLED: false,
      V1_COMPATIBILITY_ADAPTER_ENABLED: false,
      JWT_ACCESS_TOKEN_TTL: '15m',
      JWT_REFRESH_TOKEN_TTL: '24h',
      EMAIL_VERIFICATION_TOKEN_TTL: '15m',
      CREDENTIAL_TOKEN_RATE_WINDOW_MS: 3_600_000,
      CREDENTIAL_TOKEN_RATE_MAX: 3,
      GOOGLE_OAUTH_DEFAULT_ROLE: 'guest',
      GOOGLE_OAUTH_ENABLED: false,
      GOOGLE_DRIVE_ENABLED: false,
      CLOUDINARY_ENABLED: false,
      LIVEKIT_ENABLED: false,
      SMTP_ENABLED: false,
      RECORDING_ENABLED: false,
      SIP_ENABLED: false,
      AWS_RECORDING_ENABLED: false,
      GEMINI_ENABLED: false,
    });
  });

  it('requires a MongoDB URI when persistence is enabled', () => {
    const result = environmentValidationSchema.validate(
      { MONGO_ENABLED: 'true' },
      { abortEarly: false },
    );

    expect(result.error?.message).toContain('MONGO_URI');
  });

  it('requires file logging in production and provides a default path', () => {
    const result = environmentValidationSchema.validate({
      NODE_ENV: 'production',
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
    });
    expect(result.error).toBeUndefined();
    expect(result.value).toMatchObject({
      LOG_FILE_ENABLED: true,
      LOG_FILE_PATH: 'logs/backend-remake.log',
    });

    const disabled = environmentValidationSchema.validate({
      NODE_ENV: 'production',
      LOG_FILE_ENABLED: 'false',
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
    });
    expect(disabled.error?.message).toContain('LOG_FILE_ENABLED');
  });

  it('does not accept Phase 00 provider activation by environment alone', () => {
    const result = environmentValidationSchema.validate(
      {
        GOOGLE_DRIVE_ENABLED: 'true',
        SIP_ENABLED: 'true',
        AWS_RECORDING_ENABLED: 'true',
      },
      { abortEarly: false },
    );

    expect(result.error?.message).toContain('GOOGLE_DRIVE_ENABLED');
    expect(result.error?.message).toContain('SIP_ENABLED');
    expect(result.error?.message).toContain('AWS_RECORDING_ENABLED');
  });
});
