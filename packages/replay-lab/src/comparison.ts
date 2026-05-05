import type { ReplayRun, ReplayComparison, RlResult } from './types.js';
import { validateReplayComparison } from './validation.js';

let comparisonCounter = 0;

function generateComparisonId(): string {
  return `cmp_${++comparisonCounter}_${Date.now()}`;
}

export function compareReplayRuns(
  baseline: ReplayRun,
  candidate: ReplayRun,
): RlResult<ReplayComparison> {
  const scoreDelta = candidate.summary.finalRiskScore - baseline.summary.finalRiskScore;
  const confidenceDelta =
    candidate.summary.averageConfidence - baseline.summary.averageConfidence;
  const verdictChanged = baseline.summary.finalVerdict !== candidate.summary.finalVerdict;

  const summaryParts: string[] = [];
  if (Math.abs(scoreDelta) > 0.01) {
    summaryParts.push(
      `risk score ${scoreDelta > 0 ? 'increased' : 'decreased'} by ${Math.abs(scoreDelta).toFixed(3)}`,
    );
  }
  if (Math.abs(confidenceDelta) > 0.01) {
    summaryParts.push(
      `confidence ${confidenceDelta > 0 ? 'increased' : 'decreased'} by ${Math.abs(confidenceDelta).toFixed(3)}`,
    );
  }
  if (verdictChanged) {
    summaryParts.push(
      `verdict changed from ${baseline.summary.finalVerdict} to ${candidate.summary.finalVerdict}`,
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push('no significant changes detected');
  }

  const comparison: ReplayComparison = {
    comparisonId: generateComparisonId(),
    baselineRunId: baseline.runId,
    candidateRunId: candidate.runId,
    scoreDelta: Math.round(scoreDelta * 1000) / 1000,
    confidenceDelta: Math.round(confidenceDelta * 1000) / 1000,
    verdictChanged,
    summary: summaryParts.join('; '),
    safeToDisplay: true,
  };

  return validateReplayComparison(comparison);
}
