/**
 * packages/evidence-ledger/src/export-markdown.ts
 *
 * Phase 17 — EvidenceLedger Markdown export.
 *
 * Produces safe, deterministic Markdown for human review.
 * No stack traces, no secrets, no keys, no URLs, no trading instructions.
 * Includes mandatory safety footer.
 */

import type { EvidenceLedger } from './types.js';

const SAFETY_FOOTER =
  '> ⚠️ SAFETY NOTICE: This report is fixture-only, analysis-only, non-executable, and append-only. ' +
  'It does not recommend or enable trading. ' +
  'It does not create real trade intents, execution plans, orders, or any actionable output. ' +
  'Prior evidence cannot be mutated.';

/**
 * Exports an EvidenceLedger as a safe, deterministic Markdown string.
 * Analysis-only — no trade signals, no action labels.
 */
export function exportEvidenceLedgerMarkdown(ledger: EvidenceLedger): string {
  const lines: string[] = [];

  lines.push('# Evidence Ledger Report');
  lines.push('');
  lines.push(`**Ledger ID:** \`${ledger.id}\``);
  lines.push(`**Traces:** ${ledger.traces.length}`);
  lines.push(`**Top-Level Entries:** ${ledger.entries.length}`);
  lines.push(`**Overall Classification:** ${ledger.summary.classification}`);
  lines.push('');

  // Summary section
  lines.push('## Ledger Summary');
  lines.push('');
  lines.push(ledger.summary.summaryText);
  lines.push('');
  lines.push(`- Total Entries: ${ledger.summary.totalEntries}`);
  lines.push(`- Total Steps: ${ledger.summary.totalSteps}`);
  lines.push(`- Blocked Reason Count: ${ledger.summary.blockedReasonCount}`);
  lines.push(`- Warning Reason Count: ${ledger.summary.warningReasonCount}`);
  lines.push(`- Inconclusive Reason Count: ${ledger.summary.inconclusiveReasonCount}`);
  lines.push('');

  // Severity counts
  lines.push('**Severity Counts:**');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|----------|-------|');
  const severities = ['info', 'warning', 'risk', 'failure', 'inconclusive'] as const;
  for (const sev of severities) {
    lines.push(`| ${sev} | ${ledger.summary.severityCounts[sev] ?? 0} |`);
  }
  lines.push('');

  // Source kind counts
  lines.push('**Source Kind Counts:**');
  lines.push('');
  lines.push('| Source Kind | Count |');
  lines.push('|-------------|-------|');
  const sourceKinds = ['replay_run', 'replay_report', 'strategy_intent', 'strategy_evaluation', 'fixture_only_source'] as const;
  for (const sk of sourceKinds) {
    lines.push(`| ${sk} | ${ledger.summary.sourceKindCounts[sk] ?? 0} |`);
  }
  lines.push('');

  // Integrity check
  lines.push('## Integrity Check');
  lines.push('');
  lines.push(`**Valid:** ${String(ledger.integrity.valid)}`);
  lines.push('');
  lines.push(ledger.integrity.summaryText);
  lines.push('');
  if (ledger.integrity.duplicateIds.length > 0) {
    lines.push(`- Duplicate IDs: ${ledger.integrity.duplicateIds.join(', ')}`);
  }
  if (ledger.integrity.liveDataViolations.length > 0) {
    lines.push(`- Live Data Violations: ${ledger.integrity.liveDataViolations.join(', ')}`);
  }
  lines.push('');

  // Decision Traces
  if (ledger.traces.length > 0) {
    lines.push('## Decision Traces');
    lines.push('');
    for (const trace of ledger.traces) {
      lines.push(`### Trace: \`${trace.id}\``);
      lines.push('');
      lines.push(`**Classification:** ${trace.classification}`);
      lines.push(`**Steps:** ${trace.steps.length}`);
      lines.push(`**Entries:** ${trace.entries.length}`);
      lines.push('');
      lines.push(trace.summary);
      lines.push('');

      if (trace.entries.length > 0) {
        lines.push('**Evidence Entries:**');
        lines.push('');
        for (const entry of trace.entries) {
          lines.push(`#### Entry: \`${entry.id}\``);
          lines.push('');
          lines.push(`- **Kind:** ${entry.kind}`);
          lines.push(`- **Severity:** ${entry.severity}`);
          lines.push(`- **Title:** ${entry.title}`);
          lines.push(`- **Summary:** ${entry.summary}`);
          lines.push(`- **Source:** ${entry.sourceRef.label} (${entry.sourceRef.sourceKind})`);
          if (entry.reasons.length > 0) {
            lines.push(`- **Reasons:**`);
            for (const reason of entry.reasons) {
              lines.push(`  - ${reason}`);
            }
          }
          lines.push('');
        }
      }
    }
  }

  // Top-level entries
  if (ledger.entries.length > 0) {
    lines.push('## Top-Level Evidence Entries');
    lines.push('');
    for (const entry of ledger.entries) {
      lines.push(`### Entry: \`${entry.id}\``);
      lines.push('');
      lines.push(`- **Kind:** ${entry.kind}`);
      lines.push(`- **Severity:** ${entry.severity}`);
      lines.push(`- **Title:** ${entry.title}`);
      lines.push(`- **Summary:** ${entry.summary}`);
      lines.push(`- **Source:** ${entry.sourceRef.label} (${entry.sourceRef.sourceKind})`);
      lines.push('');
    }
  }

  // Safety flags
  lines.push('## Safety Flags');
  lines.push('');
  lines.push(`- fixtureOnly: ${String(ledger.fixtureOnly)}`);
  lines.push(`- liveData: ${String(ledger.liveData)}`);
  lines.push(`- safeToDisplay: ${String(ledger.safeToDisplay)}`);
  lines.push(`- analysisOnly: ${String(ledger.analysisOnly)}`);
  lines.push(`- nonExecutable: ${String(ledger.nonExecutable)}`);
  lines.push(`- appendOnly: ${String(ledger.appendOnly)}`);
  lines.push('');

  // Mandatory safety footer
  lines.push('---');
  lines.push('');
  lines.push(SAFETY_FOOTER);
  lines.push('');

  return lines.join('\n');
}
