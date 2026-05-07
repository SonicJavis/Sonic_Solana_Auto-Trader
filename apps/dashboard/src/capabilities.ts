/**
 * apps/dashboard/src/capabilities.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Capabilities
 *
 * Phase 25/26/27/28/29 dashboard capability flags.
 * All unsafe flags are permanently false.
 * Phase 25 adds the local read-only dashboard UI shell.
 * Phase 26 adds local dashboard interaction state and filters.
 * Phase 27 adds deterministic render snapshots and regression fixtures.
 * Phase 28 adds deterministic local dashboard report export models.
 */

import type { DashboardUiShellCapabilities } from './types.js';

/**
 * Returns the Phase 25/26/27/28/29 dashboard capabilities.
 *
 * All unsafe capabilities (live data, trading controls, wallet controls,
 * mutation controls, execution controls, external network, real-time updates,
 * wallet connection, persistence, snapshot persistence, snapshot live data,
 * snapshot external network, snapshot mutation controls, report file export,
 * report persistence, report live data, report external network, and
 * report mutation controls) are permanently false.
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
    // Phase 28 report capabilities
    dashboardReportModels: true,
    dashboardReportFixtures: true,
    deterministicReportModels: true,
    reportSafetyValidation: true,
    fixtureBackedReports: true,
    dashboardReportFileExport: false,
    dashboardReportPersistence: false,
    dashboardReportExternalNetwork: false,
    dashboardReportLiveData: false,
    dashboardReportMutationControls: false,
    // Phase 29 serialization preview capabilities
    dashboardReportSerializationPreview: true,
    dashboardReportJsonPreview: true,
    dashboardReportMarkdownPreview: true,
    dashboardReportTextPreview: true,
    dashboardReportMetadataPreview: true,
    dashboardReportActualFileExport: false,
    dashboardReportDownloadSupport: false,
  };
}
