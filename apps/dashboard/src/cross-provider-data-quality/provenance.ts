import type { ProviderProvenanceRecord } from './types.js';

export function buildProviderProvenanceRecord(input: {
  fixtureId: string;
  sourceProviderId: string;
  sourceFixtureName: string;
  sourcePhase: number;
  fieldPath: string;
  sourceKind: ProviderProvenanceRecord['sourceKind'];
}): ProviderProvenanceRecord {
  return {
    provenanceId: `${input.fixtureId}-${input.sourceProviderId}-${input.fieldPath.replace(/[^a-z0-9]/gi, '-')}-provenance`,
    sourceProviderId: input.sourceProviderId,
    sourceFixtureName: input.sourceFixtureName,
    sourcePhase: input.sourcePhase,
    fieldPath: input.fieldPath,
    sourceKind: input.sourceKind,
    deterministicOnly: true,
  };
}
