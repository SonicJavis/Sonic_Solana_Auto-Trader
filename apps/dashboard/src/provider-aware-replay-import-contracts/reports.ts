import type { ReplayImportAuditReport } from './types.js';

export function buildReplayImportAuditReport(
  input: Omit<ReplayImportAuditReport, 'reportId'> & { fixtureId: string },
): ReplayImportAuditReport {
  return {
    reportId: `${input.fixtureId}-report`,
    candidateSummary: input.candidateSummary,
    manifestSummary: input.manifestSummary,
    compatibilitySummary: input.compatibilitySummary,
    gatePolicySummary: input.gatePolicySummary,
    importPlanSummary: input.importPlanSummary,
    provenanceSummary: input.provenanceSummary,
    integritySummary: input.integritySummary,
    safetySummary: input.safetySummary,
  };
}

export const buildHistoricalSnapshotAuditReport = buildReplayImportAuditReport;
