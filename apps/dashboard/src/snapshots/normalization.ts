/**
 * apps/dashboard/src/snapshots/normalization.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Normalization
 *
 * Pure, deterministic snapshot normalization helpers.
 * Ensures stable, serializable, ordered output for regression testing.
 *
 * No mutation of inputs. No timers. No randomness. No persistence. No network.
 */

import type { DashboardRenderSnapshot } from './types.js';
import type { DashboardItem, DashboardSection } from '../types.js';

/**
 * Normalizes an array of DashboardItems for stable ordering.
 * Sorts by key alphabetically.
 */
function normalizeItems(items: readonly DashboardItem[]): readonly DashboardItem[] {
  return [...items].sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Normalizes a DashboardSection for stable comparison.
 * Sorts items by key and recursively normalizes sub-sections.
 */
function normalizeSection(section: DashboardSection): DashboardSection {
  const base = {
    ...section,
    items: normalizeItems(section.items),
  };
  if (section.subSections !== undefined) {
    return {
      ...base,
      subSections: [...section.subSections].sort((a, b) => a.sectionId.localeCompare(b.sectionId)).map(normalizeSection),
    };
  }
  return base;
}

/**
 * Normalizes an array of DashboardSections for stable comparison.
 * Sorts by sectionId.
 */
function normalizeSections(sections: readonly DashboardSection[]): readonly DashboardSection[] {
  return [...sections].sort((a, b) => a.sectionId.localeCompare(b.sectionId)).map(normalizeSection);
}

/**
 * Normalizes a single DashboardRenderSnapshot for stable regression comparison.
 *
 * Normalization:
 * - Sorts panel ID arrays alphabetically.
 * - Normalizes all section/item arrays for stable ordering.
 * - Preserves all metadata as-is (it is already deterministic).
 * - Does not modify safety boundary flags.
 * - Does not add or remove fields.
 *
 * Input is NOT mutated.
 */
export function normalizeDashboardRenderSnapshot(snapshot: DashboardRenderSnapshot): DashboardRenderSnapshot {
  const normalizedVisible = [...snapshot.expectedVisiblePanelIds].sort();
  const normalizedHidden = [...snapshot.expectedHiddenPanelIds].sort();

  const renderResult = snapshot.renderResult;

  // Normalize sections if renderResult has sections (DashboardRenderResult or DashboardShellResult footer).
  if ('sections' in renderResult && Array.isArray(renderResult.sections)) {
    const normalizedRenderResult = {
      ...renderResult,
      sections: normalizeSections(renderResult.sections as readonly DashboardSection[]),
    };

    return {
      ...snapshot,
      expectedVisiblePanelIds: normalizedVisible,
      expectedHiddenPanelIds: normalizedHidden,
      renderResult: normalizedRenderResult,
    };
  }

  return {
    ...snapshot,
    expectedVisiblePanelIds: normalizedVisible,
    expectedHiddenPanelIds: normalizedHidden,
  };
}

/**
 * Converts a snapshot to a plain serializable object.
 * Ensures no non-serializable values are present.
 * Returns a record safe for JSON.stringify.
 */
export function serializeDashboardRenderSnapshot(snapshot: DashboardRenderSnapshot): Record<string, unknown> {
  return JSON.parse(JSON.stringify(snapshot)) as Record<string, unknown>;
}

/**
 * Checks whether a snapshot is serializable (can be round-tripped via JSON).
 */
export function isDashboardRenderSnapshotSerializable(snapshot: DashboardRenderSnapshot): boolean {
  try {
    const serialized = JSON.stringify(snapshot);
    if (typeof serialized !== 'string') return false;
    JSON.parse(serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Compares two snapshots for regression equality.
 * Uses normalized forms for deterministic comparison.
 *
 * Returns true if snapshots are structurally equal (after normalization).
 */
export function areDashboardRenderSnapshotsEqual(a: DashboardRenderSnapshot, b: DashboardRenderSnapshot): boolean {
  const normalA = normalizeDashboardRenderSnapshot(a);
  const normalB = normalizeDashboardRenderSnapshot(b);
  return JSON.stringify(normalA) === JSON.stringify(normalB);
}

/**
 * Extracts a stable snapshot summary for display or logging.
 * Does not include raw render result for brevity.
 */
export function getDashboardRenderSnapshotSummary(snapshot: DashboardRenderSnapshot): {
  readonly name: string;
  readonly kind: string;
  readonly componentType: string;
  readonly visiblePanelCount: number;
  readonly hiddenPanelCount: number;
  readonly isErrorState: boolean;
  readonly isEmptyState: boolean;
  readonly isFilteredState: boolean;
  readonly meta: DashboardRenderSnapshot['meta'];
} {
  return {
    name: snapshot.name,
    kind: snapshot.kind,
    componentType: snapshot.expectedComponentType,
    visiblePanelCount: snapshot.expectedVisiblePanelIds.length,
    hiddenPanelCount: snapshot.expectedHiddenPanelIds.length,
    isErrorState: snapshot.isErrorState,
    isEmptyState: snapshot.isEmptyState,
    isFilteredState: snapshot.isFilteredState,
    meta: snapshot.meta,
  };
}
