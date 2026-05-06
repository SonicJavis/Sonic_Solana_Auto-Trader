/**
 * packages/strategy-intent/src/strategy-family.ts
 *
 * Phase 15 — Strategy family classification.
 *
 * Maps fixture-only replay/reporting evidence to a safe StrategyFamily label.
 * This is analysis-only — these labels are NOT trade recommendations.
 */

import type { StrategyFamily, StrategyIntentInput } from './types.js';

/**
 * Classifies a StrategyFamily from fixture-only StrategyIntentInput.
 *
 * Rules:
 * - failed verdict + manipulation-like context → manipulation_avoidance_review
 * - degraded verdict + creator-like context → creator_leaderboard_review
 * - degraded verdict + wallet-like context → wallet_cluster_review
 * - regression / verdict changed comparison → replay_regression_review
 * - clean fixture_only with no flags → defensive_new_launch_filter or fixture_only_review
 * - missing or insufficient evidence → insufficient_evidence_review
 */
export function classifyStrategyFamily(input: StrategyIntentInput): StrategyFamily {
  const verdict = input.finalVerdict ?? '';
  const scenarioId = input.scenarioId ?? '';
  const sourceId = input.sourceId ?? '';
  const regression = input.regression ?? false;
  const verdictChanged = input.verdictChanged ?? false;
  const failureCount = input.failureCount ?? 0;
  const degradedCount = input.degradedCount ?? 0;
  const inconclusiveCount = input.inconclusiveCount ?? 0;
  const riskScore = input.finalRiskScore ?? 0;

  // Regression / comparison context
  if (regression || verdictChanged || input.sourceKind === 'replay_comparison' || input.sourceKind === 'replay_comparison_report') {
    return 'replay_regression_review';
  }

  // Failed verdict — check for manipulation-like signals
  if (verdict === 'failed' || failureCount > 0) {
    if (
      scenarioId.includes('manipulation') ||
      sourceId.includes('manipulation') ||
      riskScore >= 0.85
    ) {
      return 'manipulation_avoidance_review';
    }
    // Failed but context not clearly manipulation → still reject via manipulation avoidance
    return 'manipulation_avoidance_review';
  }

  // Degraded — check context
  if (verdict === 'degraded' || degradedCount > 0) {
    if (scenarioId.includes('creator') || sourceId.includes('creator')) {
      return 'creator_leaderboard_review';
    }
    if (scenarioId.includes('wallet') || sourceId.includes('wallet')) {
      return 'wallet_cluster_review';
    }
    // Generic degraded → creator review as conservative default
    return 'creator_leaderboard_review';
  }

  // Inconclusive
  if (verdict === 'inconclusive' || inconclusiveCount > 0) {
    return 'insufficient_evidence_review';
  }

  // Missing evidence
  if (!verdict && !scenarioId && !sourceId) {
    return 'insufficient_evidence_review';
  }

  // Clean / fixture_only passed
  if (verdict === 'fixture_only' || verdict === 'passed') {
    if (scenarioId.includes('regression') || sourceId.includes('regression')) {
      return 'replay_regression_review';
    }
    return 'defensive_new_launch_filter';
  }

  // Fallback
  return 'fixture_only_review';
}
