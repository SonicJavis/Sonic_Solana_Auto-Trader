import type {
  ExecutionApprovalStatus,
  ExecutionBoundaryGateStatus,
  ExecutionBoundaryStateStatus,
  ExecutionBoundaryViewModel,
  ManualConfirmExecutionBoundaryName,
} from './types.js';

export function buildExecutionBoundaryViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: ManualConfirmExecutionBoundaryName;
  gateStatus: ExecutionBoundaryGateStatus;
  stateStatus: ExecutionBoundaryStateStatus;
  approvalStatus: ExecutionApprovalStatus;
}): ExecutionBoundaryViewModel {
  return {
    ...input,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / state:${input.stateStatus} / approval:${input.approvalStatus}`,
  };
}
