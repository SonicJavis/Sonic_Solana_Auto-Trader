/**
 * apps/dashboard/src/report-serialization/index.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Public API Barrel
 */

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
} from './types.js';

export {
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS,
} from './types.js';

export {
  buildDashboardReportSerializationPreview,
  buildJsonReportPreview,
  buildMarkdownReportPreview,
  buildTextReportPreview,
  buildMetadataReportPreview,
} from './builders.js';

export {
  sortKeysDeep,
  stablePrettyJsonStringify,
  stableDeterministicChecksum,
  normalizeDashboardReportSerializationPreview,
  serializeDashboardReportSerializationPreview,
  isDashboardReportSerializationPreviewSerializable,
  areDashboardReportSerializationPreviewsEqual,
} from './normalization.js';

export {
  validateDashboardReportSerializationPreview,
  validateDashboardReportSerializationPreviewSafety,
} from './validation.js';

export {
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
} from './fixtures.js';
