import {
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT,
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION,
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES,
  type ReadOnlyLiveSnapshotCaptureFixture,
  type ReadOnlyLiveSnapshotCaptureKind,
  type ReadOnlyLiveSnapshotCaptureName,
} from './types.js';

export function stableDeterministicReadOnlyLiveSnapshotCaptureChecksum(content: string): string {
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

export function isValidReadOnlyLiveSnapshotCaptureName(value: unknown): value is ReadOnlyLiveSnapshotCaptureName {
  return typeof value === 'string' && (READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES as readonly string[]).includes(value);
}

export function isValidReadOnlyLiveSnapshotCaptureKind(value: unknown): value is ReadOnlyLiveSnapshotCaptureKind {
  return typeof value === 'string' && (READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS as readonly string[]).includes(value);
}

export function isValidReadOnlyLiveSnapshotCaptureGeneratedAt(
  value: unknown,
): value is typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT {
  return value === PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT;
}

export function isValidReadOnlyLiveSnapshotCaptureSource(
  value: unknown,
): value is typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE {
  return value === PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE;
}

export function isValidReadOnlyLiveSnapshotCaptureSchemaVersion(
  value: unknown,
): value is typeof PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION {
  return value === PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION;
}

export function normalizeReadOnlyLiveSnapshotCaptureFixture(
  fixture: ReadOnlyLiveSnapshotCaptureFixture,
): ReadOnlyLiveSnapshotCaptureFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ReadOnlyLiveSnapshotCaptureFixture;
}

export function serializeReadOnlyLiveSnapshotCaptureFixture(fixture: ReadOnlyLiveSnapshotCaptureFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areReadOnlyLiveSnapshotCaptureFixturesEqual(
  a: ReadOnlyLiveSnapshotCaptureFixture,
  b: ReadOnlyLiveSnapshotCaptureFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
