import type {
  ProviderCertificationTelemetryLinkage,
  ProviderDriftAudit,
  ProviderFreshnessModel,
  ProviderReliabilityReport,
  ProviderReliabilityScore,
  ProviderTelemetrySample,
} from './types.js';

export function buildProviderReliabilityReport(input: {
  fixtureId: string;
  providerId: string;
  telemetrySample: ProviderTelemetrySample;
  freshnessModel: ProviderFreshnessModel;
  reliabilityScore: ProviderReliabilityScore;
  driftAudit: ProviderDriftAudit;
  certificationLinkage: ProviderCertificationTelemetryLinkage;
}): ProviderReliabilityReport {
  return {
    reportId: `${input.fixtureId}-reliability-report`,
    providerId: input.providerId,
    telemetrySummary: `${input.telemetrySample.sampleKind} ${input.telemetrySample.observedStatus} ${input.telemetrySample.freshnessBucket}`,
    freshnessSummary: `stale=${String(input.freshnessModel.stale)} reason=${input.freshnessModel.staleReasonCode}`,
    reliabilitySummary: `score=${input.reliabilityScore.score} band=${input.reliabilityScore.scoreBand} confidence=${input.reliabilityScore.confidenceLabel}`,
    driftSummary: `${input.driftAudit.driftKind} severity=${input.driftAudit.driftSeverity} failClosed=${String(input.driftAudit.failClosed)}`,
    certificationSummary: `status=${input.certificationLinkage.certificationStatus} telemetryCompatible=${String(input.certificationLinkage.telemetryCompatible)}`,
    safetySummary: 'Reliability telemetry is fixture-only, read-only, fail-closed, and non-advisory.',
  };
}
