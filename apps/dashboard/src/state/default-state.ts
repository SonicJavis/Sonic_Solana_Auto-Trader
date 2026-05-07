/**
 * apps/dashboard/src/state/default-state.ts
 *
 * Phase 26 default deterministic local interaction state.
 */

import type {
  DashboardEvidenceFilterState,
  DashboardFilterState,
  DashboardInteractionState,
  DashboardPanelVisibilityState,
  DashboardSafetyFilterState,
  DashboardSortState,
} from './types.js';

export function createDefaultDashboardPanelVisibilityState(): DashboardPanelVisibilityState {
  return {
    health: true,
    capabilities: true,
    overview: true,
    evidence: true,
    safety: true,
    metadata: true,
  };
}

export function createDefaultDashboardEvidenceFilterState(): DashboardEvidenceFilterState {
  return {
    panel: 'all',
    severity: 'all',
    status: 'all',
    classification: '',
    sourceKind: '',
    query: '',
    maxItems: 50,
  };
}

export function createDefaultDashboardSafetyFilterState(): DashboardSafetyFilterState {
  return {
    panel: 'all',
    severity: 'all',
    status: 'all',
    classification: '',
    sourceKind: '',
    query: '',
    includeSummary: true,
  };
}

export function createDefaultDashboardFilterState(): DashboardFilterState {
  return {
    evidence: createDefaultDashboardEvidenceFilterState(),
    safety: createDefaultDashboardSafetyFilterState(),
  };
}

export function createDefaultDashboardSortState(): DashboardSortState {
  return {
    evidence: {
      sortBy: 'label',
      direction: 'asc',
    },
    safety: {
      sortBy: 'label',
      direction: 'asc',
    },
  };
}

export function createDefaultDashboardInteractionState(): DashboardInteractionState {
  return {
    phase: 26,
    activePanelId: 'overview',
    panelVisibility: createDefaultDashboardPanelVisibilityState(),
    filters: createDefaultDashboardFilterState(),
    sort: createDefaultDashboardSortState(),
  };
}
