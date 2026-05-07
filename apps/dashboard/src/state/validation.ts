/**
 * apps/dashboard/src/state/validation.ts
 *
 * Phase 26 state validation and sanitization helpers.
 */

import {
  DASHBOARD_EVIDENCE_SEVERITIES,
  DASHBOARD_EVIDENCE_SORT_FIELDS,
  DASHBOARD_ITEM_STATUS_FILTERS,
  DASHBOARD_LOCAL_ITEM_STATES,
  DASHBOARD_PANEL_IDS,
  DASHBOARD_SAFETY_SORT_FIELDS,
  DASHBOARD_SORT_DIRECTIONS,
  type DashboardEvidenceFilterState,
  type DashboardEvidenceSortField,
  type DashboardInteractionState,
  type DashboardItemStatusFilter,
  type DashboardLocalItemStateFilter,
  type DashboardPanelId,
  type DashboardSafetyFilterState,
  type DashboardSafetySortField,
  type DashboardSortDirection,
  type DashboardStateValidationResult,
} from './types.js';
import {
  createDefaultDashboardEvidenceFilterState,
  createDefaultDashboardInteractionState,
  createDefaultDashboardSafetyFilterState,
  createDefaultDashboardSortState,
} from './default-state.js';

const SAFE_TEXT_PATTERN = /[^a-zA-Z0-9 _:\-/]/g;
const MAX_FILTER_TEXT_LENGTH = 120;
const MIN_MAX_ITEMS = 1;
const MAX_MAX_ITEMS = 200;

function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim().replace(SAFE_TEXT_PATTERN, '');
  return trimmed.length > MAX_FILTER_TEXT_LENGTH ? trimmed.slice(0, MAX_FILTER_TEXT_LENGTH) : trimmed;
}

export function sanitizeDashboardPanelId(value: unknown, fallback: DashboardPanelId = 'overview'): DashboardPanelId {
  return DASHBOARD_PANEL_IDS.includes(value as DashboardPanelId) ? (value as DashboardPanelId) : fallback;
}

function sanitizeEnum<T extends readonly string[]>(value: unknown, values: T, fallback: T[number]): T[number] {
  return values.includes(value as T[number]) ? (value as T[number]) : fallback;
}

export function sanitizeDashboardFilterInput(value: unknown): string {
  return sanitizeText(value);
}

export function sanitizeDashboardEvidenceFilters(
  input: Partial<DashboardEvidenceFilterState>,
): DashboardEvidenceFilterState {
  const defaults = createDefaultDashboardEvidenceFilterState();

  const maxItems =
    typeof input.maxItems === 'number' && Number.isFinite(input.maxItems)
      ? Math.min(MAX_MAX_ITEMS, Math.max(MIN_MAX_ITEMS, Math.floor(input.maxItems)))
      : defaults.maxItems;

  return {
    panel: sanitizeEnum(input.panel, [...DASHBOARD_PANEL_IDS, 'all'] as const, defaults.panel),
    severity: sanitizeEnum(input.severity, DASHBOARD_EVIDENCE_SEVERITIES, defaults.severity),
    status: sanitizeEnum(input.status, DASHBOARD_ITEM_STATUS_FILTERS, defaults.status),
    classification: sanitizeText(input.classification),
    sourceKind: sanitizeText(input.sourceKind),
    query: sanitizeText(input.query),
    maxItems,
  };
}

export function sanitizeDashboardSafetyFilters(input: Partial<DashboardSafetyFilterState>): DashboardSafetyFilterState {
  const defaults = createDefaultDashboardSafetyFilterState();

  return {
    panel: sanitizeEnum(input.panel, [...DASHBOARD_PANEL_IDS, 'all'] as const, defaults.panel),
    severity: sanitizeEnum(input.severity, DASHBOARD_EVIDENCE_SEVERITIES, defaults.severity),
    status: sanitizeEnum(input.status, DASHBOARD_LOCAL_ITEM_STATES, defaults.status),
    classification: sanitizeText(input.classification),
    sourceKind: sanitizeText(input.sourceKind),
    query: sanitizeText(input.query),
    includeSummary: typeof input.includeSummary === 'boolean' ? input.includeSummary : defaults.includeSummary,
  };
}

export function sanitizeDashboardEvidenceSortField(value: unknown): DashboardEvidenceSortField {
  return sanitizeEnum(value, DASHBOARD_EVIDENCE_SORT_FIELDS, createDefaultDashboardSortState().evidence.sortBy);
}

export function sanitizeDashboardSafetySortField(value: unknown): DashboardSafetySortField {
  return sanitizeEnum(value, DASHBOARD_SAFETY_SORT_FIELDS, createDefaultDashboardSortState().safety.sortBy);
}

export function sanitizeDashboardSortDirection(value: unknown): DashboardSortDirection {
  return sanitizeEnum(value, DASHBOARD_SORT_DIRECTIONS, 'asc');
}

export function sanitizeDashboardStatusFilter(value: unknown): DashboardItemStatusFilter {
  return sanitizeEnum(value, DASHBOARD_ITEM_STATUS_FILTERS, 'all');
}

export function sanitizeDashboardLocalStatusFilter(value: unknown): DashboardLocalItemStateFilter {
  return sanitizeEnum(value, DASHBOARD_LOCAL_ITEM_STATES, 'all');
}

export function validateDashboardInteractionState(state: unknown): DashboardStateValidationResult {
  const errors: string[] = [];

  if (typeof state !== 'object' || state === null || Array.isArray(state)) {
    return {
      valid: false,
      errors: ['state must be an object'],
    };
  }

  const typedState = state as DashboardInteractionState;
  const defaults = createDefaultDashboardInteractionState();

  if (typedState.phase !== 26) {
    errors.push('phase must be 26');
  }

  if (!DASHBOARD_PANEL_IDS.includes(typedState.activePanelId)) {
    errors.push('activePanelId must be a supported dashboard panel');
  }

  const panelVisibility =
    typeof typedState.panelVisibility === 'object' && typedState.panelVisibility !== null
      ? typedState.panelVisibility
      : defaults.panelVisibility;

  DASHBOARD_PANEL_IDS.forEach(panelId => {
    if (typeof panelVisibility[panelId] !== 'boolean') {
      errors.push(`panelVisibility.${panelId} must be boolean`);
    }
  });

  const filters =
    typeof typedState.filters === 'object' && typedState.filters !== null ? typedState.filters : defaults.filters;

  const evidenceFilters = sanitizeDashboardEvidenceFilters(filters.evidence ?? defaults.filters.evidence);
  const safetyFilters = sanitizeDashboardSafetyFilters(filters.safety ?? defaults.filters.safety);

  if (typedState.filters?.evidence?.maxItems !== evidenceFilters.maxItems) {
    errors.push('filters.evidence.maxItems must be a finite bounded integer between 1 and 200');
  }

  if ((typedState.filters?.evidence?.query ?? '') !== evidenceFilters.query) {
    errors.push('filters.evidence.query contains unsupported characters');
  }

  if ((typedState.filters?.safety?.query ?? '') !== safetyFilters.query) {
    errors.push('filters.safety.query contains unsupported characters');
  }

  const json = JSON.stringify(typedState);
  if (json.includes('/home/') || json.includes('C:\\Users\\') || json.includes('/Users/')) {
    errors.push('state must not contain local filesystem paths');
  }
  if (/private[_ -]?key|seed[_ -]?phrase|mnemonic|api[_ -]?key|secret/i.test(json)) {
    errors.push('state must not contain secrets');
  }
  if (json.includes('at ') && json.includes('(') && json.includes(')')) {
    errors.push('state must not contain stack trace text');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
