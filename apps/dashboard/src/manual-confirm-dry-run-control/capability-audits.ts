import type { ManualConfirmDryRunCapabilityAudit } from './types.js';

export function buildManualConfirmDryRunCapabilityAudit(input: {
  auditId: string;
  auditStatus: 'pass' | 'warning' | 'fail';
}): ManualConfirmDryRunCapabilityAudit {
  return {
    auditId: input.auditId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noUnlockAuthority: true,
    noOrderCreation: true,
    noTransactionConstruction: true,
    noDispatch: true,
    noExecution: true,
    auditStatus: input.auditStatus,
  };
}
