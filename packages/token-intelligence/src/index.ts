/**
 * Phase 8 — @sonic/token-intelligence public API barrel.
 *
 * Exports all Phase 8 Token Intelligence types, models, scoring functions,
 * risk flags, classification, fixtures, validation, and engine functions.
 *
 * What this package provides:
 *   - TokenProfile and TokenMetricSnapshot types (local model, fixture-only)
 *   - MetadataQualityScore, CurveQualityScore, HolderConcentrationScore,
 *     LiquidityQualityScore, OrganicMomentumScore, TokenComponentScores
 *   - TokenRiskFlag codes, TokenRiskFlagEntry, risk flag helpers
 *   - TokenClassification values
 *   - TokenIntelligenceCapabilities (all unsafe fields false)
 *   - TokenIntelligenceResult (all safety invariants enforced)
 *   - Deterministic scoring functions: scoreTokenProfile, scoreMetadata,
 *     scoreCurve, scoreHolderConcentration, scoreLiquidity, scoreMomentum
 *   - Engine: buildTokenIntelligenceResult, classifyToken, buildTokenRiskFlags,
 *     getTokenIntelligenceCapabilities
 *   - Validation: validateTokenProfile, validateTokenMetrics, validateTokenMint
 *   - Errors: TokenIntelligenceError, TokenIntelligenceErrorCode, tiOk, tiErr
 *   - Fixtures: 5 deterministic synthetic fixture profiles + metrics
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone / Geyser providers
 *   - No live market data ingestion
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 *   - No network calls of any kind
 *   - No provider API keys
 *   - No live token data
 *   - No live holder data
 *   - No live social data
 */

export * from './token-profile.js';
export * from './score-types.js';
export * from './risk-flags.js';
export * from './classifier.js';
export * from './types.js';
export * from './errors.js';
export * from './metadata-score.js';
export * from './curve-score.js';
export * from './holder-score.js';
export * from './liquidity-score.js';
export * from './momentum-score.js';
export * from './validation.js';
export * from './fixtures.js';
export * from './token-intelligence-engine.js';
