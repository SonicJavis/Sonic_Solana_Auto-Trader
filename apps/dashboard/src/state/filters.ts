/**
 * apps/dashboard/src/state/filters.ts
 *
 * Phase 26 deterministic local filter helpers.
 */

import type {
  DashboardEvidenceFilterState,
  DashboardEvidenceItem,
  DashboardEvidenceSortField,
  DashboardPanelId,
  DashboardSafetyFilterState,
  DashboardSafetyItem,
  DashboardSafetySortField,
  DashboardSortDirection,
} from './types.js';
import type { DashboardEvidenceViewModel, DashboardSafetyViewModel } from '@sonic/dashboard-view-models';

interface Indexed<T> {
  readonly item: T;
  readonly index: number;
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function lowerIncludes(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function toSafePanel(value: unknown): DashboardPanelId | 'unknown' {
  if (
    value === 'health' ||
    value === 'capabilities' ||
    value === 'overview' ||
    value === 'evidence' ||
    value === 'safety' ||
    value === 'metadata'
  ) {
    return value;
  }
  return 'unknown';
}

function toEvidenceLabel(entry: Record<string, unknown>, fallback: string): string {
  const preferred = [entry['title'], entry['label'], entry['findingId'], entry['id']]
    .map(normalizeText)
    .find(value => value.length > 0);

  return preferred ?? fallback;
}

function toEvidenceDescription(entry: Record<string, unknown>): string {
  return normalizeText(entry['description']) || normalizeText(entry['summary']) || '';
}

export function buildDashboardEvidenceItems(viewModel: DashboardEvidenceViewModel): readonly DashboardEvidenceItem[] {
  return viewModel.entries
    .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null && !Array.isArray(entry))
    .map((entry, index) => {
      const fallbackId = `evidence-${index}`;
      const id = normalizeText(entry['id']) || normalizeText(entry['findingId']) || fallbackId;
      const statusCandidate = normalizeText(entry['status']);
      const status =
        statusCandidate === 'ready' ||
        statusCandidate === 'empty' ||
        statusCandidate === 'loading' ||
        statusCandidate === 'error' ||
        statusCandidate === 'unavailable'
          ? statusCandidate
          : 'unknown';

      return {
        id,
        label: toEvidenceLabel(entry, `Entry ${index + 1}`),
        description: toEvidenceDescription(entry),
        severity: normalizeText(entry['severity']) || 'unknown',
        status,
        panel: toSafePanel(entry['panel']),
        classification: normalizeText(entry['classification']),
        sourceKind: normalizeText(entry['sourceKind']),
        raw: entry,
      };
    });
}

export function buildDashboardSafetyItems(viewModel: DashboardSafetyViewModel): readonly DashboardSafetyItem[] {
  const summaryItem: DashboardSafetyItem = {
    id: 'safety-summary',
    label: 'Safety Summary',
    description: viewModel.summaryText,
    severity: viewModel.safetyInvariantsSatisfied ? 'info' : 'warning',
    status: viewModel.safetyInvariantsSatisfied ? 'unlocked' : 'locked',
    panel: 'safety',
    classification: 'summary',
    sourceKind: 'safety_panel',
  };

  const lockedItems = viewModel.lockedCapabilityNames.map((name, index): DashboardSafetyItem => ({
    id: `locked-capability-${index}`,
    label: name,
    description: 'Capability locked by safety design.',
    severity: 'warning',
    status: 'locked',
    panel: 'safety',
    classification: 'locked_capability',
    sourceKind: 'safety_panel',
  }));

  return [summaryItem, ...lockedItems];
}

function matchesEvidenceFilters(item: DashboardEvidenceItem, filters: DashboardEvidenceFilterState): boolean {
  if (filters.panel !== 'all' && item.panel !== filters.panel) {
    return false;
  }

  if (filters.severity !== 'all' && item.severity !== filters.severity) {
    return false;
  }

  if (filters.status !== 'all' && item.status !== filters.status) {
    return false;
  }

  if (filters.classification.length > 0 && item.classification !== filters.classification) {
    return false;
  }

  if (filters.sourceKind.length > 0 && item.sourceKind !== filters.sourceKind) {
    return false;
  }

  if (filters.query.length > 0) {
    const searchable = [item.label, item.description, item.classification, item.sourceKind].join(' ');
    if (!lowerIncludes(searchable, filters.query)) {
      return false;
    }
  }

  return true;
}

function matchesSafetyFilters(item: DashboardSafetyItem, filters: DashboardSafetyFilterState): boolean {
  if (!filters.includeSummary && item.classification === 'summary') {
    return false;
  }

  if (filters.panel !== 'all' && item.panel !== filters.panel) {
    return false;
  }

  if (filters.severity !== 'all' && item.severity !== filters.severity) {
    return false;
  }

  if (filters.status !== 'all' && item.status !== filters.status) {
    return false;
  }

  if (filters.classification.length > 0 && item.classification !== filters.classification) {
    return false;
  }

  if (filters.sourceKind.length > 0 && item.sourceKind !== filters.sourceKind) {
    return false;
  }

  if (filters.query.length > 0) {
    const searchable = [item.label, item.description, item.classification, item.sourceKind].join(' ');
    if (!lowerIncludes(searchable, filters.query)) {
      return false;
    }
  }

  return true;
}

function compareValue(a: string, b: string, direction: DashboardSortDirection): number {
  if (a === b) {
    return 0;
  }

  if (direction === 'asc') {
    return a < b ? -1 : 1;
  }

  return a < b ? 1 : -1;
}

function sortEvidence(
  items: readonly DashboardEvidenceItem[],
  sortBy: DashboardEvidenceSortField,
  direction: DashboardSortDirection,
): readonly DashboardEvidenceItem[] {
  const indexed: readonly Indexed<DashboardEvidenceItem>[] = items.map((item, index) => ({ item, index }));

  const sorted = [...indexed].sort((a, b) => {
    const primary = compareValue(String(a.item[sortBy] ?? ''), String(b.item[sortBy] ?? ''), direction);
    if (primary !== 0) {
      return primary;
    }
    return a.index - b.index;
  });

  return sorted.map(entry => entry.item);
}

function sortSafety(
  items: readonly DashboardSafetyItem[],
  sortBy: DashboardSafetySortField,
  direction: DashboardSortDirection,
): readonly DashboardSafetyItem[] {
  const indexed: readonly Indexed<DashboardSafetyItem>[] = items.map((item, index) => ({ item, index }));

  const sorted = [...indexed].sort((a, b) => {
    const primary = compareValue(String(a.item[sortBy] ?? ''), String(b.item[sortBy] ?? ''), direction);
    if (primary !== 0) {
      return primary;
    }
    return a.index - b.index;
  });

  return sorted.map(entry => entry.item);
}

export function applyDashboardEvidenceFilters(
  items: readonly DashboardEvidenceItem[],
  filters: DashboardEvidenceFilterState,
): readonly DashboardEvidenceItem[] {
  const filtered = items.filter(item => matchesEvidenceFilters(item, filters));
  return filtered.slice(0, filters.maxItems);
}

export function applyDashboardSafetyFilters(
  items: readonly DashboardSafetyItem[],
  filters: DashboardSafetyFilterState,
): readonly DashboardSafetyItem[] {
  return items.filter(item => matchesSafetyFilters(item, filters));
}

export function applyDashboardEvidenceSort(
  items: readonly DashboardEvidenceItem[],
  sortBy: DashboardEvidenceSortField,
  direction: DashboardSortDirection,
): readonly DashboardEvidenceItem[] {
  return sortEvidence(items, sortBy, direction);
}

export function applyDashboardSafetySort(
  items: readonly DashboardSafetyItem[],
  sortBy: DashboardSafetySortField,
  direction: DashboardSortDirection,
): readonly DashboardSafetyItem[] {
  return sortSafety(items, sortBy, direction);
}
