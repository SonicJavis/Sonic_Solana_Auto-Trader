import type { FeedbackCapabilityAudit } from './types.js';

export function buildFeedbackCapabilityAudit(input: {
  capabilityAuditId: string;
  unsafeCapabilityDetected?: boolean;
}): FeedbackCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    liveFeedbackCapabilityPresent: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected ?? false,
  };
}
