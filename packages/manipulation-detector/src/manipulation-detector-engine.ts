/**
 * Phase 11 — Bundle / Manipulation Detector v1: Manipulation Detector Engine.
 *
 * Orchestrates scoring, risk flag building, classification, and result assembly.
 * Works exclusively from local/fixture data — no network, no Solana RPC,
 * no provider APIs, no wallet data, no private keys.
 *
 * Safety invariants:
 *   - actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed always false
 *   - liveData always false
 *   - fixtureOnly always true
 *   - canTrade/canExecute/canCreateTradeIntents/canCreateEnforcementActions always false
 *   - canUseLiveData/canUseSolanaRpc/canUseProviderApis/canAccessPrivateKeys always false
 *   - No side effects, no network calls
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { ManipulationComponentScores } from './score-types.js';
import type {
  ManipulationDetectorCapabilities,
  ManipulationDetectionResult,
} from './types.js';
import type { ManipulationRiskFlagEntry } from './risk-flags.js';
import type { ManipulationClassification } from './classifier.js';
import {
  makeManipulationRiskFlag,
  hasManipulationCriticalFlag,
  hasManipulationFlagCode,
} from './risk-flags.js';
import { scoreBundleSignals } from './bundle-score.js';
import { scoreWashTradePatterns } from './wash-trade-score.js';
import { scoreCoordination } from './coordination-score.js';
import { scoreFundingPatterns } from './funding-pattern-score.js';
import { scoreCreatorLinks } from './creator-link-score.js';
import {
  validateBundleSignal,
  validateManipulationPattern,
  validateCoordinatedActivity,
} from './validation.js';
import { mdErr, mdOk, type MdResult } from './errors.js';

// ── Capabilities ──────────────────────────────────────────────────────────────

/**
 * Return the static capabilities of the Phase 11 manipulation detector engine.
 * All unsafe capabilities are always false.
 */
export function getManipulationDetectorCapabilities(): ManipulationDetectorCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCreateEnforcementActions: false,
    canTrade: false,
    canExecute: false,
    fixtureOnly: true,
    safeToDisplay: true,
  };
}

// ── Component scoring helpers ─────────────────────────────────────────────────

// Re-export scoring helpers for use by consumers
export { scoreBundleSignals } from './bundle-score.js';
export { scoreWashTradePatterns } from './wash-trade-score.js';
export { scoreCoordination } from './coordination-score.js';
export { scoreFundingPatterns } from './funding-pattern-score.js';
export { scoreCreatorLinks } from './creator-link-score.js';

// ── Risk flag builder ─────────────────────────────────────────────────────────

/**
 * Build manipulation risk flags from bundle signals, patterns, and activity snapshot.
 * Returns an array of ManipulationRiskFlagEntry objects.
 * No network calls, no provider APIs.
 */
