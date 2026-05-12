import {
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE,
  PROVIDER_AWARE_REPLAY_SCENARIO_KINDS,
  PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
  type ProviderAwareReplayScenarioFixture,
  type ProviderAwareReplayScenarioKind,
  type ProviderAwareReplayScenarioName,
} from './types.js';

export function stableDeterministicProviderAwareReplayScenarioChecksum(content: string): string {
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
      .reduce<Record<string, unknown>>((accumulator, [key, nestedValue]) => {
        accumulator[key] = sortKeysDeep(nestedValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidProviderAwareReplayScenarioName(value: unknown): value is ProviderAwareReplayScenarioName {
  return typeof value === 'string' && (PROVIDER_AWARE_REPLAY_SCENARIO_NAMES as readonly string[]).includes(value);
}

export function isValidProviderAwareReplayScenarioKind(value: unknown): value is ProviderAwareReplayScenarioKind {
  return typeof value === 'string' && (PROVIDER_AWARE_REPLAY_SCENARIO_KINDS as readonly string[]).includes(value);
}

export function isValidProviderAwareReplayScenarioGeneratedAt(
  value: unknown,
): value is typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT {
  return value === PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT;
}

export function isValidProviderAwareReplayScenarioSource(
  value: unknown,
): value is typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE {
  return value === PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SOURCE;
}

export function isValidProviderAwareReplayScenarioSchemaVersion(
  value: unknown,
): value is typeof PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION {
  return value === PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_SCHEMA_VERSION;
}

export function normalizeProviderAwareReplayScenarioFixture(
  fixture: ProviderAwareReplayScenarioFixture,
): ProviderAwareReplayScenarioFixture {
  return {
    ...fixture,
    provenanceMappings: [...fixture.provenanceMappings].sort((left, right) =>
      left.provenanceMappingId.localeCompare(right.provenanceMappingId, 'en-US'),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
    sourcePhase57ReplayFixtureSnapshot: [...fixture.sourcePhase57ReplayFixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
    sourcePhase56LifecycleFixtureSnapshot: [...fixture.sourcePhase56LifecycleFixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
  };
}

export function serializeProviderAwareReplayScenarioFixture(fixture: ProviderAwareReplayScenarioFixture): string {
  return stablePrettyJsonStringify(normalizeProviderAwareReplayScenarioFixture(fixture));
}

export function areProviderAwareReplayScenarioFixturesEqual(
  left: ProviderAwareReplayScenarioFixture,
  right: ProviderAwareReplayScenarioFixture,
): boolean {
  return (
    stableDeterministicProviderAwareReplayScenarioChecksum(serializeProviderAwareReplayScenarioFixture(left)) ===
    stableDeterministicProviderAwareReplayScenarioChecksum(serializeProviderAwareReplayScenarioFixture(right))
  );
}
