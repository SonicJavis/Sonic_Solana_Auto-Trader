import type {
  FirstReadOnlyProviderTransportContract,
  FirstReadOnlyProviderTransportKind,
} from './types.js';

export function buildFirstReadOnlyProviderTransport(input: {
  fixtureId: string;
  transportKind: FirstReadOnlyProviderTransportKind;
}): FirstReadOnlyProviderTransportContract {
  return {
    transportId: `${input.fixtureId}-transport`,
    transportKind: input.transportKind,
    networkAccessDefault: false,
    sideEffectsAtImport: false,
    sideEffectsAtConstruction: false,
  };
}
