import type { MultiProviderRegistry, MultiProviderRegistryEntry } from './types.js';

export function buildMultiProviderRegistry(input: {
  fixtureId: string;
  registryName: string;
  providerEntries: readonly MultiProviderRegistryEntry[];
  defaultProviderOrder: readonly string[];
}): MultiProviderRegistry {
  const disabledProviderEntries = input.providerEntries
    .filter(entry => !entry.enabledByDefault)
    .map(entry => entry.providerId)
    .sort((left, right) => left.localeCompare(right, 'en-US'));

  return {
    providerRegistryId: `${input.fixtureId}-provider-registry`,
    registryName: input.registryName,
    providerEntries: input.providerEntries,
    defaultProviderOrder: input.defaultProviderOrder,
    disabledProviderEntries,
    gateRequired: true,
    boundaryRequired: true,
    adapterRequired: true,
  };
}
