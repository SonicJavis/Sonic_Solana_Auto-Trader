import type { ManualConfirmDryRunDecisionStatus, ManualConfirmSimulatedDecision } from './types.js';

export function buildManualConfirmSimulatedDecision(input: {
  decisionId: string;
  decisionKind: string;
  decisionStatus: ManualConfirmDryRunDecisionStatus;
}): ManualConfirmSimulatedDecision {
  return {
    decisionId: input.decisionId,
    decisionKind: input.decisionKind,
    dryRunDecisionOnly: true,
    advisoryOutput: false,
    recommendationOutput: false,
    signalOutput: false,
    decisionStatus: input.decisionStatus,
  };
}
