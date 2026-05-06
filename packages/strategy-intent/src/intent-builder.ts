/**
 * packages/strategy-intent/src/intent-builder.ts
 *
 * Phase 15 — Strategy intent builder.
 *
 * Builds a StrategyIntent from a fixture-only StrategyIntentInput.
 * The output is analysis-only, non-executable, and safe to display.
 *
 * IMPORTANT: buildStrategyIntent does NOT create real trade intents.
 * It does NOT create execution plans.
 * It does NOT enable paper trading, live data, or any form of execution.
 */

import type { StrategyIntent, StrategyIntentInput, StrategyIntentFinding } from './types.js';
import { classifyStrategyFamily } from './strategy-family.js';
import { assessStrategyEvidence } from './evidence.js';
import { buildStrategySafetyGates } from './safety-gates.js';
import { buildStrategyIntentRationale } from './rationale.js';
import { siOk, siErr } from './errors.js';
import type { SiResult } from './errors.js';

let _idCounter = 0;

/** Generates a deterministic-enough ID for a strategy intent. */
function generateIntentId(sourceKind: string, sourceId: string): string {
  _idCounter += 1;
  return `si_${sourceKind}_${sourceId}_${_idCounter}`;
}

/**
 * Derives the StrategyIntentClassification from family and evidence quality.
 */
function deriveClassification(
  family: import('./types.js').StrategyFamily,
  quality: import('./types.js').StrategyEvidenceQuality,
): import('./types.js').StrategyIntentClassification {
  if (quality === 'failed_fixture_evidence') return 'reject';
  if (quality === 'inconclusive_fixture_evidence') return 'insufficient_evidence';
  if (quality === 'weak_fixture_evidence') return 'insufficient_evidence';
  if (quality === 'degraded_fixture_evidence') return 'watch_only';
  if (family === 'manipulation_avoidance_review') return 'reject';
  if (family === 'insufficient_evidence_review') return 'insufficient_evidence';
  if (family === 'replay_regression_review') return 'watch_only';
  if (family === 'fixture_only_review') return 'fixture_only';
  return 'analysis_only';
}

/**
 * Builds analysis findings from input and evidence quality.
 */
function buildFindings(
  input: StrategyIntentInput,
  quality: import('./types.js').StrategyEvidenceQuality,
  family: import('./types.js').StrategyFamily,
): readonly StrategyIntentFinding[] {
  const findings: StrategyIntentFinding[] = [];

  if (quality === 'failed_fixture_evidence') {
    findings.push({
      severity: 'failure',
      code: 'FIXTURE_EVIDENCE_FAILED',
      message: 'Fixture evidence has a failed verdict. This scenario is rejected for analysis progression.',
      safeToDisplay: true,
    });
  }

  if (quality === 'degraded_fixture_evidence') {
    findings.push({
      severity: 'warning',
      code: 'FIXTURE_EVIDENCE_DEGRADED',
      message: 'Fixture evidence shows degraded outcome. Elevated risk flags observed.',
      safeToDisplay: true,
    });
  }

  if (quality === 'inconclusive_fixture_evidence') {
    findings.push({
      severity: 'inconclusive',
      code: 'FIXTURE_EVIDENCE_INCONCLUSIVE',
      message: 'Fixture evidence is inconclusive. Insufficient data to determine outcome.',
      safeToDisplay: true,
    });
  }

  if (quality === 'weak_fixture_evidence') {
    findings.push({
      severity: 'warning',
      code: 'FIXTURE_EVIDENCE_WEAK',
      message: 'Fixture evidence is weak. Low confidence or missing data detected.',
      safeToDisplay: true,
    });
  }

  if (input.regression === true) {
    findings.push({
      severity: 'risk',
      code: 'REGRESSION_DETECTED',
      message: 'Regression detected in comparison between baseline and candidate fixture runs.',
      safeToDisplay: true,
    });
  }

  if (input.verdictChanged === true) {
    findings.push({
      severity: 'warning',
      code: 'VERDICT_CHANGED',
      message: 'Verdict changed between baseline and candidate fixture runs.',
      safeToDisplay: true,
    });
  }

  if (family === 'manipulation_avoidance_review' && quality === 'failed_fixture_evidence') {
    findings.push({
      severity: 'failure',
      code: 'MANIPULATION_SIGNAL_DETECTED',
      message: 'Fixture evidence shows manipulation-like signals. Scenario is rejected for analysis progression.',
      safeToDisplay: true,
    });
  }

  // Always add analysis-only note
  findings.push({
    severity: 'info',
    code: 'ANALYSIS_ONLY',
    message: 'This StrategyIntent is analysis-only, fixture-only, and non-executable. No action is implied.',
    safeToDisplay: true,
  });

  findings.push({
    severity: 'info',
    code: 'NOT_A_REAL_TRADE_INTENT',
    message: 'StrategyIntent is NOT a real trade intent. It does not enable or recommend trading.',
    safeToDisplay: true,
  });

  return findings;
}

/**
 * Builds a StrategyIntent from a fixture-only StrategyIntentInput.
 *
 * Returns a typed SiResult containing the StrategyIntent or an error.
 * Does not throw for normal validation failures.
 */
export function buildStrategyIntent(input: StrategyIntentInput): SiResult<StrategyIntent> {
  // Safety invariant checks on input
  if (input.fixtureOnly !== true) {
    return siErr('FIXTURE_ONLY_REQUIRED', 'Input fixtureOnly must be true');
  }
  if (input.liveData !== false) {
    return siErr('LIVE_DATA_FORBIDDEN', 'Input liveData must be false');
  }

  const family = classifyStrategyFamily(input);
  const evidenceAssessment = assessStrategyEvidence(input);
  const { quality, confidence } = evidenceAssessment;
  const classification = deriveClassification(family, quality);
  const safetyGates = buildStrategySafetyGates(input, quality);
  const rationale = buildStrategyIntentRationale(input, family, quality, classification);
  const findings = buildFindings(input, quality, family);
  const id = generateIntentId(input.sourceKind, input.sourceId);

  const intent: StrategyIntent = {
    id,
    strategyFamily: family,
    classification,
    evidenceQuality: quality,
    confidence,
    safetyGates,
    rationale,
    findings,
    sourceKind: input.sourceKind,
    sourceId: input.sourceId,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  };

  return siOk(intent);
}
