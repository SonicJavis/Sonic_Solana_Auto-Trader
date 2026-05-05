/**
 * Phase 12 — Risk Engine v1: Core aggregation logic.
 *
 * No live data, no RPC calls, no external APIs, no private keys,
 * no trade intents, no execution, no enforcement.
 */

import type { RiskAssessmentInput } from './risk-input.js';
import type { RiskPolicy } from './risk-policy.js';
import type { RiskComponentScores, ComponentScoreEntry } from './risk-score.js';
import type { RiskFlagEntry } from './risk-flags.js';
import type { RiskDecision } from './risk-decision.js';
import type { RiskAssessmentResult, RiskEngineCapabilities } from './types.js';
import { reOk, reErr, type ReResult } from './errors.js';
import { makeRiskFlag, hasRiskCriticalFlag } from './risk-flags.js';
import { calculateRiskConfidence } from './confidence.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function makeEntry(score: number, ...reasons: string[]): ComponentScoreEntry {
  return { score: clamp(Math.round(score), 0, 100), reasons };
}

// ---------------------------------------------------------------------------
// Flag building
// ---------------------------------------------------------------------------

export function buildRiskFlags(
  input: RiskAssessmentInput,
  policy: RiskPolicy,
): readonly RiskFlagEntry[] {
  const flags: RiskFlagEntry[] = [];

  // Always present — structural invariants
  flags.push(makeRiskFlag('LIVE_DATA_UNAVAILABLE', 'info', 'Live data is unavailable — fixture-only mode'));
  flags.push(makeRiskFlag('EXECUTION_FORBIDDEN', 'info', 'Execution is forbidden in this phase'));
  flags.push(makeRiskFlag('TRADE_INTENTS_FORBIDDEN', 'info', 'Trade intents are forbidden in this phase'));

  // Missing intelligence components
  if (!input.tokenIntelligence) {
    flags.push(makeRiskFlag('MISSING_TOKEN_INTELLIGENCE', 'warn', 'Token intelligence not provided'));
  }
  if (!input.creatorIntelligence) {
    flags.push(makeRiskFlag('MISSING_CREATOR_INTELLIGENCE', 'warn', 'Creator intelligence not provided'));
  }
  if (!input.walletClusterIntelligence) {
    flags.push(makeRiskFlag('MISSING_WALLET_INTELLIGENCE', 'warn', 'Wallet cluster intelligence not provided'));
  }
  if (!input.manipulationDetection) {
    flags.push(makeRiskFlag('MISSING_MANIPULATION_DETECTION', 'warn', 'Manipulation detection not provided'));
  }

  // No components at all
  const hasAny =
    input.tokenIntelligence ||
    input.creatorIntelligence ||
    input.walletClusterIntelligence ||
    input.manipulationDetection;
  if (!hasAny) {
    flags.push(makeRiskFlag('INSUFFICIENT_RISK_DATA', 'high', 'No intelligence components provided'));
  }

  // Rejection flags
  if (input.tokenIntelligence?.hasRejection) {
    const severity = policy.blockOnTokenReject ? 'critical' : 'high';
    flags.push(makeRiskFlag('TOKEN_REJECTED', severity, 'Token intelligence has a rejection signal'));
  }
  if (input.creatorIntelligence?.hasRejection) {
    const severity = policy.blockOnCreatorReject ? 'critical' : 'high';
    flags.push(makeRiskFlag('CREATOR_REJECTED', severity, 'Creator intelligence has a rejection signal'));
  }
  if (input.walletClusterIntelligence?.hasRejection) {
    const severity = policy.blockOnWalletReject ? 'critical' : 'high';
    flags.push(makeRiskFlag('WALLET_CLUSTER_REJECTED', severity, 'Wallet cluster intelligence has a rejection signal'));
  }
  if (input.manipulationDetection?.hasRejection) {
    const severity = policy.blockOnManipulationReject ? 'critical' : 'high';
    flags.push(makeRiskFlag('MANIPULATION_REJECTED', severity, 'Manipulation detection has a rejection signal'));
  }

  // Critical flags propagation
  if (input.tokenIntelligence?.hasCriticalFlags) {
    flags.push(makeRiskFlag('TOKEN_CRITICAL_RISK', 'critical', 'Token intelligence has critical risk flags'));
  }
  if (input.creatorIntelligence?.hasCriticalFlags) {
    flags.push(makeRiskFlag('CREATOR_CRITICAL_RISK', 'critical', 'Creator intelligence has critical risk flags'));
  }
  if (input.walletClusterIntelligence?.hasCriticalFlags) {
    flags.push(makeRiskFlag('WALLET_CRITICAL_RISK', 'critical', 'Wallet cluster intelligence has critical risk flags'));
  }
  if (input.manipulationDetection?.hasCriticalFlags) {
    flags.push(makeRiskFlag('MANIPULATION_CRITICAL_RISK', 'critical', 'Manipulation detection has critical risk flags'));
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Component scoring
// ---------------------------------------------------------------------------

export function calculateRiskComponentScores(
  input: RiskAssessmentInput,
  _policy: RiskPolicy,
): RiskComponentScores {
  // Token score
  let tokenScore: ComponentScoreEntry;
  if (!input.tokenIntelligence) {
    tokenScore = makeEntry(0, 'Missing token intelligence');
  } else if (input.tokenIntelligence.hasRejection) {
    tokenScore = makeEntry(
      Math.min(30, input.tokenIntelligence.finalScore),
      'Token has rejection signal — score capped at 30',
    );
  } else if (input.tokenIntelligence.hasCriticalFlags) {
    tokenScore = makeEntry(
      Math.min(50, input.tokenIntelligence.finalScore),
      'Token has critical flags — score capped at 50',
    );
  } else {
    tokenScore = makeEntry(input.tokenIntelligence.finalScore, 'Token score from intelligence');
  }

  // Creator score
  let creatorScore: ComponentScoreEntry;
  if (!input.creatorIntelligence) {
    creatorScore = makeEntry(0, 'Missing creator intelligence');
  } else if (input.creatorIntelligence.hasRejection) {
    creatorScore = makeEntry(
      Math.min(30, input.creatorIntelligence.finalScore),
      'Creator has rejection signal — score capped at 30',
    );
  } else if (input.creatorIntelligence.hasCriticalFlags) {
    creatorScore = makeEntry(
      Math.min(50, input.creatorIntelligence.finalScore),
      'Creator has critical flags — score capped at 50',
    );
  } else {
    creatorScore = makeEntry(input.creatorIntelligence.finalScore, 'Creator score from intelligence');
  }

  // Wallet cluster score
  let walletClusterScore: ComponentScoreEntry;
  if (!input.walletClusterIntelligence) {
    walletClusterScore = makeEntry(0, 'Missing wallet cluster intelligence');
  } else if (input.walletClusterIntelligence.hasRejection) {
    walletClusterScore = makeEntry(
      Math.min(30, input.walletClusterIntelligence.finalScore),
      'Wallet cluster has rejection signal — score capped at 30',
    );
  } else if (input.walletClusterIntelligence.hasCriticalFlags) {
    walletClusterScore = makeEntry(
      Math.min(50, input.walletClusterIntelligence.finalScore),
      'Wallet cluster has critical flags — score capped at 50',
    );
  } else {
    walletClusterScore = makeEntry(
      input.walletClusterIntelligence.finalScore,
      'Wallet cluster score from intelligence',
    );
  }

  // Manipulation score
  let manipulationScore: ComponentScoreEntry;
  if (!input.manipulationDetection) {
    manipulationScore = makeEntry(0, 'Missing manipulation detection');
  } else if (input.manipulationDetection.hasRejection) {
    manipulationScore = makeEntry(
      Math.min(30, input.manipulationDetection.finalScore),
      'Manipulation detection has rejection signal — score capped at 30',
    );
  } else if (input.manipulationDetection.hasCriticalFlags) {
    manipulationScore = makeEntry(
      Math.min(50, input.manipulationDetection.finalScore),
      'Manipulation detection has critical flags — score capped at 50',
    );
  } else {
    manipulationScore = makeEntry(
      input.manipulationDetection.finalScore,
      'Manipulation score from detection',
    );
  }

  // Missing data penalty
  let missingCount = 0;
  if (!input.tokenIntelligence) missingCount++;
  if (!input.creatorIntelligence) missingCount++;
  if (!input.walletClusterIntelligence) missingCount++;
  if (!input.manipulationDetection) missingCount++;
  const penaltyValue = missingCount * 15;
  const missingDataPenalty = makeEntry(
    penaltyValue,
    missingCount > 0
      ? `${missingCount} component(s) missing — penalty ${penaltyValue}`
      : 'No missing components',
  );

  // Critical flag penalty
  const criticalCount = [
    input.tokenIntelligence?.hasCriticalFlags,
    input.creatorIntelligence?.hasCriticalFlags,
    input.walletClusterIntelligence?.hasCriticalFlags,
    input.manipulationDetection?.hasCriticalFlags,
  ].filter(Boolean).length;
  const criticalPenaltyValue = criticalCount * 20;
  const criticalFlagPenalty = makeEntry(
    criticalPenaltyValue,
    criticalCount > 0
      ? `${criticalCount} component(s) with critical flags — penalty ${criticalPenaltyValue}`
      : 'No critical flag penalties',
  );

  // Confidence-adjusted composite
  const presentScores: number[] = [];
  if (input.tokenIntelligence) presentScores.push(tokenScore.score);
  if (input.creatorIntelligence) presentScores.push(creatorScore.score);
  if (input.walletClusterIntelligence) presentScores.push(walletClusterScore.score);
  if (input.manipulationDetection) presentScores.push(manipulationScore.score);

  const rawAvg = presentScores.length > 0
    ? presentScores.reduce((a, b) => a + b, 0) / presentScores.length
    : 0;
  const adjustedScore = Math.max(0, rawAvg - penaltyValue * 0.5 - criticalPenaltyValue * 0.5);
  const confidenceAdjustedScore = makeEntry(
    adjustedScore,
    `Composite from ${presentScores.length} component(s), penalty-adjusted`,
  );

  return {
    tokenScore,
    creatorScore,
    walletClusterScore,
    manipulationScore,
    confidenceAdjustedScore,
    missingDataPenalty,
    criticalFlagPenalty,
  };
}

// ---------------------------------------------------------------------------
// Decision classification
// ---------------------------------------------------------------------------

export function classifyRisk(
  input: RiskAssessmentInput,
  policy: RiskPolicy,
  flags: readonly RiskFlagEntry[],
  scores: RiskComponentScores,
  confidence: number,
): { decision: RiskDecision; blockingReasons: readonly string[]; warnings: readonly string[] } {
  const blockingReasons: string[] = [];
  const warnings: string[] = [];

  // Critical flag blocks
  if (policy.blockOnCriticalFlags && hasRiskCriticalFlag(flags)) {
    blockingReasons.push('Critical risk flags present — blocked by policy');
  }

  // Component rejection blocks
  if (policy.blockOnTokenReject && input.tokenIntelligence?.hasRejection) {
    blockingReasons.push('Token intelligence has rejection — blocked by policy');
  }
  if (policy.blockOnCreatorReject && input.creatorIntelligence?.hasRejection) {
    blockingReasons.push('Creator intelligence has rejection — blocked by policy');
  }
  if (policy.blockOnWalletReject && input.walletClusterIntelligence?.hasRejection) {
    blockingReasons.push('Wallet cluster intelligence has rejection — blocked by policy');
  }
  if (policy.blockOnManipulationReject && input.manipulationDetection?.hasRejection) {
    blockingReasons.push('Manipulation detection has rejection — blocked by policy');
  }

  if (blockingReasons.length > 0) {
    return { decision: 'block', blockingReasons, warnings };
  }

  // Insufficient data
  const hasAny =
    input.tokenIntelligence ||
    input.creatorIntelligence ||
    input.walletClusterIntelligence ||
    input.manipulationDetection;
  if (!hasAny) {
    return {
      decision: 'insufficient_data',
      blockingReasons: [],
      warnings: ['No intelligence components provided — cannot assess risk'],
    };
  }

  if (policy.requireAllInputs && scores.missingDataPenalty.score > 0) {
    return {
      decision: 'insufficient_data',
      blockingReasons: [],
      warnings: ['Policy requires all inputs — some are missing'],
    };
  }

  // Confidence checks
  if (confidence < 0.1) {
    warnings.push('Extremely low confidence — insufficient data for reliable assessment');
    return { decision: 'insufficient_data', blockingReasons: [], warnings };
  }
  if (confidence < policy.minConfidence) {
    warnings.push(`Confidence ${confidence.toFixed(2)} below minimum ${policy.minConfidence}`);
    return { decision: 'watch_only', blockingReasons: [], warnings };
  }

  const finalScore = scores.confidenceAdjustedScore.score;

  // Score-based decisions
  if (finalScore < policy.rejectBelowScore) {
    return {
      decision: 'reject',
      blockingReasons: [],
      warnings: [`Final score ${finalScore} below reject threshold ${policy.rejectBelowScore}`],
    };
  }
  if (finalScore < policy.watchBelowScore) {
    warnings.push(`Final score ${finalScore} below watch threshold ${policy.watchBelowScore}`);
    return { decision: 'watch_only', blockingReasons: [], warnings };
  }

  return { decision: 'analysis_only', blockingReasons: [], warnings };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function buildRiskAssessmentResult(
  input: RiskAssessmentInput,
  policy: RiskPolicy,
): ReResult<RiskAssessmentResult> {
  if (input.liveData !== false) {
    return reErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  }
  if (policy.liveData !== false) {
    return reErr('LIVE_DATA_FORBIDDEN', 'policy.liveData must be false');
  }
  if (policy.fixtureOnly !== true) {
    return reErr('RISK_ENGINE_FIXTURE_ONLY', 'policy.fixtureOnly must be true');
  }

  const flags = buildRiskFlags(input, policy);
  const scores = calculateRiskComponentScores(input, policy);
  const confidence = calculateRiskConfidence(input, policy);
  const { decision, blockingReasons, warnings } = classifyRisk(
    input,
    policy,
    flags,
    scores,
    confidence,
  );

  const finalRiskScore = clamp(Math.round(scores.confidenceAdjustedScore.score), 0, 100);

  const componentCount = [
    input.tokenIntelligence,
    input.creatorIntelligence,
    input.walletClusterIntelligence,
    input.manipulationDetection,
  ].filter(Boolean).length;

  const inputSummary =
    `requestId=${input.requestId} source=${input.source} components=${componentCount}/4 fixtureOnly=true liveData=false`;

  const result: RiskAssessmentResult = {
    resultId: `RE_${input.requestId}`,
    inputSummary,
    policy,
    componentScores: scores,
    finalRiskScore,
    confidence,
    decision,
    blockingReasons,
    warnings,
    riskFlags: flags,
    generatedAt: input.requestedAt,
    fixtureOnly: true,
    liveData: false,
    actionAllowed: false,
    tradingAllowed: false,
    executionAllowed: false,
    enforcementAllowed: false,
    tradeIntentAllowed: false,
    safeToDisplay: true,
  };

  return reOk(result);
}

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------

export function getRiskEngineCapabilities(): RiskEngineCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCreateExecutionPlans: false,
    canCreateEnforcementActions: false,
    canTrade: false,
    canExecute: false,
    fixtureOnly: true,
    safeToDisplay: true,
  };
}
