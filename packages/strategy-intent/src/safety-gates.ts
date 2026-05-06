/**
 * packages/strategy-intent/src/safety-gates.ts
 *
 * Phase 15 — Strategy safety gate creation.
 *
 * All gates are analysis-only and produce no side effects.
 * No gate may trigger actions, trade intents, or execution.
 */

import type { StrategySafetyGate, StrategyIntentInput, StrategyEvidenceQuality } from './types.js';

const GATE_ANALYSIS_ONLY = true as const;
const GATE_NON_EXECUTABLE = true as const;
const GATE_SAFE_TO_DISPLAY = true as const;

function gate(
  gateId: string,
  gateName: string,
  status: StrategySafetyGate['status'],
  reason: string,
): StrategySafetyGate {
  return {
    gateId,
    gateName,
    status,
    reason,
    analysisOnly: GATE_ANALYSIS_ONLY,
    nonExecutable: GATE_NON_EXECUTABLE,
    safeToDisplay: GATE_SAFE_TO_DISPLAY,
  };
}

/**
 * Builds the required set of analysis-only safety gates from fixture-only input.
 *
 * Required gates:
 *   fixture_only_gate
 *   live_data_forbidden_gate
 *   execution_forbidden_gate
 *   trade_intent_forbidden_gate
 *   paper_trading_forbidden_gate
 *   wallet_forbidden_gate
 *   provider_forbidden_gate
 *   reporting_safety_gate
 *   evidence_quality_gate
 */
export function buildStrategySafetyGates(
  input: StrategyIntentInput,
  evidenceQuality: StrategyEvidenceQuality,
): readonly StrategySafetyGate[] {
  const gates: StrategySafetyGate[] = [];

  // fixture_only_gate: always passed (this package only accepts fixture data)
  gates.push(
    gate(
      'fixture_only_gate',
      'Fixture-Only Gate',
      'passed',
      'Input is fixture-only (fixtureOnly=true, liveData=false). All data is synthetic.',
    ),
  );

  // live_data_forbidden_gate: always passed (live data is never allowed)
  gates.push(
    gate(
      'live_data_forbidden_gate',
      'Live Data Forbidden Gate',
      'passed',
      'Live data is permanently forbidden. liveData=false is enforced.',
    ),
  );

  // execution_forbidden_gate: always passed (execution is never allowed)
  gates.push(
    gate(
      'execution_forbidden_gate',
      'Execution Forbidden Gate',
      'passed',
      'Execution is permanently forbidden. nonExecutable=true is enforced.',
    ),
  );

  // trade_intent_forbidden_gate: always passed (no trade intents allowed)
  gates.push(
    gate(
      'trade_intent_forbidden_gate',
      'Trade Intent Forbidden Gate',
      'passed',
      'Trade intents are permanently forbidden. canCreateTradeIntents=false is enforced.',
    ),
  );

  // paper_trading_forbidden_gate: always passed (paper trading is not allowed)
  gates.push(
    gate(
      'paper_trading_forbidden_gate',
      'Paper Trading Forbidden Gate',
      'passed',
      'Paper trading is permanently forbidden. canPaperTrade=false is enforced.',
    ),
  );

  // wallet_forbidden_gate: always passed (no wallet access)
  gates.push(
    gate(
      'wallet_forbidden_gate',
      'Wallet Forbidden Gate',
      'passed',
      'Wallet and key access is permanently forbidden. All wallet capability flags are false.',
    ),
  );

  // provider_forbidden_gate: always passed (no provider access)
  gates.push(
    gate(
      'provider_forbidden_gate',
      'Provider Forbidden Gate',
      'passed',
      'Provider API access is permanently forbidden. All provider and RPC capability flags are false.',
    ),
  );

  // reporting_safety_gate: depends on input validity
  const reportingStatus =
    input.fixtureOnly === true && input.liveData === false ? 'passed' : 'blocked';
  const reportingReason =
    reportingStatus === 'passed'
      ? 'Reporting safety constraints satisfied. Input is fixture-only and non-live.'
      : 'Reporting safety constraint violated. Input must have fixtureOnly=true and liveData=false.';
  gates.push(
    gate('reporting_safety_gate', 'Reporting Safety Gate', reportingStatus, reportingReason),
  );

  // evidence_quality_gate: depends on evidence quality
  const failedQualities: StrategyEvidenceQuality[] = [
    'failed_fixture_evidence',
    'inconclusive_fixture_evidence',
  ];
  const warnQualities: StrategyEvidenceQuality[] = [
    'weak_fixture_evidence',
    'degraded_fixture_evidence',
  ];

  let evidenceStatus: StrategySafetyGate['status'];
  let evidenceReason: string;

  if (failedQualities.includes(evidenceQuality)) {
    evidenceStatus = 'blocked';
    evidenceReason = `Evidence quality is ${evidenceQuality}. Insufficient or failed evidence blocks any progression.`;
  } else if (warnQualities.includes(evidenceQuality)) {
    evidenceStatus = 'warning';
    evidenceReason = `Evidence quality is ${evidenceQuality}. Weak or degraded evidence requires review.`;
  } else {
    evidenceStatus = 'passed';
    evidenceReason = `Evidence quality is ${evidenceQuality}. Sufficient fixture evidence for analysis review.`;
  }

  gates.push(gate('evidence_quality_gate', 'Evidence Quality Gate', evidenceStatus, evidenceReason));

  return gates;
}
