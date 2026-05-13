import type { ProviderReliabilityScore } from './types.js';

export function buildProviderReliabilityScore(input: {
  fixtureId: string;
  providerId: string;
  score: number;
  scoreBand: ProviderReliabilityScore['scoreBand'];
  confidenceLabel: ProviderReliabilityScore['confidenceLabel'];
  reasonCodes: readonly string[];
  evidenceRefs: readonly string[];
  failClosed: boolean;
}): ProviderReliabilityScore {
  return {
    scoreId: `${input.fixtureId}-reliability-score`,
    providerId: input.providerId,
    score: Math.max(0, Math.min(100, Math.round(input.score))),
    scoreBand: input.scoreBand,
    confidenceLabel: input.confidenceLabel,
    reasonCodes: [...input.reasonCodes].sort((left, right) => left.localeCompare(right, 'en-US')),
    evidenceRefs: [...input.evidenceRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
    failClosed: input.failClosed,
  };
}
