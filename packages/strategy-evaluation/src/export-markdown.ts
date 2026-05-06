/**
 * packages/strategy-evaluation/src/export-markdown.ts
 *
 * Phase 16 — Strategy evaluation Markdown export.
 *
 * Produces safe, deterministic Markdown for human review.
 * No stack traces, no secrets, no keys, no URLs, no trading instructions.
 * Includes mandatory safety footer.
 */

import type { StrategyEvaluation } from './types.js';

const SAFETY_FOOTER =
  '> ⚠️ SAFETY NOTICE: This report is fixture-only, analysis-only, and non-executable. ' +
  'It does not recommend or enable trading. ' +
  'It does not create real trade intents or execution plans.';

/**
 * Exports a StrategyEvaluation as a safe, deterministic Markdown string.
 * Analysis-only — no trade signals, no action labels.
 */
export function exportStrategyEvaluationMarkdown(evaluation: StrategyEvaluation): string {
  const lines: string[] = [];

  lines.push('# Strategy Evaluation Report');
  lines.push('');
  lines.push(`**Evaluation ID:** \`${evaluation.id}\``);
  lines.push(`**Source Kind:** ${evaluation.sourceKind}`);
  lines.push(`**Intent Count:** ${evaluation.intentCount}`);
  lines.push(`**Classification:** ${evaluation.classification}`);
  lines.push('');

  // Score band summary
  lines.push('## Score Band Summary');
  lines.push('');
  lines.push(evaluation.scoreBandSummary.summaryText);
  lines.push('');
  lines.push('| Band | Count |');
  lines.push('|------|-------|');
  lines.push(`| Excellent | ${evaluation.scoreBandSummary.excellent} |`);
  lines.push(`| Strong | ${evaluation.scoreBandSummary.strong} |`);
  lines.push(`| Moderate | ${evaluation.scoreBandSummary.moderate} |`);
  lines.push(`| Weak | ${evaluation.scoreBandSummary.weak} |`);
  lines.push(`| Degraded | ${evaluation.scoreBandSummary.degraded} |`);
  lines.push(`| Failed | ${evaluation.scoreBandSummary.failed} |`);
  lines.push(`| Inconclusive | ${evaluation.scoreBandSummary.inconclusive} |`);
  lines.push(`| **Total** | **${evaluation.scoreBandSummary.total}** |`);
  lines.push('');

  // Evidence distribution
  lines.push('## Evidence Distribution');
  lines.push('');
  lines.push(evaluation.evidenceDistribution.summaryText);
  lines.push('');

  const classificationEntries = Object.entries(evaluation.evidenceDistribution.classificationCounts).sort();
  if (classificationEntries.length > 0) {
    lines.push('**Classification counts:**');
    for (const [cls, count] of classificationEntries) {
      lines.push(`- ${cls}: ${count}`);
    }
    lines.push('');
  }

  const familyEntries = Object.entries(evaluation.evidenceDistribution.familyCounts).sort();
  if (familyEntries.length > 0) {
    lines.push('**Family counts:**');
    for (const [fam, count] of familyEntries) {
      lines.push(`- ${fam}: ${count}`);
    }
    lines.push('');
  }

  // Safety gate summary
  lines.push('## Safety Gate Summary');
  lines.push('');
  lines.push(evaluation.safetyGateSummary.summaryText);
  lines.push('');
  lines.push(`- Passed: ${evaluation.safetyGateSummary.passed}`);
  lines.push(`- Warning: ${evaluation.safetyGateSummary.warning}`);
  lines.push(`- Blocked: ${evaluation.safetyGateSummary.blocked}`);
  lines.push(`- Inconclusive: ${evaluation.safetyGateSummary.inconclusive}`);
  if (evaluation.safetyGateSummary.mostCommonBlockedGateIds.length > 0) {
    lines.push(`- Most common blocked gates: ${evaluation.safetyGateSummary.mostCommonBlockedGateIds.join(', ')}`);
  }
  lines.push('');

  // Family comparisons
  if (evaluation.familyComparisons.length > 0) {
    lines.push('## Strategy Family Comparisons');
    lines.push('');
    for (const fc of evaluation.familyComparisons) {
      lines.push(`### ${fc.familyName}`);
      lines.push('');
      lines.push(fc.summaryText);
      lines.push('');
    }
  }

  // Findings
  if (evaluation.findings.length > 0) {
    lines.push('## Findings');
    lines.push('');
    for (const finding of evaluation.findings) {
      lines.push(`- **[${finding.severity.toUpperCase()}]** \`${finding.code}\`: ${finding.message}`);
    }
    lines.push('');
  }

  // Safety flags
  lines.push('## Safety Flags');
  lines.push('');
  lines.push(`- fixtureOnly: ${String(evaluation.fixtureOnly)}`);
  lines.push(`- liveData: ${String(evaluation.liveData)}`);
  lines.push(`- safeToDisplay: ${String(evaluation.safeToDisplay)}`);
  lines.push(`- analysisOnly: ${String(evaluation.analysisOnly)}`);
  lines.push(`- nonExecutable: ${String(evaluation.nonExecutable)}`);
  lines.push('');

  // Mandatory safety footer
  lines.push('---');
  lines.push('');
  lines.push(SAFETY_FOOTER);
  lines.push('');

  return lines.join('\n');
}
