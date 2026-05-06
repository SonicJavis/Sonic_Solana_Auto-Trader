/**
 * packages/dashboard-read-models/src/overview-model.ts
 *
 * Phase 18 — DashboardOverviewModel builder.
 *
 * Creates safe summary counts from fixture-only replay/reporting/strategy/evaluation/evidence data.
 * Includes panel availability, total findings, severity counts, and safety status.
 * No live status claims.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardOverviewModel,
  DashboardReadModelInput,
  DashboardReadModelSeverity,
} from './types.js';
import { validateDashboardReadModelInput } from './validation.js';

function zeroCounts(): Record<DashboardReadModelSeverity, number> {
  return { info: 0, warning: 0, risk: 0, failure: 0, inconclusive: 0 };
}

/**
 * Builds a safe DashboardOverviewModel from a DashboardReadModelInput.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildDashboardOverviewModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardOverviewModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const findings = input.findings ?? [];
  const counts = zeroCounts();
  for (const f of findings) {
    counts[f.severity] = (counts[f.severity] ?? 0) + 1;
  }

  const safetyStatus =
    'fixture-only, analysis-only, non-executable, read-only — no live data, no trading, no execution';

  const panelsAvailable: string[] = [
    'replay_panel',
    'strategy_panel',
    'evaluation_panel',
    'evidence_panel',
    'safety_panel',
  ];

  return drmOk({
    overviewId: `overview_${input.inputId}`,
    totalFindings: findings.length,
    severityCounts: counts,
    panelsAvailable,
    safetyStatus,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  });
}
