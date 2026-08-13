import { environmentValidationSchema } from '../config/environment.schema';
import {
  INTEGRATION_CAPABILITIES,
  PHASE_00_LOCKED_OFF_INTEGRATION_FLAGS,
} from './integration-capabilities';

describe('Phase 00 integration composition contract', () => {
  it('keeps every provider outside runtime composition', () => {
    expect(Object.values(INTEGRATION_CAPABILITIES)).toEqual(
      expect.arrayContaining([expect.objectContaining({ composition: 'off' })]),
    );
    expect(
      Object.values(INTEGRATION_CAPABILITIES).every(
        (capability) => capability.composition === 'off',
      ),
    ).toBe(true);
  });

  it.each(PHASE_00_LOCKED_OFF_INTEGRATION_FLAGS)(
    'rejects activation of %s before its enablement gate',
    (flag) => {
      const result = environmentValidationSchema.validate(
        { [flag]: 'true' },
        { abortEarly: false },
      );
      expect(result.error?.message).toContain(flag);
    },
  );

  it('marks Drive retired and Recording/SIP deferred', () => {
    expect(INTEGRATION_CAPABILITIES.googleDrive.lifecycle).toBe('retire');
    expect(INTEGRATION_CAPABILITIES.recordingAwsGemini.lifecycle).toBe(
      'deferred',
    );
    expect(INTEGRATION_CAPABILITIES.sipAsterisk.lifecycle).toBe('deferred');
  });
});
