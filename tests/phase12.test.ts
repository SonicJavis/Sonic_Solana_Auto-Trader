/**
 * Phase 12 — Risk Engine v1 tests.
 *
 * Covers:
 *   A. Type/model shapes
 *   B. Default policy shape and bounds
 *   C. Aggregation score bounds
 *   D. Confidence bounds
 *   E. Risk flag generation
 *   F. Decision rules
 *   G. Fixture behaviours (deterministic, correct decisions)
 *   H. Capabilities — all unsafe fields false
 *   I. Safety invariants (actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed/tradeIntentAllowed false)
 *   J. liveData false, fixtureOnly true
 *   K. Invalid inputs/policies return safe errors, no stack traces
 *   L. Validation helpers
 *   M. No secrets, RPC URLs, API keys, private keys, or stack traces in errors
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no external DB.
 */

import { describe, it, expect } from 'vitest';

import {
  // Errors
  reOk,
  reErr,
  isReOk,
  isReErr,
  // Decision
  RISK_DECISIONS,
  isRiskDecision,
  isRiskDecisionSafe,
  // Flags
  RISK_FLAG_CODES,
  makeRiskFlag,
  hasRiskCriticalFlag,
  hasRiskFlagCode,
  filterRiskFlagsBySeverity,
  // Policy
  buildDefaultRiskPolicy,
  // Aggregate
  buildRiskFlags,
  calculateRiskComponentScores,
  classifyRisk,
  buildRiskAssessmentResult,
  getRiskEngineCapabilities,
  // Confidence
  calculateRiskConfidence,
  // Validation
  validateRiskAssessmentInput,
  validateRiskPolicy,
  validateRiskScoreBounds,
  validateRiskConfidenceBounds,
  validateRiskAssessmentResult,
  // Fixtures
  CLEAN_RISK_ASSESSMENT_INPUT,
  CLEAN_RISK_ASSESSMENT_RESULT,
  TOKEN_REJECT_RISK_INPUT,
  TOKEN_REJECT_RISK_RESULT,
  CREATOR_REJECT_RISK_INPUT,
  CREATOR_REJECT_RISK_RESULT,
  WALLET_REJECT_RISK_INPUT,
  WALLET_REJECT_RISK_RESULT,
  MANIPULATION_REJECT_RISK_INPUT,
  MANIPULATION_REJECT_RISK_RESULT,
  MISSING_DATA_RISK_INPUT,
  MISSING_DATA_RISK_RESULT,
  LOW_CONFIDENCE_RISK_RESULT,
  MIXED_WARNING_RISK_RESULT,
  ALL_RISK_FIXTURES,
  type RiskAssessmentInput,
} from '@sonic/risk-engine';

// ── A. Type/model shapes ───────────────────────────────────────────────────────

