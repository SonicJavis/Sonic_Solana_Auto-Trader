import type { PreLiveCertificationReport } from './types.js';

export function buildPreLiveCertificationReport(input: {
  reportId: string;
  gateSummary: string;
  checklistSummary: string;
  certificationSummary: string;
  evidenceSummary: string;
  signoffSummary: string;
  approvalSummary: string;
  rejectionSummary: string;
  safetySummary: string;
}): PreLiveCertificationReport {
  return {
    reportId: input.reportId,
    gateSummary: input.gateSummary,
    checklistSummary: input.checklistSummary,
    certificationSummary: input.certificationSummary,
    evidenceSummary: input.evidenceSummary,
    signoffSummary: input.signoffSummary,
    approvalSummary: input.approvalSummary,
    rejectionSummary: input.rejectionSummary,
    safetySummary: input.safetySummary,
  };
}