export function buildManipulationRiskFlags(
  signals: readonly BundleSignal[],
  patterns: readonly ManipulationPattern[],
  activity: CoordinatedActivitySnapshot,
): readonly ManipulationRiskFlagEntry[] {
  const flags: ManipulationRiskFlagEntry[] = [];

  // Insufficient data
  if (signals.length === 0 && patterns.length === 0) {
    flags.push(
      makeManipulationRiskFlag(
        'INSUFFICIENT_MANIPULATION_DATA',
        'high',
        'No bundle signals or patterns provided — insufficient manipulation data',
      ),
    );
  }

  // Same-slot participation
  const totalSameSlot =
    signals.reduce((sum, s) => sum + s.sameSlotParticipationCount, 0) +
    activity.sameSlotWalletCount;
  if (totalSameSlot > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'SAME_SLOT_PARTICIPATION_PLACEHOLDER',
        totalSameSlot >= 5 ? 'high' : 'warn',
        `${totalSameSlot} same-slot participation signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Same funding source
  const totalSameFunding =
    signals.reduce((sum, s) => sum + s.sameFundingSourceSignalCount, 0) +
    activity.sameFundingWalletCount;
  if (totalSameFunding > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'SAME_FUNDING_SOURCE_PLACEHOLDER',
        totalSameFunding >= 4 ? 'high' : 'warn',
        `${totalSameFunding} same-funding-source signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Coordinated entry
  const totalCoordEntry =
    signals.reduce((sum, s) => sum + s.coordinatedEntrySignalCount, 0) +
    activity.coordinatedEntryCount;
  if (totalCoordEntry > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'COORDINATED_ENTRY_PLACEHOLDER',
        totalCoordEntry >= 4 ? 'high' : 'warn',
        `${totalCoordEntry} coordinated-entry signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Coordinated exit
  const totalCoordExit =
    signals.reduce((sum, s) => sum + s.coordinatedExitSignalCount, 0) +
    activity.coordinatedExitCount;
  if (totalCoordExit > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'COORDINATED_EXIT_PLACEHOLDER',
        totalCoordExit >= 4 ? 'high' : 'warn',
        `${totalCoordExit} coordinated-exit signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Wash trade cycles
  const totalWashCycles =
    signals.reduce((sum, s) => sum + s.suspectedWashCycleCount, 0) +
    activity.washTradeCycleCount;
  if (totalWashCycles > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'WASH_TRADE_CYCLE_PLACEHOLDER',
        totalWashCycles >= 3 ? 'high' : 'warn',
        `${totalWashCycles} suspected wash-trade cycle(s) (placeholder analysis only)`,
      ),
    );
  }

  // Creator-linked wallets
  const totalCreatorLinked =
    signals.reduce((sum, s) => sum + s.creatorLinkedWalletSignalCount, 0) +
    activity.creatorLinkedWalletCount;
  if (totalCreatorLinked > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'CREATOR_LINKED_WALLETS_PLACEHOLDER',
        totalCreatorLinked >= 3 ? 'high' : 'warn',
        `${totalCreatorLinked} creator-linked wallet signal(s) (placeholder analysis only)`,
      ),
    );
  }

  // Fresh wallet farm
  if (activity.freshWalletCount >= 3) {
    flags.push(
      makeManipulationRiskFlag(
        'FRESH_WALLET_FARM_PLACEHOLDER',
        activity.freshWalletCount >= 5 ? 'high' : 'warn',
        `${activity.freshWalletCount} fresh wallet(s) observed (placeholder analysis only)`,
      ),
    );
  }

  // Bot noise
  if (activity.botNoiseSignalCount > 0) {
    flags.push(
      makeManipulationRiskFlag(
        'BOT_NOISE_PATTERN',
        activity.botNoiseSignalCount >= 5 ? 'high' : 'warn',
        `${activity.botNoiseSignalCount} bot-noise signal(s) detected`,
      ),
    );
  }

  // Pattern-based flags
  for (const pattern of patterns) {
    if (pattern.patternType === 'likely_bundle') {
      flags.push(
        makeManipulationRiskFlag(
          'LIKELY_BUNDLE_PATTERN',
          'critical',
          `Likely bundle pattern detected: ${pattern.description}`,
        ),
      );
    } else if (pattern.patternType === 'possible_bundle') {
      flags.push(
        makeManipulationRiskFlag(
          'POSSIBLE_BUNDLE_PATTERN',
          'high',
          `Possible bundle pattern detected: ${pattern.description}`,
        ),
      );
    } else if (pattern.patternType === 'likely_wash_trade') {
      flags.push(
        makeManipulationRiskFlag(
          'LIKELY_WASH_TRADE_PATTERN',
          'critical',
          `Likely wash-trade pattern detected: ${pattern.description}`,
        ),
      );
    } else if (pattern.patternType === 'possible_wash_trade') {
      flags.push(
        makeManipulationRiskFlag(
          'POSSIBLE_WASH_TRADE_PATTERN',
          'high',
          `Possible wash-trade pattern detected: ${pattern.description}`,
        ),
      );
    } else if (pattern.patternType === 'coordinated_dump') {
      flags.push(
        makeManipulationRiskFlag(
          'COORDINATED_DUMP_PATTERN',
          'critical',
          `Coordinated dump pattern detected: ${pattern.description}`,
        ),
      );
    }
  }

  // Always-present informational flags
  flags.push(
    makeManipulationRiskFlag(
      'LIVE_DATA_UNAVAILABLE',
      'info',
      'No live on-chain data — Phase 11 fixture/local detection only',
    ),
  );
  flags.push(
    makeManipulationRiskFlag(
      'WALLET_CLUSTER_CONTEXT_UNKNOWN',
      'info',
      'Wallet cluster context not available in Phase 11 (placeholder only)',
    ),
  );
  flags.push(
    makeManipulationRiskFlag(
      'CREATOR_CONTEXT_UNKNOWN',
      'info',
      'Creator context not available in Phase 11 (placeholder only)',
    ),
  );

  return flags;
}

