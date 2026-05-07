/**
 * apps/dashboard/src/state/reducer.ts
 *
 * Phase 26 reducer-style pure update helpers.
 */

import {
  type DashboardInteractionState,
  type DashboardPanelId,
  type DashboardStateAction,
  type DashboardStateResetMode,
  type DashboardStateUpdateResult,
} from './types.js';
import {
  createDefaultDashboardFilterState,
  createDefaultDashboardInteractionState,
  createDefaultDashboardPanelVisibilityState,
  createDefaultDashboardSortState,
} from './default-state.js';
import {
  sanitizeDashboardEvidenceFilters,
  sanitizeDashboardEvidenceSortField,
  sanitizeDashboardFilterInput,
  sanitizeDashboardPanelId,
  sanitizeDashboardSafetyFilters,
  sanitizeDashboardSafetySortField,
  sanitizeDashboardSortDirection,
  validateDashboardInteractionState,
} from './validation.js';

function createResult(
  state: DashboardInteractionState,
  changed: boolean,
  errors: readonly string[] = [],
): DashboardStateUpdateResult {
  return {
    state,
    changed,
    errors,
  };
}

function withActivePanelFallback(state: DashboardInteractionState): DashboardInteractionState {
  if (state.panelVisibility[state.activePanelId]) {
    return state;
  }

  const firstVisiblePanel = (Object.entries(state.panelVisibility).find(([, visible]) => visible)?.[0] ?? 'overview') as DashboardPanelId;

  return {
    ...state,
    activePanelId: firstVisiblePanel,
  };
}

export function setDashboardActivePanel(
  state: DashboardInteractionState,
  panelId: string,
): DashboardStateUpdateResult {
  const sanitizedPanelId = sanitizeDashboardPanelId(panelId, state.activePanelId);

  if (sanitizedPanelId === state.activePanelId) {
    return createResult(state, false, panelId === state.activePanelId ? [] : ['invalid panelId']);
  }

  return createResult(
    {
      ...state,
      activePanelId: sanitizedPanelId,
    },
    true,
  );
}

export function toggleDashboardPanelVisibility(
  state: DashboardInteractionState,
  panelId: string,
): DashboardStateUpdateResult {
  const sanitizedPanelId = sanitizeDashboardPanelId(panelId, state.activePanelId);

  if (sanitizedPanelId !== panelId) {
    return createResult(state, false, ['invalid panelId']);
  }

  const nextState = withActivePanelFallback({
    ...state,
    panelVisibility: {
      ...state.panelVisibility,
      [sanitizedPanelId]: !state.panelVisibility[sanitizedPanelId],
    },
  });

  return createResult(nextState, true);
}

export function setDashboardPanelVisibility(
  state: DashboardInteractionState,
  panelId: string,
  visible: boolean,
): DashboardStateUpdateResult {
  const sanitizedPanelId = sanitizeDashboardPanelId(panelId, state.activePanelId);

  if (sanitizedPanelId !== panelId) {
    return createResult(state, false, ['invalid panelId']);
  }

  if (state.panelVisibility[sanitizedPanelId] === visible) {
    return createResult(state, false);
  }

  const nextState = withActivePanelFallback({
    ...state,
    panelVisibility: {
      ...state.panelVisibility,
      [sanitizedPanelId]: visible,
    },
  });

  return createResult(nextState, true);
}

export function updateDashboardEvidenceFilters(
  state: DashboardInteractionState,
  filters: Partial<DashboardInteractionState['filters']['evidence']>,
): DashboardStateUpdateResult {
  const merged = {
    ...state.filters.evidence,
    ...filters,
    classification: sanitizeDashboardFilterInput(filters.classification ?? state.filters.evidence.classification),
    sourceKind: sanitizeDashboardFilterInput(filters.sourceKind ?? state.filters.evidence.sourceKind),
    query: sanitizeDashboardFilterInput(filters.query ?? state.filters.evidence.query),
  };

  const nextFilters = sanitizeDashboardEvidenceFilters(merged);

  return createResult(
    {
      ...state,
      filters: {
        ...state.filters,
        evidence: nextFilters,
      },
    },
    true,
  );
}

