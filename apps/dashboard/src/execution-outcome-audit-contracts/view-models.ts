import type {
  ExecutionOutcomeAuditContractName,
  ExecutionOutcomeAuditViewModel,
  OutcomeAuditGateStatus,
} from './types.js';

export function buildExecutionOutcomeAuditViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: ExecutionOutcomeAuditContractName;
  gateStatus: OutcomeAuditGateStatus;
}): ExecutionOutcomeAuditViewModel {
  return {
    ...input,
    summary: `${input.fixtureName}: gate=${input.gateStatus}, outcome=audit-only`,
  };
}
