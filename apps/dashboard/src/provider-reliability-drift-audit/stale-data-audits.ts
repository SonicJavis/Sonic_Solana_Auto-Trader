import type { ProviderStaleDataAudit } from './types.js';

export function buildProviderStaleDataAudit(input: {
  fixtureId: string;
  providerId: string;
  stale: boolean;
  staleReasonCode: string;
  observedAgeBucket: string;
  sourceFreshnessId: string;
  failClosed: boolean;
}): ProviderStaleDataAudit {
  return {
    staleAuditId: `${input.fixtureId}-stale-audit`,
    providerId: input.providerId,
    stale: input.stale,
    staleReasonCode: input.staleReasonCode,
    observedAgeBucket: input.observedAgeBucket,
    sourceFreshnessId: input.sourceFreshnessId,
    failClosed: input.failClosed,
  };
}
