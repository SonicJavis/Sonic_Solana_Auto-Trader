/**
 * Phase 10 — Wallet Cluster Intelligence v1: Wallet Intelligence Engine.
 *
 * Orchestrates scoring, risk flag building, classification, and result assembly.
 * Works exclusively from local/fixture data — no network, no Solana RPC,
 * no provider APIs, no wallet data, no private keys.
 *
 * Safety invariants:
 *   - actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed always false
 *   - liveData always false
 *   - fixtureOnly always true
 *   - canTrade/canExecute/canCreateTradeIntents/canCopyTrade always false
 *   - canUseLiveData/canUseSolanaRpc/canUseProviderApis/canAccessPrivateKeys always false
 *   - No side effects, no network calls
 */

import type { WalletProfile } from './wallet-profile.js';
import type { WalletCluster } from './wallet-cluster.js';
import type { WalletComponentScores } from './score-types.js';
import type { WalletIntelligenceCapabilities, WalletClusterIntelligenceResult } from './types.js';
import type { WalletClusterRiskFlagEntry } from './risk-flags.js';
import type { WalletClusterClassification } from './classifier.js';
import { makeWalletClusterRiskFlag, hasWalletCriticalFlag } from './risk-flags.js';
import { scoreWalletProfile } from './wallet-quality-score.js';
import { scoreWalletCluster } from './cluster-quality-score.js';
import { scoreLeaderFollower } from './leader-follower-score.js';
import { scoreFreshWalletRisk } from './fresh-wallet-score.js';
import { scoreFundingSource } from './funding-source-score.js';
import {
  validateWalletProfile,
  validateWalletCluster,
} from './validation.js';
import { wiErr, wiOk, type WiResult } from './errors.js';

// ── Capabilities ──────────────────────────────────────────────────────────────

/**
 * Return the static capabilities of the Phase 10 wallet intelligence engine.
 * All unsafe capabilities are always false.
 */
export function getWalletIntelligenceCapabilities(): WalletIntelligenceCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCopyTrade: false,
    canTrade: false,
    canExecute: false,
    fixtureOnly: true,
    safeToDisplay: true,
  };
}

// ── Risk flag builder ─────────────────────────────────────────────────────────

/**
 * Build wallet cluster risk flags from wallet profiles and cluster model.
 * Returns an array of WalletClusterRiskFlagEntry objects.
 * No network calls, no provider APIs.
 */
