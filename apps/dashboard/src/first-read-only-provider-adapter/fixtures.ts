import { buildFirstReadOnlyProviderAdapterFixture } from './builders.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
  type FirstReadOnlyProviderAdapterFixture,
  type FirstReadOnlyProviderAdapterKind,
  type FirstReadOnlyProviderAdapterName,
} from './types.js';
import { validateFirstReadOnlyProviderAdapterFixtureTable } from './validation.js';

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES =
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.map(fixtureName =>
    buildFirstReadOnlyProviderAdapterFixture({ fixtureName }),
  ) satisfies readonly FirstReadOnlyProviderAdapterFixture[];

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP: ReadonlyMap<
  string,
  FirstReadOnlyProviderAdapterFixture
> = new Map(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.length < 8) {
  throw new Error(
    `Phase 65 fixture count mismatch: expected >= 8, received ${FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.length}`,
  );
}
if (FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.length !== FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS.length) {
  throw new Error('Phase 65 adapter name/kind cardinality mismatch');
}

const tableValidation = validateFirstReadOnlyProviderAdapterFixtureTable(
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 65 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listFirstReadOnlyProviderAdapterFixtures(): readonly FirstReadOnlyProviderAdapterFixture[] {
  return FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES;
}

export function getFirstReadOnlyProviderAdapterFixture(
  fixtureId: string,
): FirstReadOnlyProviderAdapterFixture | null {
  return FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES, FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS };
export type { FirstReadOnlyProviderAdapterName, FirstReadOnlyProviderAdapterKind };
