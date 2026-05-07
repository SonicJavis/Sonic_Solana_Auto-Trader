/**
 * apps/dashboard/src/reports/validation.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Validation
 */

import type {
  DashboardReportModel,
  DashboardReportSafetyResult,
  DashboardReportValidationIssue,
  DashboardReportValidationResult,
} from './types.js';
import { DASHBOARD_REPORT_KINDS, DASHBOARD_REPORT_NAMES, DASHBOARD_REPORT_SECTION_KINDS } from './types.js';
import { DASHBOARD_RENDER_SNAPSHOT_NAMES } from '../snapshots/types.js';
import { isDashboardReportSerializable } from './normalization.js';

const FORBIDDEN_REPORT_PATTERNS: readonly string[] = [
  'TypeError: ',
  'ReferenceError: ',
  'SyntaxError: ',
  'at Object.<',
  'at Function.<',
  '/home/',
  '/Users/',
  'C:\\Users\\',
  '/root/',
  'BEGIN PRIVATE KEY',
  'seed phrase',
  'mnemonic',
  'api_key=',
  'secret=',
];

function makeIssue(code: string, message: string, field: string): DashboardReportValidationIssue {
  return { code, message, field };
}

function validateRequiredFields(report: unknown): readonly DashboardReportValidationIssue[] {
  if (report === null || typeof report !== 'object') {
    return [makeIssue('INVALID_TYPE', 'Report must be a non-null object.', 'report')];
  }

  const r = report as Record<string, unknown>;
  const issues: DashboardReportValidationIssue[] = [];

  if (typeof r['name'] !== 'string' || !r['name']) {
    issues.push(makeIssue('MISSING_NAME', 'Report name must be a non-empty string.', 'name'));
  }
  if (typeof r['kind'] !== 'string' || !r['kind']) {
    issues.push(makeIssue('MISSING_KIND', 'Report kind must be a non-empty string.', 'kind'));
  }
  if (typeof r['title'] !== 'string' || !r['title']) {
    issues.push(makeIssue('MISSING_TITLE', 'Report title must be a non-empty string.', 'title'));
  }
  if (!Array.isArray(r['sections'])) {
    issues.push(makeIssue('MISSING_SECTIONS', 'Report sections must be an array.', 'sections'));
  }
  if (r['summary'] === null || typeof r['summary'] !== 'object') {
    issues.push(makeIssue('MISSING_SUMMARY', 'Report summary must be an object.', 'summary'));
  }
  if (r['meta'] === null || typeof r['meta'] !== 'object') {
    issues.push(makeIssue('MISSING_META', 'Report meta must be an object.', 'meta'));
  }
  if (r['safetyBoundary'] === null || typeof r['safetyBoundary'] !== 'object') {
    issues.push(makeIssue('MISSING_SAFETY_BOUNDARY', 'Report safetyBoundary must be an object.', 'safetyBoundary'));
  }
  if (typeof r['expectedStatus'] !== 'string' || !r['expectedStatus']) {
    issues.push(makeIssue('MISSING_EXPECTED_STATUS', 'expectedStatus must be a non-empty string.', 'expectedStatus'));
  }
  if (!Array.isArray(r['safeNotes'])) {
    issues.push(makeIssue('MISSING_SAFE_NOTES', 'safeNotes must be an array.', 'safeNotes'));
  }

  return issues;
}

function validateSupportedValues(report: DashboardReportModel): readonly DashboardReportValidationIssue[] {
  const issues: DashboardReportValidationIssue[] = [];

  if (!DASHBOARD_REPORT_NAMES.includes(report.name)) {
    issues.push(makeIssue('UNSUPPORTED_NAME', `Unsupported report name: ${report.name}`, 'name'));
  }
  if (!DASHBOARD_REPORT_KINDS.includes(report.kind)) {
    issues.push(makeIssue('UNSUPPORTED_KIND', `Unsupported report kind: ${report.kind}`, 'kind'));
  }

  report.sections.forEach((section, index) => {
    if (!DASHBOARD_REPORT_SECTION_KINDS.includes(section.kind)) {
      issues.push(makeIssue('UNSUPPORTED_SECTION_KIND', `Unsupported report section kind: ${section.kind}`, `sections[${index}].kind`));
    }
    if (!DASHBOARD_RENDER_SNAPSHOT_NAMES.includes(section.sourceSnapshotName)) {
      issues.push(
        makeIssue(
          'UNSUPPORTED_SNAPSHOT_NAME',
          `Unsupported source snapshot name: ${section.sourceSnapshotName}`,
          `sections[${index}].sourceSnapshotName`,
        ),
      );
    }
  });

  return issues;
}