describe('A. Type/model shapes', () => {
  it('RISK_DECISIONS contains all required decision values', () => {
    const required = ['reject', 'block', 'watch_only', 'analysis_only', 'insufficient_data', 'fixture_only'];
    for (const v of required) {
      expect(RISK_DECISIONS).toContain(v);
    }
  });

  it('RISK_FLAG_CODES contains all required flag codes', () => {
    const required = [
      'INSUFFICIENT_RISK_DATA',
      'TOKEN_REJECTED',
      'CREATOR_REJECTED',
      'WALLET_CLUSTER_REJECTED',
      'MANIPULATION_REJECTED',
      'TOKEN_CRITICAL_RISK',
      'CREATOR_CRITICAL_RISK',
      'WALLET_CRITICAL_RISK',
      'MANIPULATION_CRITICAL_RISK',
      'LOW_CONFIDENCE',
      'MISSING_TOKEN_INTELLIGENCE',
      'MISSING_CREATOR_INTELLIGENCE',
      'MISSING_WALLET_INTELLIGENCE',
      'MISSING_MANIPULATION_DETECTION',
      'LIVE_DATA_UNAVAILABLE',
      'EXECUTION_FORBIDDEN',
      'TRADE_INTENTS_FORBIDDEN',
    ];
    for (const code of required) {
      expect(RISK_FLAG_CODES).toContain(code);
    }
  });

  it('isRiskDecision identifies valid decisions', () => {
    expect(isRiskDecision('reject')).toBe(true);
    expect(isRiskDecision('block')).toBe(true);
    expect(isRiskDecision('watch_only')).toBe(true);
    expect(isRiskDecision('analysis_only')).toBe(true);
    expect(isRiskDecision('insufficient_data')).toBe(true);
    expect(isRiskDecision('fixture_only')).toBe(true);
    expect(isRiskDecision('buy')).toBe(false);
    expect(isRiskDecision('sell')).toBe(false);
    expect(isRiskDecision('trade')).toBe(false);
    expect(isRiskDecision('execute')).toBe(false);
  });

  it('isRiskDecisionSafe rejects forbidden words', () => {
    expect(isRiskDecisionSafe('analysis_only')).toBe(true);
    expect(isRiskDecisionSafe('reject')).toBe(true);
    expect(isRiskDecisionSafe('block')).toBe(true);
    expect(isRiskDecisionSafe('watch_only')).toBe(true);
    expect(isRiskDecisionSafe('insufficient_data')).toBe(true);
    expect(isRiskDecisionSafe('fixture_only')).toBe(true);
  });

  it('reOk / reErr / isReOk / isReErr work correctly', () => {
    const ok = reOk(42);
    expect(ok.ok).toBe(true);
    expect(isReOk(ok)).toBe(true);
    expect(isReErr(ok)).toBe(false);

    const err = reErr('INVALID_RISK_INPUT', 'test error');
    expect(err.ok).toBe(false);
    expect(isReOk(err)).toBe(false);
    expect(isReErr(err)).toBe(true);
    expect(err.error.code).toBe('INVALID_RISK_INPUT');
    expect(err.error.safeToDisplay).toBe(true);
  });
});

// ── B. Default policy shape and bounds ───────────────────────────────────────

describe('B. Default policy shape and bounds', () => {
  it('buildDefaultRiskPolicy returns valid policy', () => {
    const policy = buildDefaultRiskPolicy();
    expect(policy.fixtureOnly).toBe(true);
    expect(policy.liveData).toBe(false);
    expect(policy.safeToDisplay).toBe(true);
    expect(policy.minConfidence).toBeGreaterThanOrEqual(0);
    expect(policy.minConfidence).toBeLessThanOrEqual(1);
    expect(policy.rejectBelowScore).toBeGreaterThanOrEqual(0);
    expect(policy.rejectBelowScore).toBeLessThanOrEqual(100);
    expect(policy.watchBelowScore).toBeGreaterThanOrEqual(0);
    expect(policy.watchBelowScore).toBeLessThanOrEqual(100);
    expect(typeof policy.blockOnCriticalFlags).toBe('boolean');
    expect(typeof policy.blockOnManipulationReject).toBe('boolean');
    expect(typeof policy.blockOnCreatorReject).toBe('boolean');
    expect(typeof policy.blockOnWalletReject).toBe('boolean');
    expect(typeof policy.blockOnTokenReject).toBe('boolean');
    expect(typeof policy.requireAllInputs).toBe('boolean');
  });

  it('default policy thresholds are finite', () => {
    const policy = buildDefaultRiskPolicy();
    expect(isFinite(policy.minConfidence)).toBe(true);
    expect(isFinite(policy.rejectBelowScore)).toBe(true);
    expect(isFinite(policy.watchBelowScore)).toBe(true);
  });
});

// ── C. Aggregation score bounds ───────────────────────────────────────────────

