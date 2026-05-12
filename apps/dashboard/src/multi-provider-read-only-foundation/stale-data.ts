import type { MultiProviderStaleDataCheck } from './types.js';

export function buildStaleDataCheck(input: {
  fixtureId: string;
  providerId: string;
  observedAt: string;
  freshnessWindow: number;
  stale: boolean;
  staleReason: string;
}): MultiProviderStaleDataCheck {
  return {
    staleDataCheckId: `${input.fixtureId}-${input.providerId}-stale-data-check`,
    providerId: input.providerId,
    observedAt: input.observedAt,
    freshnessWindow: input.freshnessWindow,
    stale: input.stale,
    staleReason: input.staleReason,
    deterministicOnly: true,
  };
}
