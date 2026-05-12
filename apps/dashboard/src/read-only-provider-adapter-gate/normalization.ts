import {
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  type ReadOnlyProviderAdapterGateFixture,
  type ReadOnlyProviderAdapterGateKind,
  type ReadOnlyProviderAdapterGateName,
  type ReadOnlyProviderGatePolicyKind,
  READ_ONLY_PROVIDER_GATE_POLICY_KINDS,
  type ReadOnlyProviderGateStateKind,
  READ_ONLY_PROVIDER_GATE_STATE_KINDS,
} from './types.js';

export function stableDeterministicReadOnlyProviderAdapterGateChecksum(content: string): string {
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

export function isValidReadOnlyProviderAdapterGateName(
  value: unknown,
): value is ReadOnlyProviderAdapterGateName {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterGateKind(
  value: unknown,
): value is ReadOnlyProviderAdapterGateKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterGatePolicyKind(
  value: unknown,
): value is ReadOnlyProviderGatePolicyKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_GATE_POLICY_KINDS as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterGateStateKind(
  value: unknown,
): value is ReadOnlyProviderGateStateKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_GATE_STATE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterGateGeneratedAt(
  value: unknown,
): value is typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT {
  return value === PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
}

export function isValidReadOnlyProviderAdapterGateSource(
  value: unknown,
): value is typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE {
  return value === PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
}

export function isValidReadOnlyProviderAdapterGateSchemaVersion(
  value: unknown,
): value is typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION {
  return value === PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION;
}

export function normalizeReadOnlyProviderAdapterGateFixture(
  fixture: ReadOnlyProviderAdapterGateFixture,
): ReadOnlyProviderAdapterGateFixture {
  return {
    ...fixture,
    gatePolicies: [...fixture.gatePolicies].sort((left, right) =>
      left.policyKind.localeCompare(right.policyKind, 'en-US'),
    ),
    capabilityChecks: [...fixture.capabilityChecks].sort((left, right) =>
      left.checkId.localeCompare(right.checkId, 'en-US'),
    ),
    compatibilityChecks: [...fixture.compatibilityChecks].sort((left, right) =>
      left.checkId.localeCompare(right.checkId, 'en-US'),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    resolutionResult: {
      ...fixture.resolutionResult,
      policyResults: [...fixture.resolutionResult.policyResults].sort((left, right) =>
        left.policyKind.localeCompare(right.policyKind, 'en-US'),
      ),
      rejectionReasons: [...fixture.resolutionResult.rejectionReasons].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
  };
}

export function serializeReadOnlyProviderAdapterGateFixture(
  fixture: ReadOnlyProviderAdapterGateFixture,
): string {
  return stablePrettyJsonStringify(normalizeReadOnlyProviderAdapterGateFixture(fixture));
}

export function areReadOnlyProviderAdapterGateFixturesEqual(
  left: ReadOnlyProviderAdapterGateFixture,
  right: ReadOnlyProviderAdapterGateFixture,
): boolean {
  return (
    stableDeterministicReadOnlyProviderAdapterGateChecksum(
      serializeReadOnlyProviderAdapterGateFixture(left),
    ) ===
    stableDeterministicReadOnlyProviderAdapterGateChecksum(
      serializeReadOnlyProviderAdapterGateFixture(right),
    )
  );
}
