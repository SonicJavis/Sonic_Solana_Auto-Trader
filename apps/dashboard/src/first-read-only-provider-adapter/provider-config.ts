import type { FirstReadOnlyProviderConfig, FirstReadOnlyProviderConfigState } from './types.js';

export function buildFirstReadOnlyProviderConfig(input: {
  fixtureId: string;
  mode: FirstReadOnlyProviderConfigState;
}): FirstReadOnlyProviderConfig {
  return {
    configId: `${input.fixtureId}-config`,
    mode: input.mode,
    disabledByDefault: true,
    offlineFixtureMode: true,
    liveSmokeEnabled: false,
    liveSmokeRequiresExplicitOptIn: true,
    networkAccessDefault: false,
    apiKeysRequiredByDefault: false,
    endpointRequiredByDefault: false,
    gateRequired: true,
    boundaryRequired: true,
  };
}
