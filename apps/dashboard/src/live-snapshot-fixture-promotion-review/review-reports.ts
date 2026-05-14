import type { FixturePromotionReport } from './types.js';

export function buildFixturePromotionReport(input: {
  reportId: string;
  gateSummary: string;
  candidateSummary: string;
  policySummary: string;
  decisionSummary: string;
  evidenceSummary: string;
  manifestSummary: string;
  blockerSummary: string;
  quarantineSummary: string;
  safetySummary: string;
}): FixturePromotionReport {
  return {
    reportId: input.reportId,
    gateSummary: input.gateSummary,
    candidateSummary: input.candidateSummary,
    policySummary: input.policySummary,
    decisionSummary: input.decisionSummary,
    evidenceSummary: input.evidenceSummary,
    manifestSummary: input.manifestSummary,
    blockerSummary: input.blockerSummary,
    quarantineSummary: input.quarantineSummary,
    safetySummary: input.safetySummary,
  };
}
