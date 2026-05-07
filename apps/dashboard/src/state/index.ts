/**
 * apps/dashboard/src/state/index.ts
 *
 * Phase 26 state module barrel.
 */

export type {
  DashboardInteractionState,
  DashboardPanelId,
  DashboardPanelVisibilityState,
  DashboardFilterState,
  DashboardEvidenceFilterState,
  DashboardSafetyFilterState,
  DashboardSortState,
  DashboardStateAction,
  DashboardStateActionType,
  DashboardStateUpdateResult,
  DashboardStateValidationResult,
  DashboardStateSelectorResult,
  DashboardStateResetMode,
  DashboardEvidenceItem,
  DashboardSafetyItem,
} from './types.js';

export {
  DASHBOARD_PANEL_IDS,
  DASHBOARD_EVIDENCE_SEVERITIES,
  DASHBOARD_ITEM_STATUS_FILTERS,
  DASHBOARD_LOCAL_ITEM_STATES,
  DASHBOARD_EVIDENCE_SORT_FIELDS,
  DASHBOARD_SAFETY_SORT_FIELDS,
  DASHBOARD_SORT_DIRECTIONS,
} from './types.js';

export {
  createDefaultDashboardInteractionState,
  createDefaultDashboardPanelVisibilityState,
  createDefaultDashboardEvidenceFilterState,
  createDefaultDashboardSafetyFilterState,
  createDefaultDashboardFilterState,
  createDefaultDashboardSortState,
} from './default-state.js';

export {
  sanitizeDashboardFilterInput,
  sanitizeDashboardPanelId,
  sanitizeDashboardEvidenceFilters,
  sanitizeDashboardSafetyFilters,
  sanitizeDashboardEvidenceSortField,
  sanitizeDashboardSafetySortField,
  sanitizeDashboardSortDirection,
  sanitizeDashboardStatusFilter,
  sanitizeDashboardLocalStatusFilter,
  validateDashboardInteractionState,
} from './validation.js';

export {
  buildDashboardEvidenceItems,
  buildDashboardSafetyItems,
  applyDashboardEvidenceFilters,
  applyDashboardSafetyFilters,
  applyDashboardEvidenceSort,
  applyDashboardSafetySort,
} from './filters.js';

export {
  setDashboardActivePanel,
  toggleDashboardPanelVisibility,
  setDashboardPanelVisibility,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  updateDashboardSortState,
  resetDashboardInteractionState,
  updateDashboardInteractionState,
  validateAndNormalizeDashboardInteractionState,
} from './reducer.js';

export {
  selectDashboardPanels,
  selectVisibleDashboardPanels,
  selectActiveDashboardPanel,
  selectFilteredEvidenceItems,
  selectFilteredSafetyItems,
  selectDashboardRenderModel,
  applyDashboardInteractionState,
} from './selectors.js';
