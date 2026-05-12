import { buildReadOnlySolanaProviderBoundaryFixture } from './builders.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  type ReadOnlySolanaProviderBoundaryFixture,
  type ReadOnlySolanaProviderBoundaryKind,
  type ReadOnlySolanaProviderBoundaryName,
} from './types.js';
import { validateReadOnlySolanaProviderBoundaryFixtureTable } from './validation.js';

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES =
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES.map(fixtureName =>
    buildReadOnlySolanaProviderBoundaryFixture({ fixtureName }),
  ) satisfies readonly ReadOnlySolanaProviderBoundaryFixture[];

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP: ReadonlyMap<
  string,
  ReadOnlySolanaProviderBoundaryFixture
> = new Map(
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES.length < 8) {
  throw new Error(
    `Phase 64 fixture count mismatch: expected >= 8, received ${READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES.length}`,
  );
}
if (READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES.length !== READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS.length) {
  throw new Error('Phase 64 boundary name/kind cardinality mismatch');
}
const tableValidation = validateReadOnlySolanaProviderBoundaryFixtureTable(
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 64 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listReadOnlySolanaProviderBoundaryFixtures(): readonly ReadOnlySolanaProviderBoundaryFixture[] {
  return READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES;
}

export function getReadOnlySolanaProviderBoundaryFixture(
  fixtureId: string,
): ReadOnlySolanaProviderBoundaryFixture | null {
  return READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
};
export type { ReadOnlySolanaProviderBoundaryName, ReadOnlySolanaProviderBoundaryKind };

