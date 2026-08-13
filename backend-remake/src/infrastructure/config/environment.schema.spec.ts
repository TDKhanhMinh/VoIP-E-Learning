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
      MONGO_ENABLED: false,
      SWAGGER_ENABLED: false,
      V1_COMPATIBILITY_ADAPTER_ENABLED: false,
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
