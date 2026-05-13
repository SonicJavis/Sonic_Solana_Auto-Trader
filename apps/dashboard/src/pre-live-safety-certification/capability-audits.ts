import type { PreLiveAuditStatus, PreLiveCapabilityAudit } from './types.js';

export function buildPreLiveCapabilityAudit(input: { auditId: string; auditStatus: PreLiveAuditStatus }): PreLiveCapabilityAudit {
  return {
    auditId: input.auditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noWallet: true,
    noSigning: true,
    noSending: true,
    noExecution: true,
    noAdvisory: true,
    auditStatus: input.auditStatus,
  };
}
