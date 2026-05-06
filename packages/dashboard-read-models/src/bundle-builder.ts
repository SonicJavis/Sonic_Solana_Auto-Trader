/**
 * packages/dashboard-read-models/src/bundle-builder.ts
 *
 * Phase 18 — DashboardReadModelBundle builder.
 *
 * Combines all panel models into one safe bundle.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardReadModelBundle,
  DashboardReadModelInput,
} from './types.js';
import { buildDashboardOverviewModel } from './overview-model.js';
import { buildReplayPanelModel } from './replay-panel-model.js';
import { buildStrategyPanelModel } from './strategy-panel-model.js';
import { buildEvaluationPanelModel } from './evaluation-panel-model.js';
import { buildEvidencePanelModel } from './evidence-panel-model.js';
import { buildSafetyPanelModel } from './safety-panel-model.js';

/**
 * Builds a safe DashboardReadModelBundle by combining all panel models.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildDashboardReadModelBundle(
  input: DashboardReadModelInput,
): DrmResult<DashboardReadModelBundle> {
  const overviewResult = buildDashboardOverviewModel(input);
  if (!overviewResult.ok) return drmErr(overviewResult.code, `overview: ${overviewResult.message}`);

  const replayResult = buildReplayPanelModel(input);
  if (!replayResult.ok) return drmErr(replayResult.code, `replayPanel: ${replayResult.message}`);

  const strategyResult = buildStrategyPanelModel(input);
  if (!strategyResult.ok) return drmErr(strategyResult.code, `strategyPanel: ${strategyResult.message}`);

  const evaluationResult = buildEvaluationPanelModel(input);
  if (!evaluationResult.ok)
    return drmErr(evaluationResult.code, `evaluationPanel: ${evaluationResult.message}`);

  const evidenceResult = buildEvidencePanelModel(input);
  if (!evidenceResult.ok) return drmErr(evidenceResult.code, `evidencePanel: ${evidenceResult.message}`);

  const safetyResult = buildSafetyPanelModel(input);
  if (!safetyResult.ok) return drmErr(safetyResult.code, `safetyPanel: ${safetyResult.message}`);

  return drmOk({
    bundleId: `bundle_${input.inputId}`,
    overview: overviewResult.value,
    replayPanel: replayResult.value,
    strategyPanel: strategyResult.value,
    evaluationPanel: evaluationResult.value,
    evidencePanel: evidenceResult.value,
    safetyPanel: safetyResult.value,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  });
}
