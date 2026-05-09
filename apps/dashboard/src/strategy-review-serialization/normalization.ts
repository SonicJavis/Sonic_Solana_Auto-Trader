/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: normalization.
 *
 * Pure, side-effect-free normalization helpers. No mutation, no timers,
 * no randomness, no network, no filesystem, no persistence.
 */

import type {
  StrategyReviewSerializationPreviewFixture,
  StrategyReviewSerializationPreviewFixtureKind,
  StrategyReviewSerializationPreviewFixtureName,
  StrategyReviewSerializationPreviewFormat,
} from './types.js';
import {
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS,
} from './types.js';

// ─── Key sorting ──────────────────────────────────────────────────────────────

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return entries.reduce<Record<string, unknown>>((acc, [key, entry]) => {
      acc[key] = sortKeysDeep(entry);
      return acc;
    }, {});
  }
  return value;
}

// ─── Stable JSON ─────────────────────────────────────────────────────────────

export function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

// ─── Deterministic checksum ───────────────────────────────────────────────────

export function stableDeterministicChecksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

// ─── Guards ───────────────────────────────────────────────────────────────────

export function isValidStrategyReviewSerializationPreviewFixtureName(
  value: unknown,
): value is StrategyReviewSerializationPreviewFixtureName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewSerializationPreviewFixtureKind(
  value: unknown,
): value is StrategyReviewSerializationPreviewFixtureKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewSerializationPreviewFormat(
  value: unknown,
): value is StrategyReviewSerializationPreviewFormat {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewSerializationGeneratedAt(value: unknown): boolean {
  return typeof value === 'string' && value === '2026-01-01T00:00:00.000Z';
}

export function isValidStrategyReviewSerializationSource(value: unknown): boolean {
  return (
    typeof value === 'string' && value === 'phase42_strategy_review_serialization_preview_fixtures_v1'
  );
}

// ─── Serializability ─────────────────────────────────────────────────────────

export function isStrategyReviewSerializationPreviewFixtureSerializable(
  fixture: StrategyReviewSerializationPreviewFixture,
): boolean {
  try {
    const s = JSON.stringify(fixture);
    return typeof s === 'string' && s.length > 0;
  } catch {
    return false;
  }
}

// ─── Normalization ────────────────────────────────────────────────────────────

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function normalizeStrategyReviewSerializationPreviewFixture(
  fixture: StrategyReviewSerializationPreviewFixture,
): StrategyReviewSerializationPreviewFixture {
  return {
    ...fixture,
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
    reportReference: {
      ...fixture.reportReference,
      notes: sortStrings(fixture.reportReference.notes),
    },
    summary: {
      ...fixture.summary,
      notes: sortStrings(fixture.summary.notes),
    },
    safeNotes: sortStrings(fixture.safeNotes),
    metadataPayload:
      fixture.metadataPayload === null
        ? null
        : (sortKeysDeep(fixture.metadataPayload) as Record<string, unknown>),
  };
}

// ─── Serialization ────────────────────────────────────────────────────────────

export function serializeStrategyReviewSerializationPreviewFixture(
  fixture: StrategyReviewSerializationPreviewFixture,
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(fixture)) as Record<string, unknown>;
}

// ─── Equality ─────────────────────────────────────────────────────────────────

export function areStrategyReviewSerializationPreviewFixturesEqual(
  a: StrategyReviewSerializationPreviewFixture,
  b: StrategyReviewSerializationPreviewFixture,
): boolean {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b));
}
