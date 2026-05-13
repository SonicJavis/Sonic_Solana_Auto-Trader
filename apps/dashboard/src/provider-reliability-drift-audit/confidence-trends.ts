import type { ProviderConfidenceTrend } from './types.js';

export function buildProviderConfidenceTrend(input: {
  fixtureId: string;
  providerId: string;
  direction: ProviderConfidenceTrend['direction'];
  confidenceLabel: ProviderConfidenceTrend['confidenceLabel'];
  sampledTelemetryIds: readonly string[];
  sourceRefs: readonly string[];
}): ProviderConfidenceTrend {
  return {
    trendId: `${input.fixtureId}-confidence-trend`,
    providerId: input.providerId,
    direction: input.direction,
    confidenceLabel: input.confidenceLabel,
    sampledTelemetryIds: [...input.sampledTelemetryIds].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourceRefs: [...input.sourceRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}
