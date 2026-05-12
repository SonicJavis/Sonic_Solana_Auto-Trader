import type { MultiProviderConformanceSummary, MultiProviderRegistry } from './types.js';

export function buildMultiProviderConformanceReport(input: {
  fixtureId: string;
  providerRegistry: MultiProviderRegistry;
  noUnsafeCapabilities: boolean;
  phase65AdapterLinkageValid: boolean;
  phase64BoundaryLinkageValid: boolean;
  phase63GateLinkageValid: boolean;
}): MultiProviderConformanceSummary {
  const providerIds = new Set(input.providerRegistry.providerEntries.map(entry => entry.providerId));
  const registryOrderValid = input.providerRegistry.defaultProviderOrder.every(providerId =>
    providerIds.has(providerId),
  );

  const summary = [
    input.phase65AdapterLinkageValid ? 'Phase 65 linkage valid' : 'Phase 65 linkage invalid',
    input.phase64BoundaryLinkageValid ? 'Phase 64 linkage valid' : 'Phase 64 linkage invalid',
    input.phase63GateLinkageValid ? 'Phase 63 linkage valid' : 'Phase 63 linkage invalid',
    registryOrderValid ? 'registry order valid' : 'registry order invalid',
    input.noUnsafeCapabilities ? 'unsafe capabilities blocked' : 'unsafe capabilities detected',
  ].join('; ');

  return {
    conformanceId: `${input.fixtureId}-conformance`,
    phase65AdapterLinkageValid: input.phase65AdapterLinkageValid,
    phase64BoundaryLinkageValid: input.phase64BoundaryLinkageValid,
    phase63GateLinkageValid: input.phase63GateLinkageValid,
    registryOrderValid,
    noUnsafeCapabilities: input.noUnsafeCapabilities,
    summary,
  };
}
