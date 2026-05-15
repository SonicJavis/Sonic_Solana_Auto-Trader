import type {
  SendApprovalStatus,
  SendBoundaryGateStatus,
  TransactionSendBoundarySafetyContractName,
  TransactionSendBoundaryViewModel,
} from './types.js';

export function buildTransactionSendBoundaryViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: TransactionSendBoundarySafetyContractName;
  gateStatus: SendBoundaryGateStatus;
  approvalStatus: SendApprovalStatus;
}): TransactionSendBoundaryViewModel {
  return {
    ...input,
    summary: `${input.fixtureName}: gate=${input.gateStatus}, approval=${input.approvalStatus}, send=denied`,
  };
}
