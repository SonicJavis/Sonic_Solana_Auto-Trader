import type { SnapshotScenarioRiskLinkage } from './types.js';

export function buildSnapshotScenarioRiskLinkage(input: {
  fixtureId: string;
  riskStatus: SnapshotScenarioRiskLinkage['riskStatus'];
  riskReasonCodes: readonly string[];
  failClosed: boolean;
}): SnapshotScenarioRiskLinkage {
  return {
    riskLinkageId: `${input.fixtureId}-risk-linkage`,
    riskStatus: input.riskStatus,
    riskReasonCodes: [...input.riskReasonCodes],
    failClosed: input.failClosed,
  };
}
