import { buildSyntheticStrategyComparisonLabFixture } from './builders.js';
import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES,
  type SyntheticStrategyComparisonLabFixture,
  type SyntheticStrategyComparisonLabKind,
  type SyntheticStrategyComparisonLabName,
} from './types.js';

export const SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES =
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES.map(fixtureName =>
    buildSyntheticStrategyComparisonLabFixture({ fixtureName }),
  ) satisfies readonly SyntheticStrategyComparisonLabFixture[];

export const SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP: ReadonlyMap<
  string,
  SyntheticStrategyComparisonLabFixture
> = new Map(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES.length < 8) {
  throw new Error(
    `Phase 62 fixture count mismatch: expected >= 8, received ${SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES.length}`,
  );
}

if (SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES.length !== SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS.length) {
  throw new Error('Phase 62 comparison lab name/kind cardinality mismatch');
}

export function listSyntheticStrategyComparisonLabFixtures(): readonly SyntheticStrategyComparisonLabFixture[] {
  return SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES;
}

export function getSyntheticStrategyComparisonLabFixture(
  fixtureId: string,
): SyntheticStrategyComparisonLabFixture | null {
  return SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS,
};

export type {
  SyntheticStrategyComparisonLabName,
  SyntheticStrategyComparisonLabKind,
};
