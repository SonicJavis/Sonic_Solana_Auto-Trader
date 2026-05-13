import { buildProviderReliabilityDriftAuditFixture } from './builders.js';
import {
  PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES,
  type ProviderReliabilityDriftAuditFixture,
  type ProviderReliabilityDriftAuditKind,
  type ProviderReliabilityDriftAuditName,
} from './types.js';
import { validateProviderReliabilityDriftAuditFixtureTable } from './validation.js';

export const PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.map(fixtureName =>
  buildProviderReliabilityDriftAuditFixture({ fixtureName }),
) satisfies readonly ProviderReliabilityDriftAuditFixture[];

export const PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURE_MAP: ReadonlyMap<string, ProviderReliabilityDriftAuditFixture> =
  new Map(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.length < 8) {
  throw new Error(`Phase 70 fixture count mismatch: expected >= 8, received ${PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.length}`);
}
if (PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.length !== PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS.length) {
  throw new Error('Phase 70 name/kind cardinality mismatch');
}

const tableValidation = validateProviderReliabilityDriftAuditFixtureTable(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 70 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listProviderReliabilityDriftAuditFixtures(): readonly ProviderReliabilityDriftAuditFixture[] {
  return PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES;
}

export function getProviderReliabilityDriftAuditFixture(
  fixtureId: string,
): ProviderReliabilityDriftAuditFixture | null {
  return PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES, PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS };
export type { ProviderReliabilityDriftAuditName, ProviderReliabilityDriftAuditKind };
