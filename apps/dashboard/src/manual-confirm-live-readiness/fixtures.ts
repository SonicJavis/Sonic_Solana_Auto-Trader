import { buildManualConfirmLiveReadinessFixture } from './builders.js';
import {
  MANUAL_CONFIRM_LIVE_READINESS_KINDS,
  MANUAL_CONFIRM_LIVE_READINESS_NAMES,
  type ManualConfirmLiveReadinessFixture,
  type ManualConfirmLiveReadinessKind,
  type ManualConfirmLiveReadinessName,
} from './types.js';
import { validateManualConfirmLiveReadinessFixtureTable } from './validation.js';

export const MANUAL_CONFIRM_LIVE_READINESS_FIXTURES = MANUAL_CONFIRM_LIVE_READINESS_NAMES.map(fixtureName =>
  buildManualConfirmLiveReadinessFixture({ fixtureName }),
) satisfies readonly ManualConfirmLiveReadinessFixture[];

export const MANUAL_CONFIRM_LIVE_READINESS_FIXTURE_MAP: ReadonlyMap<string, ManualConfirmLiveReadinessFixture> = new Map(
  MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 76 fixture count mismatch: expected >= 8, received ${MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length}`,
  );
}
if (MANUAL_CONFIRM_LIVE_READINESS_NAMES.length !== MANUAL_CONFIRM_LIVE_READINESS_KINDS.length) {
  throw new Error('Phase 76 name/kind cardinality mismatch');
}

const tableValidation = validateManualConfirmLiveReadinessFixtureTable(MANUAL_CONFIRM_LIVE_READINESS_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 76 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listManualConfirmLiveReadinessFixtures(): readonly ManualConfirmLiveReadinessFixture[] {
  return MANUAL_CONFIRM_LIVE_READINESS_FIXTURES;
}

export function getManualConfirmLiveReadinessFixture(
  fixtureId: string,
): ManualConfirmLiveReadinessFixture | null {
  return MANUAL_CONFIRM_LIVE_READINESS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { MANUAL_CONFIRM_LIVE_READINESS_NAMES, MANUAL_CONFIRM_LIVE_READINESS_KINDS };
export type { ManualConfirmLiveReadinessName, ManualConfirmLiveReadinessKind };
