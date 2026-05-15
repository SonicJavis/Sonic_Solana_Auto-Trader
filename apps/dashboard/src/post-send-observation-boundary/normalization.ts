import {
  PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT,
  PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SCHEMA_VERSION,
  PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SOURCE,
  POST_SEND_OBSERVATION_BOUNDARY_KINDS,
  POST_SEND_OBSERVATION_BOUNDARY_NAMES,
  type PostSendObservationBoundaryFixture,
  type PostSendObservationBoundaryKind,
  type PostSendObservationBoundaryName,
} from './types.js';

export function stableDeterministicPostSendObservationBoundaryChecksum(content: string): string {
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
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}
`;
}

export function isValidPostSendObservationBoundaryName(value: unknown): value is PostSendObservationBoundaryName {
  return typeof value === 'string' && (POST_SEND_OBSERVATION_BOUNDARY_NAMES as readonly string[]).includes(value);
}

export function isValidPostSendObservationBoundaryKind(value: unknown): value is PostSendObservationBoundaryKind {
  return typeof value === 'string' && (POST_SEND_OBSERVATION_BOUNDARY_KINDS as readonly string[]).includes(value);
}

export function isValidPostSendObservationBoundaryGeneratedAt(
  value: unknown,
): value is typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT {
  return value === PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT;
}

export function isValidPostSendObservationBoundarySource(
  value: unknown,
): value is typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SOURCE {
  return value === PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SOURCE;
}

export function isValidPostSendObservationBoundarySchemaVersion(
  value: unknown,
): value is typeof PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SCHEMA_VERSION {
  return value === PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_SCHEMA_VERSION;
}

export function normalizePostSendObservationBoundaryFixture(
  fixture: PostSendObservationBoundaryFixture,
): PostSendObservationBoundaryFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as PostSendObservationBoundaryFixture;
}

export function serializePostSendObservationBoundaryFixture(
  fixture: PostSendObservationBoundaryFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function arePostSendObservationBoundaryFixturesEqual(
  a: PostSendObservationBoundaryFixture,
  b: PostSendObservationBoundaryFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
