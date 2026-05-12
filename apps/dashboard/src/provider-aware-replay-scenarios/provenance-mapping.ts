import type { ProviderReplayProvenanceMapping } from './types.js';

export function buildProviderReplayProvenanceMapping(input: {
  fixtureId: string;
  sourceProviderId: string;
  sourceFieldPath: string;
  targetScenarioFieldPath: string;
  sourceFixtureName: ProviderReplayProvenanceMapping['sourceFixtureName'];
  confidenceLabel: string;
}): ProviderReplayProvenanceMapping {
  return {
    provenanceMappingId: `${input.fixtureId}-provenance-${input.sourceProviderId}-${input.sourceFieldPath.replace(/[^a-z0-9]/gi, '-')}`,
    sourceProviderId: input.sourceProviderId,
    sourceFieldPath: input.sourceFieldPath,
    targetScenarioFieldPath: input.targetScenarioFieldPath,
    sourceFixtureName: input.sourceFixtureName,
    sourcePhase: 67,
    confidenceLabel: input.confidenceLabel,
    deterministicOnly: true,
  };
}
