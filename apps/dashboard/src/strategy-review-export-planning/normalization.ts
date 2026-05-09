/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: normalization.
 *
 * Pure, side-effect-free normalization helpers. No mutation, no timers,
 * no randomness, no network, no filesystem, no persistence.
 */

import type {
  StrategyReviewExportPlanFixture,
  StrategyReviewExportPlanFixtureKind,
  StrategyReviewExportPlanFixtureName,
  StrategyReviewExportPlanTarget,
} from './types.js';
import {
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS,
} from './types.js';

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

export function isValidStrategyReviewExportPlanFixtureName(
  value: unknown,
): value is StrategyReviewExportPlanFixtureName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportPlanFixtureKind(
  value: unknown,
): value is StrategyReviewExportPlanFixtureKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportPlanTarget(
  value: unknown,
): value is StrategyReviewExportPlanTarget {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportPlanGeneratedAt(value: unknown): boolean {
  return typeof value === 'string' && value === PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT;
}

export function isValidStrategyReviewExportPlanSource(value: unknown): boolean {
  return typeof value === 'string' && value === PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE;
}

export function isStrategyReviewExportPlanFixtureSerializable(
  fixture: StrategyReviewExportPlanFixture,
): boolean {
  try {
    const serialized = JSON.stringify(fixture);
    return typeof serialized === 'string' && serialized.length > 0;
  } catch {
    return false;
  }
}

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function normalizeStrategyReviewExportPlanFixture(
  fixture: StrategyReviewExportPlanFixture,
): StrategyReviewExportPlanFixture {
  return {
    ...fixture,
    previewReference: {
      ...fixture.previewReference,
      notes: sortStrings(fixture.previewReference.notes),
    },
    exportPlan: {
      ...fixture.exportPlan,
      planSteps: sortStrings(fixture.exportPlan.planSteps),
      disabledReasons: sortStrings(fixture.exportPlan.disabledReasons),
      notes: sortStrings(fixture.exportPlan.notes),
    },
    summary: {
      ...fixture.summary,
      notes: sortStrings(fixture.summary.notes),
    },
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
    safetyBoundary: {
      ...fixture.safetyBoundary,
      notes: sortStrings(fixture.safetyBoundary.notes),
    },
    safeNotes: sortStrings(fixture.safeNotes),
  };
}

export function serializeStrategyReviewExportPlanFixture(
  fixture: StrategyReviewExportPlanFixture,
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(fixture)) as Record<string, unknown>;
}

export function areStrategyReviewExportPlanFixturesEqual(
  a: StrategyReviewExportPlanFixture,
  b: StrategyReviewExportPlanFixture,
): boolean {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b));
}
