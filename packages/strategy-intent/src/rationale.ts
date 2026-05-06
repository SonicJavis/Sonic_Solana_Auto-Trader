/**
 * packages/strategy-intent/src/rationale.ts
 *
 * Phase 15 — Strategy intent rationale builder.
 *
 * Produces a safe, non-actionable rationale for human review.
 * No output contains trading recommendations or actionable decisions.
 */

import type {
  StrategyIntentRationale,
  StrategyIntentInput,
  StrategyFamily,
  StrategyEvidenceQuality,
  StrategyIntentClassification,
} from './types.js';

const SAFE_TO_DISPLAY = true as const;
const ANALYSIS_ONLY = true as const;
const NON_EXECUTABLE = true as const;

const FAMILY_DESCRIPTIONS: Record<string, string> = {
  defensive_new_launch_filter:
    'Defensive new-launch filter: fixture evidence shows low risk signals and adequate confidence for review.',
  creator_leaderboard_review:
    'Creator leaderboard review: degraded creator risk flags present in fixture evidence.',
  wallet_cluster_review:
    'Wallet cluster review: degraded wallet cluster risk signals detected in fixture evidence.',
  manipulation_avoidance_review:
    'Manipulation avoidance review: failed or critical risk signals detected in fixture evidence.',
  replay_regression_review:
    'Replay regression review: score or verdict change detected between baseline and candidate fixture runs.',
  insufficient_evidence_review:
    'Insufficient evidence review: fixture data is missing, inconclusive, or below threshold for classification.',
  fixture_only_review:
    'Fixture-only review: synthetic fixture evidence with no specific risk pattern identified.',
};

const QUALITY_NOTES: Record<string, string> = {
  strong_fixture_evidence: 'Fixture evidence confidence is strong and risk score is within acceptable bounds.',
  moderate_fixture_evidence: 'Fixture evidence confidence is moderate. Further fixture runs may improve quality.',
  weak_fixture_evidence: 'Fixture evidence is weak. Low confidence or missing data. Additional fixture coverage needed.',
  degraded_fixture_evidence: 'Fixture evidence is degraded. Elevated risk flags observed in fixture data.',
  failed_fixture_evidence: 'Fixture evidence has failed verdict. This scenario does not pass analysis gates.',
  inconclusive_fixture_evidence: 'Fixture evidence is inconclusive. Insufficient data to determine quality.',
};

/**
 * Builds a non-actionable StrategyIntentRationale for human review.
 *
 * All output is safe to display and contains no trading recommendations.
 */
export function buildStrategyIntentRationale(
  input: StrategyIntentInput,
  family: StrategyFamily,
  quality: StrategyEvidenceQuality,
  classification: StrategyIntentClassification,
): StrategyIntentRationale {
  const summary = buildSummary(family, quality, classification);
  const evidenceNotes = buildEvidenceNotes(input, quality);
  const safetyNotes = buildSafetyNotes();
  const limitationNotes = buildLimitationNotes(family, quality);
  const reviewNotes = buildReviewNotes(classification);

  return {
    summary,
    evidenceNotes,
    safetyNotes,
    limitationNotes,
    reviewNotes,
    safeToDisplay: SAFE_TO_DISPLAY,
    analysisOnly: ANALYSIS_ONLY,
    nonExecutable: NON_EXECUTABLE,
  };
}

function buildSummary(
  family: StrategyFamily,
  quality: StrategyEvidenceQuality,
  classification: StrategyIntentClassification,
): string {
  const familyDesc = FAMILY_DESCRIPTIONS[family] ?? `Strategy family: ${family}.`;
  const qualityDesc = QUALITY_NOTES[quality] ?? `Evidence quality: ${quality}.`;
  const classDesc = classificationDescription(classification);
  return `${familyDesc} ${qualityDesc} Classification: ${classDesc}`;
}

