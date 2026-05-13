import type { SmokeCertificationReport } from './types.js';

export function buildSmokeCertificationReport(input: {
  reportId: string;
  planSummary: string;
  guardSummary: string;
  eligibilitySummary: string;
  environmentSummary: string;
  resultSummary: string;
  failureSummary: string;
  safetySummary: string;
}): SmokeCertificationReport {
  return {
    reportId: input.reportId,
    planSummary: input.planSummary,
    guardSummary: input.guardSummary,
    eligibilitySummary: input.eligibilitySummary,
    environmentSummary: input.environmentSummary,
    resultSummary: input.resultSummary,
    failureSummary: input.failureSummary,
    safetySummary: input.safetySummary,
  };
}
