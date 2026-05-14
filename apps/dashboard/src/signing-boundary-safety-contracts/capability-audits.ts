import type { SigningCapabilityAudit } from './types.js';

export function buildSigningCapabilityAudit(input: {
  capabilityAuditId: string;
  unsafeCapabilityDetected?: boolean;
}): SigningCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    signingCapabilityPresent: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected ?? false,
  };
}
