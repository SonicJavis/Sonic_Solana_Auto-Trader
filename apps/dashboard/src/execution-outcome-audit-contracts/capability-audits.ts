import type { OutcomeCapabilityAudit } from './types.js';

export function buildOutcomeCapabilityAudit(input: {
  capabilityAuditId: string;
  unsafeCapabilityDetected?: boolean;
}): OutcomeCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    liveOutcomeObservationCapabilityPresent: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected ?? false,
  };
}
