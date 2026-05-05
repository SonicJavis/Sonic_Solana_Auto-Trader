/**
 * Phase 8 — Token Intelligence v1: Token Intelligence Engine.
 *
 * Orchestrates scoring, risk flag building, classification, and result assembly.
 * Works exclusively from local/fixture data — no network, no Solana RPC,
 * no provider APIs, no wallet data.
 *
 * Safety invariants:
 *   - actionAllowed/tradingAllowed/executionAllowed always false
 *   - liveData always false
 *   - fixtureOnly always true
 *   - canTrade/canExecute always false
 *   - No side effects, no network calls
 */

import type { TokenProfile, TokenMetricSnapshot } from './token-profile.js';
import type { TokenComponentScores } from './score-types.js';
import type { TokenIntelligenceCapabilities, TokenIntelligenceResult } from './types.js';
import type { TokenRiskFlagEntry } from './risk-flags.js';
import type { TokenClassification } from './classifier.js';
import { makeRiskFlag, hasCriticalFlag } from './risk-flags.js';
import { scoreMetadata } from './metadata-score.js';
import { scoreCurve } from './curve-score.js';
import { scoreHolderConcentration } from './holder-score.js';
import { scoreLiquidity } from './liquidity-score.js';
import { scoreMomentum } from './momentum-score.js';
import { validateTokenProfile, validateTokenMetrics } from './validation.js';
import { tiErr, tiOk, type TiResult } from './errors.js';

// ── Capabilities ──────────────────────────────────────────────────────────────

/**
 * Return the static capabilities of the Phase 8 token intelligence engine.
 * All unsafe capabilities are always false.
 */
export function getTokenIntelligenceCapabilities(): TokenIntelligenceCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canTrade: false,
    canCreateTradeIntents: false,
    canExecute: false,
    fixtureOnly: true,
    safeToDisplay: true,
  };
}

// ── Risk flag builder ─────────────────────────────────────────────────────────

/**
 * Build risk flags from a token profile and metric snapshot.
 * Returns an array of TokenRiskFlagEntry objects.
 * No network calls, no provider APIs.
 */
export function buildTokenRiskFlags(
  profile: TokenProfile,
  metrics: TokenMetricSnapshot,
): readonly TokenRiskFlagEntry[] {
  const flags: TokenRiskFlagEntry[] = [];

  // Metadata flags
  if (!profile.name.trim() || !profile.symbol.trim()) {
    flags.push(makeRiskFlag('MISSING_METADATA', 'critical', 'Token name or symbol is missing'));
  } else if (metrics.metadataCompleteness < 0.5) {
    flags.push(makeRiskFlag('MISSING_METADATA', 'high', 'Token metadata completeness is below 50%'));
  }

  // Social flags
  if (metrics.socialCompleteness === 0) {
    flags.push(makeRiskFlag('MISSING_SOCIALS', 'warn', 'No social presence detected for this token'));
  }

  // Holder flags
  if (metrics.holderCount < 10) {
    flags.push(makeRiskFlag('LOW_HOLDER_COUNT', 'high', 'Holder count is critically low'));
  } else if (metrics.holderCount < 50) {
    flags.push(makeRiskFlag('LOW_HOLDER_COUNT', 'warn', 'Holder count is below the good threshold'));
  }

  if (metrics.topHolderPercent >= 50) {
    flags.push(
      makeRiskFlag(
        'HIGH_TOP_HOLDER_CONCENTRATION',
        'critical',
        'Top holder(s) hold 50% or more of supply',
      ),
    );
  } else if (metrics.topHolderPercent >= 30) {
    flags.push(
      makeRiskFlag(
        'HIGH_TOP_HOLDER_CONCENTRATION',
        'high',
        'Top holder(s) hold 30% or more of supply',
      ),
    );
  }

  // Liquidity flags
  if (metrics.virtualLiquidity < 1) {
    flags.push(makeRiskFlag('LOW_LIQUIDITY', 'critical', 'Virtual liquidity is critically low'));
  } else if (metrics.virtualLiquidity < 5) {
    flags.push(makeRiskFlag('LOW_LIQUIDITY', 'high', 'Virtual liquidity is low'));
  }

  // Curve flags
  if (metrics.curveProgress < 0.05) {
    flags.push(makeRiskFlag('CURVE_TOO_EARLY', 'warn', 'Curve progress is very early — limited data'));
  }
  if (metrics.curveProgress > 0.85) {
    flags.push(makeRiskFlag('CURVE_TOO_ADVANCED', 'warn', 'Curve is very advanced — limited analysis window'));
  }

  // Sell pressure flag
  const totalVelocity = metrics.buyVelocity + metrics.sellVelocity;
  if (totalVelocity > 0 && metrics.sellVelocity / totalVelocity > 0.7) {
    flags.push(makeRiskFlag('SELL_PRESSURE_HIGH', 'high', 'Sell velocity exceeds 70% of total trade velocity'));
  }

  // Fixture data flags
  flags.push(
    makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'No live on-chain data — Phase 8 fixture scoring only'),
  );
  flags.push(
    makeRiskFlag('PLACEHOLDER_CREATOR_UNKNOWN', 'info', 'Creator intelligence not available in Phase 8'),
  );
  flags.push(
    makeRiskFlag('PLACEHOLDER_WALLET_CLUSTER_UNKNOWN', 'info', 'Wallet cluster analysis not available in Phase 8'),
  );
  flags.push(
    makeRiskFlag('PLACEHOLDER_BUNDLE_UNKNOWN', 'info', 'Bundle detection not available in Phase 8'),
  );

  return flags;
}

