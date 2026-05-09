/**
 * apps/dashboard/src/index.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Public API Barrel
 *
 * Exports the local read-only dashboard UI shell components,
 * view model source, Phase 25/26/27/28/29 capability metadata, Phase 26 local
 * in-memory interaction state helpers, Phase 27 snapshots, Phase 28 reports, and
 * Phase 29 serialization previews.
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
 *   - Phase 29 local report serialization preview types/helpers/fixtures/validation
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

// ─── Phase 29 report serialization previews ─────────────────────────────────────

export type {
  DashboardReportSerializationPreview,
  DashboardReportSerializationPreviewFormat,
  DashboardReportSerializationPreviewName,
  DashboardReportSerializationPreviewKind,
  DashboardReportSerializationPreviewMeta,
  DashboardReportSerializationPreviewSafetyBoundary,
  DashboardReportSerializationPreviewBuildInput,
  DashboardReportSerializationPreviewBuildResult,
  DashboardReportSerializationPreviewValidationResult,
  DashboardReportSerializationPreviewValidationIssue,
  DashboardReportSerializationPreviewSafetyResult,
  DashboardReportSerializationPreviewFixture,
  DashboardReportSerializationPreviewFixtureName,
  DashboardReportSerializationPreviewCapabilities,
} from './report-serialization/index.js';

export {
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS,
  buildDashboardReportSerializationPreview,
  buildJsonReportPreview,
  buildMarkdownReportPreview,
  buildTextReportPreview,
  buildMetadataReportPreview,
  sortKeysDeep,
  stablePrettyJsonStringify,
  stableDeterministicChecksum,
  normalizeDashboardReportSerializationPreview,
  serializeDashboardReportSerializationPreview,
  isDashboardReportSerializationPreviewSerializable,
  areDashboardReportSerializationPreviewsEqual,
  validateDashboardReportSerializationPreview,
  validateDashboardReportSerializationPreviewSafety,
  FULL_DASHBOARD_JSON_PREVIEW_FIXTURE,
  FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE,
  FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE,
  METADATA_ONLY_PREVIEW_FIXTURE,
  HEALTH_SECTION_PREVIEW_FIXTURE,
  CAPABILITIES_SECTION_PREVIEW_FIXTURE,
  OVERVIEW_SECTION_PREVIEW_FIXTURE,
  EVIDENCE_SECTION_PREVIEW_FIXTURE,
  SAFETY_SECTION_PREVIEW_FIXTURE,
  SNAPSHOT_INVENTORY_PREVIEW_FIXTURE,
  SAFETY_BOUNDARY_PREVIEW_FIXTURE,
  EXPORT_DISABLED_PREVIEW_FIXTURE,
  MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE,
  VALIDATION_FAILURE_PREVIEW_FIXTURE,
  NO_RESULTS_PREVIEW_FIXTURE,
  PHASE_29_SERIALIZATION_PREVIEW_FIXTURES,
  listDashboardReportSerializationPreviewFixtures,
  getDashboardReportSerializationPreviewFixture,
} from './report-serialization/index.js';

// ─── Phase 35 composite evidence dashboard/report fixtures ────────────────────

export type {
  CompositeEvidenceDashboardReportFixture,
  CompositeEvidenceDashboardReportFixtureName,
  CompositeEvidenceDashboardReportFixtureKind,
  CompositeEvidenceDashboardFixture,
  CompositeEvidenceReportFixture,
  CompositeEvidencePanelFixture,
  CompositeEvidenceReportSectionFixture,
  CompositeEvidenceFixtureMeta,
  CompositeEvidenceFixtureSummary,
  CompositeEvidenceFixtureValidationResult,
  CompositeEvidenceFixtureValidationIssue,
  CompositeEvidenceFixtureSafetyResult,
  CompositeEvidenceFixtureBuildInput,
  CompositeEvidenceFixtureBuildResult,
  CompositeEvidenceDashboardReportFixtureCapabilities,
} from './composite-evidence-fixtures/index.js';

export {
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE,
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES,
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS,
  normalizeCompositeEvidenceDashboardReportFixture,
  normalizeCompositeEvidenceDashboardFixture,
  normalizeCompositeEvidenceReportFixture,
  isCompositeEvidenceDashboardReportFixtureSerializable,
  areCompositeEvidenceDashboardReportFixturesEqual,
  isValidCompositeEvidenceFixtureName,
  isValidCompositeEvidenceFixtureKind,
  validateCompositeEvidenceDashboardReportFixture,
  validateCompositeEvidenceDashboardReportSafety,
  buildCompositeEvidenceDashboardFixture,
  buildCompositeEvidenceReportFixture,
  buildCompositeEvidenceDashboardReportFixture,
  buildCompositeEvidenceFixture,
  CLEAN_LOW_RISK_DASHBOARD_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE,
  CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE,
  MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE,
  INSUFFICIENT_DATA_DASHBOARD_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE,
  SAFETY_BOUNDARY_DASHBOARD_FIXTURE,
  MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE,
  CLEAN_LOW_RISK_REPORT_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE,
  CE_SAFETY_BOUNDARY_REPORT_FIXTURE,
  DASHBOARD_READY_COMBINED_FIXTURE,
  REPORT_READY_COMBINED_FIXTURE,
  SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
  PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
  PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
  listCompositeEvidenceDashboardReportFixtures,
  getCompositeEvidenceDashboardReportFixture,
  getCompositeEvidenceDashboardReportFixtureCapabilities,
} from './composite-evidence-fixtures/index.js';

// ─── Phase 40 strategy review dashboard fixtures ───────────────────────────────

export type {
  StrategyReviewDashboardFixture,
  StrategyReviewDashboardFixtureName,
  StrategyReviewDashboardFixtureKind,
  StrategyReviewMatrixReference,
  StrategyReviewPanelFixture,
  StrategyReviewCardFixture,
  StrategyReviewTableFixture,
  StrategyReviewTableRowFixture,
  StrategyReviewTableColumnFixture,
  StrategyReviewSummaryFixture,
  StrategyReviewSafetyBoundary,
  StrategyReviewValidationResult,
  StrategyReviewValidationIssue,
  StrategyReviewSafetyResult,
  StrategyReviewBuildInput,
  StrategyReviewBuildResult,
  StrategyReviewDashboardFixtureCapabilities,
} from './strategy-review-fixtures/index.js';

export {
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS,
  buildStrategyReviewDashboardFixture,
  buildStrategyReviewSummary,
  normalizeStrategyReviewDashboardFixture,
  serializeStrategyReviewDashboardFixture,
  areStrategyReviewDashboardFixturesEqual,
  isStrategyReviewDashboardFixtureSerializable,
  validateStrategyReviewDashboardFixture,
  validateStrategyReviewDashboardSafety,
  getStrategyReviewDashboardFixtureCapabilities,
  DEFENSIVE_VS_AGGRESSIVE_REVIEW_DASHBOARD_FIXTURE,
  CREATOR_LED_REVIEW_DASHBOARD_FIXTURE,
  WALLET_LED_REVIEW_DASHBOARD_FIXTURE,
  MANIPULATION_AVOIDANCE_REVIEW_DASHBOARD_FIXTURE,
  NO_ACTION_SAFETY_REVIEW_DASHBOARD_FIXTURE,
  INSUFFICIENT_DATA_REVIEW_DASHBOARD_FIXTURE,
  HIGH_SCORE_POSITIVE_REVIEW_DASHBOARD_FIXTURE,
  HIGH_SCORE_FALSE_POSITIVE_REVIEW_DASHBOARD_FIXTURE,
  MISSED_OPPORTUNITY_REVIEW_DASHBOARD_FIXTURE,
  DRAWDOWN_CONTAINED_REVIEW_DASHBOARD_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_REVIEW_DASHBOARD_FIXTURE,
  FALSE_POSITIVE_PROTECTION_REVIEW_DASHBOARD_FIXTURE,
  MALFORMED_INPUT_SAFE_REVIEW_DASHBOARD_FIXTURE,
  DASHBOARD_READY_STRATEGY_REVIEW_FIXTURE,
  REPORT_READY_STRATEGY_REVIEW_FIXTURE,
  SAFETY_BOUNDARY_STRATEGY_REVIEW_FIXTURE,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES,
  listStrategyReviewDashboardFixtures,
  getStrategyReviewDashboardFixture,
} from './strategy-review-fixtures/index.js';

// ─── Phase 41 strategy review report fixtures ──────────────────────────────────

export type {
  StrategyReviewReportFixture,
  StrategyReviewReportFixtureName,
  StrategyReviewReportFixtureKind,
  StrategyReviewDashboardReference,
  StrategyReviewReportSectionFixture,
  StrategyReviewReportCardFixture,
  StrategyReviewReportTableFixture,
  StrategyReviewReportTableRowFixture,
  StrategyReviewReportTableColumnFixture,
  StrategyReviewReportSummaryFixture,
  StrategyReviewReportSafetyBoundary,
  StrategyReviewReportValidationResult,
  StrategyReviewReportValidationIssue,
  StrategyReviewReportSafetyResult,
  StrategyReviewReportBuildInput,
  StrategyReviewReportBuildResult,
  StrategyReviewReportFixtureCapabilities,
} from './strategy-review-reports/index.js';

export {
  PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
  PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
  STRATEGY_REVIEW_REPORT_FIXTURE_KINDS,
  buildStrategyReviewReportFixture,
  buildStrategyReviewReportSummary,
  normalizeStrategyReviewReportFixture,
  serializeStrategyReviewReportFixture,
  areStrategyReviewReportFixturesEqual,
  isStrategyReviewReportFixtureSerializable,
  validateStrategyReviewReportFixture,
  validateStrategyReviewReportSafety,
  getStrategyReviewReportFixtureCapabilities,
  DEFENSIVE_VS_AGGRESSIVE_REVIEW_REPORT_FIXTURE,
  CREATOR_LED_REVIEW_REPORT_FIXTURE,
  WALLET_LED_REVIEW_REPORT_FIXTURE,
  MANIPULATION_AVOIDANCE_REVIEW_REPORT_FIXTURE,
  NO_ACTION_SAFETY_REVIEW_REPORT_FIXTURE,
  INSUFFICIENT_DATA_REVIEW_REPORT_FIXTURE,
  HIGH_SCORE_POSITIVE_REVIEW_REPORT_FIXTURE,
  HIGH_SCORE_FALSE_POSITIVE_REVIEW_REPORT_FIXTURE,
  MISSED_OPPORTUNITY_REVIEW_REPORT_FIXTURE,
  DRAWDOWN_CONTAINED_REVIEW_REPORT_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_REVIEW_REPORT_FIXTURE,
  FALSE_POSITIVE_PROTECTION_REVIEW_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REVIEW_REPORT_FIXTURE,
  DASHBOARD_READY_STRATEGY_REVIEW_REPORT_FIXTURE,
  SERIALIZATION_READY_STRATEGY_REVIEW_REPORT_FIXTURE,
  SAFETY_BOUNDARY_STRATEGY_REVIEW_REPORT_FIXTURE,
  PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES,
  listStrategyReviewReportFixtures,
  getStrategyReviewReportFixture,
} from './strategy-review-reports/index.js';
export {
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS,
  getStrategyReviewSerializationPreviewCapabilities,
  buildStrategyReviewSerializationPreviewFixture,
  buildStrategyReviewSerializationSummary,
  normalizeStrategyReviewSerializationPreviewFixture,
  serializeStrategyReviewSerializationPreviewFixture,
  areStrategyReviewSerializationPreviewFixturesEqual,
  isStrategyReviewSerializationPreviewFixtureSerializable,
  validateStrategyReviewSerializationPreviewFixture,
  validateStrategyReviewSerializationSafety,
  listStrategyReviewSerializationPreviewFixtures,
  getStrategyReviewSerializationPreviewFixture,
  DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE,
  CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE,
  WALLET_LED_TEXT_PREVIEW_FIXTURE,
  MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE,
  NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE,
  INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE,
  HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE,
  HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE,
  MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE,
  DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE,
  FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE,
  MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE as STRATEGY_REVIEW_MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE,
  DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE,
  REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE,
  SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST,
  SERIALIZATION_NAME_TO_REPORT,
  SERIALIZATION_NAME_TO_KIND,
  SERIALIZATION_NAME_TO_FORMAT,
} from './strategy-review-serialization/index.js';


// ─── Phase 43 strategy review export planning fixtures ─────────────────────────

export type {
  StrategyReviewExportPlanFixture,
  StrategyReviewExportPlanFixtureName,
  StrategyReviewExportPlanFixtureKind,
  StrategyReviewExportPlanTarget,
  StrategyReviewSerializationPreviewReference,
  StrategyReviewExportFileExtension,
  StrategyReviewExportPlanDefinition,
  StrategyReviewExportPlanMeta,
  StrategyReviewExportPlanSafetyBoundary,
  StrategyReviewExportPlanSummary,
  StrategyReviewExportPlanValidationResult,
  StrategyReviewExportPlanValidationIssue,
  StrategyReviewExportPlanSafetyResult,
  StrategyReviewExportPlanBuildInput,
  StrategyReviewExportPlanBuildResult,
  StrategyReviewExportPlanCapabilities,
} from './strategy-review-export-planning/index.js';

export {
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS,
  getStrategyReviewExportPlanCapabilities,
  buildStrategyReviewExportPlanFixture,
  buildStrategyReviewExportPlanSummary,
  normalizeStrategyReviewExportPlanFixture,
  serializeStrategyReviewExportPlanFixture,
  areStrategyReviewExportPlanFixturesEqual,
  isStrategyReviewExportPlanFixtureSerializable,
  validateStrategyReviewExportPlanFixture,
  validateStrategyReviewExportPlanSafety,
  listStrategyReviewExportPlanFixtures,
  getStrategyReviewExportPlanFixture,
  JSON_EXPORT_PLAN_DISABLED_FIXTURE,
  MARKDOWN_EXPORT_PLAN_DISABLED_FIXTURE,
  TEXT_EXPORT_PLAN_DISABLED_FIXTURE,
  METADATA_EXPORT_PLAN_DISABLED_FIXTURE,
  DEFENSIVE_VS_AGGRESSIVE_EXPORT_PLAN_FIXTURE,
  CREATOR_LED_EXPORT_PLAN_FIXTURE,
  WALLET_LED_EXPORT_PLAN_FIXTURE,
  MANIPULATION_AVOIDANCE_EXPORT_PLAN_FIXTURE,
  NO_ACTION_SAFETY_EXPORT_PLAN_FIXTURE,
  INSUFFICIENT_DATA_EXPORT_PLAN_FIXTURE,
  HIGH_SCORE_POSITIVE_EXPORT_PLAN_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_EXPORT_PLAN_FIXTURE,
  MALFORMED_INPUT_SAFE_EXPORT_PLAN_FIXTURE,
  DASHBOARD_READY_EXPORT_PLAN_FIXTURE,
  REPORT_READY_EXPORT_PLAN_FIXTURE,
  SAFETY_BOUNDARY_EXPORT_PLAN_FIXTURE,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST,
  EXPORT_PLAN_NAME_TO_PREVIEW,
  EXPORT_PLAN_NAME_TO_KIND,
  EXPORT_PLAN_NAME_TO_TARGET,
} from './strategy-review-export-planning/index.js';
