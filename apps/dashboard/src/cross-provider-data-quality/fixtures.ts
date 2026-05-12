import { buildCrossProviderDataQualityFixture } from './builders.js';
import {
  CROSS_PROVIDER_DATA_QUALITY_KINDS,
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
  type CrossProviderDataQualityFixture,
  type CrossProviderDataQualityKind,
  type CrossProviderDataQualityName,
} from './types.js';
import { validateCrossProviderDataQualityFixtureTable } from './validation.js';

export const CROSS_PROVIDER_DATA_QUALITY_FIXTURES = CROSS_PROVIDER_DATA_QUALITY_NAMES.map(fixtureName =>
  buildCrossProviderDataQualityFixture({ fixtureName }),
) satisfies readonly CrossProviderDataQualityFixture[];

export const CROSS_PROVIDER_DATA_QUALITY_FIXTURE_MAP: ReadonlyMap<string, CrossProviderDataQualityFixture> =
  new Map(CROSS_PROVIDER_DATA_QUALITY_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (CROSS_PROVIDER_DATA_QUALITY_FIXTURES.length < 8) {
  throw new Error(
    `Phase 67 fixture count mismatch: expected >= 8, received ${CROSS_PROVIDER_DATA_QUALITY_FIXTURES.length}`,
  );
}
if (CROSS_PROVIDER_DATA_QUALITY_NAMES.length !== CROSS_PROVIDER_DATA_QUALITY_KINDS.length) {
  throw new Error('Phase 67 name/kind cardinality mismatch');
}

const tableValidation = validateCrossProviderDataQualityFixtureTable(CROSS_PROVIDER_DATA_QUALITY_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 67 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listCrossProviderDataQualityFixtures(): readonly CrossProviderDataQualityFixture[] {
  return CROSS_PROVIDER_DATA_QUALITY_FIXTURES;
}

export function getCrossProviderDataQualityFixture(fixtureId: string): CrossProviderDataQualityFixture | null {
  return CROSS_PROVIDER_DATA_QUALITY_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { CROSS_PROVIDER_DATA_QUALITY_NAMES, CROSS_PROVIDER_DATA_QUALITY_KINDS };
export type { CrossProviderDataQualityName, CrossProviderDataQualityKind };
