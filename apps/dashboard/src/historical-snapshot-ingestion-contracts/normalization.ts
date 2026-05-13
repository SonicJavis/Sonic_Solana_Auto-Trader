import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE,
  type HistoricalSnapshotIngestionContractFixture,
  type HistoricalSnapshotIngestionContractKind,
  type HistoricalSnapshotIngestionContractName,
} from './types.js';

export function stableDeterministicHistoricalSnapshotIngestionContractChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, 'en-US'))
      .reduce<Record<string, unknown>>((accumulator, [key, nestedValue]) => {
        accumulator[key] = sortKeysDeep(nestedValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidHistoricalSnapshotIngestionContractName(
  value: unknown,
): value is HistoricalSnapshotIngestionContractName {
  return typeof value === 'string' && (HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES as readonly string[]).includes(value);
}

export function isValidHistoricalSnapshotIngestionContractKind(
  value: unknown,
): value is HistoricalSnapshotIngestionContractKind {
  return typeof value === 'string' && (HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS as readonly string[]).includes(value);
}

export function isValidHistoricalSnapshotIngestionContractGeneratedAt(
  value: unknown,
): value is typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT {
  return value === PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT;
}

export function isValidHistoricalSnapshotIngestionContractSource(
  value: unknown,
): value is typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE {
  return value === PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SOURCE;
}

export function isValidHistoricalSnapshotIngestionContractSchemaVersion(
  value: unknown,
): value is typeof PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION {
  return value === PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_SCHEMA_VERSION;
}

export function normalizeHistoricalSnapshotIngestionContractFixture(
  fixture: HistoricalSnapshotIngestionContractFixture,
): HistoricalSnapshotIngestionContractFixture {
  return {
    ...fixture,
    schemaContract: {
      ...fixture.schemaContract,
      requiredFields: [...fixture.schemaContract.requiredFields].sort((left, right) => left.localeCompare(right, 'en-US')),
      optionalFields: [...fixture.schemaContract.optionalFields].sort((left, right) => left.localeCompare(right, 'en-US')),
      criticalFields: [...fixture.schemaContract.criticalFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    provenanceContract: {
      ...fixture.provenanceContract,
      sourcePhaseRefs: [...fixture.provenanceContract.sourcePhaseRefs].sort((left, right) => left - right),
      sourceFixtureRefs: [...fixture.provenanceContract.sourceFixtureRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
      providerReliabilityRefs: [...fixture.provenanceContract.providerReliabilityRefs].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      replayScenarioRefs: [...fixture.provenanceContract.replayScenarioRefs].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      dataQualityRefs: [...fixture.provenanceContract.dataQualityRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    validationContract: {
      ...fixture.validationContract,
      rules: [...fixture.validationContract.rules].sort((left, right) => left.localeCompare(right, 'en-US')),
      rejectionReasons: [...fixture.validationContract.rejectionReasons].sort((left, right) => left.localeCompare(right, 'en-US')),
      criticalFailureReasons: [...fixture.validationContract.criticalFailureReasons].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      warningReasons: [...fixture.validationContract.warningReasons].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    sourcePhase65FixtureSnapshot: [...fixture.sourcePhase65FixtureSnapshot],
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot],
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot],
    sourcePhase68FixtureSnapshot: [...fixture.sourcePhase68FixtureSnapshot],
    sourcePhase69FixtureSnapshot: [...fixture.sourcePhase69FixtureSnapshot],
    sourcePhase70FixtureSnapshot: [...fixture.sourcePhase70FixtureSnapshot],
  };
}

export function serializeHistoricalSnapshotIngestionContractFixture(
  fixture: HistoricalSnapshotIngestionContractFixture,
): string {
  return stablePrettyJsonStringify(normalizeHistoricalSnapshotIngestionContractFixture(fixture));
}

export function areHistoricalSnapshotIngestionContractFixturesEqual(
  left: HistoricalSnapshotIngestionContractFixture,
  right: HistoricalSnapshotIngestionContractFixture,
): boolean {
  return (
    stableDeterministicHistoricalSnapshotIngestionContractChecksum(serializeHistoricalSnapshotIngestionContractFixture(left)) ===
    stableDeterministicHistoricalSnapshotIngestionContractChecksum(serializeHistoricalSnapshotIngestionContractFixture(right))
  );
}
