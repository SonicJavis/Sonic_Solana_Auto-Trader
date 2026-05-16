import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type ReevaluationCapabilityAudit,
} from './types.js';

export function buildReevaluationCapabilityAudit(input: {
  id: string;
  auditScore: number;
  passedChecks?: readonly string[];
  failedChecks?: readonly string[];
}): ReevaluationCapabilityAudit {
  const passedChecks = input.passedChecks ?? [];
  const failedChecks = input.failedChecks ?? [];
  return {
    capabilityAuditId: input.id,
    phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
    auditScore: input.auditScore,
    passedChecks,
    failedChecks,
    auditPassed: failedChecks.length === 0 && input.auditScore >= 80,
  };
}
