/**
 * apps/dashboard/src/snapshots/fixtures.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Fixtures
 *
 * Deterministic regression fixture definitions for all 20 required snapshot cases.
 *
 * All fixtures are:
 * - Static or generated only from deterministic Phase 23 fixtures
 * - Typed
 * - Serializable
 * - Sanitized (no secrets, no stack traces, no local paths, no wall-clock timestamps)
 * - Free of live data, persistence, network, mutation controls, wallet/trading/execution controls
 *
 * SAFETY: All fixtures use Phase 23 fixtures -> Phase 24 view models -> Phase 25 render shells ->
 *         Phase 26 interaction state -> Phase 27 snapshots.
 */

import type {
  DashboardRenderSnapshotFixture,
  DashboardRenderSnapshotSuite,
} from './types.js';
import {
  buildDefaultDashboardRenderSnapshot,
  buildSafetyBannerSnapshot,
  buildPanelRenderSnapshot,
  buildEmptyStateSnapshot,
  buildLoadingStateSnapshot,
  buildErrorStateSnapshot,
  buildUnavailableStateSnapshot,
  buildStateRenderSnapshot,
  buildFilteredDashboardRenderSnapshot,
  buildSafetyBoundarySnapshot,
  buildMalformedInputSafeSnapshot,
} from './builders.js';
import { buildFixtureDashboardViewModel } from '../view-model-source.js';
import {
  createDefaultDashboardInteractionState,
} from '../state/default-state.js';
import {
  setDashboardActivePanel,
  setDashboardPanelVisibility,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  resetDashboardInteractionState,
} from '../state/reducer.js';

// ─── Shared fixture view model (built once from Phase 23 fixtures) ─────────────

const FIXTURE_VIEW_MODEL = buildFixtureDashboardViewModel();

// ─── Fixture 1: Default dashboard shell ──────────────────────────────────────

export const DEFAULT_DASHBOARD_SHELL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'default-dashboard-shell',
  description: 'Full default dashboard shell snapshot built from Phase 23 fixtures and Phase 24 view models.',
  snapshot: buildDefaultDashboardRenderSnapshot(FIXTURE_VIEW_MODEL),
};

// ─── Fixture 2: Safety banner ─────────────────────────────────────────────────

export const SAFETY_BANNER_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'safety-banner',
  description: 'Safety banner snapshot showing all safety notices.',
  snapshot: buildSafetyBannerSnapshot(),
};

// ─── Fixture 3: Metadata panel ────────────────────────────────────────────────

export const METADATA_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'metadata-panel',
  description: 'Metadata panel snapshot showing phase and safety metadata.',
  snapshot: buildPanelRenderSnapshot(
    'metadata',
    FIXTURE_VIEW_MODEL,
    'Metadata panel snapshot showing phase and safety metadata.',
  ),
};

// ─── Fixture 4: Health panel ──────────────────────────────────────────────────

export const HEALTH_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'health-panel',
  description: 'Health panel snapshot showing health status from Phase 23 fixtures.',
  snapshot: buildPanelRenderSnapshot(
    'health',
    FIXTURE_VIEW_MODEL,
    'Health panel snapshot showing health status from Phase 23 fixtures.',
  ),
};

// ─── Fixture 5: Capabilities panel ───────────────────────────────────────────

export const CAPABILITIES_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'capabilities-panel',
  description: 'Capabilities panel snapshot showing capability flags from Phase 23 fixtures.',
  snapshot: buildPanelRenderSnapshot(
    'capabilities',
    FIXTURE_VIEW_MODEL,
    'Capabilities panel snapshot showing capability flags from Phase 23 fixtures.',
  ),
};

// ─── Fixture 6: Overview panel ────────────────────────────────────────────────

export const OVERVIEW_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'overview-panel',
  description: 'Overview panel snapshot from Phase 23 fixtures.',
  snapshot: buildPanelRenderSnapshot(
    'overview',
    FIXTURE_VIEW_MODEL,
    'Overview panel snapshot from Phase 23 fixtures.',
  ),
};

// ─── Fixture 7: Evidence panel ────────────────────────────────────────────────

export const EVIDENCE_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'evidence-panel',
  description: 'Evidence panel snapshot from Phase 23 fixtures.',
  snapshot: buildPanelRenderSnapshot(
    'evidence',
    FIXTURE_VIEW_MODEL,
    'Evidence panel snapshot from Phase 23 fixtures.',
  ),
};

