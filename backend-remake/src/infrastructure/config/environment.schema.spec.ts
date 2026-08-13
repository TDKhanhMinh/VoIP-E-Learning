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
      SIP_ENABLED: false,
      AWS_RECORDING_ENABLED: false,
    });
  });

  it('requires a MongoDB URI when persistence is enabled', () => {
    const result = environmentValidationSchema.validate(
      { MONGO_ENABLED: 'true' },
      { abortEarly: false },
    );

    expect(result.error?.message).toContain('MONGO_URI');
  });
});
