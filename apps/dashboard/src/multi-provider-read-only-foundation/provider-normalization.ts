import type { MultiProviderNormalizedRecord } from './types.js';

export function buildMultiProviderNormalizedRecord(input: {
  fixtureId: string;
  providerId: string;
  normalizedFields: readonly string[];
  missingFields: readonly string[];
  semanticCaveats: readonly string[];
  sourceFixtureRefs: MultiProviderNormalizedRecord['sourceFixtureRefs'];
}): MultiProviderNormalizedRecord {
  return {
    normalizedProviderRecordId: `${input.fixtureId}-normalized-${input.providerId}`,
    providerId: input.providerId,
    normalizedFields: input.normalizedFields,
    missingFields: input.missingFields,
    semanticCaveats: input.semanticCaveats,
    sourceFixtureRefs: input.sourceFixtureRefs,
  };
}
