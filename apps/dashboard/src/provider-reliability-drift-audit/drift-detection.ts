import type { ProviderDriftAudit } from './types.js';

export function buildProviderDriftAudit(input: {
  fixtureId: string;
  providerId: string;
  driftKind: ProviderDriftAudit['driftKind'];
  driftSeverity: ProviderDriftAudit['driftSeverity'];
  expectedShapeId: string;
  observedShapeId: string;
  mismatchFields: readonly string[];
  conformanceStatus: ProviderDriftAudit['conformanceStatus'];
  failClosed: boolean;
}): ProviderDriftAudit {
  return {
    auditId: `${input.fixtureId}-drift-audit`,
    providerId: input.providerId,
    driftKind: input.driftKind,
    driftSeverity: input.driftSeverity,
    expectedShapeId: input.expectedShapeId,
    observedShapeId: input.observedShapeId,
    mismatchFields: [...input.mismatchFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    conformanceStatus: input.conformanceStatus,
    failClosed: input.failClosed,
  };
}
