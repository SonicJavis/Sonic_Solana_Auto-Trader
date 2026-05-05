/**
 * Phase 9 — Creator Intelligence v1 tests.
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
  buildCreatorIntelligenceResult,
  getCreatorIntelligenceCapabilities,
  scoreCreatorProfile,
  buildCreatorRiskFlags,
  // Fixtures
  STRONG_FIXTURE_CREATOR_PROFILE,
  STRONG_FIXTURE_CREATOR_HISTORY,
  NEW_FIXTURE_CREATOR_PROFILE,
  NEW_FIXTURE_CREATOR_HISTORY,
  FAST_DUMP_FIXTURE_CREATOR_PROFILE,
  FAST_DUMP_FIXTURE_CREATOR_HISTORY,
  REPEATED_METADATA_FIXTURE_CREATOR_PROFILE,
  REPEATED_METADATA_FIXTURE_CREATOR_HISTORY,
  SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE,
  SUSPICIOUS_FUNDING_FIXTURE_CREATOR_HISTORY,
  RUG_LIKE_FIXTURE_CREATOR_PROFILE,
  RUG_LIKE_FIXTURE_CREATOR_HISTORY,
  ALL_FIXTURE_CREATOR_PAIRS,
  // Scoring
  scoreSuccess,
  scoreLaunchQuality,
  scoreConsistency,
  scoreSuspiciousPatterns,
  // Validation
  validateCreatorId,
  validateCreatorAddress,
  validateCreatorProfile,
  validateCreatorScoreBounds,
  validateCreatorConfidenceBounds,
  // Errors
  ciOk,
  ciErr,
  isCiOk,
  isCiErr,
  // Classification helpers
  isCreatorClassification,
  isCreatorClassificationSafe,
  CREATOR_CLASSIFICATIONS,
  // Risk flag helpers
  makeCreatorRiskFlag,
  hasCreatorCriticalFlag,
  filterCreatorFlagsBySeverity,
  filterCreatorFlagsByCode,
} from '@sonic/creator-intelligence';

// ─────────────────────────────────────────────────────────────────────────────
// A. Types / Models
// ─────────────────────────────────────────────────────────────────────────────

describe('A. Types / Models', () => {
  it('creator profile has expected shape', () => {
    const profile = STRONG_FIXTURE_CREATOR_PROFILE;
    expect(typeof profile.creatorId).toBe('string');
    expect(typeof profile.creatorAddress).toBe('string');
    expect(typeof profile.displayLabel).toBe('string');
    expect(typeof profile.firstSeenAt).toBe('string');
    expect(typeof profile.lastSeenAt).toBe('string');
    expect(profile.source).toBe('fixture');
    expect(profile.fixtureOnly).toBe(true);
    expect(profile.liveData).toBe(false);
    expect(profile.safeToDisplay).toBe(true);
  });

  it('creator history has expected shape', () => {
    const history = STRONG_FIXTURE_CREATOR_HISTORY;
    expect(typeof history.creatorId).toBe('string');
    expect(typeof history.launchCount).toBe('number');
    expect(typeof history.migratedLaunchCount).toBe('number');
    expect(typeof history.failedLaunchCount).toBe('number');
    expect(typeof history.averagePeakQuality).toBe('number');
    expect(typeof history.averageDumpSpeed).toBe('number');
    expect(typeof history.averageHolderQuality).toBe('number');
    expect(typeof history.averageLiquidityQuality).toBe('number');
    expect(typeof history.suspiciousFundingSignals).toBe('number');
    expect(typeof history.repeatedMetadataSignals).toBe('number');
    expect(typeof history.bundleAbuseSignals).toBe('number');
    expect(typeof history.rugLikeLaunchCount).toBe('number');
    expect(history.fixtureOnly).toBe(true);
    expect(history.liveData).toBe(false);
  });

  it('component score shapes are correct', () => {
    const { componentScores } = scoreCreatorProfile(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    const s = componentScores.successScore;
    expect(typeof s.launchCountQuality).toBe('number');
    expect(typeof s.migrationRateQuality).toBe('number');
    expect(typeof s.peakQuality).toBe('number');
    expect(typeof s.failurePenalty).toBe('number');
    expect(typeof s.score).toBe('number');
    expect(Array.isArray(s.reasons)).toBe(true);

    const lq = componentScores.launchQualityScore;
    expect(typeof lq.holderQuality).toBe('number');
    expect(typeof lq.liquidityQuality).toBe('number');
    expect(typeof lq.metadataQualityPlaceholder).toBe('number');
    expect(typeof lq.momentumQualityPlaceholder).toBe('number');

    const c = componentScores.consistencyScore;
    expect(typeof c.repeatabilityQuality).toBe('number');
    expect(typeof c.positiveHistoryConsistency).toBe('number');
    expect(typeof c.negativeHistoryPenalty).toBe('number');

    const sp = componentScores.suspiciousPatternScore;
    expect(typeof sp.suspiciousFundingPenalty).toBe('number');
    expect(typeof sp.repeatedMetadataPenalty).toBe('number');
    expect(typeof sp.bundleAbusePenalty).toBe('number');
    expect(typeof sp.rugLikeLaunchPenalty).toBe('number');
    expect(typeof sp.fastDumpPenalty).toBe('number');
  });

  it('risk flag entry has expected shape', () => {
    const flag = makeCreatorRiskFlag('LOW_LAUNCH_COUNT', 'warn', 'test reason');
    expect(typeof flag.code).toBe('string');
    expect(typeof flag.severity).toBe('string');
    expect(typeof flag.reason).toBe('string');
    expect(flag.safeToDisplay).toBe(true);
  });

  it('CreatorIntelligenceResult has all required fields', () => {
    const result = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const r = result.value;
    expect(typeof r.creatorId).toBe('string');
    expect(r.profile).toBeDefined();
    expect(r.history).toBeDefined();
    expect(r.componentScores).toBeDefined();
    expect(typeof r.finalScore).toBe('number');
    expect(typeof r.confidence).toBe('number');
    expect(typeof r.classification).toBe('string');
    expect(Array.isArray(r.riskFlags)).toBe(true);
    expect(Array.isArray(r.reasons)).toBe(true);
    expect(typeof r.generatedAt).toBe('string');
    expect(r.fixtureOnly).toBe(true);
    expect(r.liveData).toBe(false);
    expect(r.actionAllowed).toBe(false);
    expect(r.tradingAllowed).toBe(false);
    expect(r.executionAllowed).toBe(false);
    expect(r.safeToDisplay).toBe(true);
  });

  it('capabilities — all unsafe fields are false', () => {
    const caps = getCreatorIntelligenceCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canUseWalletData).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
    expect(caps.safeToDisplay).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. Scoring
// ─────────────────────────────────────────────────────────────────────────────

describe('B. Scoring', () => {
  it('success score is bounded 0–100', () => {
    for (const { history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const s = scoreSuccess(history);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('launch quality score is bounded 0–100', () => {
    for (const { history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const s = scoreLaunchQuality(history);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('consistency score is bounded 0–100', () => {
    for (const { history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const s = scoreConsistency(history);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('suspicious pattern score is bounded 0–100', () => {
    for (const { history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const s = scoreSuspiciousPatterns(history);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('suspicious pattern score: higher = safer (no patterns = 100)', () => {
    const cleanHistory = {
      ...STRONG_FIXTURE_CREATOR_HISTORY,
      suspiciousFundingSignals: 0,
      repeatedMetadataSignals: 0,
      bundleAbuseSignals: 0,
      rugLikeLaunchCount: 0,
      averageDumpSpeed: 0.0,
    };
    const s = scoreSuspiciousPatterns(cleanHistory);
    expect(s.score).toBe(100);
  });

  it('missing data (no launches) reduces confidence', () => {
    const { confidence } = scoreCreatorProfile(
      NEW_FIXTURE_CREATOR_PROFILE,
      NEW_FIXTURE_CREATOR_HISTORY,
    );
    expect(confidence).toBeLessThan(0.3);
  });

  it('final score is bounded 0–100', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const { finalScore } = scoreCreatorProfile(profile, history);
      expect(finalScore).toBeGreaterThanOrEqual(0);
      expect(finalScore).toBeLessThanOrEqual(100);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. Risk Flags
// ─────────────────────────────────────────────────────────────────────────────

describe('C. Risk Flags', () => {
  it('INSUFFICIENT_CREATOR_DATA flag raised for new creator', () => {
    const flags = buildCreatorRiskFlags(NEW_FIXTURE_CREATOR_PROFILE, NEW_FIXTURE_CREATOR_HISTORY);
    expect(flags.some((f) => f.code === 'INSUFFICIENT_CREATOR_DATA')).toBe(true);
  });

  it('LOW_LAUNCH_COUNT flag raised for 1–2 launches', () => {
    const history = { ...STRONG_FIXTURE_CREATOR_HISTORY, creatorId: STRONG_FIXTURE_CREATOR_HISTORY.creatorId, launchCount: 2 };
    const flags = buildCreatorRiskFlags(STRONG_FIXTURE_CREATOR_PROFILE, history);
    expect(flags.some((f) => f.code === 'LOW_LAUNCH_COUNT')).toBe(true);
  });

  it('HIGH_FAILURE_RATE flag raised for >50% failure rate', () => {
    const flags = buildCreatorRiskFlags(
      FAST_DUMP_FIXTURE_CREATOR_PROFILE,
      FAST_DUMP_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'HIGH_FAILURE_RATE')).toBe(true);
  });

  it('LOW_MIGRATION_RATE flag raised for low migration', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'LOW_MIGRATION_RATE')).toBe(true);
  });

  it('FAST_DUMP_HISTORY flag raised for high dump speed', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'FAST_DUMP_HISTORY')).toBe(true);
  });

  it('SUSPICIOUS_FUNDING_PLACEHOLDER flag raised', () => {
    const flags = buildCreatorRiskFlags(
      SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE,
      SUSPICIOUS_FUNDING_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'SUSPICIOUS_FUNDING_PLACEHOLDER')).toBe(true);
  });

  it('REPEATED_METADATA_PLACEHOLDER flag raised', () => {
    const flags = buildCreatorRiskFlags(
      REPEATED_METADATA_FIXTURE_CREATOR_PROFILE,
      REPEATED_METADATA_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'REPEATED_METADATA_PLACEHOLDER')).toBe(true);
  });

  it('BUNDLE_ABUSE_PLACEHOLDER flag raised', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'BUNDLE_ABUSE_PLACEHOLDER')).toBe(true);
  });

  it('RUG_LIKE_HISTORY flag raised for rug-like creator', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(flags.some((f) => f.code === 'RUG_LIKE_HISTORY')).toBe(true);
  });

  it('WALLET_CLUSTER_UNKNOWN placeholder flag always present', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const flags = buildCreatorRiskFlags(profile, history);
      expect(flags.some((f) => f.code === 'WALLET_CLUSTER_UNKNOWN')).toBe(true);
    }
  });

  it('BUNDLE_RISK_UNKNOWN placeholder flag always present', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const flags = buildCreatorRiskFlags(profile, history);
      expect(flags.some((f) => f.code === 'BUNDLE_RISK_UNKNOWN')).toBe(true);
    }
  });

  it('all flag entries have safeToDisplay = true', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const flags = buildCreatorRiskFlags(profile, history);
      for (const flag of flags) {
        expect(flag.safeToDisplay).toBe(true);
      }
    }
  });

  it('hasCreatorCriticalFlag returns true when critical flags present', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(hasCreatorCriticalFlag(flags)).toBe(true);
  });

  it('filterCreatorFlagsBySeverity works correctly', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    const criticals = filterCreatorFlagsBySeverity(flags, 'critical');
    expect(criticals.every((f) => f.severity === 'critical')).toBe(true);
  });

  it('filterCreatorFlagsByCode works correctly', () => {
    const flags = buildCreatorRiskFlags(NEW_FIXTURE_CREATOR_PROFILE, NEW_FIXTURE_CREATOR_HISTORY);
    const matches = filterCreatorFlagsByCode(flags, 'LIVE_DATA_UNAVAILABLE');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((f) => f.code === 'LIVE_DATA_UNAVAILABLE')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Classification
// ─────────────────────────────────────────────────────────────────────────────

describe('D. Classification', () => {
  it('critical flags produce reject classification', () => {
    const flags = buildCreatorRiskFlags(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    const result = buildCreatorIntelligenceResult(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('reject');
    expect(hasCreatorCriticalFlag(flags)).toBe(true);
  });

  it('new creator produces insufficient_data classification', () => {
    const result = buildCreatorIntelligenceResult(
      NEW_FIXTURE_CREATOR_PROFILE,
      NEW_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('insufficient_data');
  });

  it('fixture-only profile with low score produces fixture_only or analysis_only (not trade)', () => {
    const result = buildCreatorIntelligenceResult(
      FAST_DUMP_FIXTURE_CREATOR_PROFILE,
      FAST_DUMP_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const validSafeClassifications = ['fixture_only', 'watch_only', 'analysis_only', 'insufficient_data', 'reject'];
    expect(validSafeClassifications).toContain(result.value.classification);
  });

  it('strong fixture creator scores high but remains analysis_only (never trade)', () => {
    const result = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('analysis_only');
  });

  it('no classification uses forbidden trade wording', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const result = buildCreatorIntelligenceResult(profile, history);
      if (!result.ok) continue;
      expect(isCreatorClassificationSafe(result.value.classification)).toBe(true);
    }
  });

  it('all CREATOR_CLASSIFICATIONS are safe', () => {
    for (const cls of CREATOR_CLASSIFICATIONS) {
      expect(isCreatorClassificationSafe(cls)).toBe(true);
    }
  });

  it('isCreatorClassification recognises valid values', () => {
    expect(isCreatorClassification('reject')).toBe(true);
    expect(isCreatorClassification('watch_only')).toBe(true);
    expect(isCreatorClassification('analysis_only')).toBe(true);
    expect(isCreatorClassification('insufficient_data')).toBe(true);
    expect(isCreatorClassification('fixture_only')).toBe(true);
    expect(isCreatorClassification('buy')).toBe(false);
    expect(isCreatorClassification('sell')).toBe(false);
    expect(isCreatorClassification('execute')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. Safety Invariants
// ─────────────────────────────────────────────────────────────────────────────

describe('E. Safety Invariants', () => {
  it('liveData is always false in all fixture results', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const result = buildCreatorIntelligenceResult(profile, history);
      if (!result.ok) continue;
      expect(result.value.liveData).toBe(false);
    }
  });

  it('fixtureOnly is true for all fixture profiles', () => {
    for (const { profile } of ALL_FIXTURE_CREATOR_PAIRS) {
      expect(profile.fixtureOnly).toBe(true);
    }
  });

  it('actionAllowed is always false', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const result = buildCreatorIntelligenceResult(profile, history);
      if (!result.ok) continue;
      expect(result.value.actionAllowed).toBe(false);
    }
  });

  it('tradingAllowed is always false', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const result = buildCreatorIntelligenceResult(profile, history);
      if (!result.ok) continue;
      expect(result.value.tradingAllowed).toBe(false);
    }
  });

  it('executionAllowed is always false', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      const result = buildCreatorIntelligenceResult(profile, history);
      if (!result.ok) continue;
      expect(result.value.executionAllowed).toBe(false);
    }
  });

  it('canUseSolanaRpc is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canUseSolanaRpc).toBe(false);
  });

  it('canUseProviderApis is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canUseProviderApis).toBe(false);
  });

  it('canUseWalletData is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canUseWalletData).toBe(false);
  });

  it('canCreateTradeIntents is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canCreateTradeIntents).toBe(false);
  });

  it('canTrade is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canTrade).toBe(false);
  });

  it('canExecute is false in capabilities', () => {
    expect(getCreatorIntelligenceCapabilities().canExecute).toBe(false);
  });

  it('all fixture history liveData fields are false', () => {
    for (const { history } of ALL_FIXTURE_CREATOR_PAIRS) {
      expect(history.liveData).toBe(false);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Fixture Engine
// ─────────────────────────────────────────────────────────────────────────────

describe('F. Fixture Engine', () => {
  it('strong creator scores higher than rug-like creator', () => {
    const strong = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    const rugLike = buildCreatorIntelligenceResult(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(strong.ok).toBe(true);
    expect(rugLike.ok).toBe(true);
    if (!strong.ok || !rugLike.ok) return;
    expect(strong.value.finalScore).toBeGreaterThan(rugLike.value.finalScore);
  });

  it('strong creator scores higher than new creator', () => {
    const strong = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    const newCreator = buildCreatorIntelligenceResult(
      NEW_FIXTURE_CREATOR_PROFILE,
      NEW_FIXTURE_CREATOR_HISTORY,
    );
    expect(strong.ok).toBe(true);
    expect(newCreator.ok).toBe(true);
    if (!strong.ok || !newCreator.ok) return;
    expect(strong.value.finalScore).toBeGreaterThan(newCreator.value.finalScore);
  });

  it('new creator produces INSUFFICIENT_CREATOR_DATA risk flag', () => {
    const result = buildCreatorIntelligenceResult(
      NEW_FIXTURE_CREATOR_PROFILE,
      NEW_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.riskFlags.some((f) => f.code === 'INSUFFICIENT_CREATOR_DATA')).toBe(true);
  });

  it('fast dump creator produces FAST_DUMP_HISTORY risk flag', () => {
    const result = buildCreatorIntelligenceResult(
      FAST_DUMP_FIXTURE_CREATOR_PROFILE,
      FAST_DUMP_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.riskFlags.some((f) => f.code === 'FAST_DUMP_HISTORY')).toBe(true);
  });

  it('repeated metadata creator produces REPEATED_METADATA_PLACEHOLDER risk flag', () => {
    const result = buildCreatorIntelligenceResult(
      REPEATED_METADATA_FIXTURE_CREATOR_PROFILE,
      REPEATED_METADATA_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.riskFlags.some((f) => f.code === 'REPEATED_METADATA_PLACEHOLDER')).toBe(true);
  });

  it('suspicious funding creator produces SUSPICIOUS_FUNDING_PLACEHOLDER risk flag', () => {
    const result = buildCreatorIntelligenceResult(
      SUSPICIOUS_FUNDING_FIXTURE_CREATOR_PROFILE,
      SUSPICIOUS_FUNDING_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.riskFlags.some((f) => f.code === 'SUSPICIOUS_FUNDING_PLACEHOLDER')).toBe(true);
  });

  it('rug-like creator produces critical risk and reject classification', () => {
    const result = buildCreatorIntelligenceResult(
      RUG_LIKE_FIXTURE_CREATOR_PROFILE,
      RUG_LIKE_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('reject');
    expect(result.value.riskFlags.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('scoring is deterministic — same input produces same score', () => {
    const r1 = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    const r2 = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      STRONG_FIXTURE_CREATOR_HISTORY,
    );
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (!r1.ok || !r2.ok) return;
    expect(r1.value.finalScore).toBe(r2.value.finalScore);
    expect(r1.value.confidence).toBe(r2.value.confidence);
    expect(r1.value.classification).toBe(r2.value.classification);
  });

  it('ALL_FIXTURE_CREATOR_PAIRS has 6 entries', () => {
    expect(ALL_FIXTURE_CREATOR_PAIRS.length).toBe(6);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// G. Error Safety
// ─────────────────────────────────────────────────────────────────────────────

describe('G. Error Safety', () => {
  it('invalid creator profile returns safe error, not thrown exception', () => {
    const result = buildCreatorIntelligenceResult(null, STRONG_FIXTURE_CREATOR_HISTORY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
    expect(typeof result.error.message).toBe('string');
    expect(typeof result.error.code).toBe('string');
  });

  it('invalid creator history returns safe error', () => {
    const result = buildCreatorIntelligenceResult(STRONG_FIXTURE_CREATOR_PROFILE, null);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('mismatched creatorId returns safe error', () => {
    const result = buildCreatorIntelligenceResult(
      STRONG_FIXTURE_CREATOR_PROFILE,
      NEW_FIXTURE_CREATOR_HISTORY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('error message does not contain stack traces', () => {
    const result = buildCreatorIntelligenceResult(undefined, undefined);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).not.toContain('at Object.');
    expect(result.error.message).not.toContain('Error:');
  });

  it('error message does not contain env values or secrets', () => {
    const result = buildCreatorIntelligenceResult({}, {});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).not.toContain('PRIVATE_KEY');
    expect(result.error.message).not.toContain('SECRET');
    expect(result.error.message).not.toContain('MNEMONIC');
    expect(result.error.message).not.toContain('rpcUrl');
    expect(result.error.message).not.toContain('apiKey');
  });

  it('ciOk wraps value correctly', () => {
    const r = ciOk(42);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toBe(42);
  });

  it('ciErr wraps error correctly', () => {
    const r = ciErr('INVALID_CREATOR_ID', 'test error');
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error.code).toBe('INVALID_CREATOR_ID');
    expect(r.error.message).toBe('test error');
    expect(r.error.safeToDisplay).toBe(true);
  });

  it('isCiOk and isCiErr work as type guards', () => {
    const ok = ciOk('test');
    const err = ciErr('INVALID_CREATOR_ID', 'msg');
    expect(isCiOk(ok)).toBe(true);
    expect(isCiErr(ok)).toBe(false);
    expect(isCiOk(err)).toBe(false);
    expect(isCiErr(err)).toBe(true);
  });

  it('profile with liveData=true returns LIVE_DATA_FORBIDDEN error', () => {
    const badProfile = { ...STRONG_FIXTURE_CREATOR_PROFILE, liveData: true };
    const result = validateCreatorProfile(badProfile);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('profile with fixtureOnly=false returns CREATOR_INTELLIGENCE_FIXTURE_ONLY error', () => {
    const badProfile = { ...STRONG_FIXTURE_CREATOR_PROFILE, fixtureOnly: false };
    const result = validateCreatorProfile(badProfile);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('CREATOR_INTELLIGENCE_FIXTURE_ONLY');
  });

  it('validateCreatorId rejects empty ID', () => {
    expect(validateCreatorId('').ok).toBe(false);
    expect(validateCreatorId('  ').ok).toBe(false);
  });

  it('validateCreatorAddress rejects empty address', () => {
    expect(validateCreatorAddress('').ok).toBe(false);
  });

  it('validateCreatorScoreBounds rejects out-of-range values', () => {
    expect(validateCreatorScoreBounds(-1, 'test').ok).toBe(false);
    expect(validateCreatorScoreBounds(101, 'test').ok).toBe(false);
    expect(validateCreatorScoreBounds(50, 'test').ok).toBe(true);
  });

  it('validateCreatorConfidenceBounds rejects out-of-range values', () => {
    expect(validateCreatorConfidenceBounds(-0.1).ok).toBe(false);
    expect(validateCreatorConfidenceBounds(1.1).ok).toBe(false);
    expect(validateCreatorConfidenceBounds(0.5).ok).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// H. Regression
// ─────────────────────────────────────────────────────────────────────────────

describe('H. Regression — Phase 9 does not break prior foundations', () => {
  it('creator-intelligence package is importable', () => {
    const caps = getCreatorIntelligenceCapabilities();
    expect(caps).toBeDefined();
  });

  it('ALL_FIXTURE_CREATOR_PAIRS are all processable without errors', () => {
    for (const { profile, history } of ALL_FIXTURE_CREATOR_PAIRS) {
      // Should not throw
      const flags = buildCreatorRiskFlags(profile, history);
      expect(Array.isArray(flags)).toBe(true);
      const scored = scoreCreatorProfile(profile, history);
      expect(typeof scored.finalScore).toBe('number');
    }
  });

  it('no Phase 9 export uses forbidden trade wording in classification', () => {
    for (const cls of CREATOR_CLASSIFICATIONS) {
      const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'enter', 'ape'];
      for (const word of forbidden) {
        expect(cls).not.toContain(word);
      }
    }
  });
});
