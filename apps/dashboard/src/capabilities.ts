/**
 * apps/dashboard/src/capabilities.ts
 *
 * Phase 26 — Local Dashboard Interaction State and Filters v1 — Capabilities
 *
 * Phase 25/26 dashboard capability flags.
 * All unsafe flags are permanently false.
 * Phase 25 adds the local read-only dashboard UI shell.
 */

import type { DashboardUiShellCapabilities } from './types.js';

/**
 * Returns the Phase 25/26 dashboard capabilities.
 *
 * All unsafe capabilities (live data, trading controls, wallet controls,
 * mutation controls, execution controls, external network, real-time updates,
 * wallet connection) are permanently false.
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
  };
}
