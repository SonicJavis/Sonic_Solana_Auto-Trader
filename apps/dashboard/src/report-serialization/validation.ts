/**
 * apps/dashboard/src/report-serialization/validation.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Validation
 */

import { DASHBOARD_REPORT_KINDS, DASHBOARD_REPORT_NAMES } from '../reports/types.js';
import { isDashboardReportSerializationPreviewSerializable } from './normalization.js';
import {
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES,
} from './types.js';
import type {
  DashboardReportSerializationPreview,
  DashboardReportSerializationPreviewSafetyResult,
  DashboardReportSerializationPreviewValidationIssue,
  DashboardReportSerializationPreviewValidationResult,
} from './types.js';

const FORBIDDEN_PREVIEW_PATTERNS: readonly string[] = [
  'TypeError: ',
  'ReferenceError: ',
  'SyntaxError: ',
  'at Object.<',
  '/home/',
  '/Users/',
  'C:\\Users\\',
  'BEGIN PRIVATE KEY',
  'seed phrase',
  'mnemonic',
  'api_key=',
  'secret=',
  'wallet connect',
  'signTransaction',
  'sendTransaction',
  'download now',
  'write file',
  'live data enabled',
  'external api',
  'localStorage',
  'sessionStorage',
  'IndexedDB',
  'URL.createObjectURL',
  'Blob(',
];

function makeIssue(code: string, message: string, field: string): DashboardReportSerializationPreviewValidationIssue {
  return { code, message, field };
}

function validateRequiredFields(preview: unknown): readonly DashboardReportSerializationPreviewValidationIssue[] {
  if (preview === null || typeof preview !== 'object') {
    return [makeIssue('INVALID_TYPE', 'Preview must be a non-null object.', 'preview')];
  }

  const p = preview as Record<string, unknown>;
  const issues: DashboardReportSerializationPreviewValidationIssue[] = [];

  if (typeof p['name'] !== 'string' || !p['name']) {
    issues.push(makeIssue('MISSING_NAME', 'name must be a non-empty string.', 'name'));
  }
  if (typeof p['kind'] !== 'string' || !p['kind']) {
    issues.push(makeIssue('MISSING_KIND', 'kind must be a non-empty string.', 'kind'));
  }
  if (typeof p['format'] !== 'string' || !p['format']) {
    issues.push(makeIssue('MISSING_FORMAT', 'format must be a non-empty string.', 'format'));
  }
  if (typeof p['title'] !== 'string' || !p['title']) {
    issues.push(makeIssue('MISSING_TITLE', 'title must be a non-empty string.', 'title'));
  }
  if (typeof p['sourceReportName'] !== 'string' || !p['sourceReportName']) {
    issues.push(makeIssue('MISSING_SOURCE_REPORT_NAME', 'sourceReportName must be a non-empty string.', 'sourceReportName'));
  }
  if (typeof p['sourceReportKind'] !== 'string' || !p['sourceReportKind']) {
    issues.push(makeIssue('MISSING_SOURCE_REPORT_KIND', 'sourceReportKind must be a non-empty string.', 'sourceReportKind'));
  }
  if (typeof p['contentLength'] !== 'number' || Number.isNaN(p['contentLength'])) {
    issues.push(makeIssue('MISSING_CONTENT_LENGTH', 'contentLength must be a number.', 'contentLength'));
  }
  if (typeof p['checksum'] !== 'string' || !p['checksum']) {
    issues.push(makeIssue('MISSING_CHECKSUM', 'checksum must be a non-empty string.', 'checksum'));
  }
  if (p['meta'] === null || typeof p['meta'] !== 'object') {
    issues.push(makeIssue('MISSING_META', 'meta must be an object.', 'meta'));
  }
  if (p['safetyBoundary'] === null || typeof p['safetyBoundary'] !== 'object') {
    issues.push(makeIssue('MISSING_SAFETY_BOUNDARY', 'safetyBoundary must be an object.', 'safetyBoundary'));
  }
  if (!Array.isArray(p['safeNotes'])) {
    issues.push(makeIssue('MISSING_SAFE_NOTES', 'safeNotes must be an array.', 'safeNotes'));
  }

  return issues;
}

