import { buildMultiProviderReadOnlyFoundationFixture } from './builders.js';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
  type MultiProviderReadOnlyFoundationFixture,
  type MultiProviderReadOnlyFoundationKind,
  type MultiProviderReadOnlyFoundationName,
} from './types.js';
import { validateMultiProviderReadOnlyFoundationFixtureTable } from './validation.js';

export const MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES =
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.map(fixtureName =>
    buildMultiProviderReadOnlyFoundationFixture({ fixtureName }),
  ) satisfies readonly MultiProviderReadOnlyFoundationFixture[];

export const MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP: ReadonlyMap<
  string,
  MultiProviderReadOnlyFoundationFixture
> = new Map(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.length < 8) {
  throw new Error(
    `Phase 66 fixture count mismatch: expected >= 8, received ${MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.length}`,
  );
}
if (MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.length !== MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS.length) {
  throw new Error('Phase 66 name/kind cardinality mismatch');
}

const tableValidation = validateMultiProviderReadOnlyFoundationFixtureTable(
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 66 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listMultiProviderReadOnlyFoundationFixtures(): readonly MultiProviderReadOnlyFoundationFixture[] {
  return MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES;
}

export function getMultiProviderReadOnlyFoundationFixture(
  fixtureId: string,
): MultiProviderReadOnlyFoundationFixture | null {
  return MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES, MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS };
export type { MultiProviderReadOnlyFoundationName, MultiProviderReadOnlyFoundationKind };
