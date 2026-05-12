import type { ProviderCertificationGate } from './types.js';

export function buildProviderCertificationGate(input: {
  fixtureId: string;
  providerId: string;
  gateStatus: ProviderCertificationGate['gateStatus'];
  reasonCodes: readonly string[];
}): ProviderCertificationGate {
  return {
    gateId: `${input.fixtureId}-certification-gate`,
    providerId: input.providerId,
    gatePassed: input.gateStatus === 'passed',
    gateStatus: input.gateStatus,
    reasonCodes: [...input.reasonCodes],
  };
}
