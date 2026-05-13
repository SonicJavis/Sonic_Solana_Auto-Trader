import type { ProviderFreshnessModel } from './types.js';

export function buildProviderFreshnessModel(input: {
  fixtureId: string;
  providerId: string;
  stale: boolean;
  staleReasonCode: string;
  observedSlotLagBucket: string;
  observedAgeBucket: string;
  deterministicWindow: string;
  sourceRefs: readonly string[];
}): ProviderFreshnessModel {
  return {
    freshnessId: `${input.fixtureId}-freshness`,
    providerId: input.providerId,
    stale: input.stale,
    staleReasonCode: input.staleReasonCode,
    observedSlotLagBucket: input.observedSlotLagBucket,
    observedAgeBucket: input.observedAgeBucket,
    deterministicWindow: input.deterministicWindow,
    sourceRefs: [...input.sourceRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}
