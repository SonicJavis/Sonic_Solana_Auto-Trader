import type {
  ManualConfirmGateStatus,
  ManualConfirmReadinessReport,
} from './types.js';

export function buildManualConfirmReadinessReport(input: {
  reportId: string;
  gateSummary: string;
  approvalSummary: string;
  confirmationSummary: string;
  roleSeparationSummary: string;
  coolingOffSummary: string;
  riskAcknowledgementSummary: string;
  checklistSummary: string;
  evidenceSummary: string;
  safetySummary: string;
  overallStatus: ManualConfirmGateStatus;
}): ManualConfirmReadinessReport {
  return {
    reportId: input.reportId,
    gateSummary: input.gateSummary,
    approvalSummary: input.approvalSummary,
    confirmationSummary: input.confirmationSummary,
    roleSeparationSummary: input.roleSeparationSummary,
    coolingOffSummary: input.coolingOffSummary,
    riskAcknowledgementSummary: input.riskAcknowledgementSummary,
    checklistSummary: input.checklistSummary,
    evidenceSummary: input.evidenceSummary,
    safetySummary: input.safetySummary,
    overallStatus: input.overallStatus,
    failClosed: true,
    unlockAuthority: false,
    manualLiveAllowed: false,
  };
}
