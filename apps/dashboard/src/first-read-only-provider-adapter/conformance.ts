import type { FirstReadOnlyProviderConformanceCheck } from './types.js';

export function buildFirstReadOnlyProviderConformanceCheck(input: {
  fixtureId: string;
  mappingComplete: boolean;
  gateOpen: boolean;
}): FirstReadOnlyProviderConformanceCheck {
  return {
    conformanceId: `${input.fixtureId}-conformance`,
    adapterToPhase64BoundaryConformance: input.mappingComplete,
    adapterToPhase63GateConformance: input.gateOpen,
    offlineFixtureTransportConformance: true,
    liveSmokeDisabledConformance: true,
    writeCapabilityAbsence: true,
    walletSigningSendingAbsence: true,
  };
}
