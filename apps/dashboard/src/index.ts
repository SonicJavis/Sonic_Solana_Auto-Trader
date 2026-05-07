/**
 * apps/dashboard/src/index.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Public API Barrel
 *
 * Exports the local read-only dashboard UI shell components,
 * view model source, Phase 25/26/27/28 capability metadata, Phase 26 local
 * in-memory interaction state helpers, Phase 27 snapshots, and Phase 28 reports.
 *
 * What this module provides:
 *   - DashboardShell — top-level dashboard shell component
 *   - SafetyBanner — safety boundary notice component
 *   - MetadataPanel — phase/safety metadata panel
 *   - HealthPanel — health view model panel
 *   - CapabilitiesPanel — capabilities view model panel
 *   - OverviewPanel — overview view model panel
 *   - EvidencePanel — evidence view model panel
 *   - SafetyPanel — safety view model panel
 *   - EmptyState — empty state panel
 *   - LoadingState — loading state panel
 *   - ErrorState — error state panel
 *   - UnavailableState — unavailable state panel
 *   - StatusBadge — status badge component
 *   - buildFixtureDashboardViewModel — fixture-backed view model builder
 *   - getDashboardUiShellCapabilities — Phase 25 capability flags
 *   - Phase 26 local interaction state types/helpers/selectors
 *   - Phase 28 local report model types/helpers/fixtures/validation
 *   - PHASE_25_SAFETY_BOUNDARY — shared safety boundary constant
 *   - All dashboard UI shell types
 *
 * What this module does NOT provide:
 *   - No live data
 *   - No network requests (no HTTP or web socket clients)
 *   - No Solana RPC
 *   - No provider APIs
 *   - No wallet integration
 *   - No private keys
 *   - No execution logic
 *   - No trading controls
 *   - No mutation controls
 *   - No external network access
 *   - No browser-specific APIs for unsafe side effects
 *   - No filesystem or browser report export behavior
 *
 * IMPORTANT: This UI shell is local-only, read-only, fixture-only,
 * deterministic, offline, non-mutating, and external-network-free.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  DashboardItem,
  DashboardSection,
  StatusBadgeResult,
  DashboardSafetyBoundary,
  DashboardRenderResult,
  SafetyBannerResult,
  DashboardNavEntry,
  DashboardShellResult,
  DashboardUiShellCapabilities,
} from './types.js';

// ─── Components ───────────────────────────────────────────────────────────────

export { StatusBadge } from './components/StatusBadge.js';
export type { StatusBadgeProps } from './components/StatusBadge.js';

export { SafetyBanner, PHASE_25_SAFETY_BOUNDARY, SAFETY_BANNER_NOTICES } from './components/SafetyBanner.js';

export { MetadataPanel } from './components/MetadataPanel.js';
export type { MetadataPanelProps } from './components/MetadataPanel.js';

export { HealthPanel } from './components/HealthPanel.js';
export type { HealthPanelProps } from './components/HealthPanel.js';

export { CapabilitiesPanel } from './components/CapabilitiesPanel.js';
export type { CapabilitiesPanelProps } from './components/CapabilitiesPanel.js';

export { OverviewPanel } from './components/OverviewPanel.js';
export type { OverviewPanelProps } from './components/OverviewPanel.js';

export { EvidencePanel } from './components/EvidencePanel.js';
export type { EvidencePanelProps } from './components/EvidencePanel.js';

export { SafetyPanel } from './components/SafetyPanel.js';
export type { SafetyPanelProps } from './components/SafetyPanel.js';

export { EmptyState } from './components/EmptyState.js';
export type { EmptyStateProps } from './components/EmptyState.js';

export { LoadingState } from './components/LoadingState.js';
export type { LoadingStateProps } from './components/LoadingState.js';

export { ErrorState } from './components/ErrorState.js';
export type { ErrorStateProps } from './components/ErrorState.js';

export { UnavailableState } from './components/UnavailableState.js';
export type { UnavailableStateProps } from './components/UnavailableState.js';

export { DashboardShell } from './components/DashboardShell.js';
export type { DashboardShellProps } from './components/DashboardShell.js';

// ─── View model source ────────────────────────────────────────────────────────

export {
  buildFixtureDashboardViewModel,
  getViewModelSourceDescription,
  getViewModelSourceMeta,
} from './view-model-source.js';

// ─── Capabilities ─────────────────────────────────────────────────────────────

export { getDashboardUiShellCapabilities } from './capabilities.js';

// ─── Phase 26 interaction state ────────────────────────────────────────────────

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
} from './state/index.js';

export {
  DASHBOARD_PANEL_IDS,
  DASHBOARD_EVIDENCE_SEVERITIES,
  DASHBOARD_ITEM_STATUS_FILTERS,
  DASHBOARD_LOCAL_ITEM_STATES,
  DASHBOARD_EVIDENCE_SORT_FIELDS,
  DASHBOARD_SAFETY_SORT_FIELDS,
  DASHBOARD_SORT_DIRECTIONS,
  createDefaultDashboardInteractionState,
  createDefaultDashboardPanelVisibilityState,
  createDefaultDashboardEvidenceFilterState,
  createDefaultDashboardSafetyFilterState,
  createDefaultDashboardFilterState,
  createDefaultDashboardSortState,
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
  buildDashboardEvidenceItems,
  buildDashboardSafetyItems,
  applyDashboardEvidenceFilters,
  applyDashboardSafetyFilters,
  applyDashboardEvidenceSort,
  applyDashboardSafetySort,
  setDashboardActivePanel,
  toggleDashboardPanelVisibility,
  setDashboardPanelVisibility,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  updateDashboardSortState,
  resetDashboardInteractionState,
  updateDashboardInteractionState,
  validateAndNormalizeDashboardInteractionState,
  selectDashboardPanels,
  selectVisibleDashboardPanels,
  selectActiveDashboardPanel,
  selectFilteredEvidenceItems,
  selectFilteredSafetyItems,
  selectDashboardRenderModel,
  applyDashboardInteractionState,
} from './state/index.js';

// ─── Phase 27 render snapshots ─────────────────────────────────────────────────

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
} from './snapshots/index.js';

export {
  DASHBOARD_RENDER_SNAPSHOT_NAMES,
  DASHBOARD_RENDER_SNAPSHOT_KINDS,
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
  normalizeDashboardRenderSnapshot,
  serializeDashboardRenderSnapshot,
  isDashboardRenderSnapshotSerializable,
  areDashboardRenderSnapshotsEqual,
  getDashboardRenderSnapshotSummary,
  validateDashboardRenderSnapshot,
  validateDashboardRenderSnapshotSafety,
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
  getDashboardSnapshotCapabilities,
} from './snapshots/index.js';

// ─── Phase 28 report export models ──────────────────────────────────────────────

export type {
  DashboardReportModel,
  DashboardReportName,
  DashboardReportKind,
  DashboardReportSection,
  DashboardReportSectionKind,
  DashboardReportMeta,
  DashboardReportSummary,
  DashboardReportSafetyBoundary,
  DashboardReportValidationResult,
  DashboardReportValidationIssue,
  DashboardReportBuildInput,
  DashboardReportBuildResult,
  DashboardReportSafetyResult,
  DashboardReportFixture,
  DashboardReportFixtureName,
  DashboardReportCapabilities,
} from './reports/index.js';

export {
  DASHBOARD_REPORT_NAMES,
  DASHBOARD_REPORT_KINDS,
  DASHBOARD_REPORT_SECTION_KINDS,
  buildDashboardReportModel,
  buildDefaultDashboardReportModel,
  buildSnapshotInventoryReportModel,
  buildDashboardReportSection,
  buildDashboardSafetyBoundaryReport,
  buildSnapshotBackedReportFromFixture,
  normalizeDashboardReportModel,
  serializeDashboardReportModel,
  isDashboardReportSerializable,
  areDashboardReportsEqual,
  validateDashboardReportModel,
  validateDashboardReportSafety,
  FULL_DASHBOARD_REPORT_FIXTURE,
  HEALTH_REPORT_SECTION_FIXTURE,
  CAPABILITIES_REPORT_SECTION_FIXTURE,
  OVERVIEW_REPORT_SECTION_FIXTURE,
  EVIDENCE_REPORT_SECTION_FIXTURE,
  SAFETY_REPORT_SECTION_FIXTURE,
  METADATA_REPORT_SECTION_FIXTURE,
  INTERACTION_STATE_REPORT_SECTION_FIXTURE,
  FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE,
  FILTERED_SAFETY_REPORT_SECTION_FIXTURE,
  SNAPSHOT_INVENTORY_REPORT_FIXTURE,
  SAFETY_BOUNDARY_REPORT_FIXTURE,
  ERROR_STATE_REPORT_FIXTURE,
  EMPTY_STATE_REPORT_FIXTURE,
  LOADING_STATE_REPORT_FIXTURE,
  UNAVAILABLE_STATE_REPORT_FIXTURE,
  NO_RESULTS_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REPORT_FIXTURE,
  REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE,
  EXPORT_DISABLED_SAFETY_REPORT_FIXTURE,
  PHASE_28_REPORT_FIXTURES,
  listDashboardReportFixtures,
  getDashboardReportFixture,
  getDashboardReportCapabilities,
} from './reports/index.js';
