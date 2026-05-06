/**
 * Phase 16 — @sonic/strategy-evaluation public API barrel.
 *
 * Exports all Phase 16 Strategy Evaluation types, models, builders,
 * validation helpers, fixtures, and capabilities guard.
 *
 * What this package provides:
 *   - StrategyEvaluationCapabilities (all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable true)
 *   - StrategyScoreBand, StrategyEvaluationClassification, StrategyEvaluationSourceKind type unions
 *   - StrategyEvaluationSeverity type union
 *   - StrategyScoreBandSummary, StrategyEvidenceDistribution, StrategySafetyGateSummary model types
 *   - StrategyFamilyComparison, StrategyEvaluationFinding model types
 *   - StrategyEvaluation — analysis-only, non-executable evaluation model
 *   - StrategyEvaluationInput, StrategyEvaluationReport, StrategyEvaluationExport types
 *   - StrategyEvaluationFixture, StrategyEvaluationErrorCode types
 *   - StrategyEvaluationError, SeResult<T>, seOk, seErr
 *   - getStrategyEvaluationCapabilities — permanently-safe capabilities
 *   - buildStrategyScoreBandSummary — fixture-only score band analysis
 *   - buildStrategyEvidenceDistribution — fixture-only evidence distribution
 *   - buildStrategySafetyGateSummary — analysis-only safety gate summary
 *   - compareStrategyFamilies — fixture-only family comparison
 *   - buildStrategyEvaluation — evaluation builder (fixture-only, analysis-only)
 *   - exportStrategyEvaluationJson — deterministic JSON export
 *   - exportStrategyEvaluationMarkdown — deterministic Markdown export with safety footer
 *   - validateStrategyEvaluation — safety invariant validation
 *   - validateStrategyEvaluationCapabilities — capabilities validation
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - 6 deterministic synthetic fixtures + ALL_STRATEGY_EVALUATION_FIXTURES
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
 *
 * IMPORTANT: StrategyEvaluation is NOT a real evaluation with actionable results.
 * It is an internal, fixture-only, analysis-only, non-executable model.
 */

export type {
  StrategyEvaluationCapabilities,
  StrategyScoreBand,
  StrategyScoreBandSummary,
  StrategyEvidenceDistribution,
  StrategySafetyGateSummary,
  StrategyFamilyComparison,
  StrategyEvaluationSeverity,
  StrategyEvaluationClassification,
  StrategyEvaluationSourceKind,
  StrategyEvaluationFinding,
  StrategyEvaluation,
  StrategyEvaluationInput,
  StrategyEvaluationReport,
  StrategyEvaluationExport,
  StrategyEvaluationFixture,
  StrategyEvaluationErrorCode,
} from './types.js';

export type { StrategyEvaluationError, SeResult } from './errors.js';
export { seOk, seErr } from './errors.js';

export { getStrategyEvaluationCapabilities } from './capabilities.js';

export { buildStrategyScoreBandSummary } from './score-bands.js';

export { buildStrategyEvidenceDistribution } from './evidence-summary.js';

export { buildStrategySafetyGateSummary } from './gate-summary.js';

export { compareStrategyFamilies } from './family-comparison.js';

export { buildStrategyEvaluation } from './evaluation-builder.js';

export { exportStrategyEvaluationJson } from './export-json.js';

export { exportStrategyEvaluationMarkdown } from './export-markdown.js';

export {
  validateStrategyEvaluation,
  validateStrategyEvaluationCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
} from './validation.js';

export {
  CLEAN_STRATEGY_EVALUATION_FIXTURE,
  DEGRADED_STRATEGY_EVALUATION_FIXTURE,
  FAILED_STRATEGY_EVALUATION_FIXTURE,
  INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE,
  MIXED_STRATEGY_EVALUATION_FIXTURE,
  REGRESSION_STRATEGY_EVALUATION_FIXTURE,
  ALL_STRATEGY_EVALUATION_FIXTURES,
} from './fixtures.js';
