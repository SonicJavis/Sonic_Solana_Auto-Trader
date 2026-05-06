/**
 * packages/dashboard-read-models/src/replay-panel-model.ts
 *
 * Phase 18 — DashboardReplayPanelModel builder.
 *
 * Shapes Replay Lab / Replay Reporting fixture evidence into read-only panel data.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardReplayPanelModel,
  DashboardReadModelInput,
  DashboardReadModelSeverity,
} from './types.js';
import { validateDashboardReadModelInput } from './validation.js';

function zeroCounts(): Record<DashboardReadModelSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

/**
 * Builds a safe DashboardReplayPanelModel from a DashboardReadModelInput.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildReplayPanelModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardReplayPanelModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const findings = input.findings ?? [];
  const counts = zeroCounts();
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] ?? 0) + 1;
  }

  const summaryText =
    `Replay panel: ${findings.length} finding(s) from fixture-only replay/reporting data. ` +
    'Analysis-only, non-executable, read-only. No live data.';

  return drmOk({
    panelId: `replay_panel_${input.inputId}`,
    panelKind: 'replay_panel',
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
