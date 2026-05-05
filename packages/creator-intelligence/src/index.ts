/**
 * Phase 9 — @sonic/creator-intelligence public API barrel.
 *
 * Exports all Phase 9 Creator Intelligence types, models, scoring functions,
 * risk flags, classification, fixtures, validation, and engine functions.
 *
 * What this package provides:
 *   - CreatorProfile and CreatorLaunchHistorySnapshot types (local model, fixture-only)
 *   - CreatorSuccessScore, CreatorLaunchQualityScore, CreatorConsistencyScore,
 *     CreatorSuspiciousPatternScore, CreatorComponentScores
 *   - CreatorRiskFlag codes, CreatorRiskFlagEntry, risk flag helpers
 *   - CreatorClassification values
 *   - CreatorIntelligenceCapabilities (all unsafe fields false)
 *   - CreatorIntelligenceResult (all safety invariants enforced)
 *   - Deterministic scoring functions: scoreCreatorProfile, scoreSuccess,
 *     scoreLaunchQuality, scoreConsistency, scoreSuspiciousPatterns
 *   - Engine: buildCreatorIntelligenceResult, classifyCreator,
 *     buildCreatorRiskFlags, getCreatorIntelligenceCapabilities
 *   - Validation: validateCreatorProfile, validateCreatorHistory,
 *     validateCreatorId, validateCreatorAddress
 *   - Errors: CreatorIntelligenceError, CreatorIntelligenceErrorCode,
 *     ciOk, ciErr
 *   - Fixtures: 6 deterministic synthetic fixture creator profiles + histories
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone / Geyser providers
 *   - No live creator / dev wallet data ingestion
 *   - No live launch-history fetching
 *   - No live funding-source analysis
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 *   - No network calls of any kind
 *   - No provider API keys
 *   - No real wallet addresses
 *   - No wallet cluster intelligence (placeholder flags only)
 *   - No bundle detector (placeholder flags only)
 */

export * from './creator-profile.js';
export * from './creator-history.js';
export * from './score-types.js';
export * from './risk-flags.js';
export * from './classifier.js';
export * from './types.js';
export * from './errors.js';
export * from './success-score.js';
export * from './launch-quality-score.js';
export * from './consistency-score.js';
export * from './suspicious-pattern-score.js';
export * from './validation.js';
export * from './fixtures.js';
export * from './creator-intelligence-engine.js';
