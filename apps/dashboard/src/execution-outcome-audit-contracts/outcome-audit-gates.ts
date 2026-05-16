import {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE,
  type OutcomeAuditGate,
  type OutcomeAuditGateStatus,
} from './types.js';

export function buildOutcomeAuditGate(input: {
  outcomeAuditGateId: string;
  outcomeAuditGateName: string;
  gateStatus: OutcomeAuditGateStatus;
  blockingReasonCodes: readonly string[];
}): OutcomeAuditGate {
  return {
    outcomeAuditGateId: input.outcomeAuditGateId,
    outcomeAuditGateName: input.outcomeAuditGateName,
    phase: EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    liveOutcomeObservationAllowed: false,
    transactionLookupAllowed: false,
    confirmationLookupAllowed: false,
    networkReadAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