export function updateDashboardSafetyFilters(
  state: DashboardInteractionState,
  filters: Partial<DashboardInteractionState['filters']['safety']>,
): DashboardStateUpdateResult {
  const merged = {
    ...state.filters.safety,
    ...filters,
    classification: sanitizeDashboardFilterInput(filters.classification ?? state.filters.safety.classification),
    sourceKind: sanitizeDashboardFilterInput(filters.sourceKind ?? state.filters.safety.sourceKind),
    query: sanitizeDashboardFilterInput(filters.query ?? state.filters.safety.query),
  };

  const nextFilters = sanitizeDashboardSafetyFilters(merged);

  return createResult(
    {
      ...state,
      filters: {
        ...state.filters,
        safety: nextFilters,
      },
    },
    true,
  );
}

export function updateDashboardSortState(
  state: DashboardInteractionState,
  sort: Partial<DashboardInteractionState['sort']>,
): DashboardStateUpdateResult {
  const nextState: DashboardInteractionState = {
    ...state,
    sort: {
      evidence: {
        sortBy: sanitizeDashboardEvidenceSortField(sort.evidence?.sortBy ?? state.sort.evidence.sortBy),
        direction: sanitizeDashboardSortDirection(sort.evidence?.direction ?? state.sort.evidence.direction),
      },
      safety: {
        sortBy: sanitizeDashboardSafetySortField(sort.safety?.sortBy ?? state.sort.safety.sortBy),
        direction: sanitizeDashboardSortDirection(sort.safety?.direction ?? state.sort.safety.direction),
      },
    },
  };

  return createResult(nextState, true);
}

export function resetDashboardInteractionState(
  state: DashboardInteractionState,
  mode: DashboardStateResetMode = 'all',
): DashboardStateUpdateResult {
  const defaults = createDefaultDashboardInteractionState();

  if (mode === 'all') {
    return createResult(defaults, true);
  }

  if (mode === 'activePanel') {
    return createResult(
      {
        ...state,
        activePanelId: defaults.activePanelId,
      },
      true,
    );
  }

  if (mode === 'panelVisibility') {
    return createResult(
      {
        ...state,
        panelVisibility: createDefaultDashboardPanelVisibilityState(),
      },
      true,
    );
  }

  if (mode === 'filters') {
    return createResult(
      {
        ...state,
        filters: createDefaultDashboardFilterState(),
      },
      true,
    );
  }

  if (mode === 'sort') {
    return createResult(
      {
        ...state,
        sort: createDefaultDashboardSortState(),
      },
      true,
    );
  }

  return createResult(state, false, ['unsupported reset mode']);
}

export function updateDashboardInteractionState(
  state: DashboardInteractionState,
  action: DashboardStateAction,
): DashboardStateUpdateResult {
  switch (action.type) {
    case 'SET_ACTIVE_PANEL':
      return setDashboardActivePanel(state, action.panelId);

    case 'TOGGLE_PANEL_VISIBILITY':
      return toggleDashboardPanelVisibility(state, action.panelId);

    case 'SET_PANEL_VISIBILITY':
      return setDashboardPanelVisibility(state, action.panelId, action.visible);

    case 'UPDATE_EVIDENCE_FILTERS':
      return updateDashboardEvidenceFilters(state, action.filters);

    case 'UPDATE_SAFETY_FILTERS':
      return updateDashboardSafetyFilters(state, action.filters);

    case 'UPDATE_SORT_STATE':
      return updateDashboardSortState(state, action.sort);

    case 'RESET_STATE':
      return resetDashboardInteractionState(state, action.mode);

    default:
      return createResult(state, false, ['unsupported action']);
  }
}

export function validateAndNormalizeDashboardInteractionState(
  state: unknown,
): DashboardStateUpdateResult {
  const validation = validateDashboardInteractionState(state);
  if (validation.valid) {
    return createResult(state as DashboardInteractionState, false);
  }

  return createResult(createDefaultDashboardInteractionState(), true, validation.errors);
}
