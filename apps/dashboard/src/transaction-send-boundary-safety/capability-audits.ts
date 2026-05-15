import type { SendCapabilityAudit } from './types.js';

export function buildSendCapabilityAudit(input: { capabilityAuditId: string; unsafeCapabilityDetected?: boolean }): SendCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    sendingCapabilityPresent: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected ?? false,
  };
}