// ── Classifier ────────────────────────────────────────────────────────────────

/**
 * Classify a token based on its flags, score, and data completeness.
 * Never produces trade wording — returns only safe classifications.
 */
export function classifyToken(
  flags: readonly TokenRiskFlagEntry[],
  finalScore: number,
  confidence: number,
  profile: TokenProfile,
): TokenClassification {
  // Critical flags always reject
  if (hasCriticalFlag(flags)) return 'reject';

  // Insufficient data
  if (confidence < 0.2) return 'insufficient_data';

  // Fixture-only data
  if (profile.fixtureOnly && finalScore < 40) return 'fixture_only';

  // Low score or low confidence
  if (finalScore < 30 || confidence < 0.4) return 'watch_only';

  // Medium-high score on fixture data -> analysis_only (never trade)
  return 'analysis_only';
}

// ── Score computation ─────────────────────────────────────────────────────────

/** Score component weights (must sum to 1.0) */
const COMPONENT_WEIGHTS = {
  metadata: 0.20,
  curve: 0.25,
  holderConcentration: 0.20,
  liquidity: 0.20,
  organicMomentum: 0.15,
} as const;

/**
 * Score a TokenProfile + TokenMetricSnapshot pair.
 * Returns component scores, final score, and confidence.
 * Deterministic from fixture data only.
 */
export function scoreTokenProfile(
  profile: TokenProfile,
  metrics: TokenMetricSnapshot,
): { componentScores: TokenComponentScores; finalScore: number; confidence: number } {
  const metadata = scoreMetadata(profile);
  const curve = scoreCurve(metrics);
  const holderConcentration = scoreHolderConcentration(metrics);
  const liquidity = scoreLiquidity(metrics);
  const organicMomentum = scoreMomentum(metrics);

  const componentScores: TokenComponentScores = {
    metadata,
    curve,
    holderConcentration,
    liquidity,
    organicMomentum,
  };

  const finalScore = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        metadata.score * COMPONENT_WEIGHTS.metadata +
          curve.score * COMPONENT_WEIGHTS.curve +
          holderConcentration.score * COMPONENT_WEIGHTS.holderConcentration +
          liquidity.score * COMPONENT_WEIGHTS.liquidity +
          organicMomentum.score * COMPONENT_WEIGHTS.organicMomentum,
      ),
    ),
  );

  // Confidence degrades with missing metadata, socials, low holder count, and low liquidity
  const completenessSignal = (metrics.metadataCompleteness + metrics.socialCompleteness) / 2;
  const holderSignal = Math.min(1, metrics.holderCount / 50);
  const liquiditySignal = metrics.virtualLiquidity >= 1 ? 1 : metrics.virtualLiquidity;
  const confidence = Math.min(
    1,
    Math.max(0, completenessSignal * 0.4 + holderSignal * 0.3 + liquiditySignal * 0.3),
  );

  return { componentScores, finalScore, confidence };
}

// ── Main result builder ───────────────────────────────────────────────────────

/**
 * Build a complete TokenIntelligenceResult from a profile and metrics pair.
 *
 * Returns a safe result or a safe error.
 * Never throws for normal validation failures.
 * All output fields enforce Phase 8 safety invariants.
 */
export function buildTokenIntelligenceResult(
  profileInput: unknown,
  metricsInput: unknown,
): TiResult<TokenIntelligenceResult> {
  // Validate inputs
  const profileResult = validateTokenProfile(profileInput);
  if (!profileResult.ok) {
    return tiErr(profileResult.error.code, profileResult.error.message);
  }
  const metricsResult = validateTokenMetrics(metricsInput);
  if (!metricsResult.ok) {
    return tiErr(metricsResult.error.code, metricsResult.error.message);
  }

  const profile = profileResult.value;
  const metrics = metricsResult.value;

  if (profile.tokenMint !== metrics.tokenMint) {
    return tiErr(
      'INVALID_TOKEN_METRICS',
      'tokenMint mismatch between profile and metrics',
    );
  }

  const { componentScores, finalScore, confidence } = scoreTokenProfile(profile, metrics);
  const riskFlags = buildTokenRiskFlags(profile, metrics);
  const classification = classifyToken(riskFlags, finalScore, confidence, profile);

  const reasons: string[] = [
    `Classification: ${classification}`,
    `Fixture-only scoring — no live data used`,
    ...componentScores.metadata.reasons.slice(0, 2),
    ...componentScores.curve.reasons.slice(0, 1),
    ...componentScores.liquidity.reasons.slice(0, 1),
  ];

  const result: TokenIntelligenceResult = {
    tokenMint: profile.tokenMint,
    profile,
    metrics,
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

  return tiOk(result);
}
