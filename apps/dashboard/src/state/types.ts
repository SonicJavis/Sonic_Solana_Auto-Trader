/**
 * apps/dashboard/src/state/types.ts
 *
 * Phase 26 — Local Dashboard Interaction State and Filters v1.
 *
 * Defines deterministic, serializable, in-memory dashboard interaction state.
 * No persistence. No network. No live data.
 */

import type { DashboardShellResult } from '../types.js';
import type { DashboardViewModel, DashboardStatusViewModel } from '@sonic/dashboard-view-models';

export const DASHBOARD_PANEL_IDS = [
  'health',
  'capabilities',
  'overview',
  'evidence',
  'safety',
  'metadata',
] as const;

export type DashboardPanelId = (typeof DASHBOARD_PANEL_IDS)[number];

export const DASHBOARD_EVIDENCE_SEVERITIES = ['all', 'info', 'warning', 'risk', 'failure', 'inconclusive'] as const;
export type DashboardEvidenceSeverityFilter = (typeof DASHBOARD_EVIDENCE_SEVERITIES)[number];

export const DASHBOARD_ITEM_STATUS_FILTERS = ['all', 'ready', 'empty', 'loading', 'error', 'unavailable'] as const;
export type DashboardItemStatusFilter = (typeof DASHBOARD_ITEM_STATUS_FILTERS)[number];

export const DASHBOARD_LOCAL_ITEM_STATES = ['all', 'locked', 'unlocked'] as const;
export type DashboardLocalItemStateFilter = (typeof DASHBOARD_LOCAL_ITEM_STATES)[number];

export const DASHBOARD_SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type DashboardSortDirection = (typeof DASHBOARD_SORT_DIRECTIONS)[number];

export const DASHBOARD_EVIDENCE_SORT_FIELDS = ['label', 'severity', 'status', 'sourceKind', 'classification'] as const;
export type DashboardEvidenceSortField = (typeof DASHBOARD_EVIDENCE_SORT_FIELDS)[number];

export const DASHBOARD_SAFETY_SORT_FIELDS = ['label', 'status', 'severity', 'classification'] as const;
export type DashboardSafetySortField = (typeof DASHBOARD_SAFETY_SORT_FIELDS)[number];

export interface DashboardPanelVisibilityState {
  readonly health: boolean;
  readonly capabilities: boolean;
  readonly overview: boolean;
  readonly evidence: boolean;
  readonly safety: boolean;
  readonly metadata: boolean;
}

export interface DashboardEvidenceFilterState {
  readonly panel: DashboardPanelId | 'all';
  readonly severity: DashboardEvidenceSeverityFilter;
  readonly status: DashboardItemStatusFilter;
  readonly classification: string;
  readonly sourceKind: string;
  readonly query: string;
  readonly maxItems: number;
}

export interface DashboardSafetyFilterState {
  readonly panel: DashboardPanelId | 'all';
  readonly severity: DashboardEvidenceSeverityFilter;
  readonly status: DashboardLocalItemStateFilter;
  readonly classification: string;
  readonly sourceKind: string;
  readonly query: string;
  readonly includeSummary: boolean;
}

export interface DashboardSortState {
  readonly evidence: {
    readonly sortBy: DashboardEvidenceSortField;
    readonly direction: DashboardSortDirection;
  };
  readonly safety: {
    readonly sortBy: DashboardSafetySortField;
    readonly direction: DashboardSortDirection;
  };
}

export interface DashboardFilterState {
  readonly evidence: DashboardEvidenceFilterState;
  readonly safety: DashboardSafetyFilterState;
}

export interface DashboardInteractionState {
  readonly phase: 26;
  readonly activePanelId: DashboardPanelId;
  readonly panelVisibility: DashboardPanelVisibilityState;
  readonly filters: DashboardFilterState;
  readonly sort: DashboardSortState;
}

export interface DashboardEvidenceItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly severity: string;
  readonly status: DashboardStatusViewModel | 'unknown';
  readonly panel: DashboardPanelId | 'unknown';
  readonly classification: string;
  readonly sourceKind: string;
  readonly raw: Record<string, unknown>;
}

export interface DashboardSafetyItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly severity: string;
  readonly status: 'locked' | 'unlocked';
  readonly panel: 'safety';
  readonly classification: string;
  readonly sourceKind: string;
}

export interface DashboardStateValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface DashboardStateUpdateResult {
  readonly state: DashboardInteractionState;
  readonly changed: boolean;
  readonly errors: readonly string[];
}

export type DashboardStateResetMode = 'all' | 'activePanel' | 'panelVisibility' | 'filters' | 'sort';

export type DashboardStateActionType =
  | 'SET_ACTIVE_PANEL'
  | 'TOGGLE_PANEL_VISIBILITY'
  | 'SET_PANEL_VISIBILITY'
  | 'UPDATE_EVIDENCE_FILTERS'
  | 'UPDATE_SAFETY_FILTERS'
  | 'UPDATE_SORT_STATE'
  | 'RESET_STATE';

export type DashboardStateAction =
  | {
      readonly type: 'SET_ACTIVE_PANEL';
      readonly panelId: string;
    }
  | {
      readonly type: 'TOGGLE_PANEL_VISIBILITY';
      readonly panelId: string;
    }
  | {
      readonly type: 'SET_PANEL_VISIBILITY';
      readonly panelId: string;
      readonly visible: boolean;
    }
  | {
      readonly type: 'UPDATE_EVIDENCE_FILTERS';
      readonly filters: Partial<DashboardEvidenceFilterState>;
    }
  | {
      readonly type: 'UPDATE_SAFETY_FILTERS';
      readonly filters: Partial<DashboardSafetyFilterState>;
    }
  | {
      readonly type: 'UPDATE_SORT_STATE';
      readonly sort: Partial<DashboardSortState>;
    }
  | {
      readonly type: 'RESET_STATE';
      readonly mode?: DashboardStateResetMode;
    };

export interface DashboardStateSelectorResult {
  readonly state: DashboardInteractionState;
  readonly viewModel: DashboardViewModel;
  readonly shell: DashboardShellResult;
  readonly visiblePanelIds: readonly DashboardPanelId[];
  readonly activePanelId: DashboardPanelId;
  readonly filteredEvidenceItems: readonly DashboardEvidenceItem[];
  readonly filteredSafetyItems: readonly DashboardSafetyItem[];
  readonly summary: {
    readonly visiblePanelCount: number;
    readonly hiddenPanelCount: number;
    readonly evidenceItemCount: number;
    readonly safetyItemCount: number;
  };
}
