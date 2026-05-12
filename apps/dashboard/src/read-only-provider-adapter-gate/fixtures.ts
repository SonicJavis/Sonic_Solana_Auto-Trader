import { buildReadOnlyProviderAdapterGateFixture } from './builders.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  type ReadOnlyProviderAdapterGateFixture,
  type ReadOnlyProviderAdapterGateKind,
  type ReadOnlyProviderAdapterGateName,
} from './types.js';
import { validateReadOnlyProviderAdapterGateFixtureTable } from './validation.js';

export const READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES =
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES.map(fixtureName =>
    buildReadOnlyProviderAdapterGateFixture({ fixtureName }),
  ) satisfies readonly ReadOnlyProviderAdapterGateFixture[];

export const READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP: ReadonlyMap<
  string,
  ReadOnlyProviderAdapterGateFixture
> = new Map(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 63 fixture count mismatch: expected >= 8, received ${READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.length}`,
  );
}

if (READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES.length !== READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS.length) {
  throw new Error('Phase 63 gate name/kind cardinality mismatch');
}

const tableValidation = validateReadOnlyProviderAdapterGateFixtureTable(
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 63 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listReadOnlyProviderAdapterGateFixtures(): readonly ReadOnlyProviderAdapterGateFixture[] {
  return READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES;
}

export function getReadOnlyProviderAdapterGateFixture(
  fixtureId: string,
): ReadOnlyProviderAdapterGateFixture | null {
  return READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
};

export type { ReadOnlyProviderAdapterGateName, ReadOnlyProviderAdapterGateKind };
