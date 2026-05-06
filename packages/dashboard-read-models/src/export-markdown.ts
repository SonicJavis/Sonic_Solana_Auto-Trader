/**
 * packages/dashboard-read-models/src/export-markdown.ts
 *
 * Phase 18 — DashboardReadModelBundle Markdown export.
 *
 * Produces safe, deterministic Markdown for human review.
 * No stack traces, no secrets, no keys, no URLs, no trading instructions.
 * Includes mandatory safety footer.
 */

import type { DashboardReadModelBundle } from './types.js';

const SAFETY_FOOTER =
  '> ⚠️ SAFETY NOTICE: This report is fixture-only, analysis-only, non-executable, and read-only. ' +
  'It does not recommend or enable trading. ' +
  'It does not create real trade intents, execution plans, orders, or any actionable output. ' +
  'It cannot access live data, wallets, private keys, Solana RPC, provider APIs, or render UI. ' +
  'All data is synthetic fixture data only.';

/**
 * Exports a DashboardReadModelBundle as a safe, deterministic Markdown string.
 * Analysis-only — no trade signals, no action labels.
 */
export function exportDashboardReadModelMarkdown(bundle: DashboardReadModelBundle): string {
  const lines: string[] = [];

  lines.push('# Dashboard Read Model Report');
  lines.push('');
  lines.push(`**Bundle ID:** \`${bundle.bundleId}\``);
  lines.push(`**Total Findings:** ${bundle.overview.totalFindings}`);
  lines.push(`**Panels Available:** ${bundle.overview.panelsAvailable.join(', ')}`);
  lines.push(`**Safety Status:** ${bundle.overview.safetyStatus}`);
  lines.push('');

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|----------|-------|');
  const severities = ['info', 'warning', 'risk', 'failure', 'inconclusive'] as const;
  for (const sev of severities) {
    lines.push(`| ${sev} | ${bundle.overview.severityCounts[sev] ?? 0} |`);
  }
  lines.push('');

  // Replay panel
  lines.push('## Replay Panel');
  lines.push('');
  lines.push(bundle.replayPanel.summaryText);
  lines.push('');
  if (bundle.replayPanel.findings.length > 0) {
    lines.push('**Findings:**');
    lines.push('');
    for (const f of bundle.replayPanel.findings) {
      lines.push(`- [${f.severity}] **${f.title}**: ${f.description}`);
    }
    lines.push('');
  }

  // Strategy panel
  lines.push('## Strategy Panel');
  lines.push('');
  lines.push(bundle.strategyPanel.summaryText);
  lines.push('');
  if (bundle.strategyPanel.findings.length > 0) {
    lines.push('**Findings:**');
    lines.push('');
    for (const f of bundle.strategyPanel.findings) {
      lines.push(`- [${f.severity}] **${f.title}**: ${f.description}`);
    }
    lines.push('');
  }

  // Evaluation panel
  lines.push('## Evaluation Panel');
  lines.push('');
  lines.push(bundle.evaluationPanel.summaryText);
  lines.push('');
  if (bundle.evaluationPanel.findings.length > 0) {
    lines.push('**Findings:**');
    lines.push('');
    for (const f of bundle.evaluationPanel.findings) {
      lines.push(`- [${f.severity}] **${f.title}**: ${f.description}`);
    }
    lines.push('');
  }

  // Evidence panel
  lines.push('## Evidence Panel');
  lines.push('');
  lines.push(`**Evidence Ledger ID:** \`${bundle.evidencePanel.evidenceLedgerId}\``);
  lines.push('');
  lines.push(bundle.evidencePanel.summaryText);
  lines.push('');
  if (bundle.evidencePanel.findings.length > 0) {
    lines.push('**Findings:**');
    lines.push('');
    for (const f of bundle.evidencePanel.findings) {
      lines.push(`- [${f.severity}] **${f.title}**: ${f.description}`);
    }
    lines.push('');
  }

  // Safety panel
  lines.push('## Safety Panel');
  lines.push('');
  lines.push(bundle.safetyPanel.summaryText);
  lines.push('');
  lines.push(`**Safety Invariants Satisfied:** ${String(bundle.safetyPanel.safetyInvariantsSatisfied)}`);
  lines.push(`**Locked Capabilities (${bundle.safetyPanel.lockedCapabilityNames.length}):** all false`);
  lines.push('');

  // Safety flags
  lines.push('## Safety Flags');
  lines.push('');
  lines.push(`- fixtureOnly: ${String(bundle.fixtureOnly)}`);
  lines.push(`- liveData: ${String(bundle.liveData)}`);
  lines.push(`- safeToDisplay: ${String(bundle.safeToDisplay)}`);
  lines.push(`- analysisOnly: ${String(bundle.analysisOnly)}`);
  lines.push(`- nonExecutable: ${String(bundle.nonExecutable)}`);
  lines.push(`- readOnly: ${String(bundle.readOnly)}`);
  lines.push('');

  // Mandatory safety footer
  lines.push('---');
  lines.push('');
  lines.push(SAFETY_FOOTER);
  lines.push('');

  return lines.join('\n');
}
