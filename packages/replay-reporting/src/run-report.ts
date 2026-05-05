/**
 * packages/replay-reporting/src/run-report.ts
 *
 * buildReplayRunReport — converts a ReplayRun into a safe ReplayRunReport.
 *
 * Rules:
 *   - input must have fixtureOnly=true, liveData=false, safeToDisplay=true
 *   - output is read-only, evidence-review only
 *   - no trading instructions, no execution plans
 */

import type { ReplayRun, ReplayVerdict } from '@sonic/replay-lab';
import type { ReplayRunReport, ReplayStepReportRow } from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';

let reportCounter = 0;

function generateReportId(runId: string): string {
  return `rpt_${runId}_${++reportCounter}`;
}

function verdictToSummaryLabel(verdict: ReplayVerdict): string {
  switch (verdict) {
    case 'passed':
      return 'All steps passed';
    case 'failed':
      return 'One or more steps failed (manipulation or critical risk detected)';
    case 'degraded':
      return 'One or more steps degraded (elevated risk flags present)';
    case 'inconclusive':
      return 'Insufficient fixture data to determine outcome';
    case 'fixture_only':
      return 'Fixture-only analysis completed';
    default:
      return 'Analysis completed';
  }
}

export function buildReplayRunReport(run: ReplayRun): RrResult<ReplayRunReport> {
  if (!run || !run.runId || run.runId.trim() === '') {
    return rrErr('INVALID_REPORT_INPUT', 'runId must be non-empty');
  }
  if (run.fixtureOnly !== true) {
    return rrErr('FIXTURE_ONLY_REQUIRED', 'run.fixtureOnly must be true');
  }
  if (run.liveData !== false) {
    return rrErr('LIVE_DATA_FORBIDDEN', 'run.liveData must be false');
  }
  if (run.safeToDisplay !== true) {
    return rrErr('UNSAFE_REPORT_OUTPUT', 'run.safeToDisplay must be true');
  }

  const stepRows: ReplayStepReportRow[] = run.stepResults.map(sr => {
    const riskScore =
      sr.riskSummary?.riskScore ??
      sr.tokenSummary?.riskScore ??
      sr.manipulationSummary?.riskScore ??
      sr.creatorSummary?.riskScore ??
      sr.walletSummary?.riskScore ??
      null;

    const confidence =
      sr.riskSummary?.confidence ??
      sr.tokenSummary?.confidence ??
      sr.manipulationSummary?.confidence ??
      sr.creatorSummary?.confidence ??
      sr.walletSummary?.confidence ??
      null;

    return {
      stepId: sr.stepId,
      sequence: sr.sequence,
      stepVerdict: sr.verdict,
      warningCount: sr.warnings.length,
      warnings: sr.warnings,
      riskScore: riskScore !== undefined ? riskScore : null,
      confidence: confidence !== undefined ? confidence : null,
      safeToDisplay: true,
    };
  });

  const warningCount = stepRows.reduce((acc, r) => acc + r.warningCount, 0);
  const failureCount = stepRows.filter(r => r.stepVerdict === 'failed').length;
  const degradedCount = stepRows.filter(r => r.stepVerdict === 'degraded').length;
  const inconclusiveCount = stepRows.filter(r => r.stepVerdict === 'inconclusive').length;

  const summaryParts: string[] = [verdictToSummaryLabel(run.summary.finalVerdict)];
  if (warningCount > 0) summaryParts.push(`${warningCount} warning(s) recorded`);
  if (run.summary.reasons.length > 0) {
    summaryParts.push(`Reasons: ${run.summary.reasons.join(', ')}`);
  }
  const summaryText = summaryParts.join('. ') + '.';

  const report: ReplayRunReport = {
    reportId: generateReportId(run.runId),
    runId: run.runId,
    scenarioId: run.scenarioId,
    finalVerdict: run.summary.finalVerdict,
    finalRiskScore: run.summary.finalRiskScore,
    averageConfidence: run.summary.averageConfidence,
    stepCount: run.stepResults.length,
    stepRows,
    warningCount,
    failureCount,
    degradedCount,
    inconclusiveCount,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return rrOk(report);
}
