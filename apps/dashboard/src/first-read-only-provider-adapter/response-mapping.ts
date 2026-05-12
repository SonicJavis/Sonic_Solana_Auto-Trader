import type { FirstReadOnlyProviderResponseMapping } from './types.js';

export function buildFirstReadOnlyProviderResponseMapping(input: {
  fixtureId: string;
  missingRequiredFields?: readonly string[];
}): FirstReadOnlyProviderResponseMapping {
  return {
    mappingId: `${input.fixtureId}-response-mapping`,
    requiredBoundaryFields: [
      'accountAddress',
      'mintAddress',
      'tokenMetadataRef',
      'authorityRef',
      'providerStatus',
    ],
    missingRequiredFields: input.missingRequiredFields ?? [],
    nullableFields: ['tokenMetadataRef', 'authorityRef'],
    semanticCaveat: 'Read-only adapter response mapping from frozen provider fixture shape only.',
    noLiveDataClaim: true,
    noWriteCapability: true,
  };
}
