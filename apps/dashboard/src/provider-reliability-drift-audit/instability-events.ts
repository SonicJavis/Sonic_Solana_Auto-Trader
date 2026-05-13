import type { ProviderInstabilityEvent } from './types.js';

export function buildProviderInstabilityEvent(input: {
  fixtureId: string;
  providerId: string;
  eventKind: ProviderInstabilityEvent['eventKind'];
  severity: ProviderInstabilityEvent['severity'];
  observedAt: string;
  sourceTelemetryIds: readonly string[];
  reasonCode: string;
  safetyNotes: readonly string[];
}): ProviderInstabilityEvent {
  return {
    eventId: `${input.fixtureId}-instability-${input.eventKind}`,
    providerId: input.providerId,
    eventKind: input.eventKind,
    severity: input.severity,
    observedAt: input.observedAt,
    sourceTelemetryIds: [...input.sourceTelemetryIds].sort((left, right) => left.localeCompare(right, 'en-US')),
    reasonCode: input.reasonCode,
    safetyNotes: [...input.safetyNotes].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}
