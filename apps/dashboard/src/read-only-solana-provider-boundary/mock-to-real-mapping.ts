import type {
  ReadOnlySolanaFieldMappingRule,
  ReadOnlySolanaMockToRealMapping,
} from './types.js';
import type { ReadOnlyProviderAdapterMockName } from '../read-only-provider-adapter-mocks/types.js';
import type { ReadOnlyProviderContractName } from '../read-only-provider-contracts/types.js';

export function buildReadOnlySolanaMockToRealMapping(input: {
  fixtureId: string;
  sourceMockAdapterName: ReadOnlyProviderAdapterMockName;
  sourceProviderContractName: ReadOnlyProviderContractName;
  fieldMappings: readonly ReadOnlySolanaFieldMappingRule[];
}): ReadOnlySolanaMockToRealMapping {
  const unmappedRequiredFields = input.fieldMappings
    .filter(mapping => mapping.required && mapping.coverageStatus !== 'covered')
    .map(mapping => mapping.normalizedField);

  return {
    mappingModelId: `${input.fixtureId}-mock-to-real-mapping`,
    mappingModelKind: 'mock_to_real_boundary_mapping',
    sourceMockAdapterName: input.sourceMockAdapterName,
    sourceProviderContractName: input.sourceProviderContractName,
    fieldMappings: input.fieldMappings,
    mappingStatus: unmappedRequiredFields.length === 0 ? 'ready' : 'incomplete',
    unmappedRequiredFields,
  };
}