// ─── Fixture 8: Safety panel ──────────────────────────────────────────────────

export const SAFETY_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'safety-panel',
  description: 'Safety panel snapshot from Phase 23 fixtures.',
  snapshot: buildPanelRenderSnapshot(
    'safety',
    FIXTURE_VIEW_MODEL,
    'Safety panel snapshot from Phase 23 fixtures.',
  ),
};

// ─── Fixture 9: Empty state ───────────────────────────────────────────────────

export const EMPTY_STATE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'empty-state',
  description: 'Empty state snapshot — no data available.',
  snapshot: buildEmptyStateSnapshot(),
};

// ─── Fixture 10: Loading state ────────────────────────────────────────────────

export const LOADING_STATE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'loading-state',
  description: 'Loading state snapshot — data is loading.',
  snapshot: buildLoadingStateSnapshot(),
};

// ─── Fixture 11: Error state ──────────────────────────────────────────────────

export const ERROR_STATE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'error-state',
  description: 'Error state snapshot — an error occurred.',
  snapshot: buildErrorStateSnapshot(),
};

// ─── Fixture 12: Unavailable state ───────────────────────────────────────────

export const UNAVAILABLE_STATE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'unavailable-state',
  description: 'Unavailable state snapshot — data is unavailable.',
  snapshot: buildUnavailableStateSnapshot(),
};

// ─── Fixture 13: Active panel selected ───────────────────────────────────────

const _activePanelState = setDashboardActivePanel(
  createDefaultDashboardInteractionState(),
  'health',
).state;

export const ACTIVE_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'active-panel',
  description: 'Dashboard shell snapshot with health panel active.',
  snapshot: buildStateRenderSnapshot(
    'active-panel',
    'full-shell',
    FIXTURE_VIEW_MODEL,
    _activePanelState,
    'Dashboard shell snapshot with health panel set as active via Phase 26 state.',
  ),
};

// ─── Fixture 14: Hidden panel state ──────────────────────────────────────────

const _hiddenPanelState = setDashboardPanelVisibility(
  createDefaultDashboardInteractionState(),
  'evidence',
  false,
).state;

export const HIDDEN_PANEL_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'hidden-panel',
  description: 'Dashboard shell snapshot with evidence panel hidden.',
  snapshot: buildStateRenderSnapshot(
    'hidden-panel',
    'full-shell',
    FIXTURE_VIEW_MODEL,
    _hiddenPanelState,
    'Dashboard shell snapshot with evidence panel hidden via Phase 26 state.',
  ),
};

// ─── Fixture 15: Filtered evidence state ─────────────────────────────────────

const _filteredEvidenceState = updateDashboardEvidenceFilters(
  createDefaultDashboardInteractionState(),
  { severity: 'warning' },
).state;

export const FILTERED_EVIDENCE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'filtered-evidence',
  description: 'Dashboard shell snapshot with evidence filtered to warning severity.',
  snapshot: buildFilteredDashboardRenderSnapshot(
    'filtered-evidence',
    FIXTURE_VIEW_MODEL,
    _filteredEvidenceState,
    'Filtered evidence snapshot with severity=warning via Phase 26 filters.',
  ),
};

// ─── Fixture 16: Filtered safety state ───────────────────────────────────────

const _filteredSafetyState = updateDashboardSafetyFilters(
  createDefaultDashboardInteractionState(),
  { status: 'locked' },
).state;

export const FILTERED_SAFETY_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'filtered-safety',
  description: 'Dashboard shell snapshot with safety filtered to locked items.',
  snapshot: buildFilteredDashboardRenderSnapshot(
    'filtered-safety',
    FIXTURE_VIEW_MODEL,
    _filteredSafetyState,
    'Filtered safety snapshot with status=locked via Phase 26 filters.',
  ),
};

// ─── Fixture 17: Reset/default interaction state ──────────────────────────────

const _resetState = resetDashboardInteractionState(
  createDefaultDashboardInteractionState(),
  'all',
).state;

export const RESET_INTERACTION_STATE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'reset-interaction-state',
  description: 'Dashboard shell snapshot after resetting interaction state to defaults.',
  snapshot: buildStateRenderSnapshot(
    'reset-interaction-state',
    'state',
    FIXTURE_VIEW_MODEL,
    _resetState,
    'Dashboard shell snapshot after full reset to default state via Phase 26 reducer.',
  ),
};

// ─── Fixture 18: No-results filtered state ───────────────────────────────────

