import type { CrossProviderDataQualityName } from '../cross-provider-data-quality/types.js';
import type { ProviderReliabilityDriftAuditName } from '../provider-reliability-drift-audit/types.js';
import type { PreLiveRiskReadinessLinkage } from './types.js';

export function buildPreLiveRiskReadinessLinkage(input: {
  linkageId: string;
  sourcePhase70FixtureName: ProviderReliabilityDriftAuditName;
  sourcePhase67FixtureName: CrossProviderDataQualityName;
  linked: boolean;
  riskBand: 'low' | 'medium' | 'high';
  reasonCodes: readonly string[];
}): PreLiveRiskReadinessLinkage {
  return {
    linkageId: input.linkageId,
    sourcePhase70FixtureName: input.sourcePhase70FixtureName,
    sourcePhase67FixtureName: input.sourcePhase67FixtureName,
    linked: input.linked,
    riskBand: input.riskBand,
    reasonCodes: [...input.reasonCodes],
  };
}
