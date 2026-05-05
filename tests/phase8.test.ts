/**
 * Phase 8 — Token Intelligence v1 tests.
 *
 * Covers:
 *   A. Types/models
 *   B. Scoring (bounded, missing data degrades confidence)
 *   C. Risk flags
 *   D. Classification (no trade wording)
 *   E. Safety invariants
 *   F. Fixture engine (deterministic, relative quality)
 *   G. Error safety (no secrets, no stack traces)
 *   H. Regression (all prior tests still pass via baseline)
 *
 * No network, no Solana RPC, no provider SDK, no API keys, no wallet.
 */

import { describe, it, expect } from 'vitest';

import {
  // Engine
  buildTokenIntelligenceResult,
  getTokenIntelligenceCapabilities,
  scoreTokenProfile,
  buildTokenRiskFlags,
  classifyToken,
  // Fixtures
  GOOD_FIXTURE_TOKEN_PROFILE,
  GOOD_FIXTURE_TOKEN_METRICS,
  MISSING_METADATA_FIXTURE_TOKEN_PROFILE,
  MISSING_METADATA_FIXTURE_TOKEN_METRICS,
  CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE,
  CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS,
  LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE,
  LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS,
  HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE,
  HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS,
  ALL_FIXTURE_TOKEN_PAIRS,
  // Scoring
  scoreMetadata,
  scoreCurve,
  scoreHolderConcentration,
  scoreLiquidity,
  scoreMomentum,
  // Validation
  validateTokenMint,
  validateScoreBounds,
  validateConfidenceBounds,
  // Errors
  tiOk,
  tiErr,
  isTiOk,
  isTiErr,
  // Classifier
  TOKEN_CLASSIFICATIONS,
  isTokenClassification,
  isClassificationSafe,
  // Risk flags
  makeRiskFlag,
  hasCriticalFlag,
  filterFlagsBySeverity,
} from '@sonic/token-intelligence';

import {
  PHASE_8_TOKEN_INTELLIGENCE_STATUS,
  buildTokenIntelligenceStatusSnapshot,
} from '@sonic/state';

