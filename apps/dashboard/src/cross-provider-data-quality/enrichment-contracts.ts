import type { ReadOnlyProviderEnrichmentContract } from './types.js';

export function buildReadOnlyProviderEnrichmentContract(input: {
  fixtureId: string;
  enrichmentKind: ReadOnlyProviderEnrichmentContract['enrichmentKind'];
  sourceReconciliationId: string;
  enrichedFields: readonly string[];
  provenanceRefs: readonly string[];
  confidenceLabel: ReadOnlyProviderEnrichmentContract['confidenceLabel'];
}): ReadOnlyProviderEnrichmentContract {
  return {
    enrichmentContractId: `${input.fixtureId}-enrichment`,
    enrichmentKind: input.enrichmentKind,
    sourceReconciliationId: input.sourceReconciliationId,
    enrichedFields: [...input.enrichedFields],
    provenanceRefs: [...input.provenanceRefs],
    confidenceLabel: input.confidenceLabel,
    readOnly: true,
    fixtureOnly: true,
    liveData: false,
  };
}
