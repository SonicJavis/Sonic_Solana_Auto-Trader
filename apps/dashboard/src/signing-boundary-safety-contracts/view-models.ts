import type {
  SigningApprovalStatus,
  SigningBoundaryGateStatus,
  SigningBoundarySafetyContractName,
  SigningBoundaryViewModel,
} from './types.js';

export function buildSigningBoundaryViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: SigningBoundarySafetyContractName;
  gateStatus: SigningBoundaryGateStatus;
  approvalStatus: SigningApprovalStatus;
}): SigningBoundaryViewModel {
  return {
    ...input,
    summary: `${input.fixtureName}: gate=${input.gateStatus}, approval=${input.approvalStatus}, design=fail-closed`,
  };
}