// ══════════════════════════════════════════════════════════════
// A. Types / Models
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — A. Types and Models', () => {
  it('TokenProfile shape: good fixture has all required fields', () => {
    const p = GOOD_FIXTURE_TOKEN_PROFILE;
    expect(typeof p.tokenId).toBe('string');
    expect(typeof p.tokenMint).toBe('string');
    expect(typeof p.name).toBe('string');
    expect(typeof p.symbol).toBe('string');
    expect(typeof p.description).toBe('string');
    expect(typeof p.imageUriPresent).toBe('boolean');
    expect(typeof p.websitePresent).toBe('boolean');
    expect(typeof p.telegramPresent).toBe('boolean');
    expect(typeof p.twitterPresent).toBe('boolean');
    expect(typeof p.createdAt).toBe('string');
    expect(p.source).toBe('fixture');
    expect(p.fixtureOnly).toBe(true);
    expect(p.liveData).toBe(false);
    expect(p.safeToDisplay).toBe(true);
  });

  it('TokenMetricSnapshot shape: good fixture has all required fields', () => {
    const m = GOOD_FIXTURE_TOKEN_METRICS;
    expect(typeof m.tokenMint).toBe('string');
    expect(typeof m.curveProgress).toBe('number');
    expect(typeof m.virtualLiquidity).toBe('number');
    expect(typeof m.reserveQuality).toBe('number');
    expect(typeof m.holderCount).toBe('number');
    expect(typeof m.topHolderPercent).toBe('number');
    expect(typeof m.uniqueBuyerCount).toBe('number');
    expect(typeof m.buyVelocity).toBe('number');
    expect(typeof m.sellVelocity).toBe('number');
    expect(typeof m.volumeTrend).toBe('number');
    expect(typeof m.metadataCompleteness).toBe('number');
    expect(typeof m.socialCompleteness).toBe('number');
    expect(typeof m.observedAt).toBe('string');
    expect(m.fixtureOnly).toBe(true);
    expect(m.liveData).toBe(false);
  });

  it('Component score shapes have score (number) and reasons (array)', () => {
    const meta = scoreMetadata(GOOD_FIXTURE_TOKEN_PROFILE);
    expect(typeof meta.score).toBe('number');
    expect(Array.isArray(meta.reasons)).toBe(true);
    expect(typeof meta.completeness).toBe('number');

    const curve = scoreCurve(GOOD_FIXTURE_TOKEN_METRICS);
    expect(typeof curve.score).toBe('number');
    expect(Array.isArray(curve.reasons)).toBe(true);

    const holder = scoreHolderConcentration(GOOD_FIXTURE_TOKEN_METRICS);
    expect(typeof holder.score).toBe('number');

    const liq = scoreLiquidity(GOOD_FIXTURE_TOKEN_METRICS);
    expect(typeof liq.score).toBe('number');
    expect(liq.exitLiquidityPlaceholder).toBeNull();

    const mom = scoreMomentum(GOOD_FIXTURE_TOKEN_METRICS);
    expect(typeof mom.score).toBe('number');
    expect(mom.botNoisePlaceholder).toBe(false);
  });

  it('Risk flag entry shape has code, severity, reason, safeToDisplay', () => {
    const flag = makeRiskFlag('MISSING_METADATA', 'critical', 'Test reason');
    expect(flag.code).toBe('MISSING_METADATA');
    expect(flag.severity).toBe('critical');
    expect(flag.reason).toBe('Test reason');
    expect(flag.safeToDisplay).toBe(true);
  });

  it('TokenIntelligenceResult safety invariants from good fixture', () => {
    const result = buildTokenIntelligenceResult(
      GOOD_FIXTURE_TOKEN_PROFILE,
      GOOD_FIXTURE_TOKEN_METRICS,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const r = result.value;
    expect(r.fixtureOnly).toBe(true);
    expect(r.liveData).toBe(false);
    expect(r.actionAllowed).toBe(false);
    expect(r.tradingAllowed).toBe(false);
    expect(r.executionAllowed).toBe(false);
    expect(r.safeToDisplay).toBe(true);
  });

  it('Capabilities: all unsafe fields are false', () => {
    const caps = getTokenIntelligenceCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
    expect(caps.safeToDisplay).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════
// B. Scoring
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — B. Scoring', () => {
  it('Metadata score is bounded 0–100', () => {
    for (const { profile } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreMetadata(profile);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('Curve score is bounded 0–100', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreCurve(metrics);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('Holder concentration score is bounded 0–100', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreHolderConcentration(metrics);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('Liquidity score is bounded 0–100', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreLiquidity(metrics);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('Organic momentum score is bounded 0–100', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreMomentum(metrics);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('Missing metadata reduces metadata score', () => {
    const goodScore = scoreMetadata(GOOD_FIXTURE_TOKEN_PROFILE).score;
    const missingScore = scoreMetadata(MISSING_METADATA_FIXTURE_TOKEN_PROFILE).score;
    expect(missingScore).toBeLessThan(goodScore);
  });

  it('Missing metadata reduces confidence', () => {
    const { confidence: goodConfidence } = scoreTokenProfile(
      GOOD_FIXTURE_TOKEN_PROFILE,
      GOOD_FIXTURE_TOKEN_METRICS,
    );
    const { confidence: missingConfidence } = scoreTokenProfile(
      MISSING_METADATA_FIXTURE_TOKEN_PROFILE,
      MISSING_METADATA_FIXTURE_TOKEN_METRICS,
    );
    expect(missingConfidence).toBeLessThan(goodConfidence);
  });

  it('Final score is bounded 0–100 for all fixtures', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const { finalScore } = scoreTokenProfile(profile, metrics);
      expect(finalScore).toBeGreaterThanOrEqual(0);
      expect(finalScore).toBeLessThanOrEqual(100);
    }
  });

  it('Confidence is bounded 0–1 for all fixtures', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const { confidence } = scoreTokenProfile(profile, metrics);
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    }
  });

  it('Metadata suspiciousReusePlaceholder is always false', () => {
    for (const { profile } of ALL_FIXTURE_TOKEN_PAIRS) {
      const s = scoreMetadata(profile);
      expect(s.suspiciousReusePlaceholder).toBe(false);
    }
  });
});

// ══════════════════════════════════════════════════════════════
// C. Risk Flags
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — C. Risk Flags', () => {
  it('Missing metadata fixture produces MISSING_METADATA flag', () => {
    const flags = buildTokenRiskFlags(
      MISSING_METADATA_FIXTURE_TOKEN_PROFILE,
      MISSING_METADATA_FIXTURE_TOKEN_METRICS,
    );
    const codes = flags.map((f) => f.code);
    expect(codes).toContain('MISSING_METADATA');
  });

  it('Missing metadata fixture produces MISSING_SOCIALS flag', () => {
    const flags = buildTokenRiskFlags(
      MISSING_METADATA_FIXTURE_TOKEN_PROFILE,
      MISSING_METADATA_FIXTURE_TOKEN_METRICS,
    );
    const codes = flags.map((f) => f.code);
    expect(codes).toContain('MISSING_SOCIALS');
  });

  it('Concentrated holder fixture produces HIGH_TOP_HOLDER_CONCENTRATION flag', () => {
    const flags = buildTokenRiskFlags(
      CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE,
      CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS,
    );
    const codes = flags.map((f) => f.code);
    expect(codes).toContain('HIGH_TOP_HOLDER_CONCENTRATION');
  });

  it('Low liquidity fixture produces LOW_LIQUIDITY flag', () => {
    const flags = buildTokenRiskFlags(
      LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE,
      LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS,
    );
    const codes = flags.map((f) => f.code);
    expect(codes).toContain('LOW_LIQUIDITY');
  });

  it('Good fixture does not produce LOW_LIQUIDITY flag', () => {
    const flags = buildTokenRiskFlags(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    const codes = flags.map((f) => f.code);
    expect(codes).not.toContain('LOW_LIQUIDITY');
  });

  it('Missing metadata fixture with low curve progress produces CURVE_TOO_EARLY flag', () => {
    // curveProgress = 0.10 — within early but not < 0.05, so no CURVE_TOO_EARLY for that fixture
    // Let's test with a metrics object where curveProgress = 0.02
    const earlyMetrics = { ...GOOD_FIXTURE_TOKEN_METRICS, curveProgress: 0.02 };
    const earlyFlags = buildTokenRiskFlags(GOOD_FIXTURE_TOKEN_PROFILE, earlyMetrics);
    expect(earlyFlags.map((f) => f.code)).toContain('CURVE_TOO_EARLY');
  });

  it('High curve progress produces CURVE_TOO_ADVANCED flag', () => {
    const lateMetrics = { ...GOOD_FIXTURE_TOKEN_METRICS, curveProgress: 0.92 };
    const flags = buildTokenRiskFlags(GOOD_FIXTURE_TOKEN_PROFILE, lateMetrics);
    expect(flags.map((f) => f.code)).toContain('CURVE_TOO_ADVANCED');
  });

  it('High sell pressure fixture produces SELL_PRESSURE_HIGH flag', () => {
    const flags = buildTokenRiskFlags(
      HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE,
      HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS,
    );
    const codes = flags.map((f) => f.code);
    expect(codes).toContain('SELL_PRESSURE_HIGH');
  });

  it('All fixtures include LIVE_DATA_UNAVAILABLE info flag', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const flags = buildTokenRiskFlags(profile, metrics);
      expect(flags.map((f) => f.code)).toContain('LIVE_DATA_UNAVAILABLE');
    }
  });

  it('All fixtures include PLACEHOLDER_CREATOR_UNKNOWN flag', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const flags = buildTokenRiskFlags(profile, metrics);
      expect(flags.map((f) => f.code)).toContain('PLACEHOLDER_CREATOR_UNKNOWN');
    }
  });

  it('All fixtures include PLACEHOLDER_WALLET_CLUSTER_UNKNOWN flag', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const flags = buildTokenRiskFlags(profile, metrics);
      expect(flags.map((f) => f.code)).toContain('PLACEHOLDER_WALLET_CLUSTER_UNKNOWN');
    }
  });

  it('All fixtures include PLACEHOLDER_BUNDLE_UNKNOWN flag', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const flags = buildTokenRiskFlags(profile, metrics);
      expect(flags.map((f) => f.code)).toContain('PLACEHOLDER_BUNDLE_UNKNOWN');
    }
  });

  it('All risk flag entries have safeToDisplay: true', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const flags = buildTokenRiskFlags(profile, metrics);
      for (const flag of flags) {
        expect(flag.safeToDisplay).toBe(true);
      }
    }
  });

  it('hasCriticalFlag returns false for info-only flags', () => {
    const flags = [makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'info only')];
    expect(hasCriticalFlag(flags)).toBe(false);
  });

  it('hasCriticalFlag returns true when critical flag present', () => {
    const flags = [
      makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'ok'),
      makeRiskFlag('MISSING_METADATA', 'critical', 'bad'),
    ];
    expect(hasCriticalFlag(flags)).toBe(true);
  });

  it('filterFlagsBySeverity filters correctly', () => {
    const flags = [
      makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'i'),
      makeRiskFlag('MISSING_METADATA', 'critical', 'c'),
      makeRiskFlag('MISSING_SOCIALS', 'warn', 'w'),
    ];
    expect(filterFlagsBySeverity(flags, 'info')).toHaveLength(1);
    expect(filterFlagsBySeverity(flags, 'critical')).toHaveLength(1);
    expect(filterFlagsBySeverity(flags, 'warn')).toHaveLength(1);
    expect(filterFlagsBySeverity(flags, 'high')).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════
// D. Classification
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — D. Classification', () => {
  it('Critical flags produce reject classification', () => {
    const flags = [makeRiskFlag('HIGH_TOP_HOLDER_CONCENTRATION', 'critical', 'crit')];
    const cls = classifyToken(flags, 80, 0.9, GOOD_FIXTURE_TOKEN_PROFILE);
    expect(cls).toBe('reject');
  });

  it('Insufficient confidence produces insufficient_data classification', () => {
    const flags = [makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'info')];
    const cls = classifyToken(flags, 80, 0.1, GOOD_FIXTURE_TOKEN_PROFILE);
    expect(cls).toBe('insufficient_data');
  });

  it('Low score on fixture produces fixture_only classification', () => {
    const flags = [makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'info')];
    const cls = classifyToken(flags, 20, 0.5, GOOD_FIXTURE_TOKEN_PROFILE);
    expect(cls).toBe('fixture_only');
  });

  it('High fixture score produces analysis_only, never trade wording', () => {
    const flags = [makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'info')];
    const cls = classifyToken(flags, 90, 0.9, GOOD_FIXTURE_TOKEN_PROFILE);
    expect(cls).toBe('analysis_only');
    // Must not be trade-related
    expect(cls).not.toBe('buy');
    expect(cls).not.toBe('sell');
    expect(cls).not.toBe('execute');
    expect(cls).not.toBe('trade');
    expect(cls).not.toBe('live_candidate');
    expect(cls).not.toBe('auto_candidate');
  });

  it('All TOKEN_CLASSIFICATIONS pass isClassificationSafe', () => {
    for (const cls of TOKEN_CLASSIFICATIONS) {
      expect(isClassificationSafe(cls)).toBe(true);
    }
  });

  it('isTokenClassification correctly identifies valid classifications', () => {
    expect(isTokenClassification('reject')).toBe(true);
    expect(isTokenClassification('watch_only')).toBe(true);
    expect(isTokenClassification('analysis_only')).toBe(true);
    expect(isTokenClassification('insufficient_data')).toBe(true);
    expect(isTokenClassification('fixture_only')).toBe(true);
    expect(isTokenClassification('buy')).toBe(false);
    expect(isTokenClassification('sell')).toBe(false);
    expect(isTokenClassification('execute')).toBe(false);
    expect(isTokenClassification('trade')).toBe(false);
  });

  it('No classification uses buy/sell/execute/trade wording', () => {
    const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'live_candidate', 'auto_candidate'];
    for (const cls of TOKEN_CLASSIFICATIONS) {
      for (const word of forbidden) {
        expect(cls).not.toContain(word);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════
// E. Safety Invariants
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — E. Safety Invariants', () => {
  it('All fixture profiles have liveData: false', () => {
    for (const { profile } of ALL_FIXTURE_TOKEN_PAIRS) {
      expect(profile.liveData).toBe(false);
    }
  });

  it('All fixture profiles have fixtureOnly: true', () => {
    for (const { profile } of ALL_FIXTURE_TOKEN_PAIRS) {
      expect(profile.fixtureOnly).toBe(true);
    }
  });

  it('All fixture metrics have liveData: false', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      expect(metrics.liveData).toBe(false);
    }
  });

  it('All fixture metrics have fixtureOnly: true', () => {
    for (const { metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      expect(metrics.fixtureOnly).toBe(true);
    }
  });

  it('All built results have actionAllowed: false', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const result = buildTokenIntelligenceResult(profile, metrics);
      if (result.ok) {
        expect(result.value.actionAllowed).toBe(false);
      }
    }
  });

  it('All built results have tradingAllowed: false', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const result = buildTokenIntelligenceResult(profile, metrics);
      if (result.ok) {
        expect(result.value.tradingAllowed).toBe(false);
      }
    }
  });

  it('All built results have executionAllowed: false', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const result = buildTokenIntelligenceResult(profile, metrics);
      if (result.ok) {
        expect(result.value.executionAllowed).toBe(false);
      }
    }
  });

  it('All built results have liveData: false', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const result = buildTokenIntelligenceResult(profile, metrics);
      if (result.ok) {
        expect(result.value.liveData).toBe(false);
      }
    }
  });

  it('Capabilities: canUseSolanaRpc is false', () => {
    expect(getTokenIntelligenceCapabilities().canUseSolanaRpc).toBe(false);
  });

  it('Capabilities: canUseProviderApis is false', () => {
    expect(getTokenIntelligenceCapabilities().canUseProviderApis).toBe(false);
  });

  it('Capabilities: canCreateTradeIntents is false', () => {
    expect(getTokenIntelligenceCapabilities().canCreateTradeIntents).toBe(false);
  });

  it('Capabilities: canExecute is false', () => {
    expect(getTokenIntelligenceCapabilities().canExecute).toBe(false);
  });

  it('Capabilities: canTrade is false', () => {
    expect(getTokenIntelligenceCapabilities().canTrade).toBe(false);
  });

  it('State static status: liveData is forbidden', () => {
    expect(PHASE_8_TOKEN_INTELLIGENCE_STATUS.liveData).toBe('forbidden');
  });

  it('State static status: providerApis is forbidden', () => {
    expect(PHASE_8_TOKEN_INTELLIGENCE_STATUS.providerApis).toBe('forbidden');
  });

  it('State static status: solanaRpc is forbidden', () => {
    expect(PHASE_8_TOKEN_INTELLIGENCE_STATUS.solanaRpc).toBe('forbidden');
  });

  it('State static status: tradeActions is forbidden', () => {
    expect(PHASE_8_TOKEN_INTELLIGENCE_STATUS.tradeActions).toBe('forbidden');
  });

  it('State static status: execution is forbidden', () => {
    expect(PHASE_8_TOKEN_INTELLIGENCE_STATUS.execution).toBe('forbidden');
  });

  it('State builder returns safe snapshot', () => {
    const snapshot = buildTokenIntelligenceStatusSnapshot();
    expect(snapshot.safeToDisplay).toBe(true);
    expect(snapshot.status).toBe('local_model_ready');
    expect(snapshot.fixtureScoring).toBe('available');
  });
});