// ── Classifier ────────────────────────────────────────────────────────────────

/**
 * Classify a manipulation detection based on flags, score, and confidence.
 * Never produces trade wording — returns only safe classifications.
 */
export function classifyManipulation(input: {
  flags: readonly ManipulationRiskFlagEntry[];
  finalScore: number;
  confidence: number;
  hasSignals: boolean;
}): ManipulationClassification {
  const { flags, finalScore, confidence, hasSignals } = input;

  // Critical flags always reject
  if (hasManipulationCriticalFlag(flags)) return 'reject';

  // Likely bundle/wash/dump patterns also reject
  if (
    hasManipulationFlagCode(flags, 'LIKELY_BUNDLE_PATTERN') ||
    hasManipulationFlagCode(flags, 'LIKELY_WASH_TRADE_PATTERN') ||
    hasManipulationFlagCode(flags, 'COORDINATED_DUMP_PATTERN')
  ) {
    return 'reject';
  }

  // Insufficient data
  const hasInsufficientFlag = hasManipulationFlagCode(flags, 'INSUFFICIENT_MANIPULATION_DATA');
  if (hasInsufficientFlag || !hasSignals || confidence < 0.15) return 'insufficient_data';

  // Low score or low confidence -> watch_only
  if (finalScore < 25 || confidence < 0.3) return 'watch_only';

  // Medium-high score on fixture data -> analysis_only (never trade/copy)
  return 'analysis_only';
}

// ── Component weight computation ──────────────────────────────────────────────

/** Component weights for final score (must sum to 1.0) */
const COMPONENT_WEIGHTS = {
  bundleRisk: 0.30,
  washTrade: 0.25,
  coordination: 0.20,
  fundingPattern: 0.15,
  creatorLink: 0.10,
} as const;

// ── Confidence computation ─────────────────────────────────────────────────────

function computeConfidence(
  signals: readonly BundleSignal[],
  patterns: readonly ManipulationPattern[],
  activity: CoordinatedActivitySnapshot,
): number {
  const signalCountSignal = Math.min(1, (signals.length + patterns.length) / 3);
  const walletCountSignal = Math.min(1, activity.participatingWalletCount / 5);
  const dataCompletenessSignal =
    activity.participatingWalletCount > 0 ? 0.6 : 0.2;

  const raw =
    signalCountSignal * 0.40 +
    walletCountSignal * 0.30 +
    dataCompletenessSignal * 0.30;

  return Math.min(1, Math.max(0, raw));
}

// ── Main result builder ───────────────────────────────────────────────────────

/** Input for buildManipulationDetectionResult */
export interface ManipulationDetectionInput {
  readonly resultId: string;
  readonly tokenMint: string;
  readonly signals: readonly unknown[];
  readonly patterns: readonly unknown[];
  readonly activity: unknown;
}

