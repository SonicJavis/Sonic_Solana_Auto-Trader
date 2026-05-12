import { buildProviderAwareReplayScenarioFixture } from './builders.js';
import {
  PROVIDER_AWARE_REPLAY_SCENARIO_KINDS,
  PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
  type ProviderAwareReplayScenarioFixture,
  type ProviderAwareReplayScenarioKind,
  type ProviderAwareReplayScenarioName,
} from './types.js';
import { validateProviderAwareReplayScenarioFixtureTable } from './validation.js';

export const PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES = PROVIDER_AWARE_REPLAY_SCENARIO_NAMES.map(fixtureName =>
  buildProviderAwareReplayScenarioFixture({ fixtureName }),
) satisfies readonly ProviderAwareReplayScenarioFixture[];

export const PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURE_MAP: ReadonlyMap<string, ProviderAwareReplayScenarioFixture> =
  new Map(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.length < 8) {
  throw new Error(
    `Phase 68 fixture count mismatch: expected >= 8, received ${PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.length}`,
  );
}
if (PROVIDER_AWARE_REPLAY_SCENARIO_NAMES.length !== PROVIDER_AWARE_REPLAY_SCENARIO_KINDS.length) {
  throw new Error('Phase 68 name/kind cardinality mismatch');
}

const tableValidation = validateProviderAwareReplayScenarioFixtureTable(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 68 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listProviderAwareReplayScenarioFixtures(): readonly ProviderAwareReplayScenarioFixture[] {
  return PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES;
}

export function getProviderAwareReplayScenarioFixture(
  fixtureId: string,
): ProviderAwareReplayScenarioFixture | null {
  return PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES, PROVIDER_AWARE_REPLAY_SCENARIO_KINDS };
export type { ProviderAwareReplayScenarioName, ProviderAwareReplayScenarioKind };