// ══════════════════════════════════════════════════════════════
// F. Fixture Engine
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — F. Fixture Engine', () => {
  it('Good fixture scores higher than missing metadata fixture', () => {
    const goodR = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    const missingR = buildTokenIntelligenceResult(MISSING_METADATA_FIXTURE_TOKEN_PROFILE, MISSING_METADATA_FIXTURE_TOKEN_METRICS);
    expect(goodR.ok).toBe(true);
    expect(missingR.ok).toBe(true);
    if (!goodR.ok || !missingR.ok) return;
    expect(goodR.value.finalScore).toBeGreaterThan(missingR.value.finalScore);
  });

  it('Good fixture scores higher than high sell pressure fixture', () => {
    const goodR = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    const sellR = buildTokenIntelligenceResult(HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE, HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS);
    expect(goodR.ok).toBe(true);
    expect(sellR.ok).toBe(true);
    if (!goodR.ok || !sellR.ok) return;
    expect(goodR.value.finalScore).toBeGreaterThan(sellR.value.finalScore);
  });

  it('Concentrated holder fixture has HIGH_TOP_HOLDER_CONCENTRATION risk flag', () => {
    const r = buildTokenIntelligenceResult(CONCENTRATED_HOLDER_FIXTURE_TOKEN_PROFILE, CONCENTRATED_HOLDER_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const codes = r.value.riskFlags.map((f) => f.code);
    expect(codes).toContain('HIGH_TOP_HOLDER_CONCENTRATION');
  });

  it('Low liquidity fixture has LOW_LIQUIDITY risk flag', () => {
    const r = buildTokenIntelligenceResult(LOW_LIQUIDITY_FIXTURE_TOKEN_PROFILE, LOW_LIQUIDITY_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const codes = r.value.riskFlags.map((f) => f.code);
    expect(codes).toContain('LOW_LIQUIDITY');
  });

  it('High sell pressure fixture has SELL_PRESSURE_HIGH risk flag', () => {
    const r = buildTokenIntelligenceResult(HIGH_SELL_PRESSURE_FIXTURE_TOKEN_PROFILE, HIGH_SELL_PRESSURE_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const codes = r.value.riskFlags.map((f) => f.code);
    expect(codes).toContain('SELL_PRESSURE_HIGH');
  });

  it('Scoring is deterministic: same fixture produces same score twice', () => {
    const r1 = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    const r2 = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (!r1.ok || !r2.ok) return;
    expect(r1.value.finalScore).toBe(r2.value.finalScore);
    expect(r1.value.confidence).toBe(r2.value.confidence);
    expect(r1.value.classification).toBe(r2.value.classification);
  });

  it('Missing metadata fixture has lower confidence than good fixture', () => {
    const goodR = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    const missingR = buildTokenIntelligenceResult(MISSING_METADATA_FIXTURE_TOKEN_PROFILE, MISSING_METADATA_FIXTURE_TOKEN_METRICS);
    if (!goodR.ok || !missingR.ok) return;
    expect(goodR.value.confidence).toBeGreaterThan(missingR.value.confidence);
  });

  it('All fixture results have safeToDisplay: true', () => {
    for (const { profile, metrics } of ALL_FIXTURE_TOKEN_PAIRS) {
      const r = buildTokenIntelligenceResult(profile, metrics);
      if (r.ok) {
        expect(r.value.safeToDisplay).toBe(true);
      }
    }
  });

  it('tokenMint in result matches profile tokenMint', () => {
    const r = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, GOOD_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.tokenMint).toBe(GOOD_FIXTURE_TOKEN_PROFILE.tokenMint);
  });
});