/**
 * Build a complete ManipulationDetectionResult from signals, patterns, and activity.
 *
 * Returns a safe result or a safe error.
 * Never throws for normal validation failures.
 * All output fields enforce Phase 11 safety invariants.
 */
export function buildManipulationDetectionResult(
  input: ManipulationDetectionInput,
): MdResult<ManipulationDetectionResult> {
  // Validate resultId
  if (typeof input.resultId !== 'string' || input.resultId.trim().length < 3) {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'resultId must be a non-empty string');
  }

  // Validate tokenMint
  if (
    typeof input.tokenMint !== 'string' ||
    input.tokenMint.trim().length < 3 ||
    /\s/.test(input.tokenMint)
  ) {
    return mdErr('INVALID_TOKEN_MINT', 'tokenMint must be a non-empty, whitespace-free string');
  }

  // Validate activity
  const activityResult = validateCoordinatedActivity(input.activity);
  if (!activityResult.ok) {
    return mdErr(activityResult.error.code, activityResult.error.message);
  }
  const activity = activityResult.value;

  // Validate signals
  if (!Array.isArray(input.signals)) {
    return mdErr('INVALID_BUNDLE_SIGNAL', 'signals must be an array');
  }
  const signals: BundleSignal[] = [];
  for (const s of input.signals) {
    const res = validateBundleSignal(s);
    if (!res.ok) return mdErr(res.error.code, res.error.message);
    signals.push(res.value);
  }

  // Validate patterns
  if (!Array.isArray(input.patterns)) {
    return mdErr('INVALID_MANIPULATION_PATTERN', 'patterns must be an array');
  }
  const patterns: ManipulationPattern[] = [];
  for (const p of input.patterns) {
    const res = validateManipulationPattern(p);
    if (!res.ok) return mdErr(res.error.code, res.error.message);
    patterns.push(res.value);
  }

  // Compute component scores
  const bundleRiskScore = scoreBundleSignals(signals, activity);
  const washTradeScore = scoreWashTradePatterns(signals, patterns, activity);
  const coordinationScore = scoreCoordination(signals, activity);
  const fundingPatternScore = scoreFundingPatterns(signals, activity);
  const creatorLinkScore = scoreCreatorLinks(signals, patterns, activity);

  const componentScores: ManipulationComponentScores = {
    bundleRiskScore,
    washTradeScore,
    coordinationScore,
    fundingPatternScore,
    creatorLinkScore,
  };

  // Final score: weighted average of component scores (higher = safer)
  const rawFinalScore =
    bundleRiskScore.score * COMPONENT_WEIGHTS.bundleRisk +
    washTradeScore.score * COMPONENT_WEIGHTS.washTrade +
    coordinationScore.score * COMPONENT_WEIGHTS.coordination +
    fundingPatternScore.score * COMPONENT_WEIGHTS.fundingPattern +
    creatorLinkScore.score * COMPONENT_WEIGHTS.creatorLink;

  const finalScore = Math.round(Math.min(100, Math.max(0, rawFinalScore)));

  // Confidence
  const confidence = computeConfidence(signals, patterns, activity);

  // Risk flags
  const riskFlags = buildManipulationRiskFlags(signals, patterns, activity);

  // Classification
  const classification = classifyManipulation({
    flags: riskFlags,
    finalScore,
    confidence,
    hasSignals: signals.length > 0 || patterns.length > 0,
  });

  const reasons: string[] = [
    `Classification: ${classification}`,
    'Fixture/local detection only — no live data used',
    ...bundleRiskScore.reasons.slice(0, 1),
    ...washTradeScore.reasons.slice(0, 1),
  ];

  const result: ManipulationDetectionResult = {
    resultId: input.resultId.trim(),
    tokenMint: input.tokenMint.trim(),
    bundleSignals: signals,
    patterns,
    coordinatedActivity: activity,
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
    enforcementAllowed: false,
    safeToDisplay: true,
  };

  return mdOk(result);
}
