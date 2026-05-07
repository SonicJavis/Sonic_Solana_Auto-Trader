/**
 * apps/dashboard/src/capabilities.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Capabilities
 *
 * Phase 25/26/27 dashboard capability flags.
 * All unsafe flags are permanently false.
 * Phase 25 adds the local read-only dashboard UI shell.
 * Phase 26 adds local dashboard interaction state and filters.
 * Phase 27 adds deterministic render snapshots and regression fixtures.
 */

import type { DashboardUiShellCapabilities } from './types.js';

/**
 * Returns the Phase 25/26/27 dashboard capabilities.
 *
 * All unsafe capabilities (live data, trading controls, wallet controls,
 * mutation controls, execution controls, external network, real-time updates,
 * wallet connection, persistence, snapshot persistence, snapshot live data,
 * snapshot external network, snapshot mutation controls) are permanently false.
 *
 * The UI shell is:
 * - Local only
 * - Read only
 * - Fixture backed
 * - Deterministic
 * - Non-mutating
 * - External-network-free
 */
export function getDashboardUiShellCapabilities(): DashboardUiShellCapabilities {
  return {
    dashboardUiShell: true,
    localReadOnlyDashboard: true,
    fixtureBackedDashboardUi: true,
    dashboardUsesViewModels: true,
    dashboardInteractionState: true,
    localDashboardFilters: true,
    inMemoryDashboardState: true,
    deterministicDashboardState: true,
    dashboardPanelVisibility: true,
    dashboardFilterSelectors: true,
    // Phase 27 snapshot capabilities
    dashboardRenderSnapshots: true,
    dashboardRegressionFixtures: true,
    deterministicRenderSnapshots: true,
    snapshotSafetyValidation: true,
    fixtureBackedRenderSnapshots: true,
    dashboardPersistentState: false,
    dashboardExternalStateSync: false,
    dashboardLiveFilters: false,
    dashboardExternalNetwork: false,
    dashboardLiveData: false,
    dashboardTradingControls: false,
    dashboardWalletControls: false,
    dashboardMutationControls: false,
    dashboardExecutionControls: false,
    dashboardWalletConnection: false,
    dashboardRealTimeUpdates: false,
    // Phase 27 snapshot unsafe flags (all false)
    dashboardSnapshotPersistence: false,
    dashboardSnapshotExternalNetwork: false,
    dashboardSnapshotLiveData: false,
    dashboardSnapshotMutationControls: false,
  };
}
