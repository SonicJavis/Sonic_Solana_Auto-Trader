import type { SnapshotFreshnessContract } from './types.js';

export function buildSnapshotFreshnessContract(input: {
  fixtureId: string;
  snapshotAgeBucket: SnapshotFreshnessContract['snapshotAgeBucket'];
  stale: boolean;
  staleReasonCode: string;
  freshnessWindow: string;
  sourceTelemetryRefs: readonly string[];
}): SnapshotFreshnessContract {
  return {
    freshnessContractId: `${input.fixtureId}-freshness-contract`,
    snapshotAgeBucket: input.snapshotAgeBucket,
    stale: input.stale,
    staleReasonCode: input.staleReasonCode,
    freshnessWindow: input.freshnessWindow,
    sourceTelemetryRefs: [...input.sourceTelemetryRefs],
  };
}
