import type {
  ManualConfirmAuditStatus,
  ManualConfirmCapabilityAudit,
} from './types.js';

export function buildManualConfirmCapabilityAudit(input: {
  auditId: string;
  auditStatus: ManualConfirmAuditStatus;
}): ManualConfirmCapabilityAudit {
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
