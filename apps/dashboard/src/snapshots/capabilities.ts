/**
 * apps/dashboard/src/snapshots/capabilities.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Capabilities
 *
 * Returns Phase 27 snapshot capability flags.
 * All unsafe flags are permanently false.
 */

import type { DashboardSnapshotCapabilities } from './types.js';

/**
 * Returns the Phase 27 dashboard snapshot capabilities.
 *
 * Unsafe capabilities (persistence, external network, live data, mutation controls)
 * are permanently false.
 */
export function getDashboardSnapshotCapabilities(): DashboardSnapshotCapabilities {
  return {
    dashboardRenderSnapshots: true,
    dashboardRegressionFixtures: true,
    deterministicRenderSnapshots: true,
    snapshotSafetyValidation: true,
    fixtureBackedRenderSnapshots: true,
    dashboardSnapshotPersistence: false,
    dashboardSnapshotExternalNetwork: false,
    dashboardSnapshotLiveData: false,
    dashboardSnapshotMutationControls: false,
  };
}
