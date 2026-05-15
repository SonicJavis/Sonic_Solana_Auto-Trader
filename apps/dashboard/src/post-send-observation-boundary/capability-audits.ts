import type { ObservationCapabilityAudit } from './types.js';

export function buildObservationCapabilityAudit(input: {
  capabilityAuditId: string;
  unsafeCapabilityDetected?: boolean;
}): ObservationCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    liveObservationCapabilityPresent: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected ?? false,
  };
}