export function buildWalletClusterRiskFlags(
  wallets: readonly WalletProfile[],
  cluster: WalletCluster,
): readonly WalletClusterRiskFlagEntry[] {
  const flags: WalletClusterRiskFlagEntry[] = [];

  // Insufficient wallet data
  if (wallets.length === 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'INSUFFICIENT_WALLET_DATA',
        'high',
        'No wallet profiles provided — insufficient wallet data for reliable scoring',
      ),
    );
  }

  // Insufficient cluster data
  if (cluster.representativeWalletCount === 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'INSUFFICIENT_CLUSTER_DATA',
        'high',
        'No representative wallets — insufficient cluster data for reliable scoring',
      ),
    );
  }

  // Low wallet age signals
  const avgAgeDays =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.walletAgeDays, 0) / wallets.length
      : 0;
  if (wallets.length > 0 && avgAgeDays < 30) {
    flags.push(
      makeWalletClusterRiskFlag(
        'LOW_WALLET_AGE',
        avgAgeDays < 7 ? 'high' : 'warn',
        `Low average wallet age: ${avgAgeDays.toFixed(1)} days`,
      ),
    );
  }

  // Fast dumper history
  const totalFastDumps = wallets.reduce((sum, w) => sum + w.fastDumpSignalCount, 0);
  if (totalFastDumps > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'FAST_DUMPER_HISTORY',
        totalFastDumps >= 5 ? 'high' : 'warn',
        `${totalFastDumps} fast-dump signal(s) across cluster wallets`,
      ),
    );
  }

  // Bot noise signals
  const totalBotNoise = wallets.reduce((sum, w) => sum + w.botNoiseSignalCount, 0);
  if (totalBotNoise > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'BOT_NOISE_SIGNALS',
        totalBotNoise >= 8 ? 'high' : 'warn',
        `${totalBotNoise} bot-noise signal(s) across cluster wallets`,
      ),
    );
  }

  // Fresh wallet farm placeholder
  if (cluster.freshWalletSignalCount >= 3 || cluster.clusterType === 'fresh_wallet_farm') {
    flags.push(
      makeWalletClusterRiskFlag(
        'FRESH_WALLET_FARM_PLACEHOLDER',
        cluster.freshWalletSignalCount >= 5 ? 'high' : 'warn',
        `${cluster.freshWalletSignalCount} fresh-wallet signal(s) — farm pattern suspected (placeholder)`,
      ),
    );
  }

  // Same funding source placeholder
  if (cluster.sameFundingSourceSignalCount > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'SAME_FUNDING_SOURCE_PLACEHOLDER',
        cluster.sameFundingSourceSignalCount >= 4 ? 'high' : 'warn',
        `${cluster.sameFundingSourceSignalCount} same-funding-source signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Same-slot coordination placeholder
  if (cluster.sameSlotParticipationSignalCount > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'SAME_SLOT_COORDINATION_PLACEHOLDER',
        cluster.sameSlotParticipationSignalCount >= 4 ? 'high' : 'warn',
        `${cluster.sameSlotParticipationSignalCount} same-slot participation signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Creator-linked wallet placeholder
  if (cluster.creatorLinkedSignalCount > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'CREATOR_LINKED_WALLET_PLACEHOLDER',
        cluster.creatorLinkedSignalCount >= 3 ? 'high' : 'warn',
        `${cluster.creatorLinkedSignalCount} creator-linked signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Coordinated sell placeholder
  if (cluster.coordinatedSellSignalCount > 0) {
    flags.push(
      makeWalletClusterRiskFlag(
        'COORDINATED_SELL_PLACEHOLDER',
        cluster.coordinatedSellSignalCount >= 4 ? 'critical' : 'high',
        `${cluster.coordinatedSellSignalCount} coordinated-sell signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Low hold time
  const avgHoldTime =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.averageHoldTimeSeconds, 0) / wallets.length
      : 0;
  if (wallets.length > 0 && avgHoldTime < 120) {
    flags.push(
      makeWalletClusterRiskFlag(
        'LOW_HOLD_TIME',
        avgHoldTime < 30 ? 'high' : 'warn',
        `Low average hold time: ${avgHoldTime.toFixed(0)}s`,
      ),
    );
  }

  // Low entry quality
  const avgEntryQuality =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.averageEntryTimingQuality, 0) / wallets.length
      : 1;
  if (wallets.length > 0 && avgEntryQuality < 0.3) {
    flags.push(
      makeWalletClusterRiskFlag(
        'LOW_ENTRY_QUALITY',
        'warn',
        `Low average entry timing quality: ${(avgEntryQuality * 100).toFixed(0)}%`,
      ),
    );
  }

  // Low exit quality
  const avgExitQuality =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.averageExitTimingQuality, 0) / wallets.length
      : 1;
  if (wallets.length > 0 && avgExitQuality < 0.3) {
    flags.push(
      makeWalletClusterRiskFlag(
        'LOW_EXIT_QUALITY',
        'warn',
        `Low average exit timing quality: ${(avgExitQuality * 100).toFixed(0)}%`,
      ),
    );
  }

  // Known rug cluster is critical
  if (cluster.clusterType === 'known_rug_cluster') {
    flags.push(
      makeWalletClusterRiskFlag(
        'COORDINATED_SELL_PLACEHOLDER',
        'critical',
        'Known rug cluster — coordinated sell pattern in history (fixture/placeholder)',
      ),
    );
  }

  // Always-present placeholder flags
  flags.push(
    makeWalletClusterRiskFlag(
      'LIVE_DATA_UNAVAILABLE',
      'info',
      'No live on-chain data — Phase 10 fixture/local scoring only',
    ),
  );
  flags.push(
    makeWalletClusterRiskFlag(
      'BUNDLE_RISK_UNKNOWN',
      'info',
      'Bundle risk analysis not available in Phase 10',
    ),
  );
  flags.push(
    makeWalletClusterRiskFlag(
      'CREATOR_RELATIONSHIP_UNKNOWN',
      'info',
      'Creator-wallet graph analysis not available in Phase 10',
    ),
  );

  return flags;
}

// ── Classifier ────────────────────────────────────────────────────────────────

/**
 * Classify a wallet cluster based on flags, score, confidence, and data completeness.
 * Never produces trade wording — returns only safe classifications.
 */
export function classifyWalletCluster(
  flags: readonly WalletClusterRiskFlagEntry[],
  finalScore: number,
  confidence: number,
  cluster: WalletCluster,
): WalletClusterClassification {
  // Critical risk flags always reject
  if (hasWalletCriticalFlag(flags)) return 'reject';

  // Insufficient wallet data
  const hasInsufficientDataFlag = flags.some(
    (f) => f.code === 'INSUFFICIENT_WALLET_DATA' || f.code === 'INSUFFICIENT_CLUSTER_DATA',
  );
  if (hasInsufficientDataFlag || confidence < 0.15) return 'insufficient_data';

  // Fixture-only with low score
  if (cluster.fixtureOnly && finalScore < 30) return 'fixture_only';

  // Low score or low confidence
  if (finalScore < 25 || confidence < 0.3) return 'watch_only';

  // Medium-high score on fixture data -> analysis_only (never trade/copy)
  return 'analysis_only';
}

// ── Score computation ─────────────────────────────────────────────────────────

/** Component weights (must sum to 1.0) */
const COMPONENT_WEIGHTS = {
  walletQuality: 0.30,
  clusterQuality: 0.25,
  leaderFollower: 0.20,
  freshWalletRisk: 0.15,
  fundingSource: 0.10,
} as const;

/**
 * Score a set of wallet profiles and a cluster deterministically.
 * Returns component scores, final score, and confidence.
 */
