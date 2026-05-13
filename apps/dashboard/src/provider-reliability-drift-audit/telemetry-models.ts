import type { ProviderTelemetrySample } from './types.js';

export function buildProviderTelemetrySample(input: {
  fixtureId: string;
  providerId: string;
  providerName: string;
  sourcePhase: ProviderTelemetrySample['sourcePhase'];
  sampledAt: string;
  sampleKind: ProviderTelemetrySample['sampleKind'];
  observedStatus: ProviderTelemetrySample['observedStatus'];
  latencyBucket: ProviderTelemetrySample['latencyBucket'];
  freshnessBucket: ProviderTelemetrySample['freshnessBucket'];
  schemaVersion: ProviderTelemetrySample['schemaVersion'];
}): ProviderTelemetrySample {
  return {
    telemetryId: `${input.fixtureId}-telemetry`,
    providerId: input.providerId,
    providerName: input.providerName,
    sourcePhase: input.sourcePhase,
    sampledAt: input.sampledAt,
    sampleKind: input.sampleKind,
    observedStatus: input.observedStatus,
    latencyBucket: input.latencyBucket,
    freshnessBucket: input.freshnessBucket,
    schemaVersion: input.schemaVersion,
    fixtureOnly: true,
    liveData: false,
  };
}
