import {
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES,
  type SyntheticStrategyComparisonLabFixture,
  type SyntheticStrategyComparisonLabKind,
  type SyntheticStrategyComparisonLabName,
} from './types.js';

export function stableDeterministicSyntheticStrategyComparisonLabChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, next]) => {
        acc[key] = sortKeysDeep(next);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidSyntheticStrategyComparisonLabName(
  value: unknown,
): value is SyntheticStrategyComparisonLabName {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES as readonly string[]).includes(value)
  );
}

export function isValidSyntheticStrategyComparisonLabKind(
  value: unknown,
): value is SyntheticStrategyComparisonLabKind {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS as readonly string[]).includes(value)
  );
}

export function isValidSyntheticStrategyComparisonLabGeneratedAt(
  value: unknown,
): value is typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT {
  return value === PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
}

export function isValidSyntheticStrategyComparisonLabSource(
  value: unknown,
): value is typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE {
  return value === PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
}

export function isValidSyntheticStrategyComparisonLabSchemaVersion(
  value: unknown,
): value is typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION {
  return value === PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION;
}

export function normalizeSyntheticStrategyComparisonLabFixture(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabFixture {
  return {
    ...fixture,
    strategyVariants: [...fixture.strategyVariants].sort((left, right) =>
      left.variantId.localeCompare(right.variantId, 'en-US'),
    ),
    scorecards: [...fixture.scorecards]
      .sort((left, right) => {
        if (left.scenarioId !== right.scenarioId) {
          return left.scenarioId.localeCompare(right.scenarioId, 'en-US');
        }
        return left.variantId.localeCompare(right.variantId, 'en-US');
      })
      .map(scorecard => ({
        ...scorecard,
        sensitivityWarnings: [...scorecard.sensitivityWarnings].sort((left, right) =>
          left.localeCompare(right, 'en-US'),
        ),
      })),
    comparisonRun: {
      ...fixture.comparisonRun,
      comparisonRows: [...fixture.comparisonRun.comparisonRows].sort((left, right) =>
        left.rowId.localeCompare(right.rowId, 'en-US'),
      ),
    },
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
  };
}

export function serializeSyntheticStrategyComparisonLabFixture(
  fixture: SyntheticStrategyComparisonLabFixture,
): string {
  return stablePrettyJsonStringify(normalizeSyntheticStrategyComparisonLabFixture(fixture));
}

export function areSyntheticStrategyComparisonLabFixturesEqual(
  left: SyntheticStrategyComparisonLabFixture,
  right: SyntheticStrategyComparisonLabFixture,
): boolean {
  return (
    stableDeterministicSyntheticStrategyComparisonLabChecksum(
      serializeSyntheticStrategyComparisonLabFixture(left),
    ) ===
    stableDeterministicSyntheticStrategyComparisonLabChecksum(
      serializeSyntheticStrategyComparisonLabFixture(right),
    )
  );
}
