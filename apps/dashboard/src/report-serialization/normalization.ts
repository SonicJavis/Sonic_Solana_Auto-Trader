/**
 * apps/dashboard/src/report-serialization/normalization.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Normalization
 */

import type { DashboardReportSerializationPreview } from './types.js';

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return entries.reduce<Record<string, unknown>>((acc, [key, entry]) => {
      acc[key] = sortKeysDeep(entry);
      return acc;
    }, {});
  }
  return value;
}

export function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function stableDeterministicChecksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function normalizeDashboardReportSerializationPreview(
  preview: DashboardReportSerializationPreview,
): DashboardReportSerializationPreview {
  return {
    ...preview,
    meta: {
      ...preview.meta,
      notes: [...preview.meta.notes].sort(),
    },
    safeNotes: [...preview.safeNotes].sort(),
    sourceReportMeta: {
      ...preview.sourceReportMeta,
      sourceSnapshotNames: [...preview.sourceReportMeta.sourceSnapshotNames].sort(),
    },
    metadataPayload: preview.metadataPayload === null ? null : (sortKeysDeep(preview.metadataPayload) as Record<string, unknown>),
  };
}

export function serializeDashboardReportSerializationPreview(preview: DashboardReportSerializationPreview): Record<string, unknown> {
  return JSON.parse(JSON.stringify(preview)) as Record<string, unknown>;
}

export function isDashboardReportSerializationPreviewSerializable(preview: DashboardReportSerializationPreview): boolean {
  try {
    const serialized = JSON.stringify(preview);
    if (typeof serialized !== 'string') return false;
    JSON.parse(serialized);
    return true;
  } catch {
    return false;
  }
}

export function areDashboardReportSerializationPreviewsEqual(
  a: DashboardReportSerializationPreview,
  b: DashboardReportSerializationPreview,
): boolean {
  return (
    JSON.stringify(normalizeDashboardReportSerializationPreview(a)) === JSON.stringify(normalizeDashboardReportSerializationPreview(b))
  );
}
