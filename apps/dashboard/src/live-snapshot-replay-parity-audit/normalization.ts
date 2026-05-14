import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE,
  type LiveSnapshotReplayParityAuditFixture,
  type LiveSnapshotReplayParityAuditKind,
  type LiveSnapshotReplayParityAuditName,
} from './types.js';

export function stableDeterministicLiveSnapshotReplayParityAuditChecksum(content: string): string {
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

export function isValidLiveSnapshotReplayParityAuditName(value: unknown): value is LiveSnapshotReplayParityAuditName {
  return typeof value === 'string' && (LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES as readonly string[]).includes(value);
}

export function isValidLiveSnapshotReplayParityAuditKind(value: unknown): value is LiveSnapshotReplayParityAuditKind {
  return typeof value === 'string' && (LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS as readonly string[]).includes(value);
}

export function isValidLiveSnapshotReplayParityAuditGeneratedAt(
  value: unknown,
): value is typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT {
  return value === PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT;
}

export function isValidLiveSnapshotReplayParityAuditSource(
  value: unknown,
): value is typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE {
  return value === PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE;
}

export function isValidLiveSnapshotReplayParityAuditSchemaVersion(
  value: unknown,
): value is typeof PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION {
  return value === PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION;
}

export function normalizeLiveSnapshotReplayParityAuditFixture(
  fixture: LiveSnapshotReplayParityAuditFixture,
): LiveSnapshotReplayParityAuditFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as LiveSnapshotReplayParityAuditFixture;
}

export function serializeLiveSnapshotReplayParityAuditFixture(fixture: LiveSnapshotReplayParityAuditFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areLiveSnapshotReplayParityAuditFixturesEqual(
  a: LiveSnapshotReplayParityAuditFixture,
  b: LiveSnapshotReplayParityAuditFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
