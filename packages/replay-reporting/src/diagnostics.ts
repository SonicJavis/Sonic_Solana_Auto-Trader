/**
 * packages/replay-reporting/src/diagnostics.ts
 *
 * buildReplayDiagnostics — produces ReplayDiagnostics from a ReplayRun or
 * ReplayRunReport.
 *
 * Rules:
 *   - read-only, evidence-review only
 *   - no trading instructions, no execution plans, no live data
 */

import type { ReplayRun } from '@sonic/replay-lab';
import type {
  ReplayRunReport,
  ReplayDiagnostics,
  ReplayDiagnosticFinding,
  ReplayDiagnosticSeverity,
} from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';

let diagnosticsCounter = 0;

function generateDiagnosticsId(sourceId: string): string {
  return `diag_${sourceId}_${++diagnosticsCounter}`;
}

type DiagnosticsSource = ReplayRun | ReplayRunReport;

function isReplayRunReport(source: DiagnosticsSource): source is ReplayRunReport {
  return 'reportId' in source && 'stepRows' in source;
}

function emptySeverityCounts(): Record<ReplayDiagnosticSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

export function buildReplayDiagnostics(source: DiagnosticsSource): RrResult<ReplayDiagnostics> {
  if (!source) {
    return rrErr('INVALID_REPORT_INPUT', 'source must be provided');
  }
  if (source.fixtureOnly !== true) {
    return rrErr('FIXTURE_ONLY_REQUIRED', 'source.fixtureOnly must be true');
  }
  if (source.liveData !== false) {
    return rrErr('LIVE_DATA_FORBIDDEN', 'source.liveData must be false');
  }
  if (source.safeToDisplay !== true) {
    return rrErr('UNSAFE_REPORT_OUTPUT', 'source.safeToDisplay must be true');
  }

  const findings: ReplayDiagnosticFinding[] = [];
  const degradedReasons: string[] = [];
  const failedReasons: string[] = [];
  const inconclusiveReasons: string[] = [];
  const missingFixtureDataNotes: string[] = [];

  let sourceRunId: string;
  let finalVerdict: string;
  let warnings: readonly string[];

  if (isReplayRunReport(source)) {
    sourceRunId = source.runId;
    finalVerdict = source.finalVerdict;
    warnings = [];

    // Analyse step rows
    for (const row of source.stepRows) {
      if (row.stepVerdict === 'failed') {
        failedReasons.push(`step ${row.stepId}: failed`);
        findings.push({
          severity: 'failure',
          code: 'STEP_FAILED',
          message: `Step ${row.stepId} (seq ${row.sequence}) failed`,
          stepId: row.stepId,
          safeToDisplay: true,
        });
      } else if (row.stepVerdict === 'degraded') {
        degradedReasons.push(`step ${row.stepId}: degraded`);
        findings.push({
          severity: 'risk',
          code: 'STEP_DEGRADED',
          message: `Step ${row.stepId} (seq ${row.sequence}) degraded`,
          stepId: row.stepId,
          safeToDisplay: true,
        });
      } else if (row.stepVerdict === 'inconclusive') {
        inconclusiveReasons.push(`step ${row.stepId}: inconclusive`);
        missingFixtureDataNotes.push(`step ${row.stepId}: missing fixture data`);
        findings.push({
          severity: 'inconclusive',
          code: 'STEP_INCONCLUSIVE',
          message: `Step ${row.stepId} (seq ${row.sequence}) inconclusive — missing fixture data`,
          stepId: row.stepId,
          safeToDisplay: true,
        });
      }
      if (row.warnings.length > 0) {
        for (const w of row.warnings) {
          findings.push({
            severity: 'warning',
            code: 'STEP_WARNING',
            message: `Step ${row.stepId} warning: ${w}`,
            stepId: row.stepId,
            safeToDisplay: true,
          });
        }
      }
    }
  } else {
    // ReplayRun
    const run = source as ReplayRun;
    sourceRunId = run.runId;
    finalVerdict = run.summary.finalVerdict;
    warnings = run.summary.warnings;

    for (const sr of run.stepResults) {
      if (sr.verdict === 'failed') {
        failedReasons.push(`step ${sr.stepId}: failed`);
        findings.push({
          severity: 'failure',
          code: 'STEP_FAILED',
          message: `Step ${sr.stepId} (seq ${sr.sequence}) failed`,
          stepId: sr.stepId,
          safeToDisplay: true,
        });
      } else if (sr.verdict === 'degraded') {
        degradedReasons.push(`step ${sr.stepId}: degraded`);
        findings.push({
          severity: 'risk',
          code: 'STEP_DEGRADED',
          message: `Step ${sr.stepId} (seq ${sr.sequence}) degraded`,
          stepId: sr.stepId,
          safeToDisplay: true,
        });
      } else if (sr.verdict === 'inconclusive') {
        inconclusiveReasons.push(`step ${sr.stepId}: inconclusive`);
        missingFixtureDataNotes.push(`step ${sr.stepId}: missing fixture data`);
        findings.push({
          severity: 'inconclusive',
          code: 'STEP_INCONCLUSIVE',
          message: `Step ${sr.stepId} (seq ${sr.sequence}) inconclusive — missing fixture data`,
          stepId: sr.stepId,
          safeToDisplay: true,
        });
      }
      for (const w of sr.warnings) {
        findings.push({
          severity: 'warning',
          code: 'STEP_WARNING',
          message: `Step ${sr.stepId} warning: ${w}`,
          stepId: sr.stepId,
          safeToDisplay: true,
        });
      }
    }

    for (const w of warnings) {
      findings.push({
        severity: 'warning',
        code: 'RUN_WARNING',
        message: `Run-level warning: ${w}`,
        safeToDisplay: true,
      });
    }

    for (const r of run.summary.reasons) {
      findings.push({
        severity: 'info',
        code: 'RUN_REASON',
        message: `Run reason: ${r}`,
        safeToDisplay: true,
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      severity: 'info',
      code: 'ALL_STEPS_CLEAN',
      message: 'All steps completed without degradation, failure, or inconclusive results',
      safeToDisplay: true,
    });
  }

  const severityCounts = emptySeverityCounts();
  for (const f of findings) {
    severityCounts[f.severity] = (severityCounts[f.severity] ?? 0) + 1;
  }

  const summaryParts: string[] = [`Final verdict: ${finalVerdict}`];
  summaryParts.push(`${findings.length} diagnostic finding(s)`);
  if (failedReasons.length > 0) summaryParts.push(`${failedReasons.length} failure(s)`);
  if (degradedReasons.length > 0) summaryParts.push(`${degradedReasons.length} degradation(s)`);
  if (inconclusiveReasons.length > 0)
    summaryParts.push(`${inconclusiveReasons.length} inconclusive step(s)`);
  const summaryText = summaryParts.join('. ') + '.';

  const diagnostics: ReplayDiagnostics = {
    diagnosticsId: generateDiagnosticsId(sourceRunId),
    sourceRunId,
    findingCount: findings.length,
    severityCounts,
    findings,
    degradedReasons,
    failedReasons,
    inconclusiveReasons,
    missingFixtureDataNotes,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return rrOk(diagnostics);
}
