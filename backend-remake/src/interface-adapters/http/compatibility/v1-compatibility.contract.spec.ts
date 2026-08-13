import {
  isCompatibilityAdapterGoverned,
  V1_COMPATIBILITY_ADAPTER,
} from './v1-compatibility.contract';

describe('V1 compatibility adapter governance', () => {
  it('keeps legacy routing unmounted until governance is complete', () => {
    expect(V1_COMPATIBILITY_ADAPTER.enabled).toBe(false);
    expect(
      isCompatibilityAdapterGoverned(V1_COMPATIBILITY_ADAPTER.governance),
    ).toBe(false);
  });

  it('requires owner, telemetry and a sunset criterion together', () => {
    expect(
      isCompatibilityAdapterGoverned({
        owner: 'backend-owner',
        telemetryEvidence: 'dashboard://compatibility-traffic',
        sunsetCriterion: 'zero traffic for an approved observation window',
      }),
    ).toBe(true);
  });
});
