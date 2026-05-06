/**
 * Phase 18 — @sonic/dashboard-read-models public API barrel.
 *
 * Exports all Phase 18 Dashboard Read Model types, models,
 * builders, validation helpers, fixtures, and capabilities guard.
 *
 * What this package provides:
 *   - DashboardReadModelCapabilities (all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/readOnly true)
 *   - DashboardReadModelSeverity type union
 *   - DashboardReadModelFinding type
 *   - DashboardReadModelInput type
 *   - DashboardOverviewModel type
 *   - DashboardReplayPanelModel type
 *   - DashboardStrategyPanelModel type
 *   - DashboardEvaluationPanelModel type
 *   - DashboardEvidencePanelModel type
 *   - DashboardSafetyPanelModel type
 *   - DashboardReadModelBundle type
 *   - DashboardReadModelExport type
 *   - DashboardReadModelFixture type
 *   - DashboardReadModelErrorCode, DashboardReadModelError, DrmResult<T>, drmOk, drmErr
 *   - getDashboardReadModelCapabilities — permanently-safe capabilities
 *   - buildDashboardOverviewModel — safe overview model builder
 *   - buildReplayPanelModel — safe replay panel model builder
 *   - buildStrategyPanelModel — safe strategy panel model builder
 *   - buildEvaluationPanelModel — safe evaluation panel model builder
 *   - buildEvidencePanelModel — safe evidence panel model builder
 *   - buildSafetyPanelModel — safe safety panel model builder
 *   - buildDashboardReadModelBundle — combines all panels into safe bundle
 *   - exportDashboardReadModelJson — deterministic JSON export
 *   - exportDashboardReadModelMarkdown — deterministic Markdown export with safety footer
 *   - validateDashboardReadModelFinding, validateDashboardReadModelInput,
 *     validateDashboardReadModelBundle, validateDashboardReadModelCapabilities
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - 6 deterministic synthetic fixtures + ALL_DASHBOARD_READ_MODEL_FIXTURES
 *
 * What this package does NOT provide:
 *   - No real trade intents
 *   - No execution plans
 *   - No order, fill, route, swap models
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 *   - No database writes
 *   - No Telegram alerts
 *   - No transaction construction, simulation, signing, or sending
 *   - No orders or positions
 *   - No live PnL calculation
 *   - No mutation of prior evidence
 *   - No UI rendering
 *
 * IMPORTANT: DashboardReadModels are NOT a trading system.
 * They are fixture-only, read-only, analysis-only, non-executable
 * data-shaping objects for future UI review.
 */

export type {
  DashboardReadModelCapabilities,
  DashboardReadModelSeverity,
  DashboardReadModelFinding,
  DashboardReadModelInput,
  DashboardOverviewModel,
  DashboardReplayPanelModel,
  DashboardStrategyPanelModel,
  DashboardEvaluationPanelModel,
  DashboardEvidencePanelModel,
  DashboardSafetyPanelModel,
  DashboardReadModelBundle,
  DashboardReadModelExport,
  DashboardReadModelFixture,
  DashboardReadModelErrorCode,
} from './types.js';

export type { DashboardReadModelError, DrmResult } from './errors.js';
export { drmOk, drmErr } from './errors.js';

export { getDashboardReadModelCapabilities } from './capabilities.js';

export { buildDashboardOverviewModel } from './overview-model.js';

export { buildReplayPanelModel } from './replay-panel-model.js';

export { buildStrategyPanelModel } from './strategy-panel-model.js';

export { buildEvaluationPanelModel } from './evaluation-panel-model.js';

export { buildEvidencePanelModel } from './evidence-panel-model.js';

export { buildSafetyPanelModel } from './safety-panel-model.js';

export { buildDashboardReadModelBundle } from './bundle-builder.js';

export { exportDashboardReadModelJson } from './export-json.js';

export { exportDashboardReadModelMarkdown } from './export-markdown.js';

export {
  validateDashboardReadModelFinding,
  validateDashboardReadModelInput,
  validateDashboardReadModelBundle,
  validateDashboardReadModelCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
} from './validation.js';

export {
  CLEAN_DASHBOARD_READ_MODEL_FIXTURE,
  DEGRADED_DASHBOARD_READ_MODEL_FIXTURE,
  FAILED_DASHBOARD_READ_MODEL_FIXTURE,
  INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE,
  MIXED_DASHBOARD_READ_MODEL_FIXTURE,
  REGRESSION_DASHBOARD_READ_MODEL_FIXTURE,
  ALL_DASHBOARD_READ_MODEL_FIXTURES,
} from './fixtures.js';
