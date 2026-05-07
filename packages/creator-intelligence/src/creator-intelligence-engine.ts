/**
 * Phase 9 — Creator Intelligence v1: Creator Intelligence Engine.
 *
 * Orchestrates scoring, risk flag building, classification, and result assembly.
 * Works exclusively from local/fixture data — no network, no Solana RPC,
 * no provider APIs, no wallet data.
 *
 * Safety invariants:
 *   - actionAllowed/tradingAllowed/executionAllowed always false
 *   - liveData always false
 *   - fixtureOnly always true
 *   - canTrade/canExecute/canCreateTradeIntents always false
 *   - canUseWalletData/canUseSolanaRpc/canUseProviderApis always false
 *   - No side effects, no network calls
 */

import type { CreatorProfile } from './creator-profile.js';
import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import type { CreatorComponentScores } from './score-types.js';
import type { CreatorIntelligenceCapabilities, CreatorIntelligenceResult } from './types.js';
import type { CreatorRiskFlagEntry } from './risk-flags.js';
import type { CreatorClassification } from './classifier.js';
import { makeCreatorRiskFlag, hasCreatorCriticalFlag } from './risk-flags.js';
import { scoreSuccess } from './success-score.js';
import { scoreLaunchQuality } from './launch-quality-score.js';
import { scoreConsistency } from './consistency-score.js';
import { scoreSuspiciousPatterns } from './suspicious-pattern-score.js';
import {
  validateCreatorProfile,
  validateCreatorHistory,
} from './validation.js';
import { ciErr, ciOk, type CiResult } from './errors.js';
import { getCreatorFixtureModelCapabilities } from './fixture-model-capabilities.js';

// ── Capabilities ──────────────────────────────────────────────────────────────

/**
 * Return the static capabilities of the Phase 9 creator intelligence engine.
 * All unsafe capabilities are always false.
 */
export function getCreatorIntelligenceCapabilities(): CreatorIntelligenceCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canUseWalletData: false,
    canCreateTradeIntents: false,
    canTrade: false,
    canExecute: false,
    ...getCreatorFixtureModelCapabilities(),
    fixtureOnly: true,
    safeToDisplay: true,
  };
}

// ── Risk flag builder ─────────────────────────────────────────────────────────

/**
 * Build creator risk flags from a creator profile and history snapshot.
 * Returns an array of CreatorRiskFlagEntry objects.
 * No network calls, no provider APIs.
 */
