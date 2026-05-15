import type { SendApprovalStatus, SendOperatorApprovalBoundary } from './types.js';

export function buildSendOperatorApprovalBoundary(input: {
  approvalBoundaryId: string;
  approvalStatus: SendApprovalStatus;
}): SendOperatorApprovalBoundary {
  return {
    approvalBoundaryId: input.approvalBoundaryId,
    manualApprovalRequired: true,
    approvalAuthorizesSending: false,
    separateSendingPhaseRequired: true,
    approvalStatus: input.approvalStatus,
  };
}
