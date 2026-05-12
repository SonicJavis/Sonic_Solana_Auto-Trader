import type { FirstReadOnlyProviderCapabilities } from './types.js';

export function buildFirstReadOnlyProviderCapabilities(input: {
  fixtureId: string;
}): FirstReadOnlyProviderCapabilities {
  return {
    capabilitiesId: `${input.fixtureId}-provider-capabilities`,
    readOnlyAccountReadShapeSupported: true,
    deterministicFixtureMode: true,
    gateEnforced: true,
    boundaryConformanceEnforced: true,
    writeMethods: false,
    walletRequired: false,
    signingRequired: false,
    transactionSending: false,
    execution: false,
    recommendationsSignalsAdvice: false,
    liveSmokeByDefault: false,
  };
}
