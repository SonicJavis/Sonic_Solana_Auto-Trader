import type { SigningApprovalBoundary, SigningApprovalStatus } from './types.js';

export function buildSigningApprovalBoundary(input: {
  approvalBoundaryId: string;
  approvalStatus: SigningApprovalStatus;
}): SigningApprovalBoundary {
  return {
    approvalBoundaryId: input.approvalBoundaryId,
    manualApprovalRequired: true,
    approvalAuthorizesSigning: false,
    separateSigningPhaseRequired: true,
    approvalStatus: input.approvalStatus,
  };
}
