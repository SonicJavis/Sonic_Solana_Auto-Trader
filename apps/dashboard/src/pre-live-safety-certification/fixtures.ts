import { buildPreLiveSafetyCertificationFixture } from './builders.js';
import {
  PRE_LIVE_SAFETY_CERTIFICATION_KINDS,
  PRE_LIVE_SAFETY_CERTIFICATION_NAMES,
  type PreLiveSafetyCertificationFixture,
  type PreLiveSafetyCertificationKind,
  type PreLiveSafetyCertificationName,
} from './types.js';
import { validatePreLiveSafetyCertificationFixtureTable } from './validation.js';

export const PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES = PRE_LIVE_SAFETY_CERTIFICATION_NAMES.map(fixtureName =>
  buildPreLiveSafetyCertificationFixture({ fixtureName }),
) satisfies readonly PreLiveSafetyCertificationFixture[];

export const PRE_LIVE_SAFETY_CERTIFICATION_FIXTURE_MAP: ReadonlyMap<string, PreLiveSafetyCertificationFixture> = new Map(
  PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.length < 8) {
  throw new Error(
    `Phase 75 fixture count mismatch: expected >= 8, received ${PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.length}`,
  );
}
if (PRE_LIVE_SAFETY_CERTIFICATION_NAMES.length !== PRE_LIVE_SAFETY_CERTIFICATION_KINDS.length) {
  throw new Error('Phase 75 name/kind cardinality mismatch');
}

const tableValidation = validatePreLiveSafetyCertificationFixtureTable(PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 75 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listPreLiveSafetyCertificationFixtures(): readonly PreLiveSafetyCertificationFixture[] {
  return PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES;
}

export function getPreLiveSafetyCertificationFixture(
  fixtureId: string,
): PreLiveSafetyCertificationFixture | null {
  return PRE_LIVE_SAFETY_CERTIFICATION_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PRE_LIVE_SAFETY_CERTIFICATION_NAMES, PRE_LIVE_SAFETY_CERTIFICATION_KINDS };
export type { PreLiveSafetyCertificationName, PreLiveSafetyCertificationKind };
