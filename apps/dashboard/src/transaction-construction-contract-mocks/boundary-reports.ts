import type { ExecutionBoundaryReport } from './types.js';

export function buildExecutionBoundaryReport(input: {
  reportId: string;
  gateSummary: string;
  stateSummary: string;
  constructionSummary: string;
  signingSummary: string;
  dispatchSummary: string;
  walletSummary: string;
  approvalSummary: string;
  abortRollbackSummary: string;
  evidenceSummary: string;
  safetySummary: string;
}): ExecutionBoundaryReport {
  return {
    reportId: input.reportId,
    gateSummary: input.gateSummary,
    stateSummary: input.stateSummary,
    constructionSummary: input.constructionSummary,
    signingSummary: input.signingSummary,
    dispatchSummary: input.dispatchSummary,
    walletSummary: input.walletSummary,
    approvalSummary: input.approvalSummary,
    abortRollbackSummary: input.abortRollbackSummary,
    evidenceSummary: input.evidenceSummary,
    safetySummary: input.safetySummary,
  };
}
