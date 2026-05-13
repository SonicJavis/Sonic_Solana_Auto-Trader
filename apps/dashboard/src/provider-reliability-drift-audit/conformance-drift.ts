import type { ProviderConformanceDrift } from './types.js';

export function buildProviderConformanceDrift(input: {
  fixtureId: string;
  providerId: string;
  expectedContractId: string;
  observedContractId: string;
  driftSeverity: ProviderConformanceDrift['driftSeverity'];
  failClosed: boolean;
  reasonCodes: readonly string[];
}): ProviderConformanceDrift {
  return {
    conformanceDriftId: `${input.fixtureId}-conformance-drift`,
    providerId: input.providerId,
    expectedContractId: input.expectedContractId,
    observedContractId: input.observedContractId,
    driftSeverity: input.driftSeverity,
    failClosed: input.failClosed,
    reasonCodes: [...input.reasonCodes].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}
