import type { LiveSnapshotParityReport } from './types.js';

export function buildLiveSnapshotParityReport(input: {
  reportId: string;
  gateSummary: string;
  snapshotSummary: string;
  replayExpectationSummary?: string;
  scenarioExpectationSummary?: string;
  comparisonSummary?: string;
  mismatchSummary?: string;
  provenanceSummary?: string;
  quarantineSummary?: string;
  replaySummary: string;
  scenarioSummary: string;
  schemaSummary: string;
  integritySummary: string;
  driftSummary: string;
  promotionSummary: string;
  safetySummary: string;
}): LiveSnapshotParityReport {
  return {
    ...input,
    replayExpectationSummary: input.replayExpectationSummary ?? input.replaySummary,
    scenarioExpectationSummary: input.scenarioExpectationSummary ?? input.scenarioSummary,
    comparisonSummary: input.comparisonSummary ?? input.replaySummary,
    mismatchSummary: input.mismatchSummary ?? input.schemaSummary,
    provenanceSummary: input.provenanceSummary ?? input.snapshotSummary,
    quarantineSummary: input.quarantineSummary ?? input.promotionSummary,
  };
}