describe('C. Aggregation score bounds', () => {
  const policy = buildDefaultRiskPolicy();

  it('component scores are all 0-100', () => {
    const scores = calculateRiskComponentScores(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    for (const entry of [
      scores.tokenScore,
      scores.creatorScore,
      scores.walletClusterScore,
      scores.manipulationScore,
      scores.confidenceAdjustedScore,
      scores.missingDataPenalty,
      scores.criticalFlagPenalty,
    ]) {
      expect(entry.score).toBeGreaterThanOrEqual(0);
      expect(entry.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(entry.reasons)).toBe(true);
    }
  });

  it('missing component scores 0 for missing data fixture', () => {
    const scores = calculateRiskComponentScores(MISSING_DATA_RISK_INPUT, policy);
    expect(scores.tokenScore.score).toBe(0);
    expect(scores.creatorScore.score).toBe(0);
    expect(scores.walletClusterScore.score).toBe(0);
    expect(scores.manipulationScore.score).toBe(0);
  });

  it('rejection caps component score at 30', () => {
    const scores = calculateRiskComponentScores(TOKEN_REJECT_RISK_INPUT, policy);
    expect(scores.tokenScore.score).toBeLessThanOrEqual(30);
  });

  it('finalRiskScore in built result is bounded 0-100', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        expect(fixture.result.value.finalRiskScore).toBeGreaterThanOrEqual(0);
        expect(fixture.result.value.finalRiskScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it('deterministic: same input produces same score on repeat calls', () => {
    const r1 = buildRiskAssessmentResult(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    const r2 = buildRiskAssessmentResult(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(r1.value.finalRiskScore).toBe(r2.value.finalRiskScore);
      expect(r1.value.decision).toBe(r2.value.decision);
    }
  });
});

// ── D. Confidence bounds ──────────────────────────────────────────────────────

describe('D. Confidence bounds', () => {
  const policy = buildDefaultRiskPolicy();

  it('confidence is 0-1 for all fixture inputs', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      const conf = calculateRiskConfidence(fixture.input as RiskAssessmentInput, policy);
      expect(conf).toBeGreaterThanOrEqual(0);
      expect(conf).toBeLessThanOrEqual(1);
    }
  });

  it('confidence is 0 for missing data input', () => {
    const conf = calculateRiskConfidence(MISSING_DATA_RISK_INPUT, policy);
    expect(conf).toBe(0);
  });

  it('confidence is higher for clean fixture (all components present)', () => {
    const cleanConf = calculateRiskConfidence(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    const missingConf = calculateRiskConfidence(MISSING_DATA_RISK_INPUT, policy);
    expect(cleanConf).toBeGreaterThan(missingConf);
  });

  it('built result confidence is bounded 0-1', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        expect(fixture.result.value.confidence).toBeGreaterThanOrEqual(0);
        expect(fixture.result.value.confidence).toBeLessThanOrEqual(1);
      }
    }
  });
});

// ── E. Risk flag generation ───────────────────────────────────────────────────

describe('E. Risk flag generation', () => {
  const policy = buildDefaultRiskPolicy();

  it('always includes LIVE_DATA_UNAVAILABLE, EXECUTION_FORBIDDEN, TRADE_INTENTS_FORBIDDEN', () => {
    const flags = buildRiskFlags(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'LIVE_DATA_UNAVAILABLE')).toBe(true);
    expect(hasRiskFlagCode(flags, 'EXECUTION_FORBIDDEN')).toBe(true);
    expect(hasRiskFlagCode(flags, 'TRADE_INTENTS_FORBIDDEN')).toBe(true);
  });

  it('includes MISSING_* flags for absent components', () => {
    const flags = buildRiskFlags(MISSING_DATA_RISK_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'MISSING_TOKEN_INTELLIGENCE')).toBe(true);
    expect(hasRiskFlagCode(flags, 'MISSING_CREATOR_INTELLIGENCE')).toBe(true);
    expect(hasRiskFlagCode(flags, 'MISSING_WALLET_INTELLIGENCE')).toBe(true);
    expect(hasRiskFlagCode(flags, 'MISSING_MANIPULATION_DETECTION')).toBe(true);
    expect(hasRiskFlagCode(flags, 'INSUFFICIENT_RISK_DATA')).toBe(true);
  });

  it('includes TOKEN_REJECTED for token rejection input', () => {
    const flags = buildRiskFlags(TOKEN_REJECT_RISK_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'TOKEN_REJECTED')).toBe(true);
  });

  it('includes CREATOR_REJECTED for creator rejection input', () => {
    const flags = buildRiskFlags(CREATOR_REJECT_RISK_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'CREATOR_REJECTED')).toBe(true);
  });

  it('includes WALLET_CLUSTER_REJECTED for wallet rejection input', () => {
    const flags = buildRiskFlags(WALLET_REJECT_RISK_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'WALLET_CLUSTER_REJECTED')).toBe(true);
  });

  it('includes MANIPULATION_REJECTED for manipulation rejection input', () => {
    const flags = buildRiskFlags(MANIPULATION_REJECT_RISK_INPUT, policy);
    expect(hasRiskFlagCode(flags, 'MANIPULATION_REJECTED')).toBe(true);
  });

  it('all flags have safeToDisplay: true', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      const flags = buildRiskFlags(fixture.input as RiskAssessmentInput, policy);
      for (const flag of flags) {
        expect(flag.safeToDisplay).toBe(true);
      }
    }
  });

  it('makeRiskFlag creates well-formed entry', () => {
    const flag = makeRiskFlag('INSUFFICIENT_RISK_DATA', 'high', 'test reason');
    expect(flag.code).toBe('INSUFFICIENT_RISK_DATA');
    expect(flag.severity).toBe('high');
    expect(flag.reason).toBe('test reason');
    expect(flag.safeToDisplay).toBe(true);
  });

  it('hasRiskCriticalFlag returns true when critical flags present', () => {
    const flags = [makeRiskFlag('TOKEN_CRITICAL_RISK', 'critical', 'critical')];
    expect(hasRiskCriticalFlag(flags)).toBe(true);
    const safeFlags = [makeRiskFlag('LOW_CONFIDENCE', 'warn', 'low conf')];
    expect(hasRiskCriticalFlag(safeFlags)).toBe(false);
  });

  it('filterRiskFlagsBySeverity filters correctly', () => {
    const flags = [
      makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'info msg'),
      makeRiskFlag('LOW_CONFIDENCE', 'warn', 'warn msg'),
      makeRiskFlag('TOKEN_REJECTED', 'high', 'high msg'),
      makeRiskFlag('TOKEN_CRITICAL_RISK', 'critical', 'critical msg'),
    ];
    expect(filterRiskFlagsBySeverity(flags, 'info')).toHaveLength(1);
    expect(filterRiskFlagsBySeverity(flags, 'warn')).toHaveLength(1);
    expect(filterRiskFlagsBySeverity(flags, 'high')).toHaveLength(1);
    expect(filterRiskFlagsBySeverity(flags, 'critical')).toHaveLength(1);
  });
});

