import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type DossierCapabilityAudit,
} from './types.js';

export function buildDossierCapabilityAudit(input: {
  id: string;
  auditScore: number;
  passedChecks?: readonly string[];
  failedChecks?: readonly string[];
}): DossierCapabilityAudit {
  const passedChecks = input.passedChecks ?? [];
  const failedChecks = input.failedChecks ?? [];
  return {
    capabilityAuditId: input.id,
    phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
    auditScore: input.auditScore,
    passedChecks,
    failedChecks,
    auditPassed: failedChecks.length === 0 && input.auditScore >= 80,
  };
}
