/**
 * Phase 15 — Strategy Intent Model v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable true
 *   C. Strategy family classification
 *   D. Evidence quality assessment
 *   E. Safety gate creation
 *   F. Rationale creation
 *   G. Strategy intent building
 *   H. Strategy intent validation
 *   I. Fixtures — deterministic, fixture-only, safeToDisplay, analysisOnly, nonExecutable
 *   J. Safety invariants — no trade intents, no execution plans, no live data, etc.
 *   K. Validation rejects unsafe content, secrets, URLs
 *   L. Dependency checks — no Solana/provider SDKs
 *   M. Phase 13 regression tests still pass (via re-import)
 *   N. Phase 14 regression tests still pass (via re-import)
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getStrategyIntentCapabilities,
  getStrategyIntentCapabilitiesGuard,
  // Types (as values via fixtures)
  // Errors
  siOk,
  siErr,
  // Validation
  validateStrategyIntent,
  validateStrategyIntentCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  // Builders
  classifyStrategyFamily,
  assessStrategyEvidence,
  buildStrategySafetyGates,
  buildStrategyIntentRationale,
  buildStrategyIntent,
  // Fixtures
  CLEAN_STRATEGY_INTENT_FIXTURE,
  DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE,
  DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE,
  FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE,
  INCONCLUSIVE_STRATEGY_INTENT_FIXTURE,
  REGRESSION_STRATEGY_INTENT_FIXTURE,
  ALL_STRATEGY_INTENT_FIXTURES,
} from '@sonic/strategy-intent';

import type {
  StrategyIntentInput,
  StrategyIntent,
} from '@sonic/strategy-intent';

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('exports getStrategyIntentCapabilities function', () => {
    expect(typeof getStrategyIntentCapabilities).toBe('function');
  });

  it('exports getStrategyIntentCapabilitiesGuard function', () => {
    expect(typeof getStrategyIntentCapabilitiesGuard).toBe('function');
  });

  it('exports siOk and siErr helpers', () => {
    expect(typeof siOk).toBe('function');
    expect(typeof siErr).toBe('function');
  });

  it('exports validateStrategyIntent function', () => {
    expect(typeof validateStrategyIntent).toBe('function');
  });

  it('exports validateStrategyIntentCapabilities function', () => {
    expect(typeof validateStrategyIntentCapabilities).toBe('function');
  });

  it('exports classifyStrategyFamily function', () => {
    expect(typeof classifyStrategyFamily).toBe('function');
  });

  it('exports assessStrategyEvidence function', () => {
    expect(typeof assessStrategyEvidence).toBe('function');
  });

  it('exports buildStrategySafetyGates function', () => {
    expect(typeof buildStrategySafetyGates).toBe('function');
  });

  it('exports buildStrategyIntentRationale function', () => {
    expect(typeof buildStrategyIntentRationale).toBe('function');
  });

  it('exports buildStrategyIntent function', () => {
    expect(typeof buildStrategyIntent).toBe('function');
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

  it('exports CLEAN_STRATEGY_INTENT_FIXTURE', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE', () => {
    expect(DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE', () => {
    expect(DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE', () => {
    expect(FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports INCONCLUSIVE_STRATEGY_INTENT_FIXTURE', () => {
    expect(INCONCLUSIVE_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports REGRESSION_STRATEGY_INTENT_FIXTURE', () => {
    expect(REGRESSION_STRATEGY_INTENT_FIXTURE).toBeDefined();
  });

  it('exports ALL_STRATEGY_INTENT_FIXTURES array', () => {
    expect(Array.isArray(ALL_STRATEGY_INTENT_FIXTURES)).toBe(true);
    expect(ALL_STRATEGY_INTENT_FIXTURES.length).toBe(6);
  });
});

// ─── B. Capabilities ──────────────────────────────────────────────────────────

describe('B. Capabilities — all unsafe flags false', () => {
  const caps = getStrategyIntentCapabilities();

  it('canUseLiveData is false', () => {
    expect(caps.canUseLiveData).toBe(false);
  });

  it('canUseSolanaRpc is false', () => {
    expect(caps.canUseSolanaRpc).toBe(false);
  });

  it('canUseProviderApis is false', () => {
    expect(caps.canUseProviderApis).toBe(false);
  });

  it('canAccessPrivateKeys is false', () => {
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('canCreateTradeIntents is false', () => {
    expect(caps.canCreateTradeIntents).toBe(false);
  });

  it('canCreateExecutionPlans is false', () => {
    expect(caps.canCreateExecutionPlans).toBe(false);
  });

  it('canPaperTrade is false', () => {
    expect(caps.canPaperTrade).toBe(false);
  });

  it('canTrade is false', () => {
    expect(caps.canTrade).toBe(false);
  });

  it('canExecute is false', () => {
    expect(caps.canExecute).toBe(false);
  });

  it('canWriteToDatabase is false', () => {
    expect(caps.canWriteToDatabase).toBe(false);
  });

  it('canSendTelegramAlerts is false', () => {
    expect(caps.canSendTelegramAlerts).toBe(false);
  });

  it('canConstructTransactions is false', () => {
    expect(caps.canConstructTransactions).toBe(false);
  });

  it('canSimulateTransactions is false', () => {
    expect(caps.canSimulateTransactions).toBe(false);
  });

  it('fixtureOnly is true', () => {
    expect(caps.fixtureOnly).toBe(true);
  });

  it('analysisOnly is true', () => {
    expect(caps.analysisOnly).toBe(true);
  });

  it('nonExecutable is true', () => {
    expect(caps.nonExecutable).toBe(true);
  });

  it('capabilities guard returns same shape', () => {
    const guard = getStrategyIntentCapabilitiesGuard();
    expect(guard.canUseLiveData).toBe(false);
    expect(guard.fixtureOnly).toBe(true);
    expect(guard.analysisOnly).toBe(true);
    expect(guard.nonExecutable).toBe(true);
  });

  it('validateStrategyIntentCapabilities passes valid caps', () => {
    const result = validateStrategyIntentCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('validateStrategyIntentCapabilities rejects caps with canUseLiveData=true', () => {
    const badCaps = { ...caps, canUseLiveData: true as unknown as false };
    const result = validateStrategyIntentCapabilities(badCaps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('validateStrategyIntentCapabilities rejects caps with canTrade=true', () => {
    const badCaps = { ...caps, canTrade: true as unknown as false };
    const result = validateStrategyIntentCapabilities(badCaps);
    expect(result.ok).toBe(false);
  });

  it('validateStrategyIntentCapabilities rejects caps with fixtureOnly=false', () => {
    const badCaps = { ...caps, fixtureOnly: false as unknown as true };
    const result = validateStrategyIntentCapabilities(badCaps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('validateStrategyIntentCapabilities rejects caps with analysisOnly=false', () => {
    const badCaps = { ...caps, analysisOnly: false as unknown as true };
    const result = validateStrategyIntentCapabilities(badCaps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('validateStrategyIntentCapabilities rejects caps with nonExecutable=false', () => {
    const badCaps = { ...caps, nonExecutable: false as unknown as true };
    const result = validateStrategyIntentCapabilities(badCaps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('NON_EXECUTABLE_REQUIRED');
  });
});

// ─── C. Strategy family classification ────────────────────────────────────────

describe('C. Strategy family classification', () => {
  const baseInput: StrategyIntentInput = {
    sourceKind: 'replay_run_report',
    sourceId: 'test_001',
    fixtureOnly: true,
    liveData: false,
  };

  it('failed verdict + manipulation scenario → manipulation_avoidance_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'failed',
      scenarioId: 'manipulation_reject_scenario',
      finalRiskScore: 0.9,
      failureCount: 2,
    };
    expect(classifyStrategyFamily(input)).toBe('manipulation_avoidance_review');
  });

  it('failed verdict without manipulation context → manipulation_avoidance_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'failed',
      failureCount: 1,
    };
    expect(classifyStrategyFamily(input)).toBe('manipulation_avoidance_review');
  });

  it('degraded verdict + creator scenario → creator_leaderboard_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'degraded',
      scenarioId: 'risky_creator_replay_scenario',
      degradedCount: 2,
    };
    expect(classifyStrategyFamily(input)).toBe('creator_leaderboard_review');
  });

  it('degraded verdict + wallet scenario → wallet_cluster_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'degraded',
      scenarioId: 'wallet_cluster_risk_replay_scenario',
      degradedCount: 2,
    };
    expect(classifyStrategyFamily(input)).toBe('wallet_cluster_review');
  });

  it('degraded verdict without specific context → creator_leaderboard_review (conservative default)', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'degraded',
      degradedCount: 1,
    };
    expect(classifyStrategyFamily(input)).toBe('creator_leaderboard_review');
  });

  it('inconclusive verdict → insufficient_evidence_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'inconclusive',
      inconclusiveCount: 2,
    };
    expect(classifyStrategyFamily(input)).toBe('insufficient_evidence_review');
  });

  it('regression=true → replay_regression_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      sourceKind: 'replay_comparison_report',
      regression: true,
      verdictChanged: true,
    };
    expect(classifyStrategyFamily(input)).toBe('replay_regression_review');
  });

  it('verdictChanged=true → replay_regression_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      sourceKind: 'replay_comparison_report',
      verdictChanged: true,
    };
    expect(classifyStrategyFamily(input)).toBe('replay_regression_review');
  });

  it('replay_comparison sourceKind → replay_regression_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      sourceKind: 'replay_comparison',
    };
    expect(classifyStrategyFamily(input)).toBe('replay_regression_review');
  });

  it('fixture_only verdict → defensive_new_launch_filter', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'fixture_only',
    };
    expect(classifyStrategyFamily(input)).toBe('defensive_new_launch_filter');
  });

  it('passed verdict → defensive_new_launch_filter', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'passed',
    };
    expect(classifyStrategyFamily(input)).toBe('defensive_new_launch_filter');
  });

  it('fixture_only verdict with regression in scenarioId → replay_regression_review', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'fixture_only',
      scenarioId: 'regression_comparison_baseline',
    };
    expect(classifyStrategyFamily(input)).toBe('replay_regression_review');
  });
});

// ─── D. Evidence quality assessment ──────────────────────────────────────────

describe('D. Evidence quality assessment', () => {
  const baseInput: StrategyIntentInput = {
    sourceKind: 'replay_run_report',
    sourceId: 'test_001',
    fixtureOnly: true,
    liveData: false,
  };

  it('failed verdict → failed_fixture_evidence', () => {
    const result = assessStrategyEvidence({ ...baseInput, finalVerdict: 'failed', failureCount: 2 });
    expect(result.quality).toBe('failed_fixture_evidence');
  });

  it('degraded verdict → degraded_fixture_evidence', () => {
    const result = assessStrategyEvidence({ ...baseInput, finalVerdict: 'degraded', degradedCount: 1 });
    expect(result.quality).toBe('degraded_fixture_evidence');
  });

  it('inconclusive verdict → inconclusive_fixture_evidence', () => {
    const result = assessStrategyEvidence({ ...baseInput, finalVerdict: 'inconclusive', inconclusiveCount: 1 });
    expect(result.quality).toBe('inconclusive_fixture_evidence');
  });

  it('fixture_only verdict with confidence>=0.6 and low risk → strong_fixture_evidence', () => {
    const result = assessStrategyEvidence({
      ...baseInput,
      finalVerdict: 'fixture_only',
      averageConfidence: 0.6,
      finalRiskScore: 0.2,
    });
    expect(result.quality).toBe('strong_fixture_evidence');
  });

  it('fixture_only verdict with confidence>=0.4 → moderate_fixture_evidence', () => {
    const result = assessStrategyEvidence({
      ...baseInput,
      finalVerdict: 'fixture_only',
      averageConfidence: 0.45,
      finalRiskScore: 0.5,
    });
    expect(result.quality).toBe('moderate_fixture_evidence');
  });

  it('no data → weak_fixture_evidence', () => {
    const result = assessStrategyEvidence({ ...baseInput });
    expect(result.quality).toBe('weak_fixture_evidence');
  });

  it('low confidence → weak_fixture_evidence', () => {
    const result = assessStrategyEvidence({
      ...baseInput,
      finalVerdict: 'passed',
      averageConfidence: 0.2,
      finalRiskScore: 0.3,
    });
    expect(result.quality).toBe('weak_fixture_evidence');
  });

  it('confidence is clamped to [0,1]', () => {
    const result = assessStrategyEvidence({ ...baseInput, finalVerdict: 'failed', averageConfidence: 2.0 });
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });

  it('returns notes array', () => {
    const result = assessStrategyEvidence({ ...baseInput, finalVerdict: 'failed' });
    expect(Array.isArray(result.notes)).toBe(true);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it('strong evidence returns confidence value', () => {
    const result = assessStrategyEvidence({
      ...baseInput,
      finalVerdict: 'fixture_only',
      averageConfidence: 0.7,
      finalRiskScore: 0.1,
    });
    expect(result.confidence).toBeCloseTo(0.7);
  });
});

// ─── E. Safety gate creation ──────────────────────────────────────────────────

describe('E. Safety gate creation', () => {
  const baseInput: StrategyIntentInput = {
    sourceKind: 'replay_run_report',
    sourceId: 'test_001',
    fixtureOnly: true,
    liveData: false,
  };

  it('returns 9 gates for clean input', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    expect(gates.length).toBe(9);
  });

  it('all gates have analysisOnly=true', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    for (const gate of gates) {
      expect(gate.analysisOnly).toBe(true);
    }
  });

  it('all gates have nonExecutable=true', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    for (const gate of gates) {
      expect(gate.nonExecutable).toBe(true);
    }
  });

  it('all gates have safeToDisplay=true', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    for (const gate of gates) {
      expect(gate.safeToDisplay).toBe(true);
    }
  });

  it('fixture_only_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const fixtureGate = gates.find(g => g.gateId === 'fixture_only_gate');
    expect(fixtureGate?.status).toBe('passed');
  });

  it('live_data_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'live_data_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('execution_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'execution_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('trade_intent_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'trade_intent_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('paper_trading_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'paper_trading_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('wallet_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'wallet_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('provider_forbidden_gate is always passed', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'provider_forbidden_gate');
    expect(gate?.status).toBe('passed');
  });

  it('evidence_quality_gate is passed for strong evidence', () => {
    const gates = buildStrategySafetyGates(baseInput, 'strong_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'evidence_quality_gate');
    expect(gate?.status).toBe('passed');
  });

  it('evidence_quality_gate is blocked for failed evidence', () => {
    const gates = buildStrategySafetyGates(baseInput, 'failed_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'evidence_quality_gate');
    expect(gate?.status).toBe('blocked');
  });

  it('evidence_quality_gate is warning for weak evidence', () => {
    const gates = buildStrategySafetyGates(baseInput, 'weak_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'evidence_quality_gate');
    expect(gate?.status).toBe('warning');
  });

  it('evidence_quality_gate is blocked for inconclusive evidence', () => {
    const gates = buildStrategySafetyGates(baseInput, 'inconclusive_fixture_evidence');
    const gate = gates.find(g => g.gateId === 'evidence_quality_gate');
    expect(gate?.status).toBe('blocked');
  });

  it('gates have non-empty gateId and gateName', () => {
    const gates = buildStrategySafetyGates(baseInput, 'moderate_fixture_evidence');
    for (const gate of gates) {
      expect(gate.gateId.length).toBeGreaterThan(0);
      expect(gate.gateName.length).toBeGreaterThan(0);
    }
  });
});

// ─── F. Rationale creation ────────────────────────────────────────────────────

describe('F. Rationale creation', () => {
  const baseInput: StrategyIntentInput = {
    sourceKind: 'replay_run_report',
    sourceId: 'test_001',
    fixtureOnly: true,
    liveData: false,
    finalVerdict: 'fixture_only',
    finalRiskScore: 0.2,
    averageConfidence: 0.6,
  };

  it('returns a rationale object', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale).toBeDefined();
  });

  it('rationale.safeToDisplay is true', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.safeToDisplay).toBe(true);
  });

  it('rationale.analysisOnly is true', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.analysisOnly).toBe(true);
  });

  it('rationale.nonExecutable is true', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.nonExecutable).toBe(true);
  });

  it('rationale.summary is non-empty', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.summary.length).toBeGreaterThan(0);
  });

  it('rationale.evidenceNotes contains source info', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.evidenceNotes.some(n => n.includes('test_001'))).toBe(true);
  });

  it('rationale.safetyNotes contains non-executable disclaimer', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.safetyNotes.some(n => n.includes('non-executable'))).toBe(true);
  });

  it('rationale.limitationNotes is non-empty', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.limitationNotes.length).toBeGreaterThan(0);
  });

  it('rationale.reviewNotes contains classification', () => {
    const rationale = buildStrategyIntentRationale(
      baseInput,
      'defensive_new_launch_filter',
      'strong_fixture_evidence',
      'analysis_only',
    );
    expect(rationale.reviewNotes.some(n => n.includes('analysis_only'))).toBe(true);
  });
});

// ─── G. Strategy intent building ─────────────────────────────────────────────

describe('G. Strategy intent building', () => {
  const baseInput: StrategyIntentInput = {
    sourceKind: 'replay_run_report',
    sourceId: 'rpt_test_001',
    finalVerdict: 'fixture_only',
    finalRiskScore: 0.2,
    averageConfidence: 0.6,
    fixtureOnly: true,
    liveData: false,
  };

  it('builds successfully for valid input', () => {
    const result = buildStrategyIntent(baseInput);
    expect(result.ok).toBe(true);
  });

  it('built intent has fixtureOnly=true', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('built intent has liveData=false', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.liveData).toBe(false);
  });

  it('built intent has safeToDisplay=true', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.safeToDisplay).toBe(true);
  });

  it('built intent has analysisOnly=true', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.analysisOnly).toBe(true);
  });

  it('built intent has nonExecutable=true', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.nonExecutable).toBe(true);
  });

  it('built intent has strategyFamily set', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.strategyFamily).toBeDefined();
    expect(typeof result.value.strategyFamily).toBe('string');
  });

  it('built intent has classification set', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.classification).toBeDefined();
  });

  it('built intent has evidenceQuality set', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.evidenceQuality).toBeDefined();
  });

  it('built intent has confidence as a number', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(typeof result.value.confidence).toBe('number');
  });

  it('built intent has safetyGates array', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(Array.isArray(result.value.safetyGates)).toBe(true);
    expect(result.value.safetyGates.length).toBeGreaterThan(0);
  });

  it('built intent has findings array', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(Array.isArray(result.value.findings)).toBe(true);
  });

  it('built intent has rationale object', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.rationale).toBeDefined();
  });

  it('built intent has id string', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    expect(typeof result.value.id).toBe('string');
    expect(result.value.id.length).toBeGreaterThan(0);
  });

  it('rejects input with liveData=true', () => {
    const badInput = { ...baseInput, liveData: true as unknown as false };
    const result = buildStrategyIntent(badInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects input with fixtureOnly=false', () => {
    const badInput = { ...baseInput, fixtureOnly: false as unknown as true };
    const result = buildStrategyIntent(badInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('failed manipulation input → reject classification', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'failed',
      scenarioId: 'manipulation_reject_scenario',
      failureCount: 2,
      finalRiskScore: 0.9,
    };
    const result = buildStrategyIntent(input);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.classification).toBe('reject');
  });

  it('degraded input → watch_only classification', () => {
    const input: StrategyIntentInput = {
      ...baseInput,
      finalVerdict: 'degraded',
      degradedCount: 2,
    };
    const result = buildStrategyIntent(input);
    if (!result.ok) throw new Error('Expected ok');
    expect(result.value.classification).toBe('watch_only');
  });

  it('findings always include ANALYSIS_ONLY finding', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    const hasAnalysisOnly = result.value.findings.some(f => f.code === 'ANALYSIS_ONLY');
    expect(hasAnalysisOnly).toBe(true);
  });

  it('findings always include NOT_A_REAL_TRADE_INTENT finding', () => {
    const result = buildStrategyIntent(baseInput);
    if (!result.ok) throw new Error('Expected ok');
    const hasNote = result.value.findings.some(f => f.code === 'NOT_A_REAL_TRADE_INTENT');
    expect(hasNote).toBe(true);
  });
});

// ─── H. Strategy intent validation ───────────────────────────────────────────

describe('H. Strategy intent validation', () => {
  const validIntent: StrategyIntent = CLEAN_STRATEGY_INTENT_FIXTURE.intent;

  it('validates clean fixture intent successfully', () => {
    const result = validateStrategyIntent(validIntent);
    expect(result.ok).toBe(true);
  });

  it('rejects intent with liveData=true', () => {
    const bad = { ...validIntent, liveData: true as unknown as false };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects intent with fixtureOnly=false', () => {
    const bad = { ...validIntent, fixtureOnly: false as unknown as true };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects intent with safeToDisplay=false', () => {
    const bad = { ...validIntent, safeToDisplay: false as unknown as true };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SAFE_TO_DISPLAY_REQUIRED');
  });

  it('rejects intent with analysisOnly=false', () => {
    const bad = { ...validIntent, analysisOnly: false as unknown as true };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('rejects intent with nonExecutable=false', () => {
    const bad = { ...validIntent, nonExecutable: false as unknown as true };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('NON_EXECUTABLE_REQUIRED');
  });

  it('rejects intent with unsafe action text in summary', () => {
    const badRationale = {
      ...validIntent.rationale,
      summary: 'You should buy this token immediately',
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('rejects intent with private key in rationale', () => {
    const badRationale = {
      ...validIntent.rationale,
      summary: 'Use this private_key: abc123',
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects intent with RPC URL in rationale', () => {
    const badRationale = {
      ...validIntent.rationale,
      summary: 'Connect to mainnet-beta.solana.com for data',
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('URL_PATTERN_DETECTED');
  });

  it('rejects intent with seed_phrase in evidence notes', () => {
    const badRationale = {
      ...validIntent.rationale,
      evidenceNotes: ['seed_phrase: word1 word2 word3 ...'],
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects intent with api_key in safety notes', () => {
    const badRationale = {
      ...validIntent.rationale,
      safetyNotes: ['Use api_key: ABC123'],
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects intent with wss:// URL in limitation notes', () => {
    const badRationale = {
      ...validIntent.rationale,
      limitationNotes: ['Connect via wss://mainnet.example.com'],
    };
    const bad = { ...validIntent, rationale: badRationale };
    const result = validateStrategyIntent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('URL_PATTERN_DETECTED');
  });

  it('validates degraded fixture intent', () => {
    const result = validateStrategyIntent(DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent);
    expect(result.ok).toBe(true);
  });

  it('validates failed manipulation fixture intent', () => {
    const result = validateStrategyIntent(FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent);
    expect(result.ok).toBe(true);
  });

  it('validates inconclusive fixture intent', () => {
    const result = validateStrategyIntent(INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent);
    expect(result.ok).toBe(true);
  });

  it('validates regression fixture intent', () => {
    const result = validateStrategyIntent(REGRESSION_STRATEGY_INTENT_FIXTURE.intent);
    expect(result.ok).toBe(true);
  });
});

// ─── I. Fixtures ──────────────────────────────────────────────────────────────

describe('I. Fixtures — deterministic and safe', () => {
  it('CLEAN fixture is fixtureOnly=true', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.fixtureOnly).toBe(true);
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.fixtureOnly).toBe(true);
  });

  it('CLEAN fixture is liveData=false', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.liveData).toBe(false);
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.liveData).toBe(false);
  });

  it('CLEAN fixture is safeToDisplay=true', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.safeToDisplay).toBe(true);
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.safeToDisplay).toBe(true);
  });

  it('CLEAN fixture is analysisOnly=true', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.analysisOnly).toBe(true);
  });

  it('CLEAN fixture is nonExecutable=true', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.nonExecutable).toBe(true);
  });

  it('CLEAN fixture has correct strategyFamily', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('defensive_new_launch_filter');
  });

  it('DEGRADED_CREATOR fixture has creator_leaderboard_review family', () => {
    expect(DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('creator_leaderboard_review');
  });

  it('DEGRADED_WALLET fixture has wallet_cluster_review family', () => {
    expect(DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('wallet_cluster_review');
  });

  it('FAILED_MANIPULATION fixture has manipulation_avoidance_review family', () => {
    expect(FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('manipulation_avoidance_review');
  });

  it('INCONCLUSIVE fixture has insufficient_evidence_review family', () => {
    expect(INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('insufficient_evidence_review');
  });

  it('REGRESSION fixture has replay_regression_review family', () => {
    expect(REGRESSION_STRATEGY_INTENT_FIXTURE.intent.strategyFamily).toBe('replay_regression_review');
  });

  it('FAILED_MANIPULATION fixture classification is reject', () => {
    expect(FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('reject');
  });

  it('INCONCLUSIVE fixture classification is insufficient_evidence', () => {
    expect(INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('insufficient_evidence');
  });

  it('CLEAN fixture classification is analysis_only', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('analysis_only');
  });

  it('DEGRADED fixtures classification is watch_only', () => {
    expect(DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('watch_only');
    expect(DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('watch_only');
    expect(REGRESSION_STRATEGY_INTENT_FIXTURE.intent.classification).toBe('watch_only');
  });

  it('all fixtures have deterministic IDs', () => {
    const ids = ALL_STRATEGY_INTENT_FIXTURES.map(f => f.intent.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('ALL_STRATEGY_INTENT_FIXTURES has 6 items', () => {
    expect(ALL_STRATEGY_INTENT_FIXTURES.length).toBe(6);
  });

  it('all fixtures are fixtureOnly=true', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.fixtureOnly).toBe(true);
      expect(f.intent.fixtureOnly).toBe(true);
    }
  });

  it('all fixtures are liveData=false', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.liveData).toBe(false);
      expect(f.intent.liveData).toBe(false);
    }
  });

  it('all fixtures are safeToDisplay=true', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.safeToDisplay).toBe(true);
      expect(f.intent.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures are analysisOnly=true', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.analysisOnly).toBe(true);
    }
  });

  it('all fixtures are nonExecutable=true', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.nonExecutable).toBe(true);
    }
  });

  it('all fixtures pass validateStrategyIntent', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      const result = validateStrategyIntent(f.intent);
      expect(result.ok).toBe(true);
    }
  });

  it('all fixtures have safety gates', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.safetyGates.length).toBeGreaterThan(0);
    }
  });

  it('all fixtures have findings', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.findings.length).toBeGreaterThan(0);
    }
  });

  it('all fixture findings have safeToDisplay=true', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      for (const finding of f.intent.findings) {
        expect(finding.safeToDisplay).toBe(true);
      }
    }
  });
});

// ─── J. Safety invariants ─────────────────────────────────────────────────────

describe('J. Safety invariants', () => {
  it('no StrategyIntent creates real trade intents', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.fixtureOnly).toBe(true);
      expect((f.intent as Record<string, unknown>).isTradeIntent).toBeUndefined();
    }
  });

  it('no StrategyIntent creates execution plans', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect((f.intent as Record<string, unknown>).executionPlan).toBeUndefined();
    }
  });

  it('no StrategyIntent enables paper trading', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect((f.intent as Record<string, unknown>).paperTrade).toBeUndefined();
    }
  });

  it('no StrategyIntent enables live data', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect(f.intent.liveData).toBe(false);
    }
  });

  it('no StrategyIntent enables transaction construction', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect((f.intent as Record<string, unknown>).transaction).toBeUndefined();
    }
  });

  it('no StrategyIntent enables transaction simulation', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect((f.intent as Record<string, unknown>).simulation).toBeUndefined();
    }
  });

  it('no StrategyIntent enables wallet or provider access', () => {
    for (const f of ALL_STRATEGY_INTENT_FIXTURES) {
      expect((f.intent as Record<string, unknown>).wallet).toBeUndefined();
      expect((f.intent as Record<string, unknown>).provider).toBeUndefined();
    }
  });

  it('capabilities never allow canTrade=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canTrade).toBe(false);
  });

  it('capabilities never allow canExecute=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canExecute).toBe(false);
  });

  it('capabilities never allow canUseLiveData=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canUseLiveData).toBe(false);
  });

  it('capabilities never allow canUseSolanaRpc=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canUseSolanaRpc).toBe(false);
  });

  it('capabilities never allow canConstructTransactions=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canConstructTransactions).toBe(false);
  });

  it('capabilities never allow canSimulateTransactions=true', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canSimulateTransactions).toBe(false);
  });
});

// ─── K. Validation rejects unsafe content ─────────────────────────────────────

describe('K. Validation text helpers', () => {
  it('containsUnsafeActionText detects "buy"', () => {
    expect(containsUnsafeActionText('you should buy this')).toBe(true);
  });

  it('containsUnsafeActionText detects "sell"', () => {
    expect(containsUnsafeActionText('recommend to sell')).toBe(true);
  });

  it('containsUnsafeActionText detects "execute"', () => {
    expect(containsUnsafeActionText('execute the plan')).toBe(true);
  });

  it('containsUnsafeActionText detects "snipe"', () => {
    expect(containsUnsafeActionText('snipe this token')).toBe(true);
  });

  it('containsUnsafeActionText detects "copy trade"', () => {
    expect(containsUnsafeActionText('copy trade wallet')).toBe(true);
  });

  it('containsUnsafeActionText detects "full auto"', () => {
    expect(containsUnsafeActionText('enable full auto mode')).toBe(true);
  });

  it('containsUnsafeActionText returns false for safe text', () => {
    expect(containsUnsafeActionText('analysis-only fixture review')).toBe(false);
  });

  it('containsSecretPattern detects "private_key"', () => {
    expect(containsSecretPattern('use private_key to sign')).toBe(true);
  });

  it('containsSecretPattern detects "seed_phrase"', () => {
    expect(containsSecretPattern('seed_phrase for wallet')).toBe(true);
  });

  it('containsSecretPattern detects "api_key"', () => {
    expect(containsSecretPattern('api_key=ABC123')).toBe(true);
  });

  it('containsSecretPattern detects "mnemonic"', () => {
    expect(containsSecretPattern('store your mnemonic safely')).toBe(true);
  });

  it('containsSecretPattern returns false for safe text', () => {
    expect(containsSecretPattern('fixture-only analysis')).toBe(false);
  });

  it('containsUrlPattern detects wss://', () => {
    expect(containsUrlPattern('connect to wss://mainnet.example.com')).toBe(true);
  });

  it('containsUrlPattern detects mainnet-beta.solana.com', () => {
    expect(containsUrlPattern('use mainnet-beta.solana.com rpc')).toBe(true);
  });

  it('containsUrlPattern detects helius.dev', () => {
    expect(containsUrlPattern('helius.dev endpoint')).toBe(true);
  });

  it('containsUrlPattern detects yellowstone', () => {
    expect(containsUrlPattern('yellowstone geyser stream')).toBe(true);
  });

  it('containsUrlPattern returns false for safe text', () => {
    expect(containsUrlPattern('fixture-only synthetic review')).toBe(false);
  });

  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('This is a fixture-only analysis review.')).toBe(true);
  });

  it('isDisplaySafe returns false for unsafe text', () => {
    expect(isDisplaySafe('buy this token now')).toBe(false);
  });
});

// ─── L. Dependency checks ──────────────────────────────────────────────────────

describe('L. Dependency checks — no Solana/provider SDKs', () => {
  const packageJsonPath = resolve(
    process.cwd(),
    'packages/strategy-intent/package.json',
  );

  it('package.json exists', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw.length).toBeGreaterThan(0);
  });

  it('does not depend on @solana/web3.js', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw).not.toContain('@solana/web3.js');
  });

  it('does not depend on helius', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw.toLowerCase()).not.toContain('helius');
  });

  it('does not depend on jito', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw.toLowerCase()).not.toContain('jito');
  });

  it('does not depend on pump', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw.toLowerCase()).not.toContain('pump');
  });

  it('does not depend on yellowstone', () => {
    const raw = readFileSync(packageJsonPath, 'utf-8');
    expect(raw.toLowerCase()).not.toContain('yellowstone');
  });

  it('only depends on @sonic packages and typescript', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const allDeps = Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
    for (const dep of allDeps) {
      const isAllowed = dep.startsWith('@sonic/') || dep === 'typescript';
      expect(isAllowed).toBe(true);
    }
  });

  it('index.ts does not import from @solana', () => {
    const indexPath = resolve(process.cwd(), 'packages/strategy-intent/src/index.ts');
    const raw = readFileSync(indexPath, 'utf-8');
    expect(raw).not.toContain('@solana');
  });

  it('intent-builder.ts does not import from @solana', () => {
    const filePath = resolve(process.cwd(), 'packages/strategy-intent/src/intent-builder.ts');
    const raw = readFileSync(filePath, 'utf-8');
    expect(raw).not.toContain('@solana');
  });
});

// ─── M. Phase 13 regression tests ────────────────────────────────────────────

describe('M. Phase 13 regression — replay-lab still works', () => {
  it('replay-lab still exports getReplayLabCapabilities', async () => {
    const mod = await import('@sonic/replay-lab');
    expect(typeof mod.getReplayLabCapabilities).toBe('function');
  });

  it('replay-lab capabilities still safe', async () => {
    const mod = await import('@sonic/replay-lab');
    const caps = mod.getReplayLabCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('replay-lab ALL_REPLAY_FIXTURES still has 8 items', async () => {
    const mod = await import('@sonic/replay-lab');
    expect(mod.ALL_REPLAY_FIXTURES.length).toBe(8);
  });

  it('replay-lab fixtures still have fixtureOnly=true', async () => {
    const mod = await import('@sonic/replay-lab');
    for (const f of mod.ALL_REPLAY_FIXTURES) {
      expect(f.fixtureOnly).toBe(true);
    }
  });
});

// ─── N. Phase 14 regression tests ────────────────────────────────────────────

describe('N. Phase 14 regression — replay-reporting still works', () => {
  it('replay-reporting still exports getReplayReportingCapabilities', async () => {
    const mod = await import('@sonic/replay-reporting');
    expect(typeof mod.getReplayReportingCapabilities).toBe('function');
  });

  it('replay-reporting capabilities still safe', async () => {
    const mod = await import('@sonic/replay-reporting');
    const caps = mod.getReplayReportingCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('replay-reporting ALL_REPLAY_REPORT_FIXTURES still has 5 items', async () => {
    const mod = await import('@sonic/replay-reporting');
    expect(mod.ALL_REPLAY_REPORT_FIXTURES.length).toBe(5);
  });

  it('replay-reporting fixtures still have fixtureOnly=true', async () => {
    const mod = await import('@sonic/replay-reporting');
    for (const f of mod.ALL_REPLAY_REPORT_FIXTURES) {
      expect(f.fixtureOnly).toBe(true);
    }
  });

  it('replay-reporting containsUnsafeActionText still works', async () => {
    const mod = await import('@sonic/replay-reporting');
    expect(mod.containsUnsafeActionText('buy this token')).toBe(true);
    expect(mod.containsUnsafeActionText('safe analysis text')).toBe(false);
  });
});

// ─── O. siOk / siErr helpers ──────────────────────────────────────────────────

describe('O. SiResult helpers', () => {
  it('siOk wraps value correctly', () => {
    const result = siOk('test value');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('test value');
  });

  it('siErr wraps error correctly', () => {
    const result = siErr('LIVE_DATA_FORBIDDEN', 'test error message');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
      expect(result.message).toBe('test error message');
    }
  });

  it('siOk and siErr are mutually exclusive via ok field', () => {
    const ok = siOk(42);
    const err = siErr('FIXTURE_ONLY_REQUIRED', 'msg');
    expect(ok.ok).not.toBe(err.ok);
  });
});
