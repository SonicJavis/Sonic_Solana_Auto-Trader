import type { LiveSnapshotMismatchTaxonomy } from './types.js';

export function buildLiveSnapshotMismatchTaxonomy(input: {
  mismatchTaxonomyId: string;
  mismatchCodes: readonly string[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  quarantined: boolean;
}): LiveSnapshotMismatchTaxonomy {
  return {
    mismatchId: input.mismatchTaxonomyId,
    mismatchKind: input.mismatchCodes[0] ?? 'NONE',
    sourceFieldPath: input.mismatchCodes[0] ? `$.${input.mismatchCodes[0]}` : '$.none',
    expectedValueLabel: 'expected_fixture_value',
    observedValueLabel: input.quarantined ? 'quarantined_observed_value' : 'observed_fixture_value',
    failClosed: true,
    mismatchTaxonomyId: input.mismatchTaxonomyId,
    mismatchCodes: input.mismatchCodes,
    severity: input.severity,
    quarantined: input.quarantined,
  };
}
