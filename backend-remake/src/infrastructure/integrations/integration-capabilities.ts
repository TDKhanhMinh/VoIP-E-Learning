export type IntegrationLifecycle = 'keep' | 'retire' | 'deferred';
export type IntegrationComposition = 'off';

export interface IntegrationCapabilityDefinition {
  lifecycle: IntegrationLifecycle;
  composition: IntegrationComposition;
  environmentFlags: readonly string[];
  releaseScope: 'candidate' | 'excluded-pending-clarification';
  enablementGate: string;
}

/**
 * Phase 00 composition contract. Every provider remains OFF until its later
 * vertical slice supplies an adapter, tests, operational evidence and approval.
 */
export const INTEGRATION_CAPABILITIES = {
  googleOAuth: {
    lifecycle: 'keep',
    composition: 'off',
    environmentFlags: ['GOOGLE_OAUTH_ENABLED'],
    releaseScope: 'candidate',
    enablementGate: 'Phase 02 account-linking decision and provider E2E.',
  },
  googleDrive: {
    lifecycle: 'retire',
    composition: 'off',
    environmentFlags: ['GOOGLE_DRIVE_ENABLED'],
    releaseScope: 'excluded-pending-clarification',
    enablementGate: 'Cannot be enabled in the remake; migrate legacy assets.',
  },
  cloudinary: {
    lifecycle: 'keep',
    composition: 'off',
    environmentFlags: ['CLOUDINARY_ENABLED'],
    releaseScope: 'candidate',
    enablementGate: 'Phase 05 adapter, binding authorization and provider E2E.',
  },
  liveKit: {
    lifecycle: 'keep',
    composition: 'off',
    environmentFlags: ['LIVEKIT_ENABLED'],
    releaseScope: 'candidate',
    enablementGate: 'Phase 10 lazy adapter, authorization and provider E2E.',
  },
  smtp: {
    lifecycle: 'keep',
    composition: 'off',
    environmentFlags: ['SMTP_ENABLED'],
    releaseScope: 'candidate',
    enablementGate: 'Phase 12 outbox, redaction and delivery evidence.',
  },
  recordingAwsGemini: {
    lifecycle: 'deferred',
    composition: 'off',
    environmentFlags: [
      'RECORDING_ENABLED',
      'AWS_RECORDING_ENABLED',
      'GEMINI_ENABLED',
    ],
    releaseScope: 'excluded-pending-clarification',
    enablementGate: 'Phase 13 security, privacy, cost and operations approval.',
  },
  sipAsterisk: {
    lifecycle: 'deferred',
    composition: 'off',
    environmentFlags: ['SIP_ENABLED'],
    releaseScope: 'excluded-pending-clarification',
    enablementGate:
      'Phase 13 security approval and credential rotation evidence.',
  },
} as const satisfies Record<string, IntegrationCapabilityDefinition>;

export const PHASE_00_LOCKED_OFF_INTEGRATION_FLAGS = Object.values(
  INTEGRATION_CAPABILITIES,
).flatMap((capability) => capability.environmentFlags);
