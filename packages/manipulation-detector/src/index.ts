/**
 * Phase 11 — @sonic/manipulation-detector public API barrel.
 *
 * Exports all Phase 11 Bundle / Manipulation Detector types, models, scoring
 * functions, risk flags, classification, fixtures, validation, and engine
 * functions.
 *
 * What this package provides:
 *   - BundleSignal, BundleSignalType models (local model, fixture-only)
 *   - ManipulationPattern, ManipulationPatternType models
 *   - CoordinatedActivitySnapshot model
 *   - BundleRiskScore, WashTradeScore, CoordinationScore,
 *     FundingPatternScore, CreatorLinkScore, ManipulationComponentScores
 *   - ManipulationRiskFlag codes, ManipulationRiskFlagEntry, risk flag helpers
 *   - ManipulationClassification values
 *   - ManipulationDetectorCapabilities (all unsafe fields false)
 *   - ManipulationDetectionResult (all safety invariants enforced)
 *   - Deterministic scoring functions: scoreBundleSignals, scoreWashTradePatterns,
 *     scoreCoordination, scoreFundingPatterns, scoreCreatorLinks
 *   - Engine: buildManipulationDetectionResult, classifyManipulation,
 *     buildManipulationRiskFlags, getManipulationDetectorCapabilities
 *   - Validation: validateBundleSignal, validateManipulationPattern,
 *     validateCoordinatedActivity, validateSignalId, validatePatternId,
 *     validateTokenMint, validateManipulationScoreBounds,
 *     validateManipulationConfidenceBounds
 *   - Errors: ManipulationDetectorError, ManipulationDetectorErrorCode,
 *     mdOk, mdErr
 *   - Fixtures: 8 deterministic synthetic fixture groups
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone / Geyser providers
 *   - No live bundle detection
 *   - No live wash-trade detection
 *   - No live wallet data ingestion
 *   - No live funding-source analysis
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 *   - No enforcement actions
 *   - No copy trading
 *   - No network calls of any kind
 *   - No provider API keys
 *   - No real wallet addresses
 *   - No real token mints
 *   - No real creator data
 */

export * from './bundle-signal.js';
export * from './manipulation-pattern.js';
export * from './coordinated-activity.js';
export * from './score-types.js';
export * from './risk-flags.js';
export * from './classifier.js';
export * from './types.js';
export * from './errors.js';
export * from './bundle-score.js';
export * from './wash-trade-score.js';
export * from './coordination-score.js';
export * from './funding-pattern-score.js';
export * from './creator-link-score.js';
export * from './validation.js';
export * from './fixtures.js';
export * from './evidence-fixture-model-types.js';
export * from './evidence-fixture-model-capabilities.js';
export * from './evidence-fixture-model-normalization.js';
export * from './evidence-fixture-model-validation.js';
export * from './evidence-fixture-model-builders.js';
export * from './evidence-fixture-model-fixtures.js';
export * from './manipulation-detector-engine.js';
