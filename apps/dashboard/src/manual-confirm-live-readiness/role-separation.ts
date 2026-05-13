import {
  type ManualConfirmRoleSeparation,
  type ManualConfirmRoleStatus,
} from './types.js';

export function buildManualConfirmRoleSeparation(input: {
  roleSeparationId: string;
  requesterRole: string;
  reviewerRole: string;
  approverRole: string;
  separationSatisfied: boolean;
  violationReasonCodes: readonly string[];
  roleSeparationStatus: ManualConfirmRoleStatus;
}): ManualConfirmRoleSeparation {
  return {
    roleSeparationId: input.roleSeparationId,
    requesterRole: input.requesterRole,
    reviewerRole: input.reviewerRole,
    approverRole: input.approverRole,
    sameActorAllowed: false,
    separationSatisfied: input.separationSatisfied,
    violationReasonCodes: input.violationReasonCodes,
    roleSeparationStatus: input.roleSeparationStatus,
  };
}
