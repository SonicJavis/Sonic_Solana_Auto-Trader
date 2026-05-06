/**
 * packages/replay-reporting/src/comparison-report.ts
 *
 * buildReplayComparisonReport — converts a ReplayComparison into a safe
 * ReplayComparisonReport with regression detection and diagnostic findings.
 *
 * Rules:
 *   - read-only, evidence-review only
 *   - no trading instructions, no execution plans, no live data
 */

import type { ReplayComparison } from '@sonic/replay-lab';
import type { ReplayComparisonReport, ReplayDiagnosticFinding } from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';

let comparisonReportCounter = 0;

function generateComparisonReportId(comparisonId: string): string {
  return `crpt_${comparisonId}_${++comparisonReportCounter}`;
}

const REGRESSION_THRESHOLD = 0.05;

export function buildReplayComparisonReport(
  comparison: ReplayComparison,
): RrResult<ReplayComparisonReport> {
  if (!comparison || !comparison.comparisonId || comparison.comparisonId.trim() === '') {
    return rrErr('INVALID_COMPARISON_INPUT', 'comparisonId must be non-empty');
  }
  if (!comparison.baselineRunId || comparison.baselineRunId.trim() === '') {
    return rrErr('INVALID_COMPARISON_INPUT', 'baselineRunId must be non-empty');
  }
  if (!comparison.candidateRunId || comparison.candidateRunId.trim() === '') {
    return rrErr('INVALID_COMPARISON_INPUT', 'candidateRunId must be non-empty');
  }
  if (comparison.safeToDisplay !== true) {
    return rrErr('UNSAFE_REPORT_OUTPUT', 'comparison.safeToDisplay must be true');
  }

  const regression = comparison.scoreDelta > REGRESSION_THRESHOLD;

  const findings: ReplayDiagnosticFinding[] = [];

  if (comparison.verdictChanged) {
    findings.push({
      severity: 'warning',
      code: 'VERDICT_CHANGED',
      message: `Verdict changed between baseline and candidate runs. ${comparison.summary}`,
      safeToDisplay: true,
    });
  }

  if (regression) {
    findings.push({
      severity: 'risk',
      code: 'RISK_SCORE_REGRESSION',
      message: `Candidate risk score regressed by ${comparison.scoreDelta.toFixed(3)} compared to baseline`,
      safeToDisplay: true,
    });
  }

  if (Math.abs(comparison.confidenceDelta) > 0.1) {
    findings.push({
      severity: 'info',
      code: 'CONFIDENCE_SHIFT',
      message: `Confidence shifted by ${comparison.confidenceDelta.toFixed(3)}`,
      safeToDisplay: true,
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: 'info',
      code: 'NO_SIGNIFICANT_CHANGE',
      message: 'No significant changes detected between baseline and candidate',
      safeToDisplay: true,
    });
  }

  const summaryParts: string[] = [comparison.summary];
  if (regression) summaryParts.push('Regression detected in candidate run');
  const summaryText = summaryParts.join('. ') + '.';

  const report: ReplayComparisonReport = {
    comparisonReportId: generateComparisonReportId(comparison.comparisonId),
    baselineRunId: comparison.baselineRunId,
    candidateRunId: comparison.candidateRunId,
    verdictChanged: comparison.verdictChanged,
    scoreDelta: comparison.scoreDelta,
    confidenceDelta: comparison.confidenceDelta,
    regression,
    summaryText,
    diagnosticFindings: findings,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return rrOk(report);
}
