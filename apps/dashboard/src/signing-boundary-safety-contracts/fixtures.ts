import { buildSigningBoundarySafetyFixture } from './builders.js';
import {
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES,
  type SigningBoundarySafetyContractKind,
  type SigningBoundarySafetyContractName,
  type SigningBoundarySafetyFixture,
} from './types.js';
import { validateSigningBoundarySafetyFixtureTable } from './validation.js';

export const SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES = SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES.map(fixtureName =>
  buildSigningBoundarySafetyFixture({ fixtureName }),
) satisfies readonly SigningBoundarySafetyFixture[];

export const SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURE_MAP: ReadonlyMap<string, SigningBoundarySafetyFixture> = new Map(
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.length < 8) {
  throw new Error(`Phase 83 fixture count mismatch: expected >= 8, received ${SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.length}`);
}
if (SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES.length !== SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS.length) {
  throw new Error('Phase 83 name/kind cardinality mismatch');
}

const tableValidation = validateSigningBoundarySafetyFixtureTable(SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 83 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listSigningBoundarySafetyFixtures(): readonly SigningBoundarySafetyFixture[] {
  return SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES;
}

export function getSigningBoundarySafetyFixture(fixtureId: string): SigningBoundarySafetyFixture | null {
  return SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES, SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS };
export type { SigningBoundarySafetyContractName, SigningBoundarySafetyContractKind };