function validateSupportedValues(preview: DashboardReportSerializationPreview): readonly DashboardReportSerializationPreviewValidationIssue[] {
  const issues: DashboardReportSerializationPreviewValidationIssue[] = [];

  if (!DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.includes(preview.name)) {
    issues.push(makeIssue('UNSUPPORTED_NAME', `Unsupported preview name: ${preview.name}`, 'name'));
  }
  if (!DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS.includes(preview.kind)) {
    issues.push(makeIssue('UNSUPPORTED_KIND', `Unsupported preview kind: ${preview.kind}`, 'kind'));
  }
  if (!DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS.includes(preview.format)) {
    issues.push(makeIssue('UNSUPPORTED_FORMAT', `Unsupported preview format: ${preview.format}`, 'format'));
  }
  if (!DASHBOARD_REPORT_NAMES.includes(preview.sourceReportName)) {
    issues.push(
      makeIssue(
        'UNSUPPORTED_SOURCE_REPORT_NAME',
        `Unsupported source report name: ${preview.sourceReportName}`,
        'sourceReportName',
      ),
    );
  }
  if (!DASHBOARD_REPORT_KINDS.includes(preview.sourceReportKind)) {
    issues.push(
      makeIssue(
        'UNSUPPORTED_SOURCE_REPORT_KIND',
        `Unsupported source report kind: ${preview.sourceReportKind}`,
        'sourceReportKind',
      ),
    );
  }

  return issues;
}

