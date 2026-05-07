/**
 * apps/dashboard/src/state/selectors.ts
 *
 * Phase 26 deterministic selectors that combine Phase 24 view models,
 * Phase 25 render shell components, and local in-memory interaction state.
 */

import type {
  DashboardEvidenceItem,
  DashboardInteractionState,
  DashboardPanelId,
  DashboardSafetyItem,
  DashboardStateSelectorResult,
} from './types.js';
import {
  applyDashboardEvidenceFilters,
  applyDashboardEvidenceSort,
  applyDashboardSafetyFilters,
  applyDashboardSafetySort,
  buildDashboardEvidenceItems,
  buildDashboardSafetyItems,
} from './filters.js';
import { createDefaultDashboardInteractionState } from './default-state.js';
import { DashboardShell } from '../components/DashboardShell.js';
import { EvidencePanel } from '../components/EvidencePanel.js';
import { SafetyPanel } from '../components/SafetyPanel.js';
import { buildDashboardEmptyViewModel } from '@sonic/dashboard-view-models';
import type { DashboardViewModel } from '@sonic/dashboard-view-models';

const DASHBOARD_PANEL_ORDER: readonly DashboardPanelId[] = [
  'health',
  'capabilities',
  'overview',
  'evidence',
  'safety',
  'metadata',
];

export function selectDashboardPanels(): readonly DashboardPanelId[] {
  return DASHBOARD_PANEL_ORDER;
}

export function selectVisibleDashboardPanels(state: DashboardInteractionState): readonly DashboardPanelId[] {
  return DASHBOARD_PANEL_ORDER.filter(panelId => state.panelVisibility[panelId]);
}

export function selectActiveDashboardPanel(state: DashboardInteractionState): DashboardPanelId {
  if (state.panelVisibility[state.activePanelId]) {
    return state.activePanelId;
  }

  return selectVisibleDashboardPanels(state)[0] ?? createDefaultDashboardInteractionState().activePanelId;
}

export function selectFilteredEvidenceItems(
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
): readonly DashboardEvidenceItem[] {
  const entries = buildDashboardEvidenceItems(viewModel.evidence);
  const filtered = applyDashboardEvidenceFilters(entries, state.filters.evidence);
  return applyDashboardEvidenceSort(filtered, state.sort.evidence.sortBy, state.sort.evidence.direction);
}

export function selectFilteredSafetyItems(
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
): readonly DashboardSafetyItem[] {
  const items = buildDashboardSafetyItems(viewModel.safety);
  const filtered = applyDashboardSafetyFilters(items, state.filters.safety);
  return applyDashboardSafetySort(filtered, state.sort.safety.sortBy, state.sort.safety.direction);
}

function applyEvidenceViewModelFilters(
  viewModel: DashboardViewModel,
  filteredItems: readonly DashboardEvidenceItem[],
): DashboardViewModel['evidence'] {
  if (viewModel.evidence.status !== 'ready') {
    return viewModel.evidence;
  }

  if (filteredItems.length === 0) {
    return {
      ...viewModel.evidence,
      status: 'empty',
      entries: [],
      totalEntries: 0,
      emptyState: buildDashboardEmptyViewModel('No evidence items match current local filters.'),
    };
  }

  return {
    ...viewModel.evidence,
    status: 'ready',
    entries: filteredItems.map(item => item.raw),
    totalEntries: filteredItems.length,
  };
}

function applySafetyViewModelFilters(
  viewModel: DashboardViewModel,
  filteredItems: readonly DashboardSafetyItem[],
): DashboardViewModel['safety'] {
  if (viewModel.safety.status !== 'ready') {
    return viewModel.safety;
  }

  if (filteredItems.length === 0) {
    return {
      ...viewModel.safety,
      status: 'empty',
      lockedCapabilityNames: [],
      summaryText: 'No safety items match current local filters.',
    };
  }

  const summaryItem = filteredItems.find(item => item.classification === 'summary');
  const locked = filteredItems.filter(item => item.classification === 'locked_capability').map(item => item.label);

  return {
    ...viewModel.safety,
    status: 'ready',
    lockedCapabilityNames: locked,
    summaryText: summaryItem?.description ?? viewModel.safety.summaryText,
  };
}

export function selectDashboardRenderModel(
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
): DashboardStateSelectorResult {
  const visiblePanelIds = selectVisibleDashboardPanels(state);
  const activePanelId = selectActiveDashboardPanel(state);
  const filteredEvidenceItems = selectFilteredEvidenceItems(viewModel, state);
  const filteredSafetyItems = selectFilteredSafetyItems(viewModel, state);

  const shell = DashboardShell({
    viewModel: {
      ...viewModel,
      evidence: applyEvidenceViewModelFilters(viewModel, filteredEvidenceItems),
      safety: applySafetyViewModelFilters(viewModel, filteredSafetyItems),
    },
  });

  const evidencePanel = EvidencePanel({
    viewModel: applyEvidenceViewModelFilters(viewModel, filteredEvidenceItems),
  });

  const safetyPanel = SafetyPanel({
    viewModel: applySafetyViewModelFilters(viewModel, filteredSafetyItems),
  });

  return {
    state,
    viewModel,
    shell: {
      ...shell,
      navigation: shell.navigation.map(entry => ({
        ...entry,
        isCurrent: entry.id === activePanelId,
      })),
      panels: {
        ...shell.panels,
        evidence: evidencePanel,
        safety: safetyPanel,
      },
    },
    visiblePanelIds,
    activePanelId,
    filteredEvidenceItems,
    filteredSafetyItems,
    summary: {
      visiblePanelCount: visiblePanelIds.length,
      hiddenPanelCount: DASHBOARD_PANEL_ORDER.length - visiblePanelIds.length,
      evidenceItemCount: filteredEvidenceItems.length,
      safetyItemCount: filteredSafetyItems.length,
    },
  };
}

export function applyDashboardInteractionState(
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
): DashboardStateSelectorResult {
  return selectDashboardRenderModel(viewModel, state);
}