function classificationDescription(c: StrategyIntentClassification): string {
  switch (c) {
    case 'reject':
      return 'reject — fixture evidence shows critical issues.';
    case 'watch_only':
      return 'watch_only — fixture evidence is degraded; review-only, not actionable.';
    case 'analysis_only':
      return 'analysis_only — fixture evidence reviewed; no action implied.';
    case 'insufficient_evidence':
      return 'insufficient_evidence — fixture data is missing or inconclusive.';
    case 'fixture_only':
      return 'fixture_only — synthetic fixture review only; no real data used.';
  }
}

function buildEvidenceNotes(input: StrategyIntentInput, quality: StrategyEvidenceQuality): string[] {
  const notes: string[] = [];
  notes.push(`Source kind: ${input.sourceKind}.`);
  notes.push(`Source ID: ${input.sourceId}.`);
  if (input.finalVerdict) notes.push(`Final verdict from fixture: ${input.finalVerdict}.`);
  if (input.finalRiskScore !== undefined) notes.push(`Final risk score: ${input.finalRiskScore.toFixed(3)}.`);
  if (input.averageConfidence !== undefined) notes.push(`Average confidence: ${input.averageConfidence.toFixed(3)}.`);
  if (input.warningCount !== undefined && input.warningCount > 0) notes.push(`Warning count: ${input.warningCount}.`);
  if (input.failureCount !== undefined && input.failureCount > 0) notes.push(`Failure count: ${input.failureCount}.`);
  if (input.degradedCount !== undefined && input.degradedCount > 0) notes.push(`Degraded count: ${input.degradedCount}.`);
  if (input.inconclusiveCount !== undefined && input.inconclusiveCount > 0) notes.push(`Inconclusive count: ${input.inconclusiveCount}.`);
  if (input.regression === true) notes.push('Regression detected in comparison fixture data.');
  if (input.verdictChanged === true) notes.push('Verdict changed between baseline and candidate fixture runs.');
  if (input.scoreDelta !== undefined && Math.abs(input.scoreDelta) > 0) notes.push(`Score delta: ${input.scoreDelta.toFixed(3)}.`);
  const qualityNote = QUALITY_NOTES[quality];
  if (qualityNote) notes.push(qualityNote);
  return notes;
}

function buildSafetyNotes(): string[] {
  return [
    'This StrategyIntent is fixture-only, analysis-only, and non-executable.',
    'It does not recommend or enable any trading action.',
    'It does not create real trade intents or execution plans.',
    'It does not use live data, providers, wallets, or Solana RPC.',
    'All safety gates confirm no execution capability is present.',
    'This output is safe to display for human review only.',
  ];
}

function buildLimitationNotes(family: StrategyFamily, quality: StrategyEvidenceQuality): string[] {
  const notes: string[] = [];
  notes.push('All fixture data is synthetic. No real market conditions are modeled.');
  notes.push('Fixture evidence may not reflect current or future real-world conditions.');
  if (quality === 'weak_fixture_evidence' || quality === 'inconclusive_fixture_evidence') {
    notes.push('Insufficient fixture coverage limits the reliability of this analysis.');
  }
  if (family === 'manipulation_avoidance_review') {
    notes.push('Manipulation signals in fixtures are synthetic and not based on live chain data.');
  }
  if (family === 'replay_regression_review') {
    notes.push('Regression is detected between fixture baseline and candidate runs only.');
  }
  notes.push('No progression beyond fixture-only review is implied by this output.');
  return notes;
}

function buildReviewNotes(classification: StrategyIntentClassification): string[] {
  const notes: string[] = [];
  notes.push(`This StrategyIntent is classified as: ${classification}.`);
  notes.push('This classification is for human review only and is not actionable.');
  switch (classification) {
    case 'reject':
      notes.push('Rejected scenarios should not be progressed until fixture evidence improves substantially.');
      break;
    case 'watch_only':
      notes.push('Watch-only scenarios require additional fixture evidence before any human review decision.');
      break;
    case 'analysis_only':
      notes.push('Analysis-only scenarios have passed basic fixture review. No action is implied.');
      break;
    case 'insufficient_evidence':
      notes.push('Insufficient evidence scenarios need more fixture coverage before classification is reliable.');
      break;
    case 'fixture_only':
      notes.push('Fixture-only scenarios are synthetic review outputs. No real data was used.');
      break;
  }
  return notes;
}
