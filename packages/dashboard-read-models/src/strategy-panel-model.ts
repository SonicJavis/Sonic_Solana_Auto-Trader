/**
 * packages/dashboard-read-models/src/strategy-panel-model.ts
 *
 * Phase 18 — DashboardStrategyPanelModel builder.
 *
 * Shapes Strategy Intent fixture evidence into read-only panel data.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardStrategyPanelModel,
  DashboardReadModelInput,
  DashboardReadModelSeverity,
} from './types.js';
import { validateDashboardReadModelInput } from './validation.js';

function zeroCounts(): Record<DashboardReadModelSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

/**
 * Builds a safe DashboardStrategyPanelModel from a DashboardReadModelInput.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildStrategyPanelModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardStrategyPanelModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const findings = input.findings ?? [];
  const counts = zeroCounts();
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] ?? 0) + 1;
  }

  const summaryText =
    `Strategy panel: ${findings.length} finding(s) from fixture-only strategy intent data. ` +
    'Analysis-only, non-executable, read-only. No live data. No trade intents created.';

  return drmOk({
    panelId: `strategy_panel_${input.inputId}`,
    panelKind: 'strategy_panel',
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
