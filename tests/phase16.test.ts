/**
 * Phase 16 — Strategy Evaluation Reports v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable true
 *   C. buildStrategyScoreBandSummary
 *   D. buildStrategyEvidenceDistribution
 *   E. buildStrategySafetyGateSummary
 *   F. compareStrategyFamilies
 *   G. buildStrategyEvaluation
 *   H. validateStrategyEvaluation
 *   I. JSON export — deterministic
 *   J. Markdown export — deterministic + safety footer
 *   K. Safety invariants — liveData/fixtureOnly/safeToDisplay/analysisOnly/nonExecutable rejection
 *   L. Validation rejects unsafe action text, private-key strings, seed-phrase strings, API keys, RPC URLs
 *   M. No evaluation creates real trade intents/execution plans/paper trades
 *   N. Fixtures — fixture-only, safeToDisplay, analysisOnly, nonExecutable
 *   O. Dependency checks — no @solana/web3.js etc in package.json
 *   P. Phase 13/14/15 regression — imports still work
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getStrategyEvaluationCapabilities,
  // Errors
  seOk,
  seErr,
  // Builders
  buildStrategyScoreBandSummary,
  buildStrategyEvidenceDistribution,
  buildStrategySafetyGateSummary,
  compareStrategyFamilies,
  buildStrategyEvaluation,
  // Exports
  exportStrategyEvaluationJson,
  exportStrategyEvaluationMarkdown,
  // Validation
  validateStrategyEvaluation,
  validateStrategyEvaluationCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  // Fixtures
  CLEAN_STRATEGY_EVALUATION_FIXTURE,
  DEGRADED_STRATEGY_EVALUATION_FIXTURE,
  FAILED_STRATEGY_EVALUATION_FIXTURE,
  INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE,
  MIXED_STRATEGY_EVALUATION_FIXTURE,
  REGRESSION_STRATEGY_EVALUATION_FIXTURE,
  ALL_STRATEGY_EVALUATION_FIXTURES,
} from '@sonic/strategy-evaluation';

import type {
  StrategyEvaluationInput,
  StrategyEvaluation,
} from '@sonic/strategy-evaluation';

// Phase 15 imports for regression
import {
  CLEAN_STRATEGY_INTENT_FIXTURE,
  FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE,
  INCONCLUSIVE_STRATEGY_INTENT_FIXTURE,
  DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE,
  DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE,
  REGRESSION_STRATEGY_INTENT_FIXTURE,
  ALL_STRATEGY_INTENT_FIXTURES,
  getStrategyIntentCapabilities,
} from '@sonic/strategy-intent';

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('exports getStrategyEvaluationCapabilities function', () => {
    expect(typeof getStrategyEvaluationCapabilities).toBe('function');
  });

  it('exports seOk and seErr helpers', () => {
    expect(typeof seOk).toBe('function');
    expect(typeof seErr).toBe('function');
  });

  it('exports buildStrategyScoreBandSummary function', () => {
    expect(typeof buildStrategyScoreBandSummary).toBe('function');
  });

  it('exports buildStrategyEvidenceDistribution function', () => {
    expect(typeof buildStrategyEvidenceDistribution).toBe('function');
  });

  it('exports buildStrategySafetyGateSummary function', () => {
    expect(typeof buildStrategySafetyGateSummary).toBe('function');
  });

  it('exports compareStrategyFamilies function', () => {
    expect(typeof compareStrategyFamilies).toBe('function');
  });

  it('exports buildStrategyEvaluation function', () => {
    expect(typeof buildStrategyEvaluation).toBe('function');
  });

  it('exports exportStrategyEvaluationJson function', () => {
    expect(typeof exportStrategyEvaluationJson).toBe('function');
  });

  it('exports exportStrategyEvaluationMarkdown function', () => {
    expect(typeof exportStrategyEvaluationMarkdown).toBe('function');
  });

  it('exports validateStrategyEvaluation function', () => {
    expect(typeof validateStrategyEvaluation).toBe('function');
  });

  it('exports validateStrategyEvaluationCapabilities function', () => {
    expect(typeof validateStrategyEvaluationCapabilities).toBe('function');
  });

  it('exports containsUnsafeActionText function', () => {
    expect(typeof containsUnsafeActionText).toBe('function');
  });

  it('exports containsSecretPattern function', () => {
    expect(typeof containsSecretPattern).toBe('function');
  });

  it('exports containsUrlPattern function', () => {
    expect(typeof containsUrlPattern).toBe('function');
  });

  it('exports isDisplaySafe function', () => {
    expect(typeof isDisplaySafe).toBe('function');
  });

  it('exports CLEAN_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(CLEAN_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports DEGRADED_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(DEGRADED_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports FAILED_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(FAILED_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports MIXED_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(MIXED_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports REGRESSION_STRATEGY_EVALUATION_FIXTURE', () => {
    expect(REGRESSION_STRATEGY_EVALUATION_FIXTURE).toBeDefined();
  });

  it('exports ALL_STRATEGY_EVALUATION_FIXTURES array', () => {
    expect(Array.isArray(ALL_STRATEGY_EVALUATION_FIXTURES)).toBe(true);
    expect(ALL_STRATEGY_EVALUATION_FIXTURES.length).toBe(6);
  });
});

// ─── B. Capabilities ──────────────────────────────────────────────────────────

describe('B. Capabilities', () => {
  const caps = getStrategyEvaluationCapabilities();

  it('canUseLiveData is false', () => { expect(caps.canUseLiveData).toBe(false); });
  it('canUseSolanaRpc is false', () => { expect(caps.canUseSolanaRpc).toBe(false); });
  it('canUseProviderApis is false', () => { expect(caps.canUseProviderApis).toBe(false); });
  it('canAccessPrivateKeys is false', () => { expect(caps.canAccessPrivateKeys).toBe(false); });
  it('canCreateTradeIntents is false', () => { expect(caps.canCreateTradeIntents).toBe(false); });
  it('canCreateExecutionPlans is false', () => { expect(caps.canCreateExecutionPlans).toBe(false); });
  it('canPaperTrade is false', () => { expect(caps.canPaperTrade).toBe(false); });
  it('canTrade is false', () => { expect(caps.canTrade).toBe(false); });
  it('canExecute is false', () => { expect(caps.canExecute).toBe(false); });
  it('canWriteToDatabase is false', () => { expect(caps.canWriteToDatabase).toBe(false); });
  it('canSendTelegramAlerts is false', () => { expect(caps.canSendTelegramAlerts).toBe(false); });
  it('canConstructTransactions is false', () => { expect(caps.canConstructTransactions).toBe(false); });
  it('canSimulateTransactions is false', () => { expect(caps.canSimulateTransactions).toBe(false); });
  it('canCreateOrders is false', () => { expect(caps.canCreateOrders).toBe(false); });
  it('canCreatePositions is false', () => { expect(caps.canCreatePositions).toBe(false); });
  it('canCalculateLivePnl is false', () => { expect(caps.canCalculateLivePnl).toBe(false); });
  it('fixtureOnly is true', () => { expect(caps.fixtureOnly).toBe(true); });
  it('analysisOnly is true', () => { expect(caps.analysisOnly).toBe(true); });
  it('nonExecutable is true', () => { expect(caps.nonExecutable).toBe(true); });

  it('capabilities validation passes', () => {
    const result = validateStrategyEvaluationCapabilities(caps);
    expect(result.ok).toBe(true);
  });
});

// ─── C. buildStrategyScoreBandSummary ─────────────────────────────────────────

describe('C. buildStrategyScoreBandSummary', () => {
  it('returns correct total for clean intent', () => {
    const summary = buildStrategyScoreBandSummary([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.total).toBe(1);
    expect(summary.strong).toBe(1);
    expect(summary.failed).toBe(0);
    expect(summary.inconclusive).toBe(0);
  });

  it('returns correct total for failed intent', () => {
    const summary = buildStrategyScoreBandSummary([FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.total).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.strong).toBe(0);
  });

  it('returns correct total for inconclusive intent', () => {
    const summary = buildStrategyScoreBandSummary([INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.total).toBe(1);
    expect(summary.inconclusive).toBe(1);
  });

  it('returns correct total for degraded intent', () => {
    const summary = buildStrategyScoreBandSummary([DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.total).toBe(1);
    expect(summary.degraded).toBe(1);
  });

  it('handles multiple intents', () => {
    const intents = [
      CLEAN_STRATEGY_INTENT_FIXTURE.intent,
      DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
      FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
    ];
    const summary = buildStrategyScoreBandSummary(intents);
    expect(summary.total).toBe(3);
    expect(summary.strong).toBe(1);
    expect(summary.degraded).toBe(1);
    expect(summary.failed).toBe(1);
  });

  it('handles empty intents', () => {
    const summary = buildStrategyScoreBandSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.summaryText).toContain('empty');
  });

  it('summaryText is non-empty for non-empty intents', () => {
    const summary = buildStrategyScoreBandSummary([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.summaryText.length).toBeGreaterThan(0);
    expect(summary.summaryText).toContain('fixture-only review');
  });

  it('excellent band for very high confidence strong evidence', () => {
    // Create a mock intent with confidence > 0.9 and strong evidence
    const highConfidenceIntent = {
      ...CLEAN_STRATEGY_INTENT_FIXTURE.intent,
      evidenceQuality: 'strong_fixture_evidence' as const,
      confidence: 0.95,
    };
    const summary = buildStrategyScoreBandSummary([highConfidenceIntent]);
    expect(summary.excellent).toBe(1);
    expect(summary.strong).toBe(0);
  });
});

// ─── D. buildStrategyEvidenceDistribution ────────────────────────────────────

describe('D. buildStrategyEvidenceDistribution', () => {
  it('counts strong evidence correctly', () => {
    const dist = buildStrategyEvidenceDistribution([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(dist.total).toBe(1);
    expect(dist.strongCount).toBe(1);
    expect(dist.failedCount).toBe(0);
  });

  it('counts failed evidence correctly', () => {
    const dist = buildStrategyEvidenceDistribution([FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent]);
    expect(dist.total).toBe(1);
    expect(dist.failedCount).toBe(1);
    expect(dist.strongCount).toBe(0);
  });

  it('counts classification correctly', () => {
    const dist = buildStrategyEvidenceDistribution([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(dist.classificationCounts['analysis_only']).toBe(1);
  });

  it('counts family correctly', () => {
    const dist = buildStrategyEvidenceDistribution([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(dist.familyCounts['defensive_new_launch_filter']).toBe(1);
  });

  it('handles multiple intents', () => {
    const intents = [
      CLEAN_STRATEGY_INTENT_FIXTURE.intent,
      DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
      FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
      INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent,
    ];
    const dist = buildStrategyEvidenceDistribution(intents);
    expect(dist.total).toBe(4);
    expect(dist.strongCount).toBe(1);
    expect(dist.degradedCount).toBe(1);
    expect(dist.failedCount).toBe(1);
    expect(dist.inconclusiveCount).toBe(1);
  });

  it('handles empty intents', () => {
    const dist = buildStrategyEvidenceDistribution([]);
    expect(dist.total).toBe(0);
    expect(dist.summaryText).toContain('empty');
  });

  it('summaryText is non-empty for non-empty intents', () => {
    const dist = buildStrategyEvidenceDistribution([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(dist.summaryText.length).toBeGreaterThan(0);
    expect(dist.summaryText).toContain('fixture-only review');
  });
});

// ─── E. buildStrategySafetyGateSummary ───────────────────────────────────────

describe('E. buildStrategySafetyGateSummary', () => {
  it('counts passed gates for clean intent', () => {
    const summary = buildStrategySafetyGateSummary([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.passed).toBeGreaterThan(0);
    expect(summary.total).toBeGreaterThan(0);
  });

  it('counts blocked gates for failed intent', () => {
    const summary = buildStrategySafetyGateSummary([FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.blocked).toBeGreaterThan(0);
  });

  it('counts warning gates for degraded intent', () => {
    const summary = buildStrategySafetyGateSummary([DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.warning).toBeGreaterThan(0);
  });

  it('handles empty intents', () => {
    const summary = buildStrategySafetyGateSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.summaryText).toContain('empty');
  });

  it('mostCommonBlockedGateIds is an array', () => {
    const summary = buildStrategySafetyGateSummary([FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent]);
    expect(Array.isArray(summary.mostCommonBlockedGateIds)).toBe(true);
  });

  it('mostCommonBlockedGateIds contains evidence_quality_gate for failed intent', () => {
    const summary = buildStrategySafetyGateSummary([FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.mostCommonBlockedGateIds).toContain('evidence_quality_gate');
  });

  it('summaryText includes fixture-only review', () => {
    const summary = buildStrategySafetyGateSummary([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(summary.summaryText).toContain('fixture-only review');
  });
});

// ─── F. compareStrategyFamilies ───────────────────────────────────────────────

describe('F. compareStrategyFamilies', () => {
  it('returns one entry for single-family intents', () => {
    const comparisons = compareStrategyFamilies([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(comparisons.length).toBe(1);
    expect(comparisons[0]?.familyName).toBe('defensive_new_launch_filter');
  });

  it('returns multiple entries for multi-family intents', () => {
    const intents = [
      CLEAN_STRATEGY_INTENT_FIXTURE.intent,
      DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
      FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
    ];
    const comparisons = compareStrategyFamilies(intents);
    expect(comparisons.length).toBe(3);
  });

  it('counts intent per family correctly', () => {
    const intents = [
      DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
      DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE.intent,
    ];
    const comparisons = compareStrategyFamilies(intents);
    const creatorComparison = comparisons.find(c => c.familyName === 'creator_leaderboard_review');
    const walletComparison = comparisons.find(c => c.familyName === 'wallet_cluster_review');
    expect(creatorComparison?.intentCount).toBe(1);
    expect(walletComparison?.intentCount).toBe(1);
  });

  it('computes averageConfidence correctly', () => {
    const comparison = compareStrategyFamilies([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(comparison[0]?.averageConfidence).toBeGreaterThanOrEqual(0);
    expect(comparison[0]?.averageConfidence).toBeLessThanOrEqual(1);
  });

  it('returns empty array for empty intents', () => {
    const comparisons = compareStrategyFamilies([]);
    expect(comparisons.length).toBe(0);
  });

  it('results are sorted by family name for determinism', () => {
    const intents = [
      FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
      CLEAN_STRATEGY_INTENT_FIXTURE.intent,
    ];
    const comparisons = compareStrategyFamilies(intents);
    const names = comparisons.map(c => c.familyName);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('summaryText includes fixture-only review', () => {
    const comparisons = compareStrategyFamilies([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(comparisons[0]?.summaryText).toContain('fixture-only review');
  });

  it('evidenceQualityCounts is a record', () => {
    const comparisons = compareStrategyFamilies([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(typeof comparisons[0]?.evidenceQualityCounts).toBe('object');
  });

  it('gateStatusCounts is a record', () => {
    const comparisons = compareStrategyFamilies([CLEAN_STRATEGY_INTENT_FIXTURE.intent]);
    expect(typeof comparisons[0]?.gateStatusCounts).toBe('object');
  });
});

// ─── G. buildStrategyEvaluation ──────────────────────────────────────────────

describe('G. buildStrategyEvaluation', () => {
  const validInput: StrategyEvaluationInput = {
    intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
    fixtureOnly: true,
    liveData: false,
  };

  it('builds a valid evaluation from clean intent', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
      expect(result.value.analysisOnly).toBe(true);
      expect(result.value.nonExecutable).toBe(true);
    }
  });

  it('evaluation has an id', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id.length).toBeGreaterThan(0);
    }
  });

  it('evaluation has correct intentCount', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.intentCount).toBe(1);
    }
  });

  it('evaluation has scoreBandSummary', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scoreBandSummary).toBeDefined();
      expect(result.value.scoreBandSummary.total).toBe(1);
    }
  });

  it('evaluation has evidenceDistribution', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.evidenceDistribution).toBeDefined();
      expect(result.value.evidenceDistribution.total).toBe(1);
    }
  });

  it('evaluation has safetyGateSummary', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.safetyGateSummary).toBeDefined();
    }
  });

  it('evaluation has familyComparisons', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.value.familyComparisons)).toBe(true);
    }
  });

  it('evaluation has findings', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.value.findings)).toBe(true);
      expect(result.value.findings.length).toBeGreaterThan(0);
    }
  });

  it('evaluation findings include ANALYSIS_ONLY', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const hasAnalysisOnlyFinding = result.value.findings.some(f => f.code === 'ANALYSIS_ONLY');
      expect(hasAnalysisOnlyFinding).toBe(true);
    }
  });

  it('evaluation findings include NOT_A_REAL_EVALUATION', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const hasNotReal = result.value.findings.some(f => f.code === 'NOT_A_REAL_EVALUATION');
      expect(hasNotReal).toBe(true);
    }
  });

  it('reject_heavy classification for failed intents', () => {
    const result = buildStrategyEvaluation({
      intents: [FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('reject_heavy');
    }
  });

  it('analysis_only_heavy classification for clean intents', () => {
    const result = buildStrategyEvaluation(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.classification).toBe('analysis_only_heavy');
    }
  });

  it('returns error for empty intents', () => {
    const result = buildStrategyEvaluation({
      intents: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('EMPTY_INTENTS');
    }
  });

  it('builds with multiple intents', () => {
    const result = buildStrategyEvaluation({
      intents: [
        CLEAN_STRATEGY_INTENT_FIXTURE.intent,
        DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
        FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
      ],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.intentCount).toBe(3);
    }
  });
});

// ─── H. validateStrategyEvaluation ───────────────────────────────────────────

describe('H. validateStrategyEvaluation', () => {
  it('passes for clean evaluation', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const validation = validateStrategyEvaluation(result.value);
      expect(validation.ok).toBe(true);
    }
  });

  it('rejects evaluation with fixtureOnly false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval = { ...result.value, fixtureOnly: false as unknown as true };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
    }
  });

  it('rejects evaluation with liveData true', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval = { ...result.value, liveData: true as unknown as false };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
    }
  });

  it('rejects evaluation with safeToDisplay false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval = { ...result.value, safeToDisplay: false as unknown as true };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
    }
  });

  it('rejects evaluation with analysisOnly false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval = { ...result.value, analysisOnly: false as unknown as true };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
    }
  });

  it('rejects evaluation with nonExecutable false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval = { ...result.value, nonExecutable: false as unknown as true };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
    }
  });

  it('passes for all fixtures', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      const validation = validateStrategyEvaluation(fixture.evaluation);
      expect(validation.ok).toBe(true);
    }
  });
});

// ─── I. JSON export ───────────────────────────────────────────────────────────

describe('I. JSON export', () => {
  it('exportStrategyEvaluationJson returns an object', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported = exportStrategyEvaluationJson(result.value);
      expect(typeof exported).toBe('object');
    }
  });

  it('JSON export has exportKind field', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported = exportStrategyEvaluationJson(result.value);
      expect(exported.exportKind).toBe('strategy_evaluation_export');
    }
  });

  it('JSON export has fixtureOnly true', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported = exportStrategyEvaluationJson(result.value);
      expect(exported.fixtureOnly).toBe(true);
    }
  });

  it('JSON export has liveData false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported = exportStrategyEvaluationJson(result.value);
      expect(exported.liveData).toBe(false);
    }
  });

  it('JSON export is deterministic (calling twice gives same result)', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported1 = exportStrategyEvaluationJson(result.value);
      const exported2 = exportStrategyEvaluationJson(result.value);
      expect(JSON.stringify(exported1)).toBe(JSON.stringify(exported2));
    }
  });

  it('JSON export is JSON-serializable (no undefined, no functions)', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const exported = exportStrategyEvaluationJson(result.value);
      expect(() => JSON.stringify(exported)).not.toThrow();
    }
  });

  it('fixture JSON export is deterministic', () => {
    const exp1 = exportStrategyEvaluationJson(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    const exp2 = exportStrategyEvaluationJson(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(JSON.stringify(exp1)).toBe(JSON.stringify(exp2));
  });
});

// ─── J. Markdown export ───────────────────────────────────────────────────────

describe('J. Markdown export', () => {
  it('exportStrategyEvaluationMarkdown returns a string', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md = exportStrategyEvaluationMarkdown(result.value);
      expect(typeof md).toBe('string');
    }
  });

  it('Markdown has safety footer', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md = exportStrategyEvaluationMarkdown(result.value);
      expect(md).toContain('SAFETY NOTICE');
      expect(md).toContain('fixture-only');
      expect(md).toContain('analysis-only');
      expect(md).toContain('non-executable');
    }
  });

  it('Markdown does not recommend or enable trading', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md = exportStrategyEvaluationMarkdown(result.value);
      expect(md).toContain('does not recommend or enable trading');
    }
  });

  it('Markdown does not contain secrets or private key patterns', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md = exportStrategyEvaluationMarkdown(result.value);
      expect(containsSecretPattern(md)).toBe(false);
    }
  });

  it('Markdown does not contain unsafe RPC URLs', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md = exportStrategyEvaluationMarkdown(result.value);
      expect(containsUrlPattern(md)).toBe(false);
    }
  });

  it('Markdown export is deterministic (calling twice gives same result)', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const md1 = exportStrategyEvaluationMarkdown(result.value);
      const md2 = exportStrategyEvaluationMarkdown(result.value);
      expect(md1).toBe(md2);
    }
  });

  it('fixture Markdown export is deterministic', () => {
    const md1 = exportStrategyEvaluationMarkdown(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    const md2 = exportStrategyEvaluationMarkdown(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(md1).toBe(md2);
  });

  it('Markdown contains # Strategy Evaluation Report header', () => {
    const md = exportStrategyEvaluationMarkdown(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(md).toContain('# Strategy Evaluation Report');
  });
});

// ─── K. Safety invariants ─────────────────────────────────────────────────────

describe('K. Safety invariants', () => {
  it('rejects input with liveData true', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: true as unknown as false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
    }
  });

  it('rejects input with fixtureOnly false', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: false as unknown as true,
      liveData: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
    }
  });

  it('seErr creates typed error correctly', () => {
    const err = seErr('LIVE_DATA_FORBIDDEN', 'test error');
    expect(err.ok).toBe(false);
    expect(err.code).toBe('LIVE_DATA_FORBIDDEN');
    expect(err.message).toBe('test error');
  });

  it('seOk wraps value correctly', () => {
    const ok = seOk({ test: 'value' });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.value).toEqual({ test: 'value' });
    }
  });
});

// ─── L. Validation rejects unsafe content ─────────────────────────────────────

describe('L. Validation rejects unsafe content', () => {
  it('containsUnsafeActionText detects buy', () => {
    expect(containsUnsafeActionText('you should buy this token')).toBe(true);
  });

  it('containsUnsafeActionText detects sell', () => {
    expect(containsUnsafeActionText('ready to sell now')).toBe(true);
  });

  it('containsUnsafeActionText detects execute', () => {
    expect(containsUnsafeActionText('execute the trade')).toBe(true);
  });

  it('containsUnsafeActionText detects snipe', () => {
    expect(containsUnsafeActionText('snipe this token')).toBe(true);
  });

  it('containsUnsafeActionText is false for safe text', () => {
    expect(containsUnsafeActionText('this is fixture-only analysis')).toBe(false);
  });

  it('containsSecretPattern detects private_key', () => {
    expect(containsSecretPattern('private_key: abc123')).toBe(true);
  });

  it('containsSecretPattern detects seed phrase', () => {
    expect(containsSecretPattern('seed phrase is secret')).toBe(true);
  });

  it('containsSecretPattern detects mnemonic', () => {
    expect(containsSecretPattern('mnemonic: word1 word2 word3')).toBe(true);
  });

  it('containsSecretPattern detects api_key', () => {
    expect(containsSecretPattern('api_key=12345')).toBe(true);
  });

  it('containsSecretPattern is false for safe text', () => {
    expect(containsSecretPattern('this is safe text')).toBe(false);
  });

  it('containsUrlPattern detects wss://', () => {
    expect(containsUrlPattern('wss://mainnet.solana.com')).toBe(true);
  });

  it('containsUrlPattern detects helius.dev', () => {
    expect(containsUrlPattern('https://api.helius.dev/v0')).toBe(true);
  });

  it('containsUrlPattern detects mainnet-beta.solana.com', () => {
    expect(containsUrlPattern('mainnet-beta.solana.com')).toBe(true);
  });

  it('containsUrlPattern is false for safe text', () => {
    expect(containsUrlPattern('this is fixture-only analysis')).toBe(false);
  });

  it('isDisplaySafe is true for safe text', () => {
    expect(isDisplaySafe('This is fixture-only analysis review.')).toBe(true);
  });

  it('isDisplaySafe is false for text with buy', () => {
    expect(isDisplaySafe('buy this token')).toBe(false);
  });

  it('isDisplaySafe is false for text with private_key', () => {
    expect(isDisplaySafe('private_key=abc')).toBe(false);
  });

  it('isDisplaySafe is false for text with wss://', () => {
    expect(isDisplaySafe('wss://rpc.example.com')).toBe(false);
  });

  it('validation rejects finding with unsafe action text', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const badEval: StrategyEvaluation = {
        ...result.value,
        findings: [
          ...result.value.findings,
          { severity: 'info', code: 'BAD', message: 'you should buy this', safeToDisplay: true },
        ],
      };
      const validation = validateStrategyEvaluation(badEval);
      expect(validation.ok).toBe(false);
      if (!validation.ok) {
        expect(validation.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
      }
    }
  });
});

// ─── M. No real trade intents / execution plans ───────────────────────────────

describe('M. No real trade intents or execution plans', () => {
  it('StrategyEvaluation has no tradeIntent field', () => {
    const result = buildStrategyEvaluation({
      intents: [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.value as unknown as Record<string, unknown>)['tradeIntent']).toBeUndefined();
      expect((result.value as unknown as Record<string, unknown>)['executionPlan']).toBeUndefined();
      expect((result.value as unknown as Record<string, unknown>)['paperTrade']).toBeUndefined();
    }
  });

  it('capabilities do not allow trade intent creation', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canCreateTradeIntents).toBe(false);
  });

  it('capabilities do not allow execution plan creation', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canCreateExecutionPlans).toBe(false);
  });

  it('capabilities do not allow paper trading', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canPaperTrade).toBe(false);
  });

  it('capabilities do not allow live data', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canUseLiveData).toBe(false);
  });

  it('capabilities do not allow Solana RPC', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canUseSolanaRpc).toBe(false);
  });

  it('capabilities do not allow wallet or private key access', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('capabilities do not allow order creation', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canCreateOrders).toBe(false);
  });

  it('capabilities do not allow position creation', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canCreatePositions).toBe(false);
  });

  it('capabilities do not allow live PnL calculation', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canCalculateLivePnl).toBe(false);
  });
});

// ─── N. Fixtures ──────────────────────────────────────────────────────────────

describe('N. Fixtures', () => {
  it('all fixtures have fixtureOnly true', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.fixtureOnly).toBe(true);
      expect(fixture.evaluation.fixtureOnly).toBe(true);
    }
  });

  it('all fixtures have liveData false', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.liveData).toBe(false);
      expect(fixture.evaluation.liveData).toBe(false);
    }
  });

  it('all fixtures have safeToDisplay true', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.safeToDisplay).toBe(true);
      expect(fixture.evaluation.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures have analysisOnly true', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.evaluation.analysisOnly).toBe(true);
    }
  });

  it('all fixtures have nonExecutable true', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.evaluation.nonExecutable).toBe(true);
    }
  });

  it('CLEAN fixture passes validation', () => {
    const v = validateStrategyEvaluation(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('DEGRADED fixture passes validation', () => {
    const v = validateStrategyEvaluation(DEGRADED_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('FAILED fixture passes validation', () => {
    const v = validateStrategyEvaluation(FAILED_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('INCONCLUSIVE fixture passes validation', () => {
    const v = validateStrategyEvaluation(INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('MIXED fixture passes validation', () => {
    const v = validateStrategyEvaluation(MIXED_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('REGRESSION fixture passes validation', () => {
    const v = validateStrategyEvaluation(REGRESSION_STRATEGY_EVALUATION_FIXTURE.evaluation);
    expect(v.ok).toBe(true);
  });

  it('all fixtures have unique fixtureIds', () => {
    const ids = ALL_STRATEGY_EVALUATION_FIXTURES.map(f => f.fixtureId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all fixtures have non-empty displayName', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.displayName.length).toBeGreaterThan(0);
    }
  });

  it('all fixtures have non-empty description', () => {
    for (const fixture of ALL_STRATEGY_EVALUATION_FIXTURES) {
      expect(fixture.description.length).toBeGreaterThan(0);
    }
  });
});

// ─── O. Dependency checks ─────────────────────────────────────────────────────

describe('O. Dependency checks', () => {
  const pkgJson = JSON.parse(
    readFileSync(
      resolve(process.cwd(), 'packages/strategy-evaluation/package.json'),
      'utf-8',
    ),
  ) as Record<string, unknown>;

  const allDeps = {
    ...((pkgJson['dependencies'] as Record<string, string> | undefined) ?? {}),
    ...((pkgJson['devDependencies'] as Record<string, string> | undefined) ?? {}),
  };

  it('does not depend on @solana/web3.js', () => {
    expect(allDeps['@solana/web3.js']).toBeUndefined();
  });

  it('does not depend on Helius SDK', () => {
    expect(allDeps['helius-sdk']).toBeUndefined();
    expect(allDeps['@helius-labs/sdk']).toBeUndefined();
  });

  it('does not depend on pump.fun SDK', () => {
    expect(allDeps['@pump-fun/sdk']).toBeUndefined();
    expect(allDeps['pumpdotfun-sdk']).toBeUndefined();
  });

  it('does not depend on Yellowstone/Geyser', () => {
    expect(allDeps['@triton-one/yellowstone-grpc']).toBeUndefined();
  });

  it('package name is @sonic/strategy-evaluation', () => {
    expect(pkgJson['name']).toBe('@sonic/strategy-evaluation');
  });

  it('package has type module', () => {
    expect(pkgJson['type']).toBe('module');
  });
});

// ─── P. Phase 13/14/15 regression ────────────────────────────────────────────

describe('P. Phase 13/14/15 regression', () => {
  it('Phase 15 strategy-intent fixtures are still importable', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE).toBeDefined();
    expect(ALL_STRATEGY_INTENT_FIXTURES.length).toBeGreaterThan(0);
  });

  it('Phase 15 capabilities still work', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 15 FAILED fixture still has correct classification', () => {
    expect(FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('reject');
  });

  it('Phase 15 INCONCLUSIVE fixture still has correct evidenceQuality', () => {
    expect(INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent.evidenceQuality).toBe('inconclusive_fixture_evidence');
  });

  it('Phase 15 DEGRADED fixtures still accessible', () => {
    expect(DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE).toBeDefined();
    expect(DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('Phase 15 REGRESSION fixture still accessible', () => {
    expect(REGRESSION_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('Phase 16 evaluations built from Phase 15 intents have correct intentCount', () => {
    expect(MIXED_STRATEGY_EVALUATION_FIXTURE.evaluation.intentCount).toBe(4);
  });

  it('Phase 16 evaluation sourceKind is fixture_batch', () => {
    expect(CLEAN_STRATEGY_EVALUATION_FIXTURE.evaluation.sourceKind).toBe('fixture_batch');
  });
});