export function scoreWalletClusterGroup(
  wallets: readonly WalletProfile[],
  cluster: WalletCluster,
): { componentScores: WalletComponentScores; finalScore: number; confidence: number } {
  // Average wallet quality score across all wallets
  const walletScores = wallets.map((w) => scoreWalletProfile(w));
  const avgWalletScore =
    walletScores.length > 0
      ? walletScores.reduce((sum, s) => sum + s.score, 0) / walletScores.length
      : 0;

  // Use the first wallet's score components for representative detail
  const walletQualityScore = walletScores[0] ?? {
    walletAgeQuality: 0,
    holdTimeQuality: 0,
    entryTimingQuality: 0,
    exitTimingQuality: 0,
    profitabilityPlaceholderQuality: 0,
    fastDumpPenalty: 0,
    botNoisePenalty: 0,
    score: 0,
    reasons: ['No wallet profiles — insufficient data'],
  };
  // Override score with average
  const walletQualityScoreWithAvg = { ...walletQualityScore, score: Math.round(avgWalletScore) };

  const clusterQualityScore = scoreWalletCluster(cluster);
  const leaderFollowerScore = scoreLeaderFollower(cluster);
  const freshWalletRiskScore = scoreFreshWalletRisk(wallets, cluster);
  const fundingSourceScore = scoreFundingSource(cluster);

  const componentScores: WalletComponentScores = {
    walletQualityScore: walletQualityScoreWithAvg,
    clusterQualityScore,
    leaderFollowerScore,
    freshWalletRiskScore,
    fundingSourceScore,
  };

  const rawFinalScore =
    walletQualityScoreWithAvg.score * COMPONENT_WEIGHTS.walletQuality +
    clusterQualityScore.score * COMPONENT_WEIGHTS.clusterQuality +
    leaderFollowerScore.score * COMPONENT_WEIGHTS.leaderFollower +
    freshWalletRiskScore.score * COMPONENT_WEIGHTS.freshWalletRisk +
    fundingSourceScore.score * COMPONENT_WEIGHTS.fundingSource;

  const finalScore = Math.round(Math.min(100, Math.max(0, rawFinalScore)));

  // Confidence: degrades with no wallets, low launch count, and missing data
  const walletCountSignal = Math.min(1, wallets.length / 3);
  const launchSignal = Math.min(
    1,
    (wallets.reduce((sum, w) => sum + w.observedLaunchCount, 0) / Math.max(1, wallets.length)) /
      5,
  );
  const qualitySignal =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.averageEntryTimingQuality, 0) / wallets.length
      : 0;

  const confidence = Math.min(
    1,
    Math.max(
      0,
      walletCountSignal * 0.4 + launchSignal * 0.4 + qualitySignal * 0.2,
    ),
  );

  return { componentScores, finalScore, confidence };
}

// ── Main result builder ───────────────────────────────────────────────────────

/**
 * Build a complete WalletClusterIntelligenceResult from wallet profiles and a cluster.
 *
 * Returns a safe result or a safe error.
 * Never throws for normal validation failures.
 * All output fields enforce Phase 10 safety invariants.
 */
export function buildWalletClusterIntelligenceResult(
  walletsInput: unknown,
  clusterInput: unknown,
): WiResult<WalletClusterIntelligenceResult> {
  // Validate cluster
  const clusterResult = validateWalletCluster(clusterInput);
  if (!clusterResult.ok) {
    return wiErr(clusterResult.error.code, clusterResult.error.message);
  }
  const cluster = clusterResult.value;

  // Validate wallets array
  if (!Array.isArray(walletsInput)) {
    return wiErr('INVALID_WALLET_PROFILE', 'wallets must be an array');
  }
  const wallets: WalletProfile[] = [];
  for (const w of walletsInput as unknown[]) {
    const walletResult = validateWalletProfile(w);
    if (!walletResult.ok) {
      return wiErr(walletResult.error.code, walletResult.error.message);
    }
    wallets.push(walletResult.value);
  }

  const { componentScores, finalScore, confidence } = scoreWalletClusterGroup(wallets, cluster);
  const riskFlags = buildWalletClusterRiskFlags(wallets, cluster);
  const classification = classifyWalletCluster(riskFlags, finalScore, confidence, cluster);

  const reasons: string[] = [
    `Classification: ${classification}`,
    'Fixture/local scoring only — no live data used',
    ...componentScores.walletQualityScore.reasons.slice(0, 2),
    ...componentScores.clusterQualityScore.reasons.slice(0, 1),
  ];

  const result: WalletClusterIntelligenceResult = {
    clusterId: cluster.clusterId,
    wallets,
    cluster,
    componentScores,
    finalScore,
    confidence,
    classification,
    riskFlags,
    reasons,
    generatedAt: new Date().toISOString(),
    fixtureOnly: true,
    liveData: false,
    actionAllowed: false,
    tradingAllowed: false,
    executionAllowed: false,
    copyTradingAllowed: false,
    safeToDisplay: true,
  };

  return wiOk(result);
}