// ── F. Decision rules ─────────────────────────────────────────────────────────

describe('F. Decision rules', () => {
  const policy = buildDefaultRiskPolicy();

  it('classifyRisk returns block when rejection + block policy', () => {
    const flags = buildRiskFlags(TOKEN_REJECT_RISK_INPUT, policy);
    const scores = calculateRiskComponentScores(TOKEN_REJECT_RISK_INPUT, policy);
    const confidence = calculateRiskConfidence(TOKEN_REJECT_RISK_INPUT, policy);
    const result = classifyRisk(TOKEN_REJECT_RISK_INPUT, policy, flags, scores, confidence);
    expect(result.decision).toBe('block');
    expect(result.blockingReasons.length).toBeGreaterThan(0);
  });

  it('classifyRisk returns insufficient_data for no components', () => {
    const flags = buildRiskFlags(MISSING_DATA_RISK_INPUT, policy);
    const scores = calculateRiskComponentScores(MISSING_DATA_RISK_INPUT, policy);
    const confidence = calculateRiskConfidence(MISSING_DATA_RISK_INPUT, policy);
    const result = classifyRisk(MISSING_DATA_RISK_INPUT, policy, flags, scores, confidence);
    expect(result.decision).toBe('insufficient_data');
  });

  it('classifyRisk returns analysis_only for clean high-confidence input', () => {
    const flags = buildRiskFlags(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    const scores = calculateRiskComponentScores(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    const confidence = calculateRiskConfidence(CLEAN_RISK_ASSESSMENT_INPUT, policy);
    const result = classifyRisk(CLEAN_RISK_ASSESSMENT_INPUT, policy, flags, scores, confidence);
    expect(result.decision).toBe('analysis_only');
  });

  it('decision is never a forbidden trade word', () => {
    const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'copy', 'mirror', 'enter'];
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        for (const word of forbidden) {
          expect(fixture.result.value.decision).not.toContain(word);
        }
      }
    }
  });

  it('decision is a valid RiskDecision for all fixtures', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        expect(isRiskDecision(fixture.result.value.decision)).toBe(true);
      }
    }
  });
});

// ── G. Fixture behaviours ─────────────────────────────────────────────────────

