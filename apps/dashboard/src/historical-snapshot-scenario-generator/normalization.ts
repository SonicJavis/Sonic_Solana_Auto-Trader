import {
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE,
  type HistoricalSnapshotScenarioGeneratorFixture,
  type HistoricalSnapshotScenarioGeneratorKind,
  type HistoricalSnapshotScenarioGeneratorName,
} from './types.js';

export function stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(content: string): string {
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

export function isValidHistoricalSnapshotScenarioGeneratorName(
  value: unknown,
): value is HistoricalSnapshotScenarioGeneratorName {
  return typeof value === 'string' && (HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES as readonly string[]).includes(value);
}

export function isValidHistoricalSnapshotScenarioGeneratorKind(
  value: unknown,
): value is HistoricalSnapshotScenarioGeneratorKind {
  return typeof value === 'string' && (HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS as readonly string[]).includes(value);
}

export function isValidHistoricalSnapshotScenarioGeneratorGeneratedAt(
  value: unknown,
): value is typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT {
  return value === PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT;
}

export function isValidHistoricalSnapshotScenarioGeneratorSource(
  value: unknown,
): value is typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE {
  return value === PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SOURCE;
}

export function isValidHistoricalSnapshotScenarioGeneratorSchemaVersion(
  value: unknown,
): value is typeof PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION {
  return value === PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_SCHEMA_VERSION;
}

export function normalizeHistoricalSnapshotScenarioGeneratorFixture(
  fixture: HistoricalSnapshotScenarioGeneratorFixture,
): HistoricalSnapshotScenarioGeneratorFixture {
  return {
    ...fixture,
    generationRules: [...fixture.generationRules].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourceSelection: {
      ...fixture.sourceSelection,
      selectedProviderIds: [...fixture.sourceSelection.selectedProviderIds],
      selectedSnapshotIds: [...fixture.sourceSelection.selectedSnapshotIds],
      selectedReliabilityRefs: [...fixture.sourceSelection.selectedReliabilityRefs],
      selectionWarnings: [...fixture.sourceSelection.selectionWarnings].sort((left, right) => left.localeCompare(right, 'en-US')),
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
    qualityLinkage: {
      ...fixture.qualityLinkage,
      qualityReasonCodes: [...fixture.qualityLinkage.qualityReasonCodes].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    riskLinkage: {
      ...fixture.riskLinkage,
      riskReasonCodes: [...fixture.riskLinkage.riskReasonCodes].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    sourcePhase65FixtureSnapshot: [...fixture.sourcePhase65FixtureSnapshot],
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot],
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot],
    sourcePhase68FixtureSnapshot: [...fixture.sourcePhase68FixtureSnapshot],
    sourcePhase70FixtureSnapshot: [...fixture.sourcePhase70FixtureSnapshot],
    sourcePhase71FixtureSnapshot: [...fixture.sourcePhase71FixtureSnapshot],
  };
}

export function serializeHistoricalSnapshotScenarioGeneratorFixture(
  fixture: HistoricalSnapshotScenarioGeneratorFixture,
): string {
  return stablePrettyJsonStringify(normalizeHistoricalSnapshotScenarioGeneratorFixture(fixture));
}

export function areHistoricalSnapshotScenarioGeneratorFixturesEqual(
  left: HistoricalSnapshotScenarioGeneratorFixture,
  right: HistoricalSnapshotScenarioGeneratorFixture,
): boolean {
  return (
    stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(serializeHistoricalSnapshotScenarioGeneratorFixture(left)) ===
    stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum(serializeHistoricalSnapshotScenarioGeneratorFixture(right))
  );
}
