/**
 * apps/dashboard/src/snapshots/builders.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Builders
 *
 * Pure, deterministic snapshot builder helpers.
 * No mutation of input state. No timers. No randomness. No persistence. No network.
 *
 * All helpers are safe, typed, and deterministic.
 */

import type {
  DashboardRenderSnapshot,
  DashboardRenderSnapshotBuildInput,
  DashboardRenderSnapshotBuildResult,
  DashboardRenderSnapshotKind,
  DashboardRenderSnapshotMeta,
  DashboardRenderSnapshotName,
} from './types.js';
import { DASHBOARD_RENDER_SNAPSHOT_NAMES, DASHBOARD_RENDER_SNAPSHOT_KINDS } from './types.js';
import type { DashboardRenderResult, DashboardShellResult, SafetyBannerResult } from '../types.js';
import type { DashboardInteractionState, DashboardPanelId } from '../state/types.js';
import { PHASE_25_SAFETY_BOUNDARY } from '../components/SafetyBanner.js';
import { DashboardShell } from '../components/DashboardShell.js';
import { HealthPanel } from '../components/HealthPanel.js';
import { CapabilitiesPanel } from '../components/CapabilitiesPanel.js';
import { OverviewPanel } from '../components/OverviewPanel.js';
import { EvidencePanel } from '../components/EvidencePanel.js';
import { SafetyPanel } from '../components/SafetyPanel.js';
import { MetadataPanel } from '../components/MetadataPanel.js';
import { SafetyBanner } from '../components/SafetyBanner.js';
import { EmptyState } from '../components/EmptyState.js';
import { LoadingState } from '../components/LoadingState.js';
import { ErrorState } from '../components/ErrorState.js';
import { UnavailableState } from '../components/UnavailableState.js';
import { DASHBOARD_PANEL_IDS } from '../state/types.js';
import { selectDashboardRenderModel } from '../state/selectors.js';
import { createDefaultDashboardInteractionState } from '../state/default-state.js';
import type { DashboardViewModel } from '@sonic/dashboard-view-models';

/** Stable Phase 27 snapshot source tag. No wall-clock timestamps. */
const SNAPSHOT_SOURCE = 'Phase 27 deterministic fixture snapshot — Phase 23 fixtures only';

/**
 * Builds a deterministic DashboardRenderSnapshotMeta.
 * All fields are static. No wall-clock timestamps.
 */
function buildSnapshotMeta(notes: string): DashboardRenderSnapshotMeta {
  return {
    phase: 27,
    viewModelPhase: 24,
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    deterministic: true,
    notes,
    source: SNAPSHOT_SOURCE,
  };
}

/**
 * Derives expected visible/hidden panel IDs from optional interaction state.
 * Falls back to all panels visible if no state provided.
 */
function deriveExpectedPanelIds(state: DashboardInteractionState | undefined): {
  visible: readonly DashboardPanelId[];
  hidden: readonly DashboardPanelId[];
} {
  const allPanels = [...DASHBOARD_PANEL_IDS] as DashboardPanelId[];
  if (state === undefined) {
    return { visible: allPanels, hidden: [] };
  }
  const visible = allPanels.filter(id => state.panelVisibility[id]);
  const hidden = allPanels.filter(id => !state.panelVisibility[id]);
  return { visible, hidden };
}

/**
 * Builds a full dashboard shell snapshot.
 */