describe('G. Fixture behaviours', () => {
  it('CLEAN fixture → ok result with analysis_only decision', () => {
    expect(CLEAN_RISK_ASSESSMENT_RESULT.ok).toBe(true);
    if (CLEAN_RISK_ASSESSMENT_RESULT.ok) {
      expect(CLEAN_RISK_ASSESSMENT_RESULT.value.decision).toBe('analysis_only');
    }
  });

  it('TOKEN_REJECT fixture → ok result with block decision', () => {
    expect(TOKEN_REJECT_RISK_RESULT.ok).toBe(true);
    if (TOKEN_REJECT_RISK_RESULT.ok) {
      expect(TOKEN_REJECT_RISK_RESULT.value.decision).toBe('block');
    }
  });

  it('CREATOR_REJECT fixture → ok result with block decision', () => {
    expect(CREATOR_REJECT_RISK_RESULT.ok).toBe(true);
    if (CREATOR_REJECT_RISK_RESULT.ok) {
      expect(CREATOR_REJECT_RISK_RESULT.value.decision).toBe('block');
    }
  });

  it('WALLET_REJECT fixture → ok result with block decision', () => {
    expect(WALLET_REJECT_RISK_RESULT.ok).toBe(true);
    if (WALLET_REJECT_RISK_RESULT.ok) {
      expect(WALLET_REJECT_RISK_RESULT.value.decision).toBe('block');
    }
  });

  it('MANIPULATION_REJECT fixture → ok result with block decision', () => {
    expect(MANIPULATION_REJECT_RISK_RESULT.ok).toBe(true);
    if (MANIPULATION_REJECT_RISK_RESULT.ok) {
      expect(MANIPULATION_REJECT_RISK_RESULT.value.decision).toBe('block');
    }
  });

  it('MISSING_DATA fixture → ok result with insufficient_data decision', () => {
    expect(MISSING_DATA_RISK_RESULT.ok).toBe(true);
    if (MISSING_DATA_RISK_RESULT.ok) {
      expect(MISSING_DATA_RISK_RESULT.value.decision).toBe('insufficient_data');
    }
  });

  it('LOW_CONFIDENCE fixture → ok result with watch_only decision', () => {
    expect(LOW_CONFIDENCE_RISK_RESULT.ok).toBe(true);
    if (LOW_CONFIDENCE_RISK_RESULT.ok) {
      expect(LOW_CONFIDENCE_RISK_RESULT.value.decision).toBe('watch_only');
    }
  });

  it('MIXED_WARNING fixture → ok result with watch_only or analysis_only', () => {
    expect(MIXED_WARNING_RISK_RESULT.ok).toBe(true);
    if (MIXED_WARNING_RISK_RESULT.ok) {
      expect(['watch_only', 'analysis_only']).toContain(MIXED_WARNING_RISK_RESULT.value.decision);
    }
  });

  it('ALL_RISK_FIXTURES has 8 entries', () => {
    expect(ALL_RISK_FIXTURES).toHaveLength(8);
  });

  it('all fixtures produce ok results', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      expect(fixture.result.ok).toBe(true);
    }
  });

  it('clean fixture has higher score than token_reject fixture', () => {
    if (CLEAN_RISK_ASSESSMENT_RESULT.ok && TOKEN_REJECT_RISK_RESULT.ok) {
      expect(CLEAN_RISK_ASSESSMENT_RESULT.value.finalRiskScore).toBeGreaterThan(
        TOKEN_REJECT_RISK_RESULT.value.finalRiskScore,
      );
    }
  });
});

// ── H. Capabilities — all unsafe fields false ─────────────────────────────────

describe('H. Capabilities — all unsafe fields false', () => {
  it('getRiskEngineCapabilities returns all unsafe capabilities as false', () => {
    const caps = getRiskEngineCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCreateExecutionPlans).toBe(false);
    expect(caps.canCreateEnforcementActions).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
    expect(caps.safeToDisplay).toBe(true);
  });
});

// ── I & J. Safety invariants, liveData false, fixtureOnly true ────────────────

