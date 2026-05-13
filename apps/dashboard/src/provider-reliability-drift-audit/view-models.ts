import type {
  ProviderReliabilityDriftAuditName,
  ProviderReliabilityScore,
  ProviderStaleDataAudit,
  ProviderDriftAudit,
  ProviderReliabilityViewModel,
} from './types.js';

export function buildProviderReliabilityViewModel(input: {
  fixtureId: string;
  fixtureName: ProviderReliabilityDriftAuditName;
  providerId: string;
  reliabilityScore: ProviderReliabilityScore;
  driftAudit: ProviderDriftAudit;
  staleDataAudit: ProviderStaleDataAudit;
}): ProviderReliabilityViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    providerId: input.providerId,
    scoreBand: input.reliabilityScore.scoreBand,
    confidenceLabel: input.reliabilityScore.confidenceLabel,
    driftSeverity: input.driftAudit.driftSeverity,
    stale: input.staleDataAudit.stale,
    summary: `${input.reliabilityScore.scoreBand}/${input.reliabilityScore.confidenceLabel}/${input.driftAudit.driftSeverity}`,
  };
}