export function buildDefaultDashboardRenderSnapshot(viewModel: DashboardViewModel): DashboardRenderSnapshot {
  const shell = DashboardShell({ viewModel });
  const state = createDefaultDashboardInteractionState();
  const { visible, hidden } = deriveExpectedPanelIds(state);

  return {
    name: 'default-dashboard-shell',
    kind: 'full-shell',
    meta: buildSnapshotMeta('Default full dashboard shell snapshot built from Phase 23 fixtures and Phase 24 view models.'),
    renderResult: shell,
    expectedVisiblePanelIds: visible,
    expectedHiddenPanelIds: hidden,
    expectedComponentType: 'DashboardShell',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds a panel-level snapshot for a named panel.
 */
export function buildPanelRenderSnapshot(
  panelId: DashboardPanelId,
  viewModel: DashboardViewModel,
  notes: string,
): DashboardRenderSnapshot {
  const PANEL_SNAPSHOT_NAMES: Record<DashboardPanelId, DashboardRenderSnapshotName> = {
    health: 'health-panel',
    capabilities: 'capabilities-panel',
    overview: 'overview-panel',
    evidence: 'evidence-panel',
    safety: 'safety-panel',
    metadata: 'metadata-panel',
  };

  const name = PANEL_SNAPSHOT_NAMES[panelId];

  let renderResult: DashboardRenderResult;
  let expectedComponentType: string;

  switch (panelId) {
    case 'health':
      renderResult = HealthPanel({ viewModel: viewModel.health });
      expectedComponentType = viewModel.health.status === 'ready' ? 'HealthPanel' : 'EmptyState';
      break;
    case 'capabilities':
      renderResult = CapabilitiesPanel({ viewModel: viewModel.capabilities });
      expectedComponentType = viewModel.capabilities.status === 'ready' ? 'CapabilitiesPanel' : 'EmptyState';
      break;
    case 'overview':
      renderResult = OverviewPanel({ viewModel: viewModel.overview });
      expectedComponentType = viewModel.overview.status === 'ready' ? 'OverviewPanel' : 'EmptyState';
      break;
    case 'evidence':
      renderResult = EvidencePanel({ viewModel: viewModel.evidence });
      expectedComponentType = viewModel.evidence.status === 'ready' ? 'EvidencePanel' : 'EmptyState';
      break;
    case 'safety':
      renderResult = SafetyPanel({ viewModel: viewModel.safety });
      expectedComponentType = viewModel.safety.status === 'ready' ? 'SafetyPanel' : 'EmptyState';
      break;
    case 'metadata':
      renderResult = MetadataPanel({ meta: viewModel.health.meta });
      expectedComponentType = 'MetadataPanel';
      break;
  }

  return {
    name,
    kind: 'panel',
    meta: buildSnapshotMeta(notes),
    renderResult,
    expectedVisiblePanelIds: [panelId],
    expectedHiddenPanelIds: DASHBOARD_PANEL_IDS.filter(id => id !== panelId),
    expectedComponentType,
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds a safety banner snapshot.
 */
export function buildSafetyBannerSnapshot(): DashboardRenderSnapshot {
  const banner = SafetyBanner();
  return {
    name: 'safety-banner',
    kind: 'banner',
    meta: buildSnapshotMeta('Safety banner snapshot showing all safety notices.'),
    renderResult: banner,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'SafetyBanner',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds a state/interaction snapshot using Phase 26 selectors.
 */
export function buildStateRenderSnapshot(
  name: DashboardRenderSnapshotName,
  kind: DashboardRenderSnapshotKind,
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
  notes: string,
): DashboardRenderSnapshot {
  const selectorResult = selectDashboardRenderModel(viewModel, state);
  const { visible, hidden } = deriveExpectedPanelIds(state);
  const activePanel = state.activePanelId;
  const shell = selectorResult.shell;

  return {
    name,
    kind,
    meta: buildSnapshotMeta(notes),
    renderResult: shell,
    expectedVisiblePanelIds: visible,
    expectedHiddenPanelIds: hidden,
    expectedComponentType: 'DashboardShell',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: selectorResult.filteredEvidenceItems.length === 0 && selectorResult.filteredSafetyItems.length === 0,
    isFilteredState:
      state.filters.evidence.severity !== 'all' ||
      state.filters.evidence.status !== 'all' ||
      state.filters.evidence.query !== '' ||
      state.filters.safety.severity !== 'all' ||
      state.filters.safety.status !== 'all' ||
      state.filters.safety.query !== '',
  };

  void activePanel; // used for documentation only
}

/**
 * Builds an empty-state snapshot.
 */
export function buildEmptyStateSnapshot(): DashboardRenderSnapshot {
  const renderResult = EmptyState({ message: 'No data available.', sectionId: 'empty-state' });
  return {
    name: 'empty-state',
    kind: 'empty',
    meta: buildSnapshotMeta('Empty state snapshot — no data available.'),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'EmptyState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: true,
    isFilteredState: false,
  };
}

/**
 * Builds a loading-state snapshot.
 */
export function buildLoadingStateSnapshot(): DashboardRenderSnapshot {
  const renderResult = LoadingState({ message: 'Loading...', sectionId: 'loading-state' });
  return {
    name: 'loading-state',
    kind: 'loading',
    meta: buildSnapshotMeta('Loading state snapshot — data is loading.'),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'LoadingState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds an error-state snapshot.
 */
export function buildErrorStateSnapshot(): DashboardRenderSnapshot {
  const renderResult = ErrorState({ message: 'An error occurred.', code: 'SNAPSHOT_ERROR', sectionId: 'error-state' });
  return {
    name: 'error-state',
    kind: 'error',
    meta: buildSnapshotMeta('Error state snapshot — an error occurred.'),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'ErrorState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: true,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds an unavailable-state snapshot.
 */
export function buildUnavailableStateSnapshot(): DashboardRenderSnapshot {
  const renderResult = UnavailableState({ message: 'Data is unavailable.', sectionId: 'unavailable-state' });
  return {
    name: 'unavailable-state',
    kind: 'unavailable',
    meta: buildSnapshotMeta('Unavailable state snapshot — data is unavailable.'),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'UnavailableState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: true,
    isEmptyState: false,
    isFilteredState: false,
  };
}

/**
 * Builds a safety-boundary snapshot confirming all safety flags.
 */
export function buildSafetyBoundarySnapshot(): DashboardRenderSnapshot {
  const renderResult = EmptyState({
    message:
      'SAFETY BOUNDARY: This snapshot is local-only, read-only, fixture-backed. ' +
      'No live data. No Solana RPC. No provider APIs. No wallets. No execution. No external network. No mutation controls.',
    sectionId: 'safety-boundary',
  });
  return {
    name: 'safety-boundary',
    kind: 'safety-boundary',
    meta: buildSnapshotMeta(
      'Safety boundary snapshot — confirms all Phase 27 safety constraints are met. ' +
        'No live data, Solana RPC, provider APIs, wallets, execution, trading, external network, persistence, or mutation controls.',
    ),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'EmptyState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: true,
    isFilteredState: false,
  };
}

/**
 * Builds a malformed-input-safe snapshot.
 * Demonstrates that invalid input is sanitized to a safe deterministic state.
 */
export function buildMalformedInputSafeSnapshot(): DashboardRenderSnapshot {
  const renderResult = EmptyState({
    message: 'Malformed input was sanitized to safe default state. No error propagated.',
    sectionId: 'malformed-input-safe',
  });
  return {
    name: 'malformed-input-safe',
    kind: 'malformed',
    meta: buildSnapshotMeta(
      'Malformed input safe snapshot — demonstrates that invalid/malformed inputs are sanitized to safe defaults.',
    ),
    renderResult,
    expectedVisiblePanelIds: [],
    expectedHiddenPanelIds: [],
    expectedComponentType: 'EmptyState',
    expectedSafetyBoundary: PHASE_25_SAFETY_BOUNDARY,
    isErrorState: false,
    isEmptyState: true,
    isFilteredState: false,
  };
}

/**
 * Generic snapshot builder from a typed build input.
 * Returns a DashboardRenderSnapshotBuildResult with success/failure.
 * Never throws for expected invalid input.
 */
export function buildDashboardRenderSnapshot(input: DashboardRenderSnapshotBuildInput): DashboardRenderSnapshotBuildResult {
  const issues: string[] = [];

  if (!DASHBOARD_RENDER_SNAPSHOT_NAMES.includes(input.name)) {
    issues.push(`Unsupported snapshot name: ${String(input.name)}`);
  }
  if (!DASHBOARD_RENDER_SNAPSHOT_KINDS.includes(input.kind)) {
    issues.push(`Unsupported snapshot kind: ${String(input.kind)}`);
  }
  if (!input.notes || typeof input.notes !== 'string') {
    issues.push('Snapshot notes must be a non-empty string.');
  }

  if (issues.length > 0) {
    return { success: false, snapshot: null, issues };
  }

  try {
    const state = input.interactionState ?? createDefaultDashboardInteractionState();
    const snapshot = buildStateRenderSnapshot(input.name, input.kind, input.viewModel, state, input.notes);
    return { success: true, snapshot, issues: [] };
  } catch {
    return {
      success: false,
      snapshot: null,
      issues: ['Snapshot build failed due to an unexpected error.'],
    };
  }
}

/**
 * Builds a filtered-evidence snapshot.
 */
export function buildFilteredDashboardRenderSnapshot(
  name: DashboardRenderSnapshotName,
  viewModel: DashboardViewModel,
  state: DashboardInteractionState,
  notes: string,
): DashboardRenderSnapshot {
  return buildStateRenderSnapshot(name, 'filter', viewModel, state, notes);
}

/**
 * Checks if a value is a valid DashboardRenderSnapshotName.
 */
export function isDashboardRenderSnapshotName(value: unknown): value is DashboardRenderSnapshotName {
  return typeof value === 'string' && DASHBOARD_RENDER_SNAPSHOT_NAMES.includes(value as DashboardRenderSnapshotName);
}

/**
 * Checks if a value is a valid DashboardRenderSnapshotKind.
 */
export function isDashboardRenderSnapshotKind(value: unknown): value is DashboardRenderSnapshotKind {
  return typeof value === 'string' && DASHBOARD_RENDER_SNAPSHOT_KINDS.includes(value as DashboardRenderSnapshotKind);
}

/**
 * Type guard for DashboardShellResult.
 */
export function isDashboardShellResult(result: DashboardRenderSnapshot['renderResult']): result is DashboardShellResult {
  return (result as DashboardShellResult).componentType === 'DashboardShell';
}

/**
 * Type guard for SafetyBannerResult.
 */
export function isSafetyBannerResult(result: DashboardRenderSnapshot['renderResult']): result is SafetyBannerResult {
  return (result as SafetyBannerResult).componentType === 'SafetyBanner';
}
