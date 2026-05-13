import { buildControlledLiveSmokeHarnessFixture } from './builders.js';
import {
  CONTROLLED_LIVE_SMOKE_HARNESS_KINDS,
  CONTROLLED_LIVE_SMOKE_HARNESS_NAMES,
  type ControlledLiveSmokeHarnessFixture,
  type ControlledLiveSmokeHarnessKind,
  type ControlledLiveSmokeHarnessName,
} from './types.js';
import { validateControlledLiveSmokeHarnessFixtureTable } from './validation.js';

export const CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES = CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.map(fixtureName =>
  buildControlledLiveSmokeHarnessFixture({ fixtureName }),
) satisfies readonly ControlledLiveSmokeHarnessFixture[];

export const CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURE_MAP: ReadonlyMap<string, ControlledLiveSmokeHarnessFixture> = new Map(
  CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 74 fixture count mismatch: expected >= 8, received ${CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.length}`,
  );
}
if (CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length !== CONTROLLED_LIVE_SMOKE_HARNESS_KINDS.length) {
  throw new Error('Phase 74 name/kind cardinality mismatch');
}

const tableValidation = validateControlledLiveSmokeHarnessFixtureTable(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 74 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listControlledLiveSmokeHarnessFixtures(): readonly ControlledLiveSmokeHarnessFixture[] {
  return CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES;
}

export function getControlledLiveSmokeHarnessFixture(
  fixtureId: string,
): ControlledLiveSmokeHarnessFixture | null {
  return CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES, CONTROLLED_LIVE_SMOKE_HARNESS_KINDS };
export type { ControlledLiveSmokeHarnessName, ControlledLiveSmokeHarnessKind };