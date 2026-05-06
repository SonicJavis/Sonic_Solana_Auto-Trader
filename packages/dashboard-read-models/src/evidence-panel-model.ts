/**
 * packages/dashboard-read-models/src/evidence-panel-model.ts
 *
 * Phase 18 — DashboardEvidencePanelModel builder.
 *
 * Shapes Evidence Ledger / Decision Trace fixture evidence into read-only panel data.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardEvidencePanelModel,
  DashboardReadModelInput,
  DashboardReadModelSeverity,
} from './types.js';
import { validateDashboardReadModelInput } from './validation.js';

function zeroCounts(): Record<DashboardReadModelSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

/**
 * Builds a safe DashboardEvidencePanelModel from a DashboardReadModelInput.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildEvidencePanelModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardEvidencePanelModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const findings = input.findings ?? [];
  const counts = zeroCounts();
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] ?? 0) + 1;
  }

  const ledgerId = input.evidenceLedgerId ?? `no_ledger_${input.inputId}`;

  const summaryText =
    `Evidence panel: ${findings.length} finding(s) from fixture-only evidence ledger data ` +
    `(ledger: ${ledgerId}). ` +
    'Analysis-only, non-executable, read-only. No live data. Prior evidence not mutated.';

  return drmOk({
    panelId: `evidence_panel_${input.inputId}`,
    panelKind: 'evidence_panel',
    findings,
    totalFindings: findings.length,
    severityCounts: counts,
    summaryText,
    evidenceLedgerId: ledgerId,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  });
}
