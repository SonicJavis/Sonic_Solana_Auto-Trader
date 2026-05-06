/**
 * packages/strategy-evaluation/src/evaluation-builder.ts
 *
 * Phase 16 — Strategy evaluation builder.
 *
 * Builds a StrategyEvaluation from a fixture-only StrategyEvaluationInput.
 * The output is analysis-only, non-executable, and safe to display.
 *
 * IMPORTANT: buildStrategyEvaluation does NOT create real trade intents.
 * It does NOT create execution plans.
 * It does NOT enable paper trading, live data, or any form of execution.
 */

import type { StrategyEvaluation, StrategyEvaluationInput, StrategyEvaluationClassification, StrategyEvaluationFinding } from './types.js';
import { seOk, seErr } from './errors.js';
import type { SeResult } from './errors.js';
import { buildStrategyScoreBandSummary } from './score-bands.js';
import { buildStrategyEvidenceDistribution } from './evidence-summary.js';
import { buildStrategySafetyGateSummary } from './gate-summary.js';
import { compareStrategyFamilies } from './family-comparison.js';

let _evalIdCounter = 0;

function generateEvaluationId(sourceKind: string): string {
  _evalIdCounter += 1;
  return `se_${sourceKind}_${_evalIdCounter}`;
}

/**
 * Derives the StrategyEvaluationClassification from majority intent classification.
 */
function deriveEvaluationClassification(
  classificationCounts: Readonly<Record<string, number>>,
): StrategyEvaluationClassification {
  const rejectCount = classificationCounts['reject'] ?? 0;
  const watchCount = classificationCounts['watch_only'] ?? 0;
  const analysisCount = classificationCounts['analysis_only'] ?? 0;
  const insufficientCount = classificationCounts['insufficient_evidence'] ?? 0;
  const fixtureCount = classificationCounts['fixture_only'] ?? 0;

  const total = rejectCount + watchCount + analysisCount + insufficientCount + fixtureCount;
  if (total === 0) return 'fixture_only';

  if (fixtureCount === total) return 'fixture_only';
  if (insufficientCount === total) return 'insufficient_evidence';

  // Find dominant classification
  const counts: [string, number][] = [
    ['reject', rejectCount],
    ['watch_only', watchCount],
    ['analysis_only', analysisCount],
    ['insufficient_evidence', insufficientCount],
    ['fixture_only', fixtureCount],
  ];

  counts.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  const dominant = counts[0]?.[0] ?? 'fixture_only';

  switch (dominant) {
    case 'reject': return 'reject_heavy';
    case 'watch_only': return 'watch_only_heavy';
    case 'analysis_only': return 'analysis_only_heavy';
    case 'insufficient_evidence': return 'insufficient_evidence';
    case 'fixture_only': return 'fixture_only';
    default: return 'fixture_only';
  }
}

/**
 * Builds evaluation findings from summaries.
 */
function buildEvaluationFindings(
  input: StrategyEvaluationInput,
  classification: StrategyEvaluationClassification,
  blockedGateCount: number,
  failedCount: number,
  inconclusiveCount: number,
): readonly StrategyEvaluationFinding[] {
  const findings: StrategyEvaluationFinding[] = [];

  if (failedCount > 0) {
    findings.push({
      severity: 'failure',
      code: 'FAILED_EVIDENCE_DETECTED',
      message: `${failedCount} intent${failedCount === 1 ? '' : 's'} with failed fixture evidence detected. Review required before progression.`,
      safeToDisplay: true,
    });
  }

  if (blockedGateCount > 0) {
    findings.push({
      severity: 'warning',
      code: 'BLOCKED_GATES_DETECTED',
      message: `${blockedGateCount} blocked safety gate${blockedGateCount === 1 ? '' : 's'} detected across intents. Fixture-only review.`,
      safeToDisplay: true,
    });
  }

  if (inconclusiveCount > 0) {
    findings.push({
      severity: 'inconclusive',
      code: 'INCONCLUSIVE_EVIDENCE_DETECTED',
      message: `${inconclusiveCount} intent${inconclusiveCount === 1 ? '' : 's'} with inconclusive fixture evidence. Insufficient data for classification.`,
      safeToDisplay: true,
    });
  }

  if (classification === 'reject_heavy') {
    findings.push({
      severity: 'failure',
      code: 'REJECT_HEAVY_CLASSIFICATION',
      message: 'Majority of intents are classified as reject. Fixture evidence shows critical issues.',
      safeToDisplay: true,
    });
  }

  if (input.intents.length === 1) {
    findings.push({
      severity: 'info',
      code: 'SINGLE_INTENT_EVALUATION',
      message: 'Evaluation is based on a single intent. Broader fixture coverage is recommended.',
      safeToDisplay: true,
    });
  }

  // Always add safety info findings
  findings.push({
    severity: 'info',
    code: 'ANALYSIS_ONLY',
    message: 'This StrategyEvaluation is analysis-only, fixture-only, and non-executable. No action is implied.',
    safeToDisplay: true,
  });

  findings.push({
    severity: 'info',
    code: 'NOT_A_REAL_EVALUATION',
    message: 'StrategyEvaluation does NOT create real trade intents, execution plans, or paper trades.',
    safeToDisplay: true,
  });

  return findings;
}

/**
 * Builds a StrategyEvaluation from a fixture-only StrategyEvaluationInput.
 *
 * Returns a typed SeResult containing the StrategyEvaluation or an error.
 * Does not throw for normal validation failures.
 */
export function buildStrategyEvaluation(input: StrategyEvaluationInput): SeResult<StrategyEvaluation> {
  if (input.fixtureOnly !== true) {
    return seErr('FIXTURE_ONLY_REQUIRED', 'Input fixtureOnly must be true');
  }
  if (input.liveData !== false) {
    return seErr('LIVE_DATA_FORBIDDEN', 'Input liveData must be false');
  }
  if (input.intents.length === 0) {
    return seErr('EMPTY_INTENTS', 'Input intents array must not be empty');
  }

  // Validate all intents carry correct safety flags
  for (let i = 0; i < input.intents.length; i++) {
    const intent = input.intents[i];
    if (!intent) continue;
    if (intent.fixtureOnly !== true) {
      return seErr('FIXTURE_ONLY_REQUIRED', `Intent at index ${i} must have fixtureOnly=true`);
    }
    if (intent.liveData !== false) {
      return seErr('LIVE_DATA_FORBIDDEN', `Intent at index ${i} must have liveData=false`);
    }
  }

  const scoreBandSummary = buildStrategyScoreBandSummary(input.intents);
  const evidenceDistribution = buildStrategyEvidenceDistribution(input.intents);
  const safetyGateSummary = buildStrategySafetyGateSummary(input.intents);
  const familyComparisons = compareStrategyFamilies(input.intents);

  const classification = deriveEvaluationClassification(evidenceDistribution.classificationCounts);
  const sourceKind = input.sourceKind ?? (input.intents.length === 1 ? 'fixture_single' : 'fixture_batch');
  const id = generateEvaluationId(sourceKind);

  const findings = buildEvaluationFindings(
    input,
    classification,
    safetyGateSummary.blocked,
    evidenceDistribution.failedCount,
    evidenceDistribution.inconclusiveCount,
  );

  const evaluation: StrategyEvaluation = {
    id,
    sourceKind,
    intentCount: input.intents.length,
    classification,
    scoreBandSummary,
    evidenceDistribution,
    safetyGateSummary,
    familyComparisons,
    findings,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  };

  return seOk(evaluation);
}
