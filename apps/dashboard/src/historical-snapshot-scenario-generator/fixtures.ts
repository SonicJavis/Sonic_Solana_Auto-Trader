import { buildHistoricalSnapshotScenarioGeneratorFixture } from './builders.js';
import {
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES,
  type HistoricalSnapshotScenarioGeneratorFixture,
  type HistoricalSnapshotScenarioGeneratorKind,
  type HistoricalSnapshotScenarioGeneratorName,
} from './types.js';
import { validateHistoricalSnapshotScenarioGeneratorFixtureTable } from './validation.js';

export const HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES.map(fixtureName =>
  buildHistoricalSnapshotScenarioGeneratorFixture({ fixtureName }),
) satisfies readonly HistoricalSnapshotScenarioGeneratorFixture[];

export const HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURE_MAP: ReadonlyMap<string, HistoricalSnapshotScenarioGeneratorFixture> =
  new Map(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.length < 8) {
  throw new Error(
    `Phase 72 fixture count mismatch: expected >= 8, received ${HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.length}`,
  );
}
if (HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES.length !== HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS.length) {
  throw new Error('Phase 72 name/kind cardinality mismatch');
}

const tableValidation = validateHistoricalSnapshotScenarioGeneratorFixtureTable(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 72 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listHistoricalSnapshotScenarioGeneratorFixtures(): readonly HistoricalSnapshotScenarioGeneratorFixture[] {
  return HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES;
}

export function getHistoricalSnapshotScenarioGeneratorFixture(
  fixtureId: string,
): HistoricalSnapshotScenarioGeneratorFixture | null {
  return HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES, HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS };
export type { HistoricalSnapshotScenarioGeneratorName, HistoricalSnapshotScenarioGeneratorKind };
