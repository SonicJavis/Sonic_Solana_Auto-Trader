import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type DossierReport,
} from './types.js';

export function buildDossierReport(input: {
  id: string;
  gateSummary: string;
  headerSummary: string;
  checklistSummary: string;
  evidenceSummary: string;
  signoffSummary: string;
  blockerSummary: string;
  approvalDenialSummary: string;
  linkageSummary: string;
  safetySummary: string;
}): DossierReport {
  return {
    reportId: input.id,
    phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
    gateSummary: input.gateSummary,
    headerSummary: input.headerSummary,
    checklistSummary: input.checklistSummary,
    evidenceSummary: input.evidenceSummary,
    signoffSummary: input.signoffSummary,
    blockerSummary: input.blockerSummary,
    approvalDenialSummary: input.approvalDenialSummary,
    linkageSummary: input.linkageSummary,
    safetySummary: input.safetySummary,
  };
}