const _noResultsState = updateDashboardEvidenceFilters(
  createDefaultDashboardInteractionState(),
  { query: 'THIS_QUERY_MATCHES_NOTHING_PHASE27_REGRESSION', severity: 'failure' },
).state;

export const NO_RESULTS_FILTERED_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'no-results-filtered',
  description: 'Dashboard shell snapshot with evidence filters producing no results.',
  snapshot: buildFilteredDashboardRenderSnapshot(
    'no-results-filtered',
    FIXTURE_VIEW_MODEL,
    _noResultsState,
    'No-results filtered snapshot — query and severity filters produce empty evidence result.',
  ),
};

// ─── Fixture 19: Malformed-input-safe snapshot ────────────────────────────────

export const MALFORMED_INPUT_SAFE_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'malformed-input-safe',
  description: 'Demonstrates that malformed input is sanitized to safe defaults. No error propagated.',
  snapshot: buildMalformedInputSafeSnapshot(),
};

// ─── Fixture 20: Safety-boundary snapshot ────────────────────────────────────

export const SAFETY_BOUNDARY_FIXTURE: DashboardRenderSnapshotFixture = {
  name: 'safety-boundary',
  description:
    'Safety boundary snapshot confirming: local-only, read-only, fixture-backed, no live data, ' +
    'no Solana RPC, no provider APIs, no wallets, no execution, no external network, no mutation controls.',
  snapshot: buildSafetyBoundarySnapshot(),
};

// ─── Master fixture map ───────────────────────────────────────────────────────

/**
 * All Phase 27 regression fixtures keyed by snapshot name.
 */
export const PHASE_27_REGRESSION_FIXTURES: ReadonlyMap<
  DashboardRenderSnapshotFixture['name'],
  DashboardRenderSnapshotFixture
> = new Map([
  ['default-dashboard-shell', DEFAULT_DASHBOARD_SHELL_FIXTURE],
  ['safety-banner', SAFETY_BANNER_FIXTURE],
  ['metadata-panel', METADATA_PANEL_FIXTURE],
  ['health-panel', HEALTH_PANEL_FIXTURE],
  ['capabilities-panel', CAPABILITIES_PANEL_FIXTURE],
  ['overview-panel', OVERVIEW_PANEL_FIXTURE],
  ['evidence-panel', EVIDENCE_PANEL_FIXTURE],
  ['safety-panel', SAFETY_PANEL_FIXTURE],
  ['empty-state', EMPTY_STATE_FIXTURE],
  ['loading-state', LOADING_STATE_FIXTURE],
  ['error-state', ERROR_STATE_FIXTURE],
  ['unavailable-state', UNAVAILABLE_STATE_FIXTURE],
  ['active-panel', ACTIVE_PANEL_FIXTURE],
  ['hidden-panel', HIDDEN_PANEL_FIXTURE],
  ['filtered-evidence', FILTERED_EVIDENCE_FIXTURE],
  ['filtered-safety', FILTERED_SAFETY_FIXTURE],
  ['reset-interaction-state', RESET_INTERACTION_STATE_FIXTURE],
  ['no-results-filtered', NO_RESULTS_FILTERED_FIXTURE],
  ['malformed-input-safe', MALFORMED_INPUT_SAFE_FIXTURE],
  ['safety-boundary', SAFETY_BOUNDARY_FIXTURE],
]);

/**
 * Returns all Phase 27 regression fixture names in stable alphabetical order.
 */
export function listDashboardRenderSnapshotFixtures(): readonly DashboardRenderSnapshotFixture['name'][] {
  return [...PHASE_27_REGRESSION_FIXTURES.keys()].sort();
}

/**
 * Returns a specific Phase 27 regression fixture by name.
 * Returns undefined if not found.
 */
export function getDashboardRenderSnapshotFixture(
  name: DashboardRenderSnapshotFixture['name'],
): DashboardRenderSnapshotFixture | undefined {
  return PHASE_27_REGRESSION_FIXTURES.get(name);
}

/**
 * Phase 27 fixture suite containing all regression fixtures.
 */
export const PHASE_27_FIXTURE_SUITE: DashboardRenderSnapshotSuite = {
  suiteName: 'Phase 27 Dashboard Render Snapshots',
  description:
    'Complete regression fixture suite for Phase 27 local dashboard render snapshots. ' +
    'All fixtures are deterministic, local-only, read-only, fixture-backed, and external-network-free.',
  fixtures: [...PHASE_27_REGRESSION_FIXTURES.values()],
};
