import type { ProviderComparison, ProviderMismatchCategory } from './types.js';

export function buildProviderComparison(input: {
  fixtureId: string;
  comparisonKind: ProviderMismatchCategory | 'agreement';
  providerIds: readonly string[];
  comparedFieldPaths: readonly string[];
  agreements: readonly string[];
  mismatches: readonly string[];
  missingFields: readonly string[];
  staleFields: readonly string[];
  partialFields: readonly string[];
}): ProviderComparison {
  return {
    comparisonId: `${input.fixtureId}-comparison`,
    comparisonKind: input.comparisonKind,
    providerIds: [...input.providerIds],
    comparedFieldPaths: [...input.comparedFieldPaths],
    agreements: [...input.agreements],
    mismatches: [...input.mismatches],
    missingFields: [...input.missingFields],
    staleFields: [...input.staleFields],
    partialFields: [...input.partialFields],
    deterministicOnly: true,
  };
}
