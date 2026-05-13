import type {
  HistoricalSnapshotIngestionContractName,
  HistoricalSnapshotIngestionContractViewModel,
  SnapshotFreshnessContract,
  SnapshotManifest,
  SnapshotRejectionContract,
} from './types.js';

export function buildHistoricalSnapshotViewModel(input: {
  fixtureId: string;
  fixtureName: HistoricalSnapshotIngestionContractName;
  manifest: SnapshotManifest;
  freshnessContract: SnapshotFreshnessContract;
  rejectionContract: SnapshotRejectionContract;
}): HistoricalSnapshotIngestionContractViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    snapshotId: input.manifest.snapshotId,
    stale: input.freshnessContract.stale,
    rejected: input.rejectionContract.failClosed,
    summary: `${input.manifest.snapshotKind}/${input.freshnessContract.snapshotAgeBucket}/${input.rejectionContract.rejectionKind}`,
  };
}
