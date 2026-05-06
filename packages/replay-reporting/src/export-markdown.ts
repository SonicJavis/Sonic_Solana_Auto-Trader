/**
 * packages/replay-reporting/src/export-markdown.ts
 *
 * exportReplayReportMarkdown — deterministic safe Markdown export.
 *
 * Rules:
 *   - no raw stack traces
 *   - no secrets, private keys, seed phrases, RPC URLs, API keys
 *   - no trading instructions
 *   - no action recommendations
 *   - deterministic output for same input
 */

import type {
  ReplayRunReport,
  ReplayComparisonReport,
  ReplayScenarioIndex,
  ReplayDiagnostics,
} from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';
import { isDisplaySafe } from './validation.js';

const SAFETY_FOOTER = [
  '',
  '---',
  '',
  '> **Safety note:** This report is a fixture-only analysis aid.',
  '> It does not recommend, enable, or imply any trading action.',
  '> No live data, no execution, no wallet access.',
  '',
].join('\n');

function sanitizeLine(line: string): string {
  // If any line contains secret-like or unsafe content, redact it
  if (!isDisplaySafe(line)) return '[REDACTED — unsafe content]';
  return line;
}

export function exportRunReportMarkdown(report: ReplayRunReport): RrResult<string> {
  if (report.fixtureOnly !== true)
    return rrErr('FIXTURE_ONLY_REQUIRED', 'report.fixtureOnly must be true');
  if (report.liveData !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'report.liveData must be false');
  if (report.safeToDisplay !== true)
    return rrErr('UNSAFE_REPORT_OUTPUT', 'report.safeToDisplay must be true');

  const lines: string[] = [
    `# Replay Run Report`,
    '',
    `**Report ID:** ${report.reportId}`,
    `**Run ID:** ${report.runId}`,
    `**Scenario ID:** ${report.scenarioId}`,
    `**Final Verdict:** ${report.finalVerdict}`,
    `**Final Risk Score:** ${report.finalRiskScore.toFixed(4)}`,
    `**Average Confidence:** ${report.averageConfidence.toFixed(4)}`,
    `**Step Count:** ${report.stepCount}`,
    `**Warning Count:** ${report.warningCount}`,
    `**Failure Count:** ${report.failureCount}`,
    `**Degraded Count:** ${report.degradedCount}`,
    `**Inconclusive Count:** ${report.inconclusiveCount}`,
    '',
    `## Summary`,
    '',
    sanitizeLine(report.summaryText),
    '',
    `## Step Details`,
    '',
    '| Seq | Step ID | Verdict | Warnings | Risk Score | Confidence |',
    '|-----|---------|---------|----------|------------|------------|',
    ...report.stepRows.map(row =>
      `| ${row.sequence} | ${row.stepId} | ${row.stepVerdict} | ${row.warningCount} | ${row.riskScore !== null ? row.riskScore.toFixed(4) : 'N/A'} | ${row.confidence !== null ? row.confidence.toFixed(4) : 'N/A'} |`,
    ),
    '',
    `## Fixture-Only Metadata`,
    '',
    `- fixtureOnly: true`,
    `- liveData: false`,
    `- safeToDisplay: true`,
  ];

  return rrOk(lines.map(sanitizeLine).join('\n') + SAFETY_FOOTER);
}

export function exportComparisonReportMarkdown(report: ReplayComparisonReport): RrResult<string> {
  if (report.fixtureOnly !== true)
    return rrErr('FIXTURE_ONLY_REQUIRED', 'report.fixtureOnly must be true');
  if (report.liveData !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'report.liveData must be false');
  if (report.safeToDisplay !== true)
    return rrErr('UNSAFE_REPORT_OUTPUT', 'report.safeToDisplay must be true');

  const lines: string[] = [
    `# Replay Comparison Report`,
    '',
    `**Report ID:** ${report.comparisonReportId}`,
    `**Baseline Run ID:** ${report.baselineRunId}`,
    `**Candidate Run ID:** ${report.candidateRunId}`,
    `**Verdict Changed:** ${report.verdictChanged}`,
    `**Score Delta:** ${report.scoreDelta.toFixed(4)}`,
    `**Confidence Delta:** ${report.confidenceDelta.toFixed(4)}`,
    `**Regression:** ${report.regression}`,
    '',
    `## Summary`,
    '',
    sanitizeLine(report.summaryText),
    '',
    `## Diagnostic Findings`,
    '',
    '| Severity | Code | Message |',
    '|----------|------|---------|',
    ...report.diagnosticFindings.map(
      f => `| ${f.severity} | ${f.code} | ${sanitizeLine(f.message)} |`,
    ),
    '',
    `## Fixture-Only Metadata`,
    '',
    `- fixtureOnly: true`,
    `- liveData: false`,
    `- safeToDisplay: true`,
  ];

  return rrOk(lines.map(sanitizeLine).join('\n') + SAFETY_FOOTER);
}

