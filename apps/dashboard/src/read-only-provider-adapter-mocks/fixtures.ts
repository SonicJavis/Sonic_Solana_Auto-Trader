/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: fixtures.
 */

import { buildReadOnlyProviderAdapterMockFixture } from './builders.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  type ReadOnlyProviderAdapterMockFixture,
  type ReadOnlyProviderAdapterMockKind,
  type ReadOnlyProviderAdapterMockName,
} from './types.js';

export const READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES =
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES.map(fixtureName =>
    buildReadOnlyProviderAdapterMockFixture({ fixtureName }),
  ) satisfies readonly ReadOnlyProviderAdapterMockFixture[];

export const READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP: ReadonlyMap<
  string,
  ReadOnlyProviderAdapterMockFixture
> = new Map(
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.length < 8) {
  throw new Error(
    `Phase 55 fixture count mismatch: expected >= 8, received ${READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.length}`,
  );
}

if (READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES.length !== READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS.length) {
  throw new Error('Phase 55 adapter mock name/kind cardinality mismatch');
}

export function listReadOnlyProviderAdapterMockFixtures(): readonly ReadOnlyProviderAdapterMockFixture[] {
  return READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES;
}

export function getReadOnlyProviderAdapterMockFixture(
  fixtureId: string,
): ReadOnlyProviderAdapterMockFixture | null {
  return READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS,
};

export type { ReadOnlyProviderAdapterMockName, ReadOnlyProviderAdapterMockKind };
