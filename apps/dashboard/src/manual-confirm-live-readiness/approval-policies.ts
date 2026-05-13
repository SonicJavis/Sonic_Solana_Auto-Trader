import {
  type ManualConfirmApprovalPolicy,
  type ManualConfirmApprovalStatus,
} from './types.js';

export function buildManualConfirmApprovalPolicy(input: {
  approvalPolicyId: string;
  multipleApproversRequired: boolean;
  approvalStatus: ManualConfirmApprovalStatus;
}): ManualConfirmApprovalPolicy {
  return {
    approvalPolicyId: input.approvalPolicyId,
    manualApprovalRequired: true,
    multipleApproversRequired: input.multipleApproversRequired,
    automaticApprovalAllowed: false,
    automaticPromotionAllowed: false,
    limitedLiveUnlockAllowed: false,
    fullAutoUnlockAllowed: false,
    requiresSeparateFuturePhase: true,
    approvalStatus: input.approvalStatus,
  };
}
