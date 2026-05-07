/**
 * apps/dashboard/src/reports/index.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Public API Barrel
 */

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
} from './types.js';

export {
  DASHBOARD_REPORT_NAMES,
  DASHBOARD_REPORT_KINDS,
  DASHBOARD_REPORT_SECTION_KINDS,
} from './types.js';

export {
  buildDashboardReportModel,
  buildDefaultDashboardReportModel,
  buildSnapshotInventoryReportModel,
  buildDashboardReportSection,
  buildDashboardSafetyBoundaryReport,
  buildSnapshotBackedReportFromFixture,
} from './builders.js';

export {
  normalizeDashboardReportModel,
  serializeDashboardReportModel,
  isDashboardReportSerializable,
  areDashboardReportsEqual,
} from './normalization.js';

export { validateDashboardReportModel, validateDashboardReportSafety } from './validation.js';

export {
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
} from './fixtures.js';

export { getDashboardReportCapabilities } from './capabilities.js';
