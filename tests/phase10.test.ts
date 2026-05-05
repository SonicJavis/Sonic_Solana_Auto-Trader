/**
 * Phase 10 — Wallet Cluster Intelligence v1 tests.
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
  buildWalletClusterIntelligenceResult,
  getWalletIntelligenceCapabilities,
  scoreWalletClusterGroup,
  buildWalletClusterRiskFlags,
  classifyWalletCluster,
  // Scoring
  scoreWalletProfile,
  scoreWalletCluster,
  scoreLeaderFollower,
  scoreFreshWalletRisk,
  scoreFundingSource,
  // Fixtures
  SMART_ACCUMULATOR_FIXTURE_WALLETS,
  SMART_ACCUMULATOR_FIXTURE_CLUSTER,
  PROFITABLE_LEADER_FIXTURE_WALLETS,
  PROFITABLE_LEADER_FIXTURE_CLUSTER,
  FAST_DUMPER_FIXTURE_WALLETS,
  FAST_DUMPER_FIXTURE_CLUSTER,
  FRESH_WALLET_FARM_FIXTURE_WALLETS,
  FRESH_WALLET_FARM_FIXTURE_CLUSTER,
  SAME_FUNDING_SOURCE_FIXTURE_WALLETS,
  SAME_FUNDING_SOURCE_FIXTURE_CLUSTER,
  BOT_NOISE_FIXTURE_WALLETS,
  BOT_NOISE_FIXTURE_CLUSTER,
  KNOWN_RUG_CLUSTER_FIXTURE_WALLETS,
  KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER,
  ALL_FIXTURE_CLUSTER_PAIRS,
  // Classification helpers
  isWalletClusterClassification,
  isWalletClusterClassificationSafe,
  WALLET_CLUSTER_CLASSIFICATIONS,
  // Risk flag helpers
  makeWalletClusterRiskFlag,
  hasWalletCriticalFlag,
  filterWalletFlagsBySeverity,
  filterWalletFlagsByCode,
  // Validation
  validateWalletId,
  validateWalletAddress,
  validateClusterId,
  validateWalletProfile,
  validateWalletCluster,
  validateWalletScoreBounds,
  validateWalletConfidenceBounds,
  // Errors
  wiOk,
  wiErr,
  isWiOk,
  isWiErr,
  // Cluster types
  WALLET_CLUSTER_TYPES,
} from '@sonic/wallet-intelligence';

// ─────────────────────────────────────────────────────────────────────────────
// A. Types / Models
// ─────────────────────────────────────────────────────────────────────────────

describe('A. Types / Models', () => {
  it('wallet profile has expected shape', () => {
    const wallet = SMART_ACCUMULATOR_FIXTURE_WALLETS[0]!;
    expect(typeof wallet.walletId).toBe('string');
    expect(typeof wallet.walletAddress).toBe('string');
    expect(typeof wallet.displayLabel).toBe('string');
    expect(typeof wallet.walletAgeDays).toBe('number');
    expect(typeof wallet.observedLaunchCount).toBe('number');
    expect(typeof wallet.averageHoldTimeSeconds).toBe('number');
    expect(typeof wallet.averageEntryTimingQuality).toBe('number');
    expect(typeof wallet.averageExitTimingQuality).toBe('number');
    expect(typeof wallet.profitabilityQualityPlaceholder).toBe('number');
    expect(typeof wallet.fastDumpSignalCount).toBe('number');
    expect(typeof wallet.botNoiseSignalCount).toBe('number');
    expect(wallet.source).toBe('fixture');
    expect(wallet.fixtureOnly).toBe(true);
    expect(wallet.liveData).toBe(false);
    expect(wallet.safeToDisplay).toBe(true);
  });

  it('wallet cluster has expected shape', () => {
    const cluster = SMART_ACCUMULATOR_FIXTURE_CLUSTER;
    expect(typeof cluster.clusterId).toBe('string');
    expect(typeof cluster.clusterType).toBe('string');
    expect(typeof cluster.displayLabel).toBe('string');
    expect(Array.isArray(cluster.walletIds)).toBe(true);
    expect(cluster.walletIds.length).toBeGreaterThan(0);
    expect(typeof cluster.representativeWalletCount).toBe('number');
    expect(typeof cluster.sameFundingSourceSignalCount).toBe('number');
    expect(typeof cluster.sameSlotParticipationSignalCount).toBe('number');
    expect(typeof cluster.creatorLinkedSignalCount).toBe('number');
    expect(typeof cluster.freshWalletSignalCount).toBe('number');
    expect(typeof cluster.coordinatedSellSignalCount).toBe('number');
    expect(typeof cluster.leaderFollowerSignalCount).toBe('number');
    expect(typeof cluster.observedAt).toBe('string');
    expect(cluster.fixtureOnly).toBe(true);
    expect(cluster.liveData).toBe(false);
    expect(cluster.safeToDisplay).toBe(true);
  });

  it('component score shapes are correct', () => {
    const wallet = SMART_ACCUMULATOR_FIXTURE_WALLETS[0]!;
    const wqs = scoreWalletProfile(wallet);
    expect(typeof wqs.walletAgeQuality).toBe('number');
    expect(typeof wqs.holdTimeQuality).toBe('number');
    expect(typeof wqs.entryTimingQuality).toBe('number');
    expect(typeof wqs.exitTimingQuality).toBe('number');
    expect(typeof wqs.profitabilityPlaceholderQuality).toBe('number');
    expect(typeof wqs.fastDumpPenalty).toBe('number');
    expect(typeof wqs.botNoisePenalty).toBe('number');
    expect(typeof wqs.score).toBe('number');
    expect(Array.isArray(wqs.reasons)).toBe(true);

    const cqs = scoreWalletCluster(SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(typeof cqs.clusterTypeQuality).toBe('number');
    expect(typeof cqs.representativeWalletQuality).toBe('number');
    expect(typeof cqs.coordinationRiskPenalty).toBe('number');
    expect(typeof cqs.creatorLinkRiskPenalty).toBe('number');
    expect(typeof cqs.score).toBe('number');
    expect(Array.isArray(cqs.reasons)).toBe(true);

    const lfs = scoreLeaderFollower(SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(typeof lfs.leaderSignalQuality).toBe('number');
    expect(typeof lfs.followerNoisePenalty).toBe('number');
    expect(typeof lfs.sameSlotPenalty).toBe('number');
    expect(typeof lfs.coordinatedSellPenalty).toBe('number');
    expect(typeof lfs.score).toBe('number');

    const fwrs = scoreFreshWalletRisk(SMART_ACCUMULATOR_FIXTURE_WALLETS, SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(typeof fwrs.freshWalletPenalty).toBe('number');
    expect(typeof fwrs.sameFundingSourcePenalty).toBe('number');
    expect(typeof fwrs.lowAgePenalty).toBe('number');
    expect(typeof fwrs.farmRiskPenalty).toBe('number');
    expect(typeof fwrs.score).toBe('number');

    const fss = scoreFundingSource(SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(typeof fss.sameFundingSignalPenalty).toBe('number');
    expect(typeof fss.suspiciousFundingPlaceholderPenalty).toBe('number');
    expect(typeof fss.sourceDiversityPlaceholderQuality).toBe('number');
    expect(typeof fss.score).toBe('number');
  });

  it('risk flag shape is correct', () => {
    const flag = makeWalletClusterRiskFlag('LOW_WALLET_AGE', 'warn', 'test reason');
    expect(typeof flag.code).toBe('string');
    expect(typeof flag.severity).toBe('string');
    expect(typeof flag.reason).toBe('string');
    expect(flag.safeToDisplay).toBe(true);
  });

  it('intelligence result shape is correct', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const r = result.value;
    expect(typeof r.clusterId).toBe('string');
    expect(Array.isArray(r.wallets)).toBe(true);
    expect(typeof r.cluster).toBe('object');
    expect(typeof r.componentScores).toBe('object');
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
    expect(r.copyTradingAllowed).toBe(false);
    expect(r.safeToDisplay).toBe(true);
  });

  it('capabilities all unsafe fields false', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCopyTrade).toBe(false);
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
  it('wallet quality scoring bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      for (const w of pair.wallets) {
        const s = scoreWalletProfile(w);
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
        expect(s.walletAgeQuality).toBeGreaterThanOrEqual(0);
        expect(s.walletAgeQuality).toBeLessThanOrEqual(100);
        expect(s.holdTimeQuality).toBeGreaterThanOrEqual(0);
        expect(s.holdTimeQuality).toBeLessThanOrEqual(100);
        expect(s.fastDumpPenalty).toBeGreaterThanOrEqual(0);
        expect(s.fastDumpPenalty).toBeLessThanOrEqual(100);
        expect(s.botNoisePenalty).toBeGreaterThanOrEqual(0);
        expect(s.botNoisePenalty).toBeLessThanOrEqual(100);
      }
    }
  });

  it('cluster quality scoring bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const s = scoreWalletCluster(pair.cluster);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(s.clusterTypeQuality).toBeGreaterThanOrEqual(0);
      expect(s.clusterTypeQuality).toBeLessThanOrEqual(100);
    }
  });

  it('leader/follower scoring bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const s = scoreLeaderFollower(pair.cluster);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(s.leaderSignalQuality).toBeGreaterThanOrEqual(0);
      expect(s.leaderSignalQuality).toBeLessThanOrEqual(100);
      expect(s.followerNoisePenalty).toBeGreaterThanOrEqual(0);
      expect(s.followerNoisePenalty).toBeLessThanOrEqual(100);
    }
  });

  it('fresh-wallet risk scoring bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const s = scoreFreshWalletRisk(pair.wallets, pair.cluster);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(s.freshWalletPenalty).toBeGreaterThanOrEqual(0);
      expect(s.freshWalletPenalty).toBeLessThanOrEqual(100);
    }
  });

  it('funding-source scoring bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const s = scoreFundingSource(pair.cluster);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('missing data reduces confidence', () => {
    const emptyWallets: unknown[] = [];
    const { confidence } = scoreWalletClusterGroup(emptyWallets as never, SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(confidence).toBeLessThan(0.5);
  });

  it('final score bounded 0–100', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const { finalScore } = scoreWalletClusterGroup(pair.wallets as never, pair.cluster);
      expect(finalScore).toBeGreaterThanOrEqual(0);
      expect(finalScore).toBeLessThanOrEqual(100);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. Risk Flags
// ─────────────────────────────────────────────────────────────────────────────

describe('C. Risk Flags', () => {
  it('insufficient wallet data flag raised when no wallets', () => {
    const flags = buildWalletClusterRiskFlags([], SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(flags.some((f) => f.code === 'INSUFFICIENT_WALLET_DATA')).toBe(true);
  });

  it('insufficient cluster data flag raised when representativeWalletCount is 0', () => {
    const cluster = {
      ...SMART_ACCUMULATOR_FIXTURE_CLUSTER,
      representativeWalletCount: 0,
    };
    const flags = buildWalletClusterRiskFlags([...SMART_ACCUMULATOR_FIXTURE_WALLETS], cluster);
    expect(flags.some((f) => f.code === 'INSUFFICIENT_CLUSTER_DATA')).toBe(true);
  });

  it('low wallet age flag raised for fresh wallets', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FRESH_WALLET_FARM_FIXTURE_WALLETS],
      FRESH_WALLET_FARM_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'LOW_WALLET_AGE')).toBe(true);
  });

  it('fast dumper history flag raised for fast dumper cluster', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'FAST_DUMPER_HISTORY')).toBe(true);
  });

  it('bot noise signals flag raised for bot noise cluster', () => {
    const flags = buildWalletClusterRiskFlags(
      [...BOT_NOISE_FIXTURE_WALLETS],
      BOT_NOISE_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'BOT_NOISE_SIGNALS')).toBe(true);
  });

  it('fresh wallet farm placeholder raised for fresh farm cluster', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FRESH_WALLET_FARM_FIXTURE_WALLETS],
      FRESH_WALLET_FARM_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'FRESH_WALLET_FARM_PLACEHOLDER')).toBe(true);
  });

  it('same funding source placeholder raised', () => {
    const flags = buildWalletClusterRiskFlags(
      [...SAME_FUNDING_SOURCE_FIXTURE_WALLETS],
      SAME_FUNDING_SOURCE_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'SAME_FUNDING_SOURCE_PLACEHOLDER')).toBe(true);
  });

  it('same-slot coordination placeholder raised', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'SAME_SLOT_COORDINATION_PLACEHOLDER')).toBe(true);
  });

  it('creator-linked wallet placeholder raised', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FRESH_WALLET_FARM_FIXTURE_WALLETS],
      FRESH_WALLET_FARM_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'CREATOR_LINKED_WALLET_PLACEHOLDER')).toBe(true);
  });

  it('coordinated sell placeholder raised for fast dumper cluster', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'COORDINATED_SELL_PLACEHOLDER')).toBe(true);
  });

  it('low hold time flag raised for fresh farm wallets', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FRESH_WALLET_FARM_FIXTURE_WALLETS],
      FRESH_WALLET_FARM_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'LOW_HOLD_TIME')).toBe(true);
  });

  it('bundle risk unknown placeholder always present', () => {
    const flags = buildWalletClusterRiskFlags(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(flags.some((f) => f.code === 'BUNDLE_RISK_UNKNOWN')).toBe(true);
  });

  it('all risk flag entries have safeToDisplay true', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const flags = buildWalletClusterRiskFlags(pair.wallets as never, pair.cluster);
      for (const flag of flags) {
        expect(flag.safeToDisplay).toBe(true);
      }
    }
  });

  it('filterWalletFlagsBySeverity filters correctly', () => {
    const flags = buildWalletClusterRiskFlags(
      [...KNOWN_RUG_CLUSTER_FIXTURE_WALLETS],
      KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER,
    );
    const criticals = filterWalletFlagsBySeverity(flags, 'critical');
    expect(criticals.length).toBeGreaterThan(0);
    criticals.forEach((f) => expect(f.severity).toBe('critical'));
  });

  it('filterWalletFlagsByCode filters correctly', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    const liveFlags = filterWalletFlagsByCode(flags, 'LIVE_DATA_UNAVAILABLE');
    expect(liveFlags.length).toBeGreaterThan(0);
    liveFlags.forEach((f) => expect(f.code).toBe('LIVE_DATA_UNAVAILABLE'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Classification
// ─────────────────────────────────────────────────────────────────────────────

describe('D. Classification', () => {
  it('critical flags result in reject classification', () => {
    const flags = buildWalletClusterRiskFlags(
      [...KNOWN_RUG_CLUSTER_FIXTURE_WALLETS],
      KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER,
    );
    expect(hasWalletCriticalFlag(flags)).toBe(true);
    const cls = classifyWalletCluster(flags, 50, 0.8, KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER);
    expect(cls).toBe('reject');
  });

  it('insufficient data returns insufficient_data', () => {
    const flags = buildWalletClusterRiskFlags([], SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    const cls = classifyWalletCluster(flags, 0, 0.05, SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(cls).toBe('insufficient_data');
  });

  it('fixture only with low score returns fixture_only', () => {
    const flags = buildWalletClusterRiskFlags(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    // Remove critical flags for this test
    const nonCriticalFlags = flags.filter((f) => f.severity !== 'critical');
    const cls = classifyWalletCluster(nonCriticalFlags, 15, 0.5, FAST_DUMPER_FIXTURE_CLUSTER);
    expect(cls).toBe('fixture_only');
  });

  it('high fixture score returns analysis_only, not trade/copy', () => {
    const flags = buildWalletClusterRiskFlags(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    const cls = classifyWalletCluster(flags, 80, 0.9, SMART_ACCUMULATOR_FIXTURE_CLUSTER);
    expect(cls).toBe('analysis_only');
    expect(cls).not.toContain('trade');
    expect(cls).not.toContain('copy');
    expect(cls).not.toContain('buy');
    expect(cls).not.toContain('sell');
    expect(cls).not.toContain('execute');
  });

  it('all classification values are safe (no trade/copy wording)', () => {
    for (const cls of WALLET_CLUSTER_CLASSIFICATIONS) {
      expect(isWalletClusterClassificationSafe(cls)).toBe(true);
    }
  });

  it('isWalletClusterClassification validates correctly', () => {
    expect(isWalletClusterClassification('reject')).toBe(true);
    expect(isWalletClusterClassification('watch_only')).toBe(true);
    expect(isWalletClusterClassification('analysis_only')).toBe(true);
    expect(isWalletClusterClassification('insufficient_data')).toBe(true);
    expect(isWalletClusterClassification('fixture_only')).toBe(true);
    expect(isWalletClusterClassification('buy')).toBe(false);
    expect(isWalletClusterClassification('trade')).toBe(false);
    expect(isWalletClusterClassification('copy')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. Safety Invariants
// ─────────────────────────────────────────────────────────────────────────────

describe('E. Safety Invariants', () => {
  it('liveData always false on fixtures', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      expect(pair.cluster.liveData).toBe(false);
      for (const w of pair.wallets) {
        expect(w.liveData).toBe(false);
      }
    }
  });

  it('fixtureOnly true for all fixtures', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      expect(pair.cluster.fixtureOnly).toBe(true);
      for (const w of pair.wallets) {
        expect(w.fixtureOnly).toBe(true);
      }
    }
  });

  it('actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed always false in result', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.actionAllowed).toBe(false);
    expect(result.value.tradingAllowed).toBe(false);
    expect(result.value.executionAllowed).toBe(false);
    expect(result.value.copyTradingAllowed).toBe(false);
  });

  it('no Solana RPC capability', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canUseSolanaRpc).toBe(false);
  });

  it('no provider API capability', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canUseProviderApis).toBe(false);
  });

  it('no private key access capability', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('no trade intent capability', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canCreateTradeIntents).toBe(false);
  });

  it('no copy-trading capability', () => {
    const caps = getWalletIntelligenceCapabilities();
    expect(caps.canCopyTrade).toBe(false);
  });

  it('FULL_AUTO and LIMITED_LIVE remain locked', async () => {
    // Check mode safety via shared LOCKED_MODES constant
    const shared = await import('@sonic/shared');
    expect(shared.LOCKED_MODES).toContain('FULL_AUTO');
    expect(shared.LOCKED_MODES).toContain('LIMITED_LIVE');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Fixture Engine
// ─────────────────────────────────────────────────────────────────────────────

describe('F. Fixture Engine', () => {
  it('smart/profitable fixtures score higher than poor fixtures', () => {
    const smartResult = scoreWalletClusterGroup(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    const fastDumperResult = scoreWalletClusterGroup(
      [...FAST_DUMPER_FIXTURE_WALLETS],
      FAST_DUMPER_FIXTURE_CLUSTER,
    );
    const profitableResult = scoreWalletClusterGroup(
      [...PROFITABLE_LEADER_FIXTURE_WALLETS],
      PROFITABLE_LEADER_FIXTURE_CLUSTER,
    );

    expect(smartResult.finalScore).toBeGreaterThan(fastDumperResult.finalScore);
    expect(profitableResult.finalScore).toBeGreaterThan(fastDumperResult.finalScore);
  });

  it('fast dumper, fresh farm, same funding, bot noise fixtures produce risks', () => {
    for (const pair of [
      { wallets: FAST_DUMPER_FIXTURE_WALLETS, cluster: FAST_DUMPER_FIXTURE_CLUSTER },
      { wallets: FRESH_WALLET_FARM_FIXTURE_WALLETS, cluster: FRESH_WALLET_FARM_FIXTURE_CLUSTER },
      { wallets: SAME_FUNDING_SOURCE_FIXTURE_WALLETS, cluster: SAME_FUNDING_SOURCE_FIXTURE_CLUSTER },
      { wallets: BOT_NOISE_FIXTURE_WALLETS, cluster: BOT_NOISE_FIXTURE_CLUSTER },
    ]) {
      const flags = buildWalletClusterRiskFlags(pair.wallets as never, pair.cluster);
      const highOrCritical = flags.filter(
        (f) => f.severity === 'high' || f.severity === 'critical',
      );
      expect(highOrCritical.length).toBeGreaterThan(0);
    }
  });

  it('known rug cluster produces critical risk and reject classification', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...KNOWN_RUG_CLUSTER_FIXTURE_WALLETS],
      KNOWN_RUG_CLUSTER_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('reject');
    const criticalFlags = result.value.riskFlags.filter((f) => f.severity === 'critical');
    expect(criticalFlags.length).toBeGreaterThan(0);
  });

  it('deterministic repeat scoring — same inputs produce same output', () => {
    const r1 = scoreWalletClusterGroup(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    const r2 = scoreWalletClusterGroup(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(r1.finalScore).toBe(r2.finalScore);
    expect(r1.componentScores.walletQualityScore.score).toBe(
      r2.componentScores.walletQualityScore.score,
    );
  });

  it('smart accumulator result is analysis_only', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.classification).toBe('analysis_only');
  });

  it('all fixture pair results have safeToDisplay true', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      const result = buildWalletClusterIntelligenceResult(pair.wallets, pair.cluster);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.value.safeToDisplay).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// G. Error Safety
// ─────────────────────────────────────────────────────────────────────────────

describe('G. Error Safety', () => {
  it('invalid wallet profile returns safe error', () => {
    const result = buildWalletClusterIntelligenceResult(
      [{ invalid: true }],
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
    expect(typeof result.error.code).toBe('string');
    expect(typeof result.error.message).toBe('string');
    // No stack traces, secrets, or RPC URLs
    expect(result.error.message).not.toContain('Error:');
    expect(result.error.message).not.toContain('rpcUrl');
    expect(result.error.message).not.toContain('apiKey');
    expect(result.error.message).not.toContain('privateKey');
  });

  it('invalid wallet cluster returns safe error', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      { invalid: true },
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('null cluster input returns safe error', () => {
    const result = buildWalletClusterIntelligenceResult(
      [...SMART_ACCUMULATOR_FIXTURE_WALLETS],
      null,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('non-array wallets input returns safe error', () => {
    const result = buildWalletClusterIntelligenceResult(
      'not-an-array',
      SMART_ACCUMULATOR_FIXTURE_CLUSTER,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.safeToDisplay).toBe(true);
  });

  it('wiOk/wiErr/isWiOk/isWiErr work correctly', () => {
    const ok = wiOk(42);
    expect(ok.ok).toBe(true);
    expect(ok.value).toBe(42);
    expect(isWiOk(ok)).toBe(true);
    expect(isWiErr(ok)).toBe(false);

    const err = wiErr('INVALID_WALLET_ID', 'test error');
    expect(err.ok).toBe(false);
    expect(err.error.code).toBe('INVALID_WALLET_ID');
    expect(err.error.safeToDisplay).toBe(true);
    expect(isWiOk(err)).toBe(false);
    expect(isWiErr(err)).toBe(true);
  });

  it('validation helpers return safe errors for invalid inputs', () => {
    expect(validateWalletId('').ok).toBe(false);
    expect(validateWalletId('ab').ok).toBe(false);
    expect(validateWalletId('valid_id').ok).toBe(true);

    expect(validateWalletAddress('').ok).toBe(false);
    expect(validateWalletAddress('VALID_ADDR').ok).toBe(true);

    expect(validateClusterId('').ok).toBe(false);
    expect(validateClusterId('valid_cluster').ok).toBe(true);

    expect(validateWalletScoreBounds(-1, 'test').ok).toBe(false);
    expect(validateWalletScoreBounds(101, 'test').ok).toBe(false);
    expect(validateWalletScoreBounds(50, 'test').ok).toBe(true);

    expect(validateWalletConfidenceBounds(-0.1).ok).toBe(false);
    expect(validateWalletConfidenceBounds(1.1).ok).toBe(false);
    expect(validateWalletConfidenceBounds(0.5).ok).toBe(true);
  });

  it('liveData false enforcement rejects bad profile', () => {
    const badProfile = { ...SMART_ACCUMULATOR_FIXTURE_WALLETS[0], liveData: true };
    const result = validateWalletProfile(badProfile);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('invalid cluster type returns safe error', () => {
    const badCluster = {
      ...SMART_ACCUMULATOR_FIXTURE_CLUSTER,
      clusterType: 'buy_signal_cluster',
    };
    const result = validateWalletCluster(badCluster);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('INVALID_CLUSTER_TYPE');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// H. Regression
// ─────────────────────────────────────────────────────────────────────────────

describe('H. Regression', () => {
  it('WALLET_CLUSTER_TYPES contains all expected types', () => {
    const expected = [
      'smart_accumulators', 'profitable_leaders', 'fast_dumpers',
      'fresh_wallet_farm', 'creator_linked', 'same_funding_source',
      'bot_noise', 'known_rug_cluster', 'unknown_fixture',
    ];
    for (const t of expected) {
      expect(WALLET_CLUSTER_TYPES).toContain(t);
    }
  });

  it('ALL_FIXTURE_CLUSTER_PAIRS has 7 entries', () => {
    expect(ALL_FIXTURE_CLUSTER_PAIRS.length).toBe(7);
  });

  it('all classification values are the expected 5', () => {
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toHaveLength(5);
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toContain('reject');
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toContain('watch_only');
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toContain('analysis_only');
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toContain('insufficient_data');
    expect(WALLET_CLUSTER_CLASSIFICATIONS).toContain('fixture_only');
  });

  it('no wallet addresses look like real Solana addresses (all synthetic)', () => {
    for (const pair of ALL_FIXTURE_CLUSTER_PAIRS) {
      for (const w of pair.wallets) {
        // Real Solana addresses are base58, 32-44 chars, no underscores
        // All fixture addresses start with FIXTURE_
        expect(w.walletAddress).toMatch(/^FIXTURE_/);
      }
    }
  });

  it('prior phase exports still accessible (sanity check)', async () => {
    const creatorIntel = await import('@sonic/creator-intelligence');
    expect(typeof creatorIntel.buildCreatorIntelligenceResult).toBe('function');
    expect(typeof creatorIntel.getCreatorIntelligenceCapabilities).toBe('function');

    const tokenIntel = await import('@sonic/token-intelligence');
    expect(typeof tokenIntel.buildTokenIntelligenceResult).toBe('function');

    const eventEngine = await import('@sonic/event-engine');
    expect(typeof eventEngine.createDisabledEventProvider).toBe('function');
  });
});
