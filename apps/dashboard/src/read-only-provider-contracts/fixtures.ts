/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: fixtures.
 */

import { buildReadOnlyProviderContractFixture } from './builders.js';
import {
  READ_ONLY_PROVIDER_CONTRACT_KINDS,
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  type ReadOnlyProviderContractFixture,
  type ReadOnlyProviderContractKind,
  type ReadOnlyProviderContractName,
} from './types.js';

export const READ_ONLY_PROVIDER_CONTRACT_FIXTURES =
  READ_ONLY_PROVIDER_CONTRACT_NAMES.map(fixtureName =>
    buildReadOnlyProviderContractFixture({ fixtureName }),
  ) satisfies readonly ReadOnlyProviderContractFixture[];

export const READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP: ReadonlyMap<
  string,
  ReadOnlyProviderContractFixture
> = new Map(
  READ_ONLY_PROVIDER_CONTRACT_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length < 8) {
  throw new Error(
    `Phase 54 fixture count mismatch: expected >= 8, received ${READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length}`,
  );
}

if (
  READ_ONLY_PROVIDER_CONTRACT_NAMES.length !==
  READ_ONLY_PROVIDER_CONTRACT_KINDS.length
) {
  throw new Error('Phase 54 provider contract name/kind cardinality mismatch');
}

export function listReadOnlyProviderContractFixtures(): readonly ReadOnlyProviderContractFixture[] {
  return READ_ONLY_PROVIDER_CONTRACT_FIXTURES;
}

export function getReadOnlyProviderContractFixture(
  fixtureId: string,
): ReadOnlyProviderContractFixture | null {
  return READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  READ_ONLY_PROVIDER_CONTRACT_KINDS,
};

export type { ReadOnlyProviderContractName, ReadOnlyProviderContractKind };