function validateDeterministicMetadata(
  preview: DashboardReportSerializationPreview,
): readonly DashboardReportSerializationPreviewValidationIssue[] {
  const issues: DashboardReportSerializationPreviewValidationIssue[] = [];

  if (preview.meta.phase !== 29) {
    issues.push(makeIssue('META_WRONG_PHASE', 'meta.phase must be 29.', 'meta.phase'));
  }
  if (preview.meta.sourceReportPhase !== 28) {
    issues.push(makeIssue('META_WRONG_SOURCE_REPORT_PHASE', 'meta.sourceReportPhase must be 28.', 'meta.sourceReportPhase'));
  }
  if (preview.meta.fixtureOnly !== true) {
    issues.push(makeIssue('META_NOT_FIXTURE_ONLY', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  }
  if (preview.meta.liveData !== false) {
    issues.push(makeIssue('META_HAS_LIVE_DATA', 'meta.liveData must be false.', 'meta.liveData'));
  }
  if (preview.meta.externalNetwork !== false) {
    issues.push(makeIssue('META_HAS_EXTERNAL_NETWORK', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  }
  if (preview.meta.deterministic !== true) {
    issues.push(makeIssue('META_NOT_DETERMINISTIC', 'meta.deterministic must be true.', 'meta.deterministic'));
  }
  if (preview.meta.sourceReportName !== preview.sourceReportName) {
    issues.push(
      makeIssue('META_SOURCE_REPORT_NAME_MISMATCH', 'meta.sourceReportName must match sourceReportName.', 'meta.sourceReportName'),
    );
  }
  if (preview.meta.sourceReportKind !== preview.sourceReportKind) {
    issues.push(
      makeIssue('META_SOURCE_REPORT_KIND_MISMATCH', 'meta.sourceReportKind must match sourceReportKind.', 'meta.sourceReportKind'),
    );
  }
  if (preview.meta.generatedAt !== preview.sourceReportMeta.generatedAt) {
    issues.push(makeIssue('GENERATED_AT_MISMATCH', 'meta.generatedAt must match source report generatedAt.', 'meta.generatedAt'));
  }

  const sortedMetaNotes = [...preview.meta.notes].sort();
  if (JSON.stringify(preview.meta.notes) !== JSON.stringify(sortedMetaNotes)) {
    issues.push(makeIssue('UNSTABLE_META_NOTES', 'meta.notes must be deterministically sorted.', 'meta.notes'));
  }

  return issues;
}

function validateSafetyBoundary(preview: DashboardReportSerializationPreview): readonly DashboardReportSerializationPreviewValidationIssue[] {
  const issues: DashboardReportSerializationPreviewValidationIssue[] = [];
  const b = preview.safetyBoundary;

  if (b.dashboardReportSerializationPreview !== true) {
    issues.push(
      makeIssue(
        'SAFETY_PREVIEW_DISABLED',
        'dashboardReportSerializationPreview must be true.',
        'safetyBoundary.dashboardReportSerializationPreview',
      ),
    );
  }
  if (b.dashboardReportActualFileExport !== false || b.dashboardReportFileExport !== false) {
    issues.push(
      makeIssue('SAFETY_FILE_EXPORT_ENABLED', 'file export flags must be false.', 'safetyBoundary.dashboardReportActualFileExport'),
    );
  }
  if (b.dashboardReportDownloadSupport !== false) {
    issues.push(
      makeIssue(
        'SAFETY_DOWNLOAD_ENABLED',
        'dashboardReportDownloadSupport must be false.',
        'safetyBoundary.dashboardReportDownloadSupport',
      ),
    );
  }
  if (b.dashboardReportPersistence !== false || b.dashboardReportMutationControls !== false) {
    issues.push(
      makeIssue(
        'SAFETY_PERSISTENCE_OR_MUTATION_ENABLED',
        'persistence and mutation flags must be false.',
        'safetyBoundary.dashboardReportPersistence',
      ),
    );
  }
  if (b.dashboardReportExternalNetwork !== false || b.hasExternalNetwork !== false) {
    issues.push(
      makeIssue(
        'SAFETY_EXTERNAL_NETWORK_ENABLED',
        'external network flags must be false.',
        'safetyBoundary.dashboardReportExternalNetwork',
      ),
    );
  }
  if (b.dashboardReportLiveData !== false || b.hasLiveData !== false) {
    issues.push(makeIssue('SAFETY_LIVE_DATA_ENABLED', 'live data flags must be false.', 'safetyBoundary.dashboardReportLiveData'));
  }

  return issues;
}

function scanForbiddenPatterns(value: unknown, path: string): readonly string[] {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return FORBIDDEN_PREVIEW_PATTERNS.filter(pattern => lower.includes(pattern.toLowerCase())).map(
      pattern => `"${pattern}" found at ${path}`,
    );
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => scanForbiddenPatterns(entry, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) => scanForbiddenPatterns(entry, `${path}.${key}`));
  }
  return [];
}

export function validateDashboardReportSerializationPreview(preview: unknown): DashboardReportSerializationPreviewValidationResult {
  const required = validateRequiredFields(preview);
  if (required.length > 0) {
    return { valid: false, issues: required };
  }

  const typedPreview = preview as DashboardReportSerializationPreview;
  const issues: DashboardReportSerializationPreviewValidationIssue[] = [
    ...validateSupportedValues(typedPreview),
    ...validateDeterministicMetadata(typedPreview),
    ...validateSafetyBoundary(typedPreview),
  ];

  if (!isDashboardReportSerializationPreviewSerializable(typedPreview)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Preview must be serializable.', 'preview'));
  }

  const sortedSafeNotes = [...typedPreview.safeNotes].sort();
  if (JSON.stringify(typedPreview.safeNotes) !== JSON.stringify(sortedSafeNotes)) {
    issues.push(makeIssue('UNSTABLE_SAFE_NOTES', 'safeNotes must be sorted.', 'safeNotes'));
  }

  const forbiddenHits = scanForbiddenPatterns(
    {
      content: typedPreview.content,
      metadataPayload: typedPreview.metadataPayload,
      title: typedPreview.title,
      notes: typedPreview.safeNotes,
    },
    'preview',
  );

  if (forbiddenHits.length > 0) {
    issues.push(makeIssue('FORBIDDEN_CONTENT', 'Preview payload contains forbidden patterns.', 'content'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateDashboardReportSerializationPreviewSafety(preview: unknown): DashboardReportSerializationPreviewSafetyResult {
  if (preview === null || typeof preview !== 'object') {
    return { safe: false, violations: ['Preview must be a non-null object.'] };
  }

  const violations = scanForbiddenPatterns(preview, 'preview');
  return {
    safe: violations.length === 0,
    violations,
  };
}
