export interface CompatibilityAdapterGovernance {
  owner: string | null;
  telemetryEvidence: string | null;
  sunsetCriterion: string | null;
}

/**
 * Phase 00 freezes the adapter boundary without mounting legacy routes. The
 * open governance fields must be resolved before composition can be enabled.
 */
export const V1_COMPATIBILITY_ADAPTER = {
  legacyContract: 'unversioned-singular-v1',
  canonicalContract: 'uri-versioned-remake-v1',
  enabled: false,
  governance: {
    owner: null,
    telemetryEvidence: null,
    sunsetCriterion: null,
  },
} as const satisfies {
  legacyContract: string;
  canonicalContract: string;
  enabled: boolean;
  governance: CompatibilityAdapterGovernance;
};

export function isCompatibilityAdapterGoverned(
  governance: CompatibilityAdapterGovernance,
): boolean {
  return Boolean(
    governance.owner &&
    governance.telemetryEvidence &&
    governance.sunsetCriterion,
  );
}