// ══════════════════════════════════════════════════════════════
// G. Error Safety
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — G. Error Safety', () => {
  it('Invalid profile returns safe error result (not throw)', () => {
    const r = buildTokenIntelligenceResult(null, GOOD_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.safeToDisplay).toBe(true);
    expect(typeof r.error.code).toBe('string');
    expect(typeof r.error.message).toBe('string');
  });

  it('Invalid metrics returns safe error result (not throw)', () => {
    const r = buildTokenIntelligenceResult(GOOD_FIXTURE_TOKEN_PROFILE, null);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.safeToDisplay).toBe(true);
  });

  it('Profile with liveData: true returns safe error', () => {
    const badProfile = { ...GOOD_FIXTURE_TOKEN_PROFILE, liveData: true };
    const r = buildTokenIntelligenceResult(badProfile, GOOD_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.code).toBe('LIVE_DATA_FORBIDDEN');
    expect(r.error.safeToDisplay).toBe(true);
  });

  it('Profile with fixtureOnly: false returns safe error', () => {
    const badProfile = { ...GOOD_FIXTURE_TOKEN_PROFILE, fixtureOnly: false };
    const r = buildTokenIntelligenceResult(badProfile, GOOD_FIXTURE_TOKEN_METRICS);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.code).toBe('TOKEN_INTELLIGENCE_FIXTURE_ONLY');
  });

  it('Mismatched tokenMint between profile and metrics returns error', () => {
    const r = buildTokenIntelligenceResult(
      GOOD_FIXTURE_TOKEN_PROFILE,
      { ...GOOD_FIXTURE_TOKEN_METRICS, tokenMint: 'DIFFERENT_MINT_000000000000000000000' },
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.safeToDisplay).toBe(true);
  });

  it('Error message does not contain stack traces', () => {
    const r = buildTokenIntelligenceResult(null, null);
    if (r.ok) return;
    expect(r.error.message).not.toMatch(/at Object\./);
    expect(r.error.message).not.toMatch(/Error: /);
  });

  it('tiOk/tiErr helpers produce correct shapes', () => {
    const ok = tiOk(42);
    expect(ok.ok).toBe(true);
    expect(ok.value).toBe(42);
    expect(isTiOk(ok)).toBe(true);
    expect(isTiErr(ok)).toBe(false);

    const error = tiErr('INVALID_TOKEN_MINT', 'bad mint');
    expect(error.ok).toBe(false);
    expect(error.error.code).toBe('INVALID_TOKEN_MINT');
    expect(error.error.safeToDisplay).toBe(true);
    expect(isTiErr(error)).toBe(true);
    expect(isTiOk(error)).toBe(false);
  });

  it('validateTokenMint rejects empty string', () => {
    const r = validateTokenMint('');
    expect(r.ok).toBe(false);
  });

  it('validateTokenMint rejects whitespace-only string', () => {
    const r = validateTokenMint('   ');
    expect(r.ok).toBe(false);
  });

  it('validateTokenMint accepts plausible fixture mint', () => {
    const r = validateTokenMint('FIXTURE_GOOD_MINT_0000000000000000001');
    expect(r.ok).toBe(true);
  });

  it('validateTokenMint rejects mint with internal whitespace', () => {
    const r = validateTokenMint('FIXTURE MINT');
    expect(r.ok).toBe(false);
  });

  it('validateScoreBounds rejects out-of-range scores', () => {
    expect(validateScoreBounds(-1, 'test').ok).toBe(false);
    expect(validateScoreBounds(101, 'test').ok).toBe(false);
    expect(validateScoreBounds(0, 'test').ok).toBe(true);
    expect(validateScoreBounds(100, 'test').ok).toBe(true);
    expect(validateScoreBounds(50, 'test').ok).toBe(true);
  });

  it('validateConfidenceBounds rejects out-of-range confidence', () => {
    expect(validateConfidenceBounds(-0.1).ok).toBe(false);
    expect(validateConfidenceBounds(1.1).ok).toBe(false);
    expect(validateConfidenceBounds(0).ok).toBe(true);
    expect(validateConfidenceBounds(1).ok).toBe(true);
    expect(validateConfidenceBounds(0.5).ok).toBe(true);
  });

  it('Error safeToDisplay is always true', () => {
    const e = tiErr('INVALID_TOKEN_PROFILE', 'test error');
    expect(e.error.safeToDisplay).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════
// H. Regression (spot-check Phase 1–7E public API not broken)
// ══════════════════════════════════════════════════════════════

describe('Phase 8 — H. Regression (Phase 1–7E spot-check)', () => {
  it('Phase 8 import does not break @sonic/state exports', async () => {
    const state = await import('@sonic/state');
    expect(typeof state.buildEventEngineReadinessSnapshot).toBe('function');
    expect(typeof state.buildPhase8ReadinessGate).toBe('function');
    expect(typeof state.PHASE_7E_EVENT_ENGINE_SUMMARY).toBe('object');
    // Phase 8 additions
    expect(typeof state.buildTokenIntelligenceStatusSnapshot).toBe('function');
    expect(typeof state.PHASE_8_TOKEN_INTELLIGENCE_STATUS).toBe('object');
  });

  it('Phase 8 import does not break @sonic/event-engine exports', async () => {
    const ee = await import('@sonic/event-engine');
    expect(typeof ee.InMemoryEventBus).toBe('function');
    expect(typeof ee.buildProviderReadinessReport).toBe('function');
    expect(typeof ee.PHASE_7D_READINESS_SUMMARY).toBe('object');
  });
});
