/**
 * packages/dashboard-read-models/src/evaluation-panel-model.ts
 *
 * Phase 18 — DashboardEvaluationPanelModel builder.
 *
 * Shapes Strategy Evaluation fixture evidence into read-only panel data.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardEvaluationPanelModel,
  DashboardReadModelInput,
  DashboardReadModelSeverity,
} from './types.js';
import { validateDashboardReadModelInput } from './validation.js';

function zeroCounts(): Record<DashboardReadModelSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

/**
 * Builds a safe DashboardEvaluationPanelModel from a DashboardReadModelInput.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildEvaluationPanelModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardEvaluationPanelModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const findings = input.findings ?? [];
  const counts = zeroCounts();
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] ?? 0) + 1;
  }

  const summaryText =
    `Evaluation panel: ${findings.length} finding(s) from fixture-only strategy evaluation data. ` +
    'Analysis-only, non-executable, read-only. No live data. No execution plans created.';

  return drmOk({
    panelId: `evaluation_panel_${input.inputId}`,
    panelKind: 'evaluation_panel',
    findings,
    totalFindings: findings.length,
    severityCounts: counts,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  });
}