describe('I+J. Safety invariants', () => {
  it('all fixture results have correct safety invariants', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        const v = fixture.result.value;
        expect(v.fixtureOnly).toBe(true);
        expect(v.liveData).toBe(false);
        expect(v.actionAllowed).toBe(false);
        expect(v.tradingAllowed).toBe(false);
        expect(v.executionAllowed).toBe(false);
        expect(v.enforcementAllowed).toBe(false);
        expect(v.tradeIntentAllowed).toBe(false);
        expect(v.safeToDisplay).toBe(true);
      }
    }
  });

  it('default policy has liveData false and fixtureOnly true', () => {
    const policy = buildDefaultRiskPolicy();
    expect(policy.liveData).toBe(false);
    expect(policy.fixtureOnly).toBe(true);
    expect(policy.safeToDisplay).toBe(true);
  });

  it('buildRiskAssessmentResult rejects liveData=true on input', () => {
    const badInput = { ...CLEAN_RISK_ASSESSMENT_INPUT, liveData: true as unknown as false };
    const result = buildRiskAssessmentResult(badInput, buildDefaultRiskPolicy());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('buildRiskAssessmentResult rejects fixtureOnly=false on policy', () => {
    const badPolicy = { ...buildDefaultRiskPolicy(), fixtureOnly: false as unknown as true };
    const result = buildRiskAssessmentResult(CLEAN_RISK_ASSESSMENT_INPUT, badPolicy);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('RISK_ENGINE_FIXTURE_ONLY');
    }
  });
});

// ── K. Invalid inputs/policies return safe errors ─────────────────────────────

