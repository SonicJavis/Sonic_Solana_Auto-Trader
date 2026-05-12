import type { MultiProviderHealthScore, MultiProviderHealthStatus } from './types.js';

export function buildProviderHealthScore(input: {
  fixtureId: string;
  providerId: string;
  status: MultiProviderHealthStatus;
  reasonCodes: readonly string[];
  staleDataImpact: number;
  gateImpact: number;
  conformanceImpact: number;
}): MultiProviderHealthScore {
  const baseScore =
    input.status === 'healthy' ? 100 : input.status === 'degraded' ? 75 : input.status === 'stale' ? 40 : 0;

  const penalties = Math.max(0, input.staleDataImpact + input.gateImpact + input.conformanceImpact);
  const score = Math.max(0, Math.min(100, baseScore - penalties));

  return {
    healthScoreId: `${input.fixtureId}-${input.providerId}-health-score`,
    providerId: input.providerId,
    status: input.status,
    score,
    reasonCodes: input.reasonCodes,
    staleDataImpact: input.staleDataImpact,
    gateImpact: input.gateImpact,
    conformanceImpact: input.conformanceImpact,
  };
}
