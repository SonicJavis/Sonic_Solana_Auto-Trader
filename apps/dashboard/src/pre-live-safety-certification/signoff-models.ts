import type { PreLiveSignoffModel, PreLiveSignoffStatus } from './types.js';

export function buildPreLiveSignoffModel(input: {
  signoffId: string;
  requiresMultipleApprovers: boolean;
  approverSlots: readonly string[];
  signoffStatus: PreLiveSignoffStatus;
}): PreLiveSignoffModel {
  return {
    signoffId: input.signoffId,
    requiresManualReview: true,
    requiresMultipleApprovers: input.requiresMultipleApprovers,
    automaticApprovalAllowed: false,
    unlockAuthority: false,
    approverSlots: [...input.approverSlots],
    signoffStatus: input.signoffStatus,
  };
}
