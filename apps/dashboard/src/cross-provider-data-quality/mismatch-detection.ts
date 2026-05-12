import type { DataQualitySeverity, ProviderMismatchCategory, ProviderMismatchReport } from './types.js';

export function buildProviderMismatchReport(input: {
  fixtureId: string;
  mismatchKind: ProviderMismatchCategory;
  providerIds: readonly string[];
  fieldPath: string;
  expectedShape: string;
  observedShapes: readonly string[];
  severity: DataQualitySeverity;
  confidenceImpact: number;
  sourceRefs: readonly string[];
}): ProviderMismatchReport {
  return {
    mismatchReportId: `${input.fixtureId}-${input.fieldPath.replace(/[^a-z0-9]/gi, '-')}-mismatch`,
    mismatchKind: input.mismatchKind,
    providerIds: [...input.providerIds],
    fieldPath: input.fieldPath,
    expectedShape: input.expectedShape,
    observedShapes: [...input.observedShapes],
    severity: input.severity,
    confidenceImpact: input.confidenceImpact,
    sourceRefs: [...input.sourceRefs],
  };
}