export function buildCreatorRiskFlags(
  profile: CreatorProfile,
  history: CreatorLaunchHistorySnapshot,
): readonly CreatorRiskFlagEntry[] {
  const flags: CreatorRiskFlagEntry[] = [];

  // Insufficient data flag
  if (history.launchCount === 0) {
    flags.push(
      makeCreatorRiskFlag(
        'INSUFFICIENT_CREATOR_DATA',
        'high',
        'No launch history — insufficient creator data for reliable scoring',
      ),
    );
  }

  // Low launch count
  if (history.launchCount > 0 && history.launchCount < 3) {
    flags.push(
      makeCreatorRiskFlag(
        'LOW_LAUNCH_COUNT',
        'warn',
        `Only ${history.launchCount} launch(es) observed — limited history`,
      ),
    );
  }

  // High failure rate
  if (history.launchCount > 0) {
    const failureRate = history.failedLaunchCount / history.launchCount;
    if (failureRate > 0.5) {
      flags.push(
        makeCreatorRiskFlag(
          'HIGH_FAILURE_RATE',
          'high',
          `Failure rate of ${Math.round(failureRate * 100)}% across observed launches`,
        ),
      );
    }
  }

  // Low migration rate
  if (history.launchCount > 0) {
    const migrationRate = history.migratedLaunchCount / history.launchCount;
    if (migrationRate < 0.2) {
      flags.push(
        makeCreatorRiskFlag(
          'LOW_MIGRATION_RATE',
          'warn',
          `Migration rate of ${Math.round(migrationRate * 100)}% — few launches graduated`,
        ),
      );
    }
  }

  // Fast dump history
  if (history.averageDumpSpeed > 0.7) {
    flags.push(
      makeCreatorRiskFlag(
        'FAST_DUMP_HISTORY',
        'high',
        'High average dump speed — fast exit patterns detected in history',
      ),
    );
  }

  // Low holder quality
  if (history.averageHolderQuality < 0.25 && history.launchCount > 0) {
    flags.push(
      makeCreatorRiskFlag(
        'LOW_HOLDER_QUALITY',
        'warn',
        'Low average holder quality across observed launches',
      ),
    );
  }

  // Low liquidity quality
  if (history.averageLiquidityQuality < 0.25 && history.launchCount > 0) {
    flags.push(
      makeCreatorRiskFlag(
        'LOW_LIQUIDITY_QUALITY',
        'warn',
        'Low average liquidity quality across observed launches',
      ),
    );
  }

  // Suspicious funding placeholder
  if (history.suspiciousFundingSignals > 0) {
    flags.push(
      makeCreatorRiskFlag(
        'SUSPICIOUS_FUNDING_PLACEHOLDER',
        history.suspiciousFundingSignals >= 3 ? 'high' : 'warn',
        `${history.suspiciousFundingSignals} suspicious funding signal(s) detected (placeholder analysis only)`,
      ),
    );
  }

  // Repeated metadata placeholder
  if (history.repeatedMetadataSignals > 0) {
    flags.push(
      makeCreatorRiskFlag(
        'REPEATED_METADATA_PLACEHOLDER',
        history.repeatedMetadataSignals >= 3 ? 'high' : 'warn',
        `${history.repeatedMetadataSignals} repeated metadata signal(s) detected (placeholder analysis only)`,
      ),
    );
  }

  // Bundle abuse placeholder
  if (history.bundleAbuseSignals > 0) {
    flags.push(
      makeCreatorRiskFlag(
        'BUNDLE_ABUSE_PLACEHOLDER',
        history.bundleAbuseSignals >= 2 ? 'high' : 'warn',
        `${history.bundleAbuseSignals} bundle abuse signal(s) detected (placeholder analysis only)`,
      ),
    );
  }

  // Rug-like history
  if (history.rugLikeLaunchCount > 0) {
    const rugRate =
      history.launchCount > 0 ? history.rugLikeLaunchCount / history.launchCount : 1;
    flags.push(
      makeCreatorRiskFlag(
        'RUG_LIKE_HISTORY',
        rugRate >= 0.5 ? 'critical' : 'high',
        `${history.rugLikeLaunchCount} rug-like launch(es) detected in history`,
      ),
    );
  }

  // Always-present placeholder flags
  flags.push(
    makeCreatorRiskFlag(
      'LIVE_DATA_UNAVAILABLE',
      'info',
      'No live on-chain data — Phase 9 fixture/local scoring only',
    ),
  );
  flags.push(
    makeCreatorRiskFlag(
      'WALLET_CLUSTER_UNKNOWN',
      'info',
      'Wallet cluster analysis not available in Phase 9',
    ),
  );
  flags.push(
    makeCreatorRiskFlag(
      'BUNDLE_RISK_UNKNOWN',
      'info',
      'Bundle risk analysis not available in Phase 9',
    ),
  );

  void profile; // profile is reserved for future use (e.g., display label checks)

  return flags;
}

// ── Classifier ────────────────────────────────────────────────────────────────

/**
 * Classify a creator based on flags, score, confidence, and data completeness.
 * Never produces trade wording — returns only safe classifications.
 */
export function classifyCreator(
  flags: readonly CreatorRiskFlagEntry[],
  finalScore: number,
  confidence: number,
  profile: CreatorProfile,
): CreatorClassification {
  // Critical risk flags always reject
  if (hasCreatorCriticalFlag(flags)) return 'reject';

  // Insufficient data
  const hasInsufficientDataFlag = flags.some((f) => f.code === 'INSUFFICIENT_CREATOR_DATA');
  if (hasInsufficientDataFlag || confidence < 0.15) return 'insufficient_data';

  // Fixture-only with low score
  if (profile.fixtureOnly && finalScore < 35) return 'fixture_only';

  // Low score or low confidence
  if (finalScore < 30 || confidence < 0.3) return 'watch_only';

  // Medium-high score on fixture data -> analysis_only (never trade)
  return 'analysis_only';
}

