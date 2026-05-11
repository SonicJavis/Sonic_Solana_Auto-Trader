/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: failure model.
 */

import type {
  BuildPaperSniperFailureModelInput,
  PaperSniperFailureBucket,
  PaperSniperFailureModel,
} from './types.js';

function deriveFailureBucket(
  riskBand: BuildPaperSniperFailureModelInput['riskBand'],
): PaperSniperFailureBucket {
  if (riskBand === 'low') return 'rare';
  if (riskBand === 'moderate') return 'possible';
  if (riskBand === 'elevated') return 'elevated';
  return 'critical';
}

export function buildPaperSniperFailureModel(
  input: BuildPaperSniperFailureModelInput,
): PaperSniperFailureModel {
  const failureBucket = deriveFailureBucket(input.riskBand);
  const staleQuoteProbability =
    failureBucket === 'rare' ? 0.04 : failureBucket === 'possible' ? 0.09 : failureBucket === 'elevated' ? 0.16 : 0.24;
  const routeMismatchProbability =
    failureBucket === 'rare' ? 0.03 : failureBucket === 'possible' ? 0.08 : failureBucket === 'elevated' ? 0.14 : 0.22;
  const liquidityFailureProbability =
    failureBucket === 'rare' ? 0.02 : failureBucket === 'possible' ? 0.06 : failureBucket === 'elevated' ? 0.15 : 0.28;
  const rejectedBySafetyProbability =
    input.riskBand === 'rejected'
      ? 0.85
      : input.riskBand === 'high'
        ? 0.22
        : input.riskBand === 'elevated'
          ? 0.12
          : 0.03;
  const aggregateFailureProbability = Math.min(
    0.99,
    staleQuoteProbability +
      routeMismatchProbability +
      liquidityFailureProbability +
      rejectedBySafetyProbability,
  );

  return {
    modelId: `phase60-failure-${input.fixtureId}`,
    failureBucket,
    staleQuoteProbability,
    routeMismatchProbability,
    liquidityFailureProbability,
    rejectedBySafetyProbability,
    aggregateFailureProbability,
    safetyNotes: [
      'Failure model is deterministic and simulated only.',
      'No executable submission path is available.',
    ],
  };
}
