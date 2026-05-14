import {
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE,
  type SigningBoundarySafetyContractKind,
  type SigningBoundarySafetyContractName,
  type SigningBoundarySafetyFixture,
} from './types.js';

export function stableDeterministicSigningBoundarySafetyChecksum(content: string): string {
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
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nested]) => {
        acc[key] = sortKeysDeep(nested);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidSigningBoundarySafetyName(value: unknown): value is SigningBoundarySafetyContractName {
  return typeof value === 'string' && (SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES as readonly string[]).includes(value);
}

export function isValidSigningBoundarySafetyKind(value: unknown): value is SigningBoundarySafetyContractKind {
  return typeof value === 'string' && (SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS as readonly string[]).includes(value);
}

export function isValidSigningBoundarySafetyGeneratedAt(
  value: unknown,
): value is typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT {
  return value === PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT;
}

export function isValidSigningBoundarySafetySource(value: unknown): value is typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE {
  return value === PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE;
}

export function isValidSigningBoundarySafetySchemaVersion(
  value: unknown,
): value is typeof PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION {
  return value === PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION;
}

export function normalizeSigningBoundarySafetyFixture(fixture: SigningBoundarySafetyFixture): SigningBoundarySafetyFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as SigningBoundarySafetyFixture;
}

export function serializeSigningBoundarySafetyFixture(fixture: SigningBoundarySafetyFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areSigningBoundarySafetyFixturesEqual(a: SigningBoundarySafetyFixture, b: SigningBoundarySafetyFixture): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