export function exportScenarioIndexMarkdown(index: ReplayScenarioIndex): RrResult<string> {
  if (index.fixtureOnly !== true)
    return rrErr('FIXTURE_ONLY_REQUIRED', 'index.fixtureOnly must be true');
  if (index.liveData !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'index.liveData must be false');
  if (index.safeToDisplay !== true)
    return rrErr('UNSAFE_REPORT_OUTPUT', 'index.safeToDisplay must be true');

  const lines: string[] = [
    `# Replay Scenario Index`,
    '',
    `**Scenario Count:** ${index.scenarioCount}`,
    `**Total Step Count:** ${index.totalStepCount}`,
    `**Unique Step Types:** ${index.uniqueStepTypes.join(', ')}`,
    '',
    `## Verdict Distribution`,
    '',
    '| Verdict | Count |',
    '|---------|-------|',
    ...Object.entries(index.verdictCounts).map(([v, c]) => `| ${v} | ${c} |`),
    '',
    `## Scenarios`,
    '',
    '| ID | Display Name | Expected Outcome | Steps |',
    '|----|-------------|-----------------|-------|',
    ...index.entries.map(
      e =>
        `| ${e.scenarioId} | ${sanitizeLine(e.displayName)} | ${e.expectedOutcome} | ${e.stepCount} |`,
    ),
    '',
    `## Fixture-Only Metadata`,
    '',
    `- fixtureOnly: true`,
    `- liveData: false`,
    `- safeToDisplay: true`,
  ];

  return rrOk(lines.map(sanitizeLine).join('\n') + SAFETY_FOOTER);
}

export function exportDiagnosticsMarkdown(diagnostics: ReplayDiagnostics): RrResult<string> {
  if (diagnostics.fixtureOnly !== true)
    return rrErr('FIXTURE_ONLY_REQUIRED', 'diagnostics.fixtureOnly must be true');
  if (diagnostics.liveData !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'diagnostics.liveData must be false');
  if (diagnostics.safeToDisplay !== true)
    return rrErr('UNSAFE_REPORT_OUTPUT', 'diagnostics.safeToDisplay must be true');

  const lines: string[] = [
    `# Replay Diagnostics`,
    '',
    `**Diagnostics ID:** ${diagnostics.diagnosticsId}`,
    `**Source Run ID:** ${diagnostics.sourceRunId}`,
    `**Finding Count:** ${diagnostics.findingCount}`,
    '',
    `## Severity Counts`,
    '',
    '| Severity | Count |',
    '|----------|-------|',
    ...Object.entries(diagnostics.severityCounts).map(([s, c]) => `| ${s} | ${c} |`),
    '',
    `## Findings`,
    '',
    '| Severity | Code | Step | Message |',
    '|----------|------|------|---------|',
    ...diagnostics.findings.map(
      f =>
        `| ${f.severity} | ${f.code} | ${f.stepId ?? 'N/A'} | ${sanitizeLine(f.message)} |`,
    ),
    '',
    `## Summary`,
    '',
    sanitizeLine(diagnostics.summaryText),
    '',
    `## Fixture-Only Metadata`,
    '',
    `- fixtureOnly: true`,
    `- liveData: false`,
    `- safeToDisplay: true`,
  ];

  return rrOk(lines.map(sanitizeLine).join('\n') + SAFETY_FOOTER);
}

/** Generic Markdown export dispatcher — accepts any safe report type */
export function exportReplayReportMarkdown(
  report: ReplayRunReport | ReplayComparisonReport | ReplayScenarioIndex | ReplayDiagnostics,
): RrResult<string> {
  if ('reportId' in report && 'stepRows' in report) {
    return exportRunReportMarkdown(report as ReplayRunReport);
  }
  if ('comparisonReportId' in report) {
    return exportComparisonReportMarkdown(report as ReplayComparisonReport);
  }
  if ('scenarioCount' in report) {
    return exportScenarioIndexMarkdown(report as ReplayScenarioIndex);
  }
  if ('diagnosticsId' in report) {
    return exportDiagnosticsMarkdown(report as ReplayDiagnostics);
  }
  return rrErr('EXPORT_UNSAFE', 'Unknown report type — cannot export to Markdown');
}
