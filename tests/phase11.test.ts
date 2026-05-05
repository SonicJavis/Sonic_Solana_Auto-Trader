/**
 * Phase 11 — Bundle / Manipulation Detector v1 tests.
 *
 * Covers:
 *   A. Types/models
 *   B. Scoring (bounded, correct penalties)
 *   C. Risk flags
 *   D. Classification (no trade wording)
 *   E. Safety invariants
 *   F. Fixture detection (deterministic, relative quality)
 *   G. Error safety (no secrets, no stack traces)
 *   H. Regression (all prior tests still pass via baseline)
 *
 * No network, no Solana RPC, no provider SDK, no API keys, no wallet.
 */

import { describe, it, expect } from 'vitest';

import {
  // Engine
  buildManipulationDetectionResult,
  getManipulationDetectorCapabilities,
  buildManipulationRiskFlags,
  classifyManipulation,
  // Scoring
  scoreBundleSignals,
  scoreWashTradePatterns,
  scoreCoordination,
  scoreFundingPatterns,
  scoreCreatorLinks,
  // Signal types
  BUNDLE_SIGNAL_TYPES,
  isBundleSignalType,
  // Pattern types
  MANIPULATION_PATTERN_TYPES,
  isManipulationPatternType,
  MANIPULATION_SEVERITY_HINTS,
  // Risk flags
  MANIPULATION_RISK_FLAGS,
  makeManipulationRiskFlag,
  hasManipulationCriticalFlag,
  filterManipulationFlagsBySeverity,
  filterManipulationFlagsByCode,
  hasManipulationFlagCode,
  // Classification
  MANIPULATION_CLASSIFICATIONS,
  isManipulationClassification,
  isManipulationClassificationSafe,
  // Validation
  validateSignalId,
  validatePatternId,
  validateTokenMint,
  validateBundleSignal,
  validateManipulationPattern,
  validateCoordinatedActivity,
  validateManipulationScoreBounds,
  validateManipulationConfidenceBounds,
  // Errors
  mdOk,
  mdErr,
  isMdOk,
  isMdErr,
  // Fixtures
  CLEAN_ACTIVITY_FIXTURE_SIGNAL,
  CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
  CLEAN_ACTIVITY_FIXTURE_PATTERNS,
  LIKELY_BUNDLE_FIXTURE_SIGNAL,
  LIKELY_BUNDLE_FIXTURE_ACTIVITY,
  LIKELY_BUNDLE_FIXTURE_PATTERNS,
  POSSIBLE_BUNDLE_FIXTURE_SIGNAL,
  POSSIBLE_BUNDLE_FIXTURE_ACTIVITY,
  POSSIBLE_BUNDLE_FIXTURE_PATTERNS,
  LIKELY_WASH_TRADE_FIXTURE_SIGNAL,
  LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
  LIKELY_WASH_TRADE_FIXTURE_PATTERNS,
  COORDINATED_DUMP_FIXTURE_SIGNAL,
  COORDINATED_DUMP_FIXTURE_ACTIVITY,
  COORDINATED_DUMP_FIXTURE_PATTERNS,
  CREATOR_LINKED_MANIPULATION_FIXTURE_SIGNAL,
  CREATOR_LINKED_MANIPULATION_FIXTURE_ACTIVITY,
  CREATOR_LINKED_MANIPULATION_FIXTURE_PATTERNS,
  FRESH_WALLET_FARM_MANIPULATION_FIXTURE_SIGNAL,
  FRESH_WALLET_FARM_MANIPULATION_FIXTURE_ACTIVITY,
  FRESH_WALLET_FARM_MANIPULATION_FIXTURE_PATTERNS,
  BOT_NOISE_FIXTURE_SIGNAL,
  BOT_NOISE_FIXTURE_ACTIVITY,
  BOT_NOISE_FIXTURE_PATTERNS,
  ALL_MANIPULATION_FIXTURE_GROUPS,
} from '@sonic/manipulation-detector';

// ─────────────────────────────────────────────────────────────────────────────
// A. Types / Models
// ─────────────────────────────────────────────────────────────────────────────

