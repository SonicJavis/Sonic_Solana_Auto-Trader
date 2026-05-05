/**
 * Phase 12 — @sonic/risk-engine public API barrel.
 *
 * Exports all types, errors, decisions, flags, input/policy/score structures,
 * confidence calculation, validation, aggregation, and deterministic fixtures.
 *
 * Constraints:
 * - NO live data, RPC, external APIs, or network calls
 * - NO trade intents, execution, or enforcement actions
 * - ALL liveData fields = false, fixtureOnly = true
 * - RiskDecision values: reject | block | watch_only | analysis_only | insufficient_data | fixture_only
 * - Scores 0-100 (higher = safer/better), Confidence 0-1
 * - ALL unsafe capability fields = false
 */

export * from './types.js';
export * from './errors.js';
export * from './risk-decision.js';
export * from './risk-flags.js';
export * from './risk-input.js';
export * from './risk-policy.js';
export * from './risk-score.js';
export * from './confidence.js';
export * from './validation.js';
export * from './aggregate.js';
export * from './fixtures.js';
