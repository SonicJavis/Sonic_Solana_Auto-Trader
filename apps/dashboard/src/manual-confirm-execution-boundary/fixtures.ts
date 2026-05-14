import { buildManualConfirmExecutionBoundaryFixture } from './builders.js';
import {
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES,
  type ManualConfirmExecutionBoundaryFixture,
  type ManualConfirmExecutionBoundaryKind,
  type ManualConfirmExecutionBoundaryName,
} from './types.js';
import { validateManualConfirmExecutionBoundaryFixtureTable } from './validation.js';

export const MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES = MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES.map(fixtureName =>
  buildManualConfirmExecutionBoundaryFixture({ fixtureName }),
) satisfies readonly ManualConfirmExecutionBoundaryFixture[];

export const MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURE_MAP: ReadonlyMap<string, ManualConfirmExecutionBoundaryFixture> =
  new Map(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.length < 8) {
  throw new Error(
    `Phase 81 fixture count mismatch: expected >= 8, received ${MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.length}`,
  );
}
if (MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES.length !== MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS.length) {
  throw new Error('Phase 81 name/kind cardinality mismatch');
}

const tableValidation = validateManualConfirmExecutionBoundaryFixtureTable(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 81 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listManualConfirmExecutionBoundaryFixtures(): readonly ManualConfirmExecutionBoundaryFixture[] {
  return MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES;
}

export function getManualConfirmExecutionBoundaryFixture(fixtureId: string): ManualConfirmExecutionBoundaryFixture | null {
  return MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES, MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS };
export type { ManualConfirmExecutionBoundaryName, ManualConfirmExecutionBoundaryKind };