describe('A. Types / Models', () => {
  it('BundleSignal fixture has expected shape', () => {
    const s = LIKELY_BUNDLE_FIXTURE_SIGNAL;
    expect(typeof s.signalId).toBe('string');
    expect(typeof s.signalType).toBe('string');
    expect(typeof s.tokenMint).toBe('string');
    expect(typeof s.clusterId).toBe('string');
    expect(typeof s.creatorId).toBe('string');
    expect(Array.isArray(s.walletIds)).toBe(true);
    expect(typeof s.sameSlotParticipationCount).toBe('number');
    expect(typeof s.sameFundingSourceSignalCount).toBe('number');
    expect(typeof s.coordinatedEntrySignalCount).toBe('number');
    expect(typeof s.coordinatedExitSignalCount).toBe('number');
    expect(typeof s.suspectedWashCycleCount).toBe('number');
    expect(typeof s.creatorLinkedWalletSignalCount).toBe('number');
    expect(typeof s.observedAt).toBe('string');
    expect(s.liveData).toBe(false);
    expect(s.fixtureOnly).toBe(true);
    expect(s.safeToDisplay).toBe(true);
  });

  it('ManipulationPattern fixture has expected shape', () => {
    const p = LIKELY_BUNDLE_FIXTURE_PATTERNS[0]!;
    expect(typeof p.patternId).toBe('string');
    expect(typeof p.patternType).toBe('string');
    expect(typeof p.severityHint).toBe('string');
    expect(Array.isArray(p.signalIds)).toBe(true);
    expect(typeof p.confidenceHint).toBe('number');
    expect(typeof p.description).toBe('string');
    expect(p.liveData).toBe(false);
    expect(p.fixtureOnly).toBe(true);
    expect(p.safeToDisplay).toBe(true);
  });

  it('CoordinatedActivitySnapshot fixture has expected shape', () => {
    const a = LIKELY_BUNDLE_FIXTURE_ACTIVITY;
    expect(typeof a.snapshotId).toBe('string');
    expect(typeof a.tokenMint).toBe('string');
    expect(typeof a.participatingWalletCount).toBe('number');
    expect(typeof a.sameSlotWalletCount).toBe('number');
    expect(typeof a.sameFundingWalletCount).toBe('number');
    expect(typeof a.coordinatedEntryCount).toBe('number');
    expect(typeof a.coordinatedExitCount).toBe('number');
    expect(typeof a.washTradeCycleCount).toBe('number');
    expect(typeof a.creatorLinkedWalletCount).toBe('number');
    expect(typeof a.freshWalletCount).toBe('number');
    expect(typeof a.botNoiseSignalCount).toBe('number');
    expect(a.liveData).toBe(false);
    expect(a.fixtureOnly).toBe(true);
    expect(a.safeToDisplay).toBe(true);
  });

  it('BUNDLE_SIGNAL_TYPES has 9 entries', () => {
    expect(BUNDLE_SIGNAL_TYPES.length).toBe(9);
  });

  it('MANIPULATION_PATTERN_TYPES has 9 entries', () => {
    expect(MANIPULATION_PATTERN_TYPES.length).toBe(9);
  });

  it('MANIPULATION_SEVERITY_HINTS has 4 entries', () => {
    expect(MANIPULATION_SEVERITY_HINTS.length).toBe(4);
  });

  it('isBundleSignalType returns true for all valid types', () => {
    for (const t of BUNDLE_SIGNAL_TYPES) {
      expect(isBundleSignalType(t)).toBe(true);
    }
  });

  it('isManipulationPatternType returns true for all valid types', () => {
    for (const t of MANIPULATION_PATTERN_TYPES) {
      expect(isManipulationPatternType(t)).toBe(true);
    }
  });

  it('isBundleSignalType returns false for invalid type', () => {
    expect(isBundleSignalType('invalid_type')).toBe(false);
  });

  it('isManipulationPatternType returns false for invalid type', () => {
    expect(isManipulationPatternType('invalid_type')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. Scoring
// ─────────────────────────────────────────────────────────────────────────────

describe('B. Scoring', () => {
  it('scoreBundleSignals returns bounded score 0–100 for clean fixture', () => {
    const score = scoreBundleSignals(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.sameSlotPenalty).toBeGreaterThanOrEqual(0);
    expect(score.sameFundingPenalty).toBeGreaterThanOrEqual(0);
    expect(score.coordinatedEntryPenalty).toBeGreaterThanOrEqual(0);
    expect(score.coordinatedExitPenalty).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(score.reasons)).toBe(true);
  });

  it('scoreBundleSignals returns lower score for likely bundle fixture', () => {
    const cleanScore = scoreBundleSignals(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    const bundleScore = scoreBundleSignals(
      [LIKELY_BUNDLE_FIXTURE_SIGNAL],
      LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    );
    expect(bundleScore.score).toBeLessThan(cleanScore.score);
  });

  it('scoreWashTradePatterns returns bounded score for clean fixture', () => {
    const score = scoreWashTradePatterns(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      CLEAN_ACTIVITY_FIXTURE_PATTERNS as ManipulationPattern[],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.washCyclePenalty).toBeGreaterThanOrEqual(0);
    expect(score.repeatedCounterpartyPlaceholderPenalty).toBeGreaterThanOrEqual(0);
    expect(score.volumeSymmetryPlaceholderPenalty).toBeGreaterThanOrEqual(0);
  });

  it('scoreWashTradePatterns returns lower score for wash trade fixture', () => {
    const cleanScore = scoreWashTradePatterns(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      [],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    const washScore = scoreWashTradePatterns(
      [LIKELY_WASH_TRADE_FIXTURE_SIGNAL],
      LIKELY_WASH_TRADE_FIXTURE_PATTERNS as ManipulationPattern[],
      LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
    );
    expect(washScore.score).toBeLessThan(cleanScore.score);
  });

  it('scoreCoordination returns bounded score', () => {
    const score = scoreCoordination(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.participantQuality).toBeGreaterThanOrEqual(0);
    expect(score.coordinationPenalty).toBeGreaterThanOrEqual(0);
    expect(score.coordinatedDumpPenalty).toBeGreaterThanOrEqual(0);
    expect(score.botNoisePenalty).toBeGreaterThanOrEqual(0);
  });

  it('scoreFundingPatterns returns bounded score', () => {
    const score = scoreFundingPatterns(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.diversityPlaceholderQuality).toBeGreaterThanOrEqual(0);
    expect(score.sameFundingPenalty).toBeGreaterThanOrEqual(0);
    expect(score.suspiciousFundingPlaceholderPenalty).toBeGreaterThanOrEqual(0);
  });

  it('scoreCreatorLinks returns bounded score', () => {
    const score = scoreCreatorLinks(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      [],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
    expect(score.creatorLinkedWalletPenalty).toBeGreaterThanOrEqual(0);
    expect(score.creatorHistoryPlaceholderPenalty).toBeGreaterThanOrEqual(0);
    expect(score.relationshipUnknownPenalty).toBeGreaterThanOrEqual(0);
  });

  it('all scoring functions return reasons arrays', () => {
    const bundleScore = scoreBundleSignals(
      [LIKELY_BUNDLE_FIXTURE_SIGNAL],
      LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    );
    const washScore = scoreWashTradePatterns(
      [LIKELY_WASH_TRADE_FIXTURE_SIGNAL],
      LIKELY_WASH_TRADE_FIXTURE_PATTERNS as ManipulationPattern[],
      LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
    );
    const coordScore = scoreCoordination(
      [COORDINATED_DUMP_FIXTURE_SIGNAL],
      COORDINATED_DUMP_FIXTURE_ACTIVITY,
    );
    expect(Array.isArray(bundleScore.reasons)).toBe(true);
    expect(Array.isArray(washScore.reasons)).toBe(true);
    expect(Array.isArray(coordScore.reasons)).toBe(true);
    expect(bundleScore.reasons.length).toBeGreaterThan(0);
    expect(washScore.reasons.length).toBeGreaterThan(0);
  });

  it('all component scores bounded 0–100 for all 8 fixtures', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const bs = scoreBundleSignals([fixture.signal], fixture.activity);
      const ws = scoreWashTradePatterns(
        [fixture.signal],
        fixture.patterns as ManipulationPattern[],
        fixture.activity,
      );
      const cs = scoreCoordination([fixture.signal], fixture.activity);
      const fs = scoreFundingPatterns([fixture.signal], fixture.activity);
      const cls = scoreCreatorLinks(
        [fixture.signal],
        fixture.patterns as ManipulationPattern[],
        fixture.activity,
      );

      for (const score of [bs.score, ws.score, cs.score, fs.score, cls.score]) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  it('scoreBundleSignals returns high score for empty signals', () => {
    const score = scoreBundleSignals(
      [],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    expect(score.score).toBeGreaterThan(50);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. Risk Flags
// ─────────────────────────────────────────────────────────────────────────────

describe('C. Risk Flags', () => {
  it('MANIPULATION_RISK_FLAGS has 17 entries', () => {
    expect(MANIPULATION_RISK_FLAGS.length).toBe(17);
  });

  it('makeManipulationRiskFlag creates a valid flag entry', () => {
    const flag = makeManipulationRiskFlag(
      'LIKELY_BUNDLE_PATTERN',
      'critical',
      'Test reason',
    );
    expect(flag.code).toBe('LIKELY_BUNDLE_PATTERN');
    expect(flag.severity).toBe('critical');
    expect(flag.reason).toBe('Test reason');
    expect(flag.safeToDisplay).toBe(true);
  });

  it('hasManipulationCriticalFlag returns true when critical flag present', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'Critical flag'),
    ];
    expect(hasManipulationCriticalFlag(flags)).toBe(true);
  });

  it('hasManipulationCriticalFlag returns false with no critical flags', () => {
    const flags = [
      makeManipulationRiskFlag('BOT_NOISE_PATTERN', 'warn', 'Warn flag'),
    ];
    expect(hasManipulationCriticalFlag(flags)).toBe(false);
  });

  it('filterManipulationFlagsBySeverity filters correctly', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'c1'),
      makeManipulationRiskFlag('BOT_NOISE_PATTERN', 'warn', 'w1'),
      makeManipulationRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'i1'),
    ];
    const criticalFlags = filterManipulationFlagsBySeverity(flags, 'critical');
    expect(criticalFlags.length).toBe(1);
    expect(criticalFlags[0]!.code).toBe('LIKELY_BUNDLE_PATTERN');
  });

  it('filterManipulationFlagsByCode filters correctly', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'c1'),
      makeManipulationRiskFlag('BOT_NOISE_PATTERN', 'warn', 'w1'),
    ];
    const bundleFlags = filterManipulationFlagsByCode(flags, 'LIKELY_BUNDLE_PATTERN');
    expect(bundleFlags.length).toBe(1);
  });

  it('hasManipulationFlagCode returns true when code present', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'c1'),
    ];
    expect(hasManipulationFlagCode(flags, 'LIKELY_BUNDLE_PATTERN')).toBe(true);
    expect(hasManipulationFlagCode(flags, 'BOT_NOISE_PATTERN')).toBe(false);
  });

  it('buildManipulationRiskFlags returns LIVE_DATA_UNAVAILABLE for all fixtures', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const flags = buildManipulationRiskFlags(
        [fixture.signal],
        fixture.patterns as ManipulationPattern[],
        fixture.activity,
      );
      expect(hasManipulationFlagCode(flags, 'LIVE_DATA_UNAVAILABLE')).toBe(true);
    }
  });

  it('buildManipulationRiskFlags includes LIKELY_BUNDLE_PATTERN for likely bundle fixture', () => {
    const flags = buildManipulationRiskFlags(
      [LIKELY_BUNDLE_FIXTURE_SIGNAL],
      LIKELY_BUNDLE_FIXTURE_PATTERNS as ManipulationPattern[],
      LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    );
    expect(hasManipulationFlagCode(flags, 'LIKELY_BUNDLE_PATTERN')).toBe(true);
  });

  it('buildManipulationRiskFlags includes LIKELY_WASH_TRADE_PATTERN for wash trade fixture', () => {
    const flags = buildManipulationRiskFlags(
      [LIKELY_WASH_TRADE_FIXTURE_SIGNAL],
      LIKELY_WASH_TRADE_FIXTURE_PATTERNS as ManipulationPattern[],
      LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
    );
    expect(hasManipulationFlagCode(flags, 'LIKELY_WASH_TRADE_PATTERN')).toBe(true);
  });

  it('buildManipulationRiskFlags includes COORDINATED_DUMP_PATTERN for dump fixture', () => {
    const flags = buildManipulationRiskFlags(
      [COORDINATED_DUMP_FIXTURE_SIGNAL],
      COORDINATED_DUMP_FIXTURE_PATTERNS as ManipulationPattern[],
      COORDINATED_DUMP_FIXTURE_ACTIVITY,
    );
    expect(hasManipulationFlagCode(flags, 'COORDINATED_DUMP_PATTERN')).toBe(true);
  });

  it('all flag entries have safeToDisplay true', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const flags = buildManipulationRiskFlags(
        [fixture.signal],
        fixture.patterns as ManipulationPattern[],
        fixture.activity,
      );
      for (const flag of flags) {
        expect(flag.safeToDisplay).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Classification
// ─────────────────────────────────────────────────────────────────────────────

describe('D. Classification', () => {
  it('MANIPULATION_CLASSIFICATIONS has 5 entries', () => {
    expect(MANIPULATION_CLASSIFICATIONS.length).toBe(5);
  });

  it('isManipulationClassification returns true for all valid values', () => {
    for (const c of MANIPULATION_CLASSIFICATIONS) {
      expect(isManipulationClassification(c)).toBe(true);
    }
  });

  it('isManipulationClassification returns false for invalid value', () => {
    expect(isManipulationClassification('buy')).toBe(false);
    expect(isManipulationClassification('snipe')).toBe(false);
    expect(isManipulationClassification('execute')).toBe(false);
  });

  it('isManipulationClassificationSafe returns true for all valid values', () => {
    for (const c of MANIPULATION_CLASSIFICATIONS) {
      expect(isManipulationClassificationSafe(c)).toBe(true);
    }
  });

  it('classifyManipulation returns reject for critical flags', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'Critical'),
    ];
    const result = classifyManipulation({
      flags,
      finalScore: 80,
      confidence: 0.9,
      hasSignals: true,
    });
    expect(result).toBe('reject');
  });

  it('classifyManipulation returns reject for LIKELY_BUNDLE_PATTERN', () => {
    const flags = [
      makeManipulationRiskFlag('LIKELY_BUNDLE_PATTERN', 'critical', 'Bundle'),
      makeManipulationRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'No live data'),
    ];
    const result = classifyManipulation({
      flags,
      finalScore: 40,
      confidence: 0.7,
      hasSignals: true,
    });
    expect(result).toBe('reject');
  });

  it('classifyManipulation returns insufficient_data when no signals', () => {
    const flags = [
      makeManipulationRiskFlag('INSUFFICIENT_MANIPULATION_DATA', 'high', 'No data'),
    ];
    const result = classifyManipulation({
      flags,
      finalScore: 50,
      confidence: 0.5,
      hasSignals: false,
    });
    expect(result).toBe('insufficient_data');
  });

  it('classifyManipulation returns analysis_only for clean fixture', () => {
    const flags = buildManipulationRiskFlags(
      [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      [],
      CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    );
    const result = classifyManipulation({
      flags,
      finalScore: 80,
      confidence: 0.7,
      hasSignals: true,
    });
    expect(result).toBe('analysis_only');
  });

  it('classifications never contain trade wording', () => {
    const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'copy', 'mirror', 'enter'];
    for (const c of MANIPULATION_CLASSIFICATIONS) {
      for (const word of forbidden) {
        expect(c).not.toContain(word);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. Safety Invariants
// ─────────────────────────────────────────────────────────────────────────────

describe('E. Safety Invariants', () => {
  it('capabilities all unsafe fields are false', () => {
    const caps = getManipulationDetectorCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCreateEnforcementActions).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
  });

  it('capabilities fixtureOnly is true', () => {
    const caps = getManipulationDetectorCapabilities();
    expect(caps.fixtureOnly).toBe(true);
  });

  it('capabilities safeToDisplay is true', () => {
    const caps = getManipulationDetectorCapabilities();
    expect(caps.safeToDisplay).toBe(true);
  });

  it('buildManipulationDetectionResult returns result with all safety flags false', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_result_001',
      tokenMint: 'TEST_SAFE_TOKEN_MINT_001',
      signals: [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      patterns: CLEAN_ACTIVITY_FIXTURE_PATTERNS,
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.liveData).toBe(false);
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.actionAllowed).toBe(false);
      expect(result.value.tradingAllowed).toBe(false);
      expect(result.value.executionAllowed).toBe(false);
      expect(result.value.enforcementAllowed).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures have liveData false', () => {
    expect(CLEAN_ACTIVITY_FIXTURE_SIGNAL.liveData).toBe(false);
    expect(LIKELY_BUNDLE_FIXTURE_SIGNAL.liveData).toBe(false);
    expect(LIKELY_WASH_TRADE_FIXTURE_SIGNAL.liveData).toBe(false);
    expect(COORDINATED_DUMP_FIXTURE_SIGNAL.liveData).toBe(false);
    expect(CLEAN_ACTIVITY_FIXTURE_ACTIVITY.liveData).toBe(false);
    expect(LIKELY_BUNDLE_FIXTURE_ACTIVITY.liveData).toBe(false);
  });

  it('all fixtures have fixtureOnly true', () => {
    expect(CLEAN_ACTIVITY_FIXTURE_SIGNAL.fixtureOnly).toBe(true);
    expect(LIKELY_BUNDLE_FIXTURE_SIGNAL.fixtureOnly).toBe(true);
    expect(LIKELY_BUNDLE_FIXTURE_ACTIVITY.fixtureOnly).toBe(true);
  });

  it('all fixtures have safeToDisplay true', () => {
    for (const g of ALL_MANIPULATION_FIXTURE_GROUPS) {
      expect(g.signal.safeToDisplay).toBe(true);
      expect(g.activity.safeToDisplay).toBe(true);
      for (const p of g.patterns) {
        expect(p.safeToDisplay).toBe(true);
      }
    }
  });

  it('fixture token mints do not look like real Solana addresses', () => {
    for (const g of ALL_MANIPULATION_FIXTURE_GROUPS) {
      // Synthetic fixture mints contain 'FIXTURE_' prefix
      expect(g.signal.tokenMint).toMatch(/^FIXTURE_/);
    }
  });

  it('fixture wallet IDs use synthetic prefixes', () => {
    for (const g of ALL_MANIPULATION_FIXTURE_GROUPS) {
      for (const wId of g.signal.walletIds) {
        expect(wId).toMatch(/^fixture_/);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Fixture Detection
// ─────────────────────────────────────────────────────────────────────────────

describe('F. Fixture Detection', () => {
  it('clean activity fixture classifies as analysis_only', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_clean_001',
      tokenMint: CLEAN_ACTIVITY_FIXTURE_SIGNAL.tokenMint,
      signals: [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      patterns: CLEAN_ACTIVITY_FIXTURE_PATTERNS,
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('analysis_only');
    }
  });

  it('likely bundle fixture classifies as reject', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_bundle_001',
      tokenMint: LIKELY_BUNDLE_FIXTURE_SIGNAL.tokenMint,
      signals: [LIKELY_BUNDLE_FIXTURE_SIGNAL],
      patterns: LIKELY_BUNDLE_FIXTURE_PATTERNS,
      activity: LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('reject');
    }
  });

  it('likely wash trade fixture classifies as reject', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_wash_001',
      tokenMint: LIKELY_WASH_TRADE_FIXTURE_SIGNAL.tokenMint,
      signals: [LIKELY_WASH_TRADE_FIXTURE_SIGNAL],
      patterns: LIKELY_WASH_TRADE_FIXTURE_PATTERNS,
      activity: LIKELY_WASH_TRADE_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('reject');
    }
  });

  it('coordinated dump fixture classifies as reject', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_dump_001',
      tokenMint: COORDINATED_DUMP_FIXTURE_SIGNAL.tokenMint,
      signals: [COORDINATED_DUMP_FIXTURE_SIGNAL],
      patterns: COORDINATED_DUMP_FIXTURE_PATTERNS,
      activity: COORDINATED_DUMP_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('reject');
    }
  });

  it('clean fixture has higher final score than likely bundle fixture', () => {
    const cleanResult = buildManipulationDetectionResult({
      resultId: 'test_clean_cmp_001',
      tokenMint: CLEAN_ACTIVITY_FIXTURE_SIGNAL.tokenMint,
      signals: [CLEAN_ACTIVITY_FIXTURE_SIGNAL],
      patterns: CLEAN_ACTIVITY_FIXTURE_PATTERNS,
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    const bundleResult = buildManipulationDetectionResult({
      resultId: 'test_bundle_cmp_001',
      tokenMint: LIKELY_BUNDLE_FIXTURE_SIGNAL.tokenMint,
      signals: [LIKELY_BUNDLE_FIXTURE_SIGNAL],
      patterns: LIKELY_BUNDLE_FIXTURE_PATTERNS,
      activity: LIKELY_BUNDLE_FIXTURE_ACTIVITY,
    });
    expect(cleanResult.ok).toBe(true);
    expect(bundleResult.ok).toBe(true);
    if (cleanResult.ok && bundleResult.ok) {
      expect(cleanResult.value.finalScore).toBeGreaterThan(bundleResult.value.finalScore);
    }
  });

  it('all fixture detections produce bounded finalScore 0–100', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const result = buildManipulationDetectionResult({
        resultId: `test_${fixture.name}_001`,
        tokenMint: fixture.signal.tokenMint,
        signals: [fixture.signal],
        patterns: fixture.patterns,
        activity: fixture.activity,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.finalScore).toBeGreaterThanOrEqual(0);
        expect(result.value.finalScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it('all fixture detections produce confidence 0–1', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const result = buildManipulationDetectionResult({
        resultId: `test_conf_${fixture.name}_001`,
        tokenMint: fixture.signal.tokenMint,
        signals: [fixture.signal],
        patterns: fixture.patterns,
        activity: fixture.activity,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.confidence).toBeGreaterThanOrEqual(0);
        expect(result.value.confidence).toBeLessThanOrEqual(1);
      }
    }
  });

  it('all fixture detections have valid classification', () => {
    for (const fixture of ALL_MANIPULATION_FIXTURE_GROUPS) {
      const result = buildManipulationDetectionResult({
        resultId: `test_cls_${fixture.name}_001`,
        tokenMint: fixture.signal.tokenMint,
        signals: [fixture.signal],
        patterns: fixture.patterns,
        activity: fixture.activity,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(isManipulationClassification(result.value.classification)).toBe(true);
      }
    }
  });

  it('ALL_MANIPULATION_FIXTURE_GROUPS has 8 entries', () => {
    expect(ALL_MANIPULATION_FIXTURE_GROUPS.length).toBe(8);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// G. Error Safety
// ─────────────────────────────────────────────────────────────────────────────

describe('G. Error Safety', () => {
  it('mdOk creates a successful result', () => {
    const result = mdOk({ test: true });
    expect(result.ok).toBe(true);
    expect(isMdOk(result)).toBe(true);
    expect(isMdErr(result)).toBe(false);
  });

  it('mdErr creates a safe error result', () => {
    const result = mdErr('INVALID_BUNDLE_SIGNAL', 'Test error');
    expect(result.ok).toBe(false);
    expect(isMdErr(result)).toBe(true);
    expect(result.error.code).toBe('INVALID_BUNDLE_SIGNAL');
    expect(result.error.message).toBe('Test error');
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('validateSignalId rejects empty string', () => {
    const result = validateSignalId('');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_SIGNAL_ID');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('validateSignalId rejects string with whitespace', () => {
    const result = validateSignalId('bad id');
    expect(result.ok).toBe(false);
  });

  it('validateSignalId accepts valid ID', () => {
    const result = validateSignalId('valid_signal_id_001');
    expect(result.ok).toBe(true);
  });

  it('validatePatternId rejects empty string', () => {
    const result = validatePatternId('');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_PATTERN_ID');
    }
  });

  it('validateTokenMint rejects empty string', () => {
    const result = validateTokenMint('');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_TOKEN_MINT');
    }
  });

  it('validateTokenMint rejects string with whitespace', () => {
    const result = validateTokenMint('bad mint');
    expect(result.ok).toBe(false);
  });

  it('validateBundleSignal rejects null', () => {
    const result = validateBundleSignal(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('validateBundleSignal rejects invalid signalType', () => {
    const result = validateBundleSignal({
      ...CLEAN_ACTIVITY_FIXTURE_SIGNAL,
      signalType: 'invalid_type',
    });
    expect(result.ok).toBe(false);
  });

  it('validateBundleSignal rejects liveData: true', () => {
    const result = validateBundleSignal({
      ...CLEAN_ACTIVITY_FIXTURE_SIGNAL,
      liveData: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
    }
  });

  it('validateBundleSignal accepts valid clean fixture signal', () => {
    const result = validateBundleSignal(CLEAN_ACTIVITY_FIXTURE_SIGNAL);
    expect(result.ok).toBe(true);
  });

  it('validateManipulationPattern rejects invalid patternType', () => {
    const result = validateManipulationPattern({
      ...LIKELY_BUNDLE_FIXTURE_PATTERNS[0]!,
      patternType: 'invalid_type',
    });
    expect(result.ok).toBe(false);
  });

  it('validateManipulationPattern rejects out-of-range confidenceHint', () => {
    const result = validateManipulationPattern({
      ...LIKELY_BUNDLE_FIXTURE_PATTERNS[0]!,
      confidenceHint: 1.5,
    });
    expect(result.ok).toBe(false);
  });

  it('validateCoordinatedActivity rejects negative counts', () => {
    const result = validateCoordinatedActivity({
      ...CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
      participatingWalletCount: -1,
    });
    expect(result.ok).toBe(false);
  });

  it('validateCoordinatedActivity rejects liveData: true', () => {
    const result = validateCoordinatedActivity({
      ...CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
      liveData: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
    }
  });

  it('validateManipulationScoreBounds rejects out-of-range score', () => {
    expect(validateManipulationScoreBounds(-1, 'test').ok).toBe(false);
    expect(validateManipulationScoreBounds(101, 'test').ok).toBe(false);
    expect(validateManipulationScoreBounds(50, 'test').ok).toBe(true);
  });

  it('validateManipulationConfidenceBounds rejects out-of-range confidence', () => {
    expect(validateManipulationConfidenceBounds(-0.1).ok).toBe(false);
    expect(validateManipulationConfidenceBounds(1.1).ok).toBe(false);
    expect(validateManipulationConfidenceBounds(0.5).ok).toBe(true);
  });

  it('buildManipulationDetectionResult returns safe error for invalid input', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_err_001',
      tokenMint: 'VALID_TEST_MINT',
      signals: [{ ...CLEAN_ACTIVITY_FIXTURE_SIGNAL, liveData: true }],
      patterns: [],
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
      expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
      // Must not contain sensitive data
      expect(result.error.message).not.toMatch(/rpcUrl|apiKey|privateKey|secret|mnemonic/i);
    }
  });

  it('buildManipulationDetectionResult returns safe error for short resultId', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'ab',
      tokenMint: 'VALID_TEST_MINT',
      signals: [],
      patterns: [],
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('error messages do not contain secrets or stack traces', () => {
    const result = buildManipulationDetectionResult({
      resultId: 'test_sec_001',
      tokenMint: 'VALID_TEST_MINT',
      signals: [{ ...CLEAN_ACTIVITY_FIXTURE_SIGNAL, signalId: '' }],
      patterns: [],
      activity: CLEAN_ACTIVITY_FIXTURE_ACTIVITY,
    });
    if (!result.ok) {
      const msg = result.error.message;
      expect(msg).not.toMatch(/rpcUrl|apiKey|privateKey|PRIVATE_KEY|SECRET_KEY|mnemonic/i);
      expect(msg).not.toMatch(/Error\s*at\s/); // no stack trace
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// H. Regression
// ─────────────────────────────────────────────────────────────────────────────

describe('H. Regression', () => {
  it('all 8 fixture groups are accessible', () => {
    expect(CLEAN_ACTIVITY_FIXTURE_SIGNAL).toBeDefined();
    expect(LIKELY_BUNDLE_FIXTURE_SIGNAL).toBeDefined();
    expect(POSSIBLE_BUNDLE_FIXTURE_SIGNAL).toBeDefined();
    expect(LIKELY_WASH_TRADE_FIXTURE_SIGNAL).toBeDefined();
    expect(COORDINATED_DUMP_FIXTURE_SIGNAL).toBeDefined();
    expect(CREATOR_LINKED_MANIPULATION_FIXTURE_SIGNAL).toBeDefined();
    expect(FRESH_WALLET_FARM_MANIPULATION_FIXTURE_SIGNAL).toBeDefined();
    expect(BOT_NOISE_FIXTURE_SIGNAL).toBeDefined();
  });

  it('all fixture activities are accessible', () => {
    expect(CLEAN_ACTIVITY_FIXTURE_ACTIVITY).toBeDefined();
    expect(LIKELY_BUNDLE_FIXTURE_ACTIVITY).toBeDefined();
    expect(POSSIBLE_BUNDLE_FIXTURE_ACTIVITY).toBeDefined();
    expect(LIKELY_WASH_TRADE_FIXTURE_ACTIVITY).toBeDefined();
    expect(COORDINATED_DUMP_FIXTURE_ACTIVITY).toBeDefined();
    expect(CREATOR_LINKED_MANIPULATION_FIXTURE_ACTIVITY).toBeDefined();
    expect(FRESH_WALLET_FARM_MANIPULATION_FIXTURE_ACTIVITY).toBeDefined();
    expect(BOT_NOISE_FIXTURE_ACTIVITY).toBeDefined();
  });

  it('all fixture pattern arrays are accessible', () => {
    expect(Array.isArray(CLEAN_ACTIVITY_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(LIKELY_BUNDLE_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(POSSIBLE_BUNDLE_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(LIKELY_WASH_TRADE_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(COORDINATED_DUMP_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(CREATOR_LINKED_MANIPULATION_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(FRESH_WALLET_FARM_MANIPULATION_FIXTURE_PATTERNS)).toBe(true);
    expect(Array.isArray(BOT_NOISE_FIXTURE_PATTERNS)).toBe(true);
  });

  it('public exports do not contain forbidden wording in constant names', () => {
    const exportNames = Object.keys({
      BUNDLE_SIGNAL_TYPES,
      MANIPULATION_PATTERN_TYPES,
      MANIPULATION_RISK_FLAGS,
      MANIPULATION_CLASSIFICATIONS,
      ALL_MANIPULATION_FIXTURE_GROUPS,
    });
    const forbidden = ['buy', 'sell', 'execute', 'live_candidate', 'auto_candidate'];
    for (const name of exportNames) {
      for (const word of forbidden) {
        expect(name.toLowerCase()).not.toContain(word);
      }
    }
  });
});
