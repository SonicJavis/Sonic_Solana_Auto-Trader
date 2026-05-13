import type {
  HistoricalSnapshotAuditReport,
  SnapshotFreshnessContract,
  SnapshotIntegrityContract,
  SnapshotManifest,
  SnapshotProvenanceContract,
  SnapshotReliabilityLinkage,
  SnapshotReplayLinkage,
  SnapshotSchemaContract,
  SnapshotValidationContract,
} from './types.js';

export function buildHistoricalSnapshotAuditReport(input: {
  fixtureId: string;
  manifest: SnapshotManifest;
  schemaContract: SnapshotSchemaContract;
  provenanceContract: SnapshotProvenanceContract;
  freshnessContract: SnapshotFreshnessContract;
  integrityContract: SnapshotIntegrityContract;
  validationContract: SnapshotValidationContract;
  replayLinkage: SnapshotReplayLinkage;
  reliabilityLinkage: SnapshotReliabilityLinkage;
}): HistoricalSnapshotAuditReport {
  return {
    reportId: `${input.fixtureId}-snapshot-audit-report`,
    manifestSummary: `${input.manifest.snapshotName} ${input.manifest.snapshotKind} ${input.manifest.capturedAt}`,
    schemaSummary: `schema=${input.schemaContract.expectedSchemaVersion} compatibility=${input.schemaContract.compatibilityLevel}`,
    provenanceSummary: `phases=${input.provenanceContract.sourcePhaseRefs.join(',')}`,
    freshnessSummary: `stale=${String(input.freshnessContract.stale)} reason=${input.freshnessContract.staleReasonCode}`,
    integritySummary: `${input.integrityContract.checksumAlgorithm}/${input.integrityContract.checksum}`,
    validationSummary: `rules=${input.validationContract.rules.length} failClosed=${String(input.validationContract.failClosed)}`,
    linkageSummary: `replay=${input.replayLinkage.parityStatus} reliability=${input.reliabilityLinkage.driftSeverity}`,
    safetySummary:
      'Historical snapshot ingestion contracts are fixture-only, read-only, deterministic, fail-closed, and non-advisory.',
  };
}
