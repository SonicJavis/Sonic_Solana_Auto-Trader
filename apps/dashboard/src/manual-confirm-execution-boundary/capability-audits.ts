import type { ExecutionBoundaryCapabilityAudit } from './types.js';

export function buildExecutionBoundaryCapabilityAudit(input: {
  capabilityAuditId: string;
}): ExecutionBoundaryCapabilityAudit {
  return {
    capabilityAuditId: input.capabilityAuditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    unlockAuthorityPresent: false,
    executionCapabilityPresent: false,
  };
}
