/**
 * apps/dashboard/src/snapshots/index.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Public API Barrel
 *
 * Exports all Phase 27 snapshot types, builders, normalization helpers,
 * validation helpers, fixtures, and capability flags.
 *
 * SAFETY: No live data. No Solana RPC. No provider APIs. No wallets.
 *         No execution. No external network. No mutation controls.
 *         No persistence. No browser storage.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  DashboardRenderSnapshot,
  DashboardRenderSnapshotName,
  DashboardRenderSnapshotKind,
  DashboardRenderSnapshotFixture,
  DashboardRenderSnapshotSuite,
  DashboardRenderSnapshotMeta,
  DashboardRenderSnapshotValidationResult,
  DashboardRenderSnapshotValidationIssue,
  DashboardRenderSnapshotBuildInput,
  DashboardRenderSnapshotBuildResult,
  DashboardRenderSnapshotSafetyResult,
  DashboardRenderSnapshotRegressionCase,
  DashboardSnapshotCapabilities,
} from './types.js';

export { DASHBOARD_RENDER_SNAPSHOT_NAMES, DASHBOARD_RENDER_SNAPSHOT_KINDS } from './types.js';

// ─── Builders ─────────────────────────────────────────────────────────────────

export {
  buildDashboardRenderSnapshot,
  buildDefaultDashboardRenderSnapshot,
  buildFilteredDashboardRenderSnapshot,
  buildPanelRenderSnapshot,
  buildStateRenderSnapshot,
  buildSafetyBannerSnapshot,
  buildEmptyStateSnapshot,
  buildLoadingStateSnapshot,
  buildErrorStateSnapshot,
  buildUnavailableStateSnapshot,
  buildSafetyBoundarySnapshot,
  buildMalformedInputSafeSnapshot,
  isDashboardRenderSnapshotName,
  isDashboardRenderSnapshotKind,
  isDashboardShellResult,
  isSafetyBannerResult,
} from './builders.js';

// ─── Normalization ────────────────────────────────────────────────────────────

export {
  normalizeDashboardRenderSnapshot,
  serializeDashboardRenderSnapshot,
  isDashboardRenderSnapshotSerializable,
  areDashboardRenderSnapshotsEqual,
  getDashboardRenderSnapshotSummary,
} from './normalization.js';

// ─── Validation ───────────────────────────────────────────────────────────────

export {
  validateDashboardRenderSnapshot,
  validateDashboardRenderSnapshotSafety,
} from './validation.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export {
  DEFAULT_DASHBOARD_SHELL_FIXTURE,
  SAFETY_BANNER_FIXTURE,
  METADATA_PANEL_FIXTURE,
  HEALTH_PANEL_FIXTURE,
  CAPABILITIES_PANEL_FIXTURE,
  OVERVIEW_PANEL_FIXTURE,
  EVIDENCE_PANEL_FIXTURE,
  SAFETY_PANEL_FIXTURE,
  EMPTY_STATE_FIXTURE,
  LOADING_STATE_FIXTURE,
  ERROR_STATE_FIXTURE,
  UNAVAILABLE_STATE_FIXTURE,
  ACTIVE_PANEL_FIXTURE,
  HIDDEN_PANEL_FIXTURE,
  FILTERED_EVIDENCE_FIXTURE,
  FILTERED_SAFETY_FIXTURE,
  RESET_INTERACTION_STATE_FIXTURE,
  NO_RESULTS_FILTERED_FIXTURE,
  MALFORMED_INPUT_SAFE_FIXTURE,
  SAFETY_BOUNDARY_FIXTURE,
  PHASE_27_REGRESSION_FIXTURES,
  PHASE_27_FIXTURE_SUITE,
  listDashboardRenderSnapshotFixtures,
  getDashboardRenderSnapshotFixture,
} from './fixtures.js';

// ─── Capabilities ─────────────────────────────────────────────────────────────

export { getDashboardSnapshotCapabilities } from './capabilities.js';