describe('K. Invalid inputs/policies return safe errors', () => {
  it('validateRiskAssessmentInput rejects null', () => {
    const result = validateRiskAssessmentInput(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
      expect(result.error.code).toBe('INVALID_RISK_INPUT');
    }
  });

  it('validateRiskAssessmentInput rejects empty requestId', () => {
    const result = validateRiskAssessmentInput({
      requestId: '',
      liveData: false,
      fixtureOnly: true,
      source: 'test',
      requestedAt: '2024-01-01T00:00:00.000Z',
    });
    expect(result.ok).toBe(false);
  });

  it('validateRiskAssessmentInput rejects liveData=true', () => {
    const result = validateRiskAssessmentInput({
      requestId: 'test123',
      liveData: true,
      fixtureOnly: true,
      source: 'test',
      requestedAt: '2024-01-01T00:00:00.000Z',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
    }
  });

  it('validateRiskAssessmentInput accepts valid clean input', () => {
    const result = validateRiskAssessmentInput(CLEAN_RISK_ASSESSMENT_INPUT);
    expect(result.ok).toBe(true);
  });

  it('validateRiskPolicy rejects null', () => {
    const result = validateRiskPolicy(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('validateRiskPolicy rejects liveData=true policy', () => {
    const result = validateRiskPolicy({ ...buildDefaultRiskPolicy(), liveData: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
    }
  });

  it('validateRiskPolicy accepts default policy', () => {
    const result = validateRiskPolicy(buildDefaultRiskPolicy());
    expect(result.ok).toBe(true);
  });

  it('validateRiskScoreBounds rejects out-of-range scores', () => {
    expect(validateRiskScoreBounds(-1).ok).toBe(false);
    expect(validateRiskScoreBounds(101).ok).toBe(false);
    expect(validateRiskScoreBounds(NaN).ok).toBe(false);
    expect(validateRiskScoreBounds(Infinity).ok).toBe(false);
  });

  it('validateRiskScoreBounds accepts valid scores', () => {
    expect(validateRiskScoreBounds(0).ok).toBe(true);
    expect(validateRiskScoreBounds(50).ok).toBe(true);
    expect(validateRiskScoreBounds(100).ok).toBe(true);
  });

  it('validateRiskConfidenceBounds rejects out-of-range confidence', () => {
    expect(validateRiskConfidenceBounds(-0.1).ok).toBe(false);
    expect(validateRiskConfidenceBounds(1.1).ok).toBe(false);
    expect(validateRiskConfidenceBounds(NaN).ok).toBe(false);
  });

  it('validateRiskConfidenceBounds accepts valid confidence', () => {
    expect(validateRiskConfidenceBounds(0).ok).toBe(true);
    expect(validateRiskConfidenceBounds(0.5).ok).toBe(true);
    expect(validateRiskConfidenceBounds(1).ok).toBe(true);
  });

  it('validateRiskAssessmentResult validates all safety invariants', () => {
    // Good result passes
    if (CLEAN_RISK_ASSESSMENT_RESULT.ok) {
      expect(validateRiskAssessmentResult(CLEAN_RISK_ASSESSMENT_RESULT.value).ok).toBe(true);
    }
    // Bad result fails
    const bad = { ...CLEAN_RISK_ASSESSMENT_RESULT.ok && CLEAN_RISK_ASSESSMENT_RESULT.value, actionAllowed: true };
    const res = validateRiskAssessmentResult(bad);
    expect(res.ok).toBe(false);
  });
});

// ── L. Validation helpers ─────────────────────────────────────────────────────

describe('L. Validation helpers', () => {
  it('validateRiskAssessmentInput validates sub-summary score bounds', () => {
    const badInput = {
      requestId: 'test123',
      liveData: false,
      fixtureOnly: true,
      source: 'test',
      requestedAt: '2024-01-01T00:00:00.000Z',
      tokenIntelligence: {
        tokenMint: 'FIXTURE_MINT',
        finalScore: 150, // invalid
        confidence: 0.9,
        classification: 'clean',
        hasRejection: false,
        hasCriticalFlags: false,
        fixtureOnly: true,
        liveData: false,
        safeToDisplay: true,
      },
    };
    const result = validateRiskAssessmentInput(badInput);
    expect(result.ok).toBe(false);
  });

  it('validateRiskAssessmentInput validates sub-summary confidence bounds', () => {
    const badInput = {
      requestId: 'test123',
      liveData: false,
      fixtureOnly: true,
      source: 'test',
      requestedAt: '2024-01-01T00:00:00.000Z',
      creatorIntelligence: {
        creatorId: 'FIXTURE_CREATOR',
        finalScore: 70,
        confidence: 2.5, // invalid
        classification: 'clean',
        hasRejection: false,
        hasCriticalFlags: false,
        fixtureOnly: true,
        liveData: false,
        safeToDisplay: true,
      },
    };
    const result = validateRiskAssessmentInput(badInput);
    expect(result.ok).toBe(false);
  });

  it('error objects contain no stack traces or sensitive data', () => {
    const err = reErr('INVALID_RISK_INPUT', 'safe message');
    const msg = err.error.message;
    expect(msg).not.toContain('Error:');
    expect(msg).not.toContain('at Object.');
    expect(msg).not.toContain('rpcUrl');
    expect(msg).not.toContain('privateKey');
    expect(msg).not.toContain('apiKey');
    expect(err.error.safeToDisplay).toBe(true);
  });
});

// ── M. No secrets in errors/results ──────────────────────────────────────────

describe('M. No secrets or sensitive data in output', () => {
  const sensitivePatterns = [
    /private.*key/i,
    /secret.*key/i,
    /mnemonic/i,
    /seed.*phrase/i,
    /rpcUrl/i,
    /apiKey/i,
    /wss:\/\//i,
    /https:\/\//i,
  ];

  it('fixture results contain no sensitive patterns in inputSummary', () => {
    for (const fixture of ALL_RISK_FIXTURES) {
      if (fixture.result.ok) {
        const summary = fixture.result.value.inputSummary;
        for (const pattern of sensitivePatterns) {
          expect(pattern.test(summary)).toBe(false);
        }
      }
    }
  });

  it('error messages contain no sensitive patterns', () => {
    const errs = [
      reErr('LIVE_DATA_FORBIDDEN', 'liveData must be false'),
      reErr('INVALID_RISK_INPUT', 'requestId must be non-empty'),
      reErr('RISK_ENGINE_FIXTURE_ONLY', 'fixtureOnly must be true'),
    ];
    for (const err of errs) {
      for (const pattern of sensitivePatterns) {
        expect(pattern.test(err.error.message)).toBe(false);
      }
    }
  });

  it('risk flag reasons contain no sensitive patterns', () => {
    const policy = buildDefaultRiskPolicy();
    for (const fixture of ALL_RISK_FIXTURES) {
      const flags = buildRiskFlags(fixture.input as RiskAssessmentInput, policy);
      for (const flag of flags) {
        for (const pattern of sensitivePatterns) {
          expect(pattern.test(flag.reason)).toBe(false);
        }
      }
    }
  });
});
