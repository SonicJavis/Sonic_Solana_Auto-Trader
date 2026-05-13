import { buildManualConfirmDryRunControlFixture } from './builders.js';
import {
  MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES,
  type ManualConfirmDryRunControlFixture,
  type ManualConfirmDryRunControlKind,
  type ManualConfirmDryRunControlName,
} from './types.js';
import { validateManualConfirmDryRunControlFixtureTable } from './validation.js';

export const MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES = MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES.map(fixtureName =>
  buildManualConfirmDryRunControlFixture({ fixtureName }),
) satisfies readonly ManualConfirmDryRunControlFixture[];

export const MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURE_MAP: ReadonlyMap<string, ManualConfirmDryRunControlFixture> = new Map(
  MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.length < 8) {
  throw new Error(`Phase 77 fixture count mismatch: expected >= 8, received ${MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.length}`);
}
if (MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES.length !== MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS.length) {
  throw new Error('Phase 77 name/kind cardinality mismatch');
}

const tableValidation = validateManualConfirmDryRunControlFixtureTable(MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 77 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listManualConfirmDryRunControlFixtures(): readonly ManualConfirmDryRunControlFixture[] {
  return MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES;
}

export function getManualConfirmDryRunControlFixture(
  fixtureId: string,
): ManualConfirmDryRunControlFixture | null {
  return MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES, MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS };
export type { ManualConfirmDryRunControlName, ManualConfirmDryRunControlKind };