// ── Score computation ─────────────────────────────────────────────────────────

/** Score component weights (must sum to 1.0) */
const COMPONENT_WEIGHTS = {
  success: 0.30,
  launchQuality: 0.30,
  consistency: 0.20,
  // suspiciousPattern is used as a safety gate/modifier, weighted last
  suspiciousPattern: 0.20,
} as const;

/**
 * Score a CreatorProfile + CreatorLaunchHistorySnapshot pair.
 * Returns component scores, final score, and confidence.
 * Deterministic from fixture data only.
 *
 * Final score blends positive quality scores with the suspicious pattern
 * safety score (higher suspiciousPattern = safer).
 */
export function scoreCreatorProfile(
  profile: CreatorProfile,
  history: CreatorLaunchHistorySnapshot,
): { componentScores: CreatorComponentScores; finalScore: number; confidence: number } {
  const successScore = scoreSuccess(history);
  const launchQualityScore = scoreLaunchQuality(history);
  const consistencyScore = scoreConsistency(history);
  const suspiciousPatternScore = scoreSuspiciousPatterns(history);

  const componentScores: CreatorComponentScores = {
    successScore,
    launchQualityScore,
    consistencyScore,
    suspiciousPatternScore,
  };

  const rawFinalScore =
    successScore.score * COMPONENT_WEIGHTS.success +
    launchQualityScore.score * COMPONENT_WEIGHTS.launchQuality +
    consistencyScore.score * COMPONENT_WEIGHTS.consistency +
    suspiciousPatternScore.score * COMPONENT_WEIGHTS.suspiciousPattern;

  const finalScore = Math.round(Math.min(100, Math.max(0, rawFinalScore)));

  // Confidence degrades with missing history and low launch count
  const launchSignal = Math.min(1, history.launchCount / 5);
  const qualitySignal =
    (history.averageHolderQuality + history.averageLiquidityQuality) / 2;
  // Suspicious patterns reduce confidence
  const suspiciousSignal = suspiciousPatternScore.score / 100;

  const confidence = Math.min(
    1,
    Math.max(
      0,
      launchSignal * 0.5 + qualitySignal * 0.3 + suspiciousSignal * 0.2,
    ),
  );

  void profile; // reserved for future profile-level confidence modifiers

  return { componentScores, finalScore, confidence };
}

// ── Main result builder ───────────────────────────────────────────────────────

/**
 * Build a complete CreatorIntelligenceResult from a profile and history pair.
 *
 * Returns a safe result or a safe error.
 * Never throws for normal validation failures.
 * All output fields enforce Phase 9 safety invariants.
 */
export function buildCreatorIntelligenceResult(
  profileInput: unknown,
  historyInput: unknown,
): CiResult<CreatorIntelligenceResult> {
  // Validate inputs
  const profileResult = validateCreatorProfile(profileInput);
  if (!profileResult.ok) {
    return ciErr(profileResult.error.code, profileResult.error.message);
  }
  const historyResult = validateCreatorHistory(historyInput);
  if (!historyResult.ok) {
    return ciErr(historyResult.error.code, historyResult.error.message);
  }

  const profile = profileResult.value;
  const history = historyResult.value;

  if (profile.creatorId !== history.creatorId) {
    return ciErr(
      'INVALID_CREATOR_HISTORY',
      'creatorId mismatch between profile and history',
    );
  }

  const { componentScores, finalScore, confidence } = scoreCreatorProfile(profile, history);
  const riskFlags = buildCreatorRiskFlags(profile, history);
  const classification = classifyCreator(riskFlags, finalScore, confidence, profile);

  const reasons: string[] = [
    `Classification: ${classification}`,
    'Fixture/local scoring only — no live data used',
    ...componentScores.successScore.reasons.slice(0, 2),
    ...componentScores.suspiciousPatternScore.reasons.slice(0, 2),
  ];

  const result: CreatorIntelligenceResult = {
    creatorId: profile.creatorId,
    profile,
    history,
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
    safeToDisplay: true,
  };

  return ciOk(result);
}