function validateMeta(report: DashboardReportModel): readonly DashboardReportValidationIssue[] {
  const issues: DashboardReportValidationIssue[] = [];
  const meta = report.meta;

  if (meta.phase !== 28) {
    issues.push(makeIssue('META_WRONG_PHASE', 'meta.phase must be 28.', 'meta.phase'));
  }
  if (meta.sourceSnapshotPhase !== 27) {
    issues.push(makeIssue('META_WRONG_SNAPSHOT_PHASE', 'meta.sourceSnapshotPhase must be 27.', 'meta.sourceSnapshotPhase'));
  }
  if (meta.fixtureOnly !== true) {
    issues.push(makeIssue('META_NOT_FIXTURE_ONLY', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  }
  if (meta.liveData !== false) {
    issues.push(makeIssue('META_HAS_LIVE_DATA', 'meta.liveData must be false.', 'meta.liveData'));
  }
  if (meta.externalNetwork !== false) {
    issues.push(makeIssue('META_HAS_EXTERNAL_NETWORK', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  }
  if (meta.deterministic !== true) {
    issues.push(makeIssue('META_NOT_DETERMINISTIC', 'meta.deterministic must be true.', 'meta.deterministic'));
  }
  if (typeof meta.generatedAt !== 'string' || !meta.generatedAt) {
    issues.push(makeIssue('META_MISSING_GENERATED_AT', 'meta.generatedAt must be a deterministic string.', 'meta.generatedAt'));
  }

  const sortedSourceSnapshots = [...meta.sourceSnapshotNames].sort();
  if (JSON.stringify(meta.sourceSnapshotNames) !== JSON.stringify(sortedSourceSnapshots)) {
    issues.push(makeIssue('META_UNSTABLE_SNAPSHOT_ORDER', 'meta.sourceSnapshotNames must be stable and sorted.', 'meta.sourceSnapshotNames'));
  }

  return issues;
}

function validateSafetyBoundary(report: DashboardReportModel): readonly DashboardReportValidationIssue[] {
  const issues: DashboardReportValidationIssue[] = [];
  const b = report.safetyBoundary;

  if (b.isReadOnly !== true) {
    issues.push(makeIssue('SAFETY_NOT_READ_ONLY', 'safetyBoundary.isReadOnly must be true.', 'safetyBoundary.isReadOnly'));
  }
  if (b.isLocalOnly !== true) {
    issues.push(makeIssue('SAFETY_NOT_LOCAL_ONLY', 'safetyBoundary.isLocalOnly must be true.', 'safetyBoundary.isLocalOnly'));
  }
  if (b.isFixtureBacked !== true) {
    issues.push(makeIssue('SAFETY_NOT_FIXTURE_BACKED', 'safetyBoundary.isFixtureBacked must be true.', 'safetyBoundary.isFixtureBacked'));
  }
  if (b.hasLiveData !== false || b.dashboardReportLiveData !== false) {
    issues.push(makeIssue('SAFETY_HAS_LIVE_DATA', 'live data flags must be false.', 'safetyBoundary.hasLiveData'));
  }
  if (b.hasMutationControls !== false || b.dashboardReportMutationControls !== false) {
    issues.push(makeIssue('SAFETY_HAS_MUTATION_CONTROLS', 'mutation control flags must be false.', 'safetyBoundary.hasMutationControls'));
  }
  if (b.dashboardReportFileExport !== false) {
    issues.push(makeIssue('SAFETY_HAS_FILE_EXPORT', 'dashboardReportFileExport must be false.', 'safetyBoundary.dashboardReportFileExport'));
  }
  if (b.dashboardReportPersistence !== false) {
    issues.push(makeIssue('SAFETY_HAS_REPORT_PERSISTENCE', 'dashboardReportPersistence must be false.', 'safetyBoundary.dashboardReportPersistence'));
  }
  if (b.dashboardReportExternalNetwork !== false || b.hasExternalNetwork !== false) {
    issues.push(makeIssue('SAFETY_HAS_EXTERNAL_NETWORK', 'external network flags must be false.', 'safetyBoundary.dashboardReportExternalNetwork'));
  }

  return issues;
}

function scanForbiddenPatterns(value: unknown, path: string): readonly string[] {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return FORBIDDEN_REPORT_PATTERNS.filter(pattern => lower.includes(pattern.toLowerCase())).map(pattern =>
      `"${pattern}" found at ${path}`,
    );
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => scanForbiddenPatterns(entry, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
      scanForbiddenPatterns(entry, `${path}.${key}`),
    );
  }
  return [];
}

export function validateDashboardReportModel(report: unknown): DashboardReportValidationResult {
  const required = validateRequiredFields(report);
  if (required.length > 0) {
    return { valid: false, issues: required };
  }

  const typedReport = report as DashboardReportModel;
  const issues: DashboardReportValidationIssue[] = [
    ...validateSupportedValues(typedReport),
    ...validateMeta(typedReport),
    ...validateSafetyBoundary(typedReport),
  ];

  if (!isDashboardReportSerializable(typedReport)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Report must be serializable.', 'report'));
  }

  const sortedSectionIds = [...typedReport.sections].map(section => section.id).sort();
  const existingSectionIds = typedReport.sections.map(section => section.id);
  if (JSON.stringify(sortedSectionIds) !== JSON.stringify(existingSectionIds)) {
    issues.push(makeIssue('UNSTABLE_SECTION_ORDER', 'Report sections must be in deterministic sorted order.', 'sections'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateDashboardReportSafety(report: unknown): DashboardReportSafetyResult {
  if (report === null || typeof report !== 'object') {
    return { safe: false, violations: ['Report must be a non-null object.'] };
  }

  const violations = scanForbiddenPatterns(report, 'report');

  return {
    safe: violations.length === 0,
    violations,
  };
}
