import { buildLiveSmokeSafetyCertificationFixture } from './builders.js';
import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS,
  LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
  type LiveSmokeSafetyCertificationFixture,
  type LiveSmokeSafetyCertificationKind,
  type LiveSmokeSafetyCertificationName,
} from './types.js';
import { validateLiveSmokeSafetyCertificationFixtureTable } from './validation.js';

export const LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES = LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.map(fixtureName =>
  buildLiveSmokeSafetyCertificationFixture({ fixtureName }),
) satisfies readonly LiveSmokeSafetyCertificationFixture[];

export const LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURE_MAP: ReadonlyMap<string, LiveSmokeSafetyCertificationFixture> =
  new Map(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.length < 8) {
  throw new Error(
    `Phase 69 fixture count mismatch: expected >= 8, received ${LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.length}`,
  );
}
if (LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.length !== LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS.length) {
  throw new Error('Phase 69 name/kind cardinality mismatch');
}

const tableValidation = validateLiveSmokeSafetyCertificationFixtureTable(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 69 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listLiveSmokeSafetyCertificationFixtures(): readonly LiveSmokeSafetyCertificationFixture[] {
  return LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES;
}

export function getLiveSmokeSafetyCertificationFixture(
  fixtureId: string,
): LiveSmokeSafetyCertificationFixture | null {
  return LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES, LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS };
export type { LiveSmokeSafetyCertificationName, LiveSmokeSafetyCertificationKind };
