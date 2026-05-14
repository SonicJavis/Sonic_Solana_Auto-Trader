import type { ExecutionApprovalBoundary, ExecutionApprovalStatus } from './types.js';

export function buildExecutionApprovalBoundary(input: {
  approvalBoundaryId: string;
  approvalStatus: ExecutionApprovalStatus;
}): ExecutionApprovalBoundary {
  return {
    approvalBoundaryId: input.approvalBoundaryId,
    manualApprovalRequired: true,
    approvalAuthorizesExecution: false,
    separateExecutionPhaseRequired: true,
    approvalStatus: input.approvalStatus,
  };
}
