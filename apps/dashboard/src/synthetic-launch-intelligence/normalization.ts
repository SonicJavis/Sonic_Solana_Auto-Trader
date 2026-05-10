/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: normalization.
 */

import {
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
  type SyntheticLaunchIntelligenceFixture,
  type SyntheticLaunchIntelligenceScenarioKind,
  type SyntheticLaunchIntelligenceScenarioName,
} from './types.js';

export function stableDeterministicSyntheticLaunchIntelligenceChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidSyntheticLaunchIntelligenceScenarioName(
  value: unknown,
): value is SyntheticLaunchIntelligenceScenarioName {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES as readonly string[]).includes(value)
  );
}

export function isValidSyntheticLaunchIntelligenceScenarioKind(
  value: unknown,
): value is SyntheticLaunchIntelligenceScenarioKind {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS as readonly string[]).includes(value)
  );
}

export function isValidSyntheticLaunchIntelligenceGeneratedAt(value: unknown): boolean {
  return value === PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT;
}

export function isValidSyntheticLaunchIntelligenceSource(value: unknown): boolean {
  return value === PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE;
}

export function normalizeSyntheticLaunchIntelligenceFixture(
  fixture: SyntheticLaunchIntelligenceFixture,
): SyntheticLaunchIntelligenceFixture {
  return {
    ...fixture,
    launchEvents: [...fixture.launchEvents].sort((left, right) => left.eventOrder - right.eventOrder),
    poolLiquiditySnapshots: [...fixture.poolLiquiditySnapshots].sort((left, right) =>
      left.syntheticTimestamp.localeCompare(right.syntheticTimestamp),
    ),
    holderDistributionSnapshots: [...fixture.holderDistributionSnapshots].sort((left, right) =>
      left.syntheticTimestamp.localeCompare(right.syntheticTimestamp),
    ),
    walletClusterIndicators: [...fixture.walletClusterIndicators].sort((left, right) =>
      left.clusterId.localeCompare(right.clusterId),
    ),
    riskFactorSummaries: [...fixture.riskFactorSummaries].sort((left, right) =>
      left.riskFactorId.localeCompare(right.riskFactorId),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId),
    ),
  };
}

export function serializeSyntheticLaunchIntelligenceFixture(
  fixture: SyntheticLaunchIntelligenceFixture,
): string {
  return stablePrettyJsonStringify(normalizeSyntheticLaunchIntelligenceFixture(fixture));
}

export function areSyntheticLaunchIntelligenceFixturesEqual(
  left: SyntheticLaunchIntelligenceFixture,
  right: SyntheticLaunchIntelligenceFixture,
): boolean {
  return serializeSyntheticLaunchIntelligenceFixture(left) === serializeSyntheticLaunchIntelligenceFixture(right);
}
