import type { PreLiveApprovalPolicy } from './types.js';

export function buildPreLiveApprovalPolicy(input: { approvalPolicyId: string }): PreLiveApprovalPolicy {
  return {
    approvalPolicyId: input.approvalPolicyId,
    manualApprovalRequired: true,
    automaticPromotionAllowed: false,
    fullAutoUnlockAllowed: false,
    limitedLiveUnlockAllowed: false,
    requiresSeparateFuturePhase: true,
  };
}
