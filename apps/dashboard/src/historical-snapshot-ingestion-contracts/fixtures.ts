import { buildHistoricalSnapshotIngestionContractFixture } from './builders.js';
import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES,
  type HistoricalSnapshotIngestionContractFixture,
  type HistoricalSnapshotIngestionContractKind,
  type HistoricalSnapshotIngestionContractName,
} from './types.js';
import { validateHistoricalSnapshotIngestionContractFixtureTable } from './validation.js';

export const HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES.map(fixtureName =>
  buildHistoricalSnapshotIngestionContractFixture({ fixtureName }),
) satisfies readonly HistoricalSnapshotIngestionContractFixture[];

export const HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURE_MAP: ReadonlyMap<string, HistoricalSnapshotIngestionContractFixture> =
  new Map(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.length < 8) {
  throw new Error(
    `Phase 71 fixture count mismatch: expected >= 8, received ${HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.length}`,
  );
}
if (HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES.length !== HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS.length) {
  throw new Error('Phase 71 name/kind cardinality mismatch');
}

const tableValidation = validateHistoricalSnapshotIngestionContractFixtureTable(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 71 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listHistoricalSnapshotIngestionContractFixtures(): readonly HistoricalSnapshotIngestionContractFixture[] {
  return HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES;
}

export function getHistoricalSnapshotIngestionContractFixture(
  fixtureId: string,
): HistoricalSnapshotIngestionContractFixture | null {
  return HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES, HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS };
export type { HistoricalSnapshotIngestionContractName, HistoricalSnapshotIngestionContractKind };
