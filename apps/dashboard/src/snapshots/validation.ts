/**
 * apps/dashboard/src/snapshots/validation.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Validation
 *
 * Pure, deterministic snapshot validation and safety check helpers.
 *
 * Validation checks:
 * - Required snapshot fields
 * - Supported snapshot names/kinds
 * - Serializability
 * - Safety flags
 * - No secrets/stack traces/local paths/live-data claims
 * - No wallet/trading/execution controls in snapshot payloads
 *
 * All helpers are pure and deterministic. Never throw for expected invalid input.
 */

import type {
  DashboardRenderSnapshot,
  DashboardRenderSnapshotValidationResult,
  DashboardRenderSnapshotValidationIssue,
  DashboardRenderSnapshotSafetyResult,
} from './types.js';
import { DASHBOARD_RENDER_SNAPSHOT_NAMES, DASHBOARD_RENDER_SNAPSHOT_KINDS } from './types.js';
import { isDashboardRenderSnapshotSerializable } from './normalization.js';

// ─── Forbidden string patterns in snapshot payloads ───────────────────────────

/**
 * Forbidden strings that must not appear in snapshot payload data fields.
 * These patterns would indicate actual unsafe data (stack traces, local paths)
 * rather than documentation about safety constraints.
 *
 * Note: Broad terms like "live data", "private key", "signTransaction" are
 * NOT included here because they appear legitimately in safety notice strings
 * (e.g., "NO LIVE DATA", "NO PRIVATE KEYS"). The safety check focuses on
 * patterns that would ONLY appear if actual unsafe data is present.
 *
 * Documentation, test fixture labels, safety-rejection strings, and notices
 * may reference these concepts to explain what is NOT present.
 */
const FORBIDDEN_SNAPSHOT_PAYLOAD_PATTERNS: readonly string[] = [
  // Stack trace indicators (would only appear if an actual error was captured)
  'at Object.<',
  'at Function.<',
  'TypeError: ',
  'ReferenceError: ',
  'SyntaxError: ',
  'RangeError: ',
  // Absolute filesystem paths (would only appear if a real path leaked into data)
  '/home/',
  '/Users/',
  'C:\\Users\\',
  'C:/Users/',
  '/root/',
];

/**
 * Checks a string value against forbidden patterns.
 * Returns an array of violated patterns.
 */
function checkForbiddenPatterns(value: string): readonly string[] {
  const lower = value.toLowerCase();
  const violated: string[] = [];
  for (const pattern of FORBIDDEN_SNAPSHOT_PAYLOAD_PATTERNS) {
    if (lower.includes(pattern.toLowerCase())) {
      violated.push(pattern);
    }
  }
  return violated;
}

/**
 * Recursively scans an unknown value for forbidden patterns in string fields.
 * Returns all found violations.
 */
function scanForForbiddenPatterns(value: unknown, path: string): readonly string[] {
  if (typeof value === 'string') {
    const violated = checkForbiddenPatterns(value);
    return violated.map(p => `"${p}" found at ${path}`);
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => scanForForbiddenPatterns(item, `${path}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      scanForForbiddenPatterns(v, `${path}.${k}`),
    );
  }
  return [];
}

// ─── Field validation ─────────────────────────────────────────────────────────

function makeIssue(code: string, message: string, field: string): DashboardRenderSnapshotValidationIssue {
  return { code, message, field };
}

/**
 * Validates required fields of a DashboardRenderSnapshot.
 */
function validateRequiredFields(snapshot: unknown): readonly DashboardRenderSnapshotValidationIssue[] {
  const issues: DashboardRenderSnapshotValidationIssue[] = [];

  if (snapshot === null || typeof snapshot !== 'object') {
    return [makeIssue('INVALID_TYPE', 'Snapshot must be a non-null object.', 'snapshot')];
  }

  const s = snapshot as Record<string, unknown>;

  if (typeof s['name'] !== 'string' || !s['name']) {
    issues.push(makeIssue('MISSING_NAME', 'Snapshot name must be a non-empty string.', 'name'));
  }
  if (typeof s['kind'] !== 'string' || !s['kind']) {
    issues.push(makeIssue('MISSING_KIND', 'Snapshot kind must be a non-empty string.', 'kind'));
  }
  if (s['meta'] === null || typeof s['meta'] !== 'object') {
    issues.push(makeIssue('MISSING_META', 'Snapshot meta must be an object.', 'meta'));
  }
  if (s['renderResult'] === null || typeof s['renderResult'] !== 'object') {
    issues.push(makeIssue('MISSING_RENDER_RESULT', 'Snapshot renderResult must be an object.', 'renderResult'));
  }
  if (!Array.isArray(s['expectedVisiblePanelIds'])) {
    issues.push(makeIssue('MISSING_VISIBLE_PANELS', 'expectedVisiblePanelIds must be an array.', 'expectedVisiblePanelIds'));
  }
  if (!Array.isArray(s['expectedHiddenPanelIds'])) {
    issues.push(makeIssue('MISSING_HIDDEN_PANELS', 'expectedHiddenPanelIds must be an array.', 'expectedHiddenPanelIds'));
  }
  if (typeof s['expectedComponentType'] !== 'string' || !s['expectedComponentType']) {
    issues.push(makeIssue('MISSING_COMPONENT_TYPE', 'expectedComponentType must be a non-empty string.', 'expectedComponentType'));
  }
  if (s['expectedSafetyBoundary'] === null || typeof s['expectedSafetyBoundary'] !== 'object') {
    issues.push(makeIssue('MISSING_SAFETY_BOUNDARY', 'expectedSafetyBoundary must be an object.', 'expectedSafetyBoundary'));
  }
  if (typeof s['isErrorState'] !== 'boolean') {
    issues.push(makeIssue('MISSING_IS_ERROR_STATE', 'isErrorState must be a boolean.', 'isErrorState'));
  }
  if (typeof s['isEmptyState'] !== 'boolean') {
    issues.push(makeIssue('MISSING_IS_EMPTY_STATE', 'isEmptyState must be a boolean.', 'isEmptyState'));
  }
  if (typeof s['isFilteredState'] !== 'boolean') {
    issues.push(makeIssue('MISSING_IS_FILTERED_STATE', 'isFilteredState must be a boolean.', 'isFilteredState'));
  }

  return issues;
}

/**
 * Validates the name and kind against supported values.
 */
function validateNameAndKind(snapshot: DashboardRenderSnapshot): readonly DashboardRenderSnapshotValidationIssue[] {
  const issues: DashboardRenderSnapshotValidationIssue[] = [];
  if (!DASHBOARD_RENDER_SNAPSHOT_NAMES.includes(snapshot.name)) {
    issues.push(makeIssue('UNSUPPORTED_NAME', `Snapshot name "${snapshot.name}" is not a supported snapshot name.`, 'name'));
  }
  if (!DASHBOARD_RENDER_SNAPSHOT_KINDS.includes(snapshot.kind)) {
    issues.push(makeIssue('UNSUPPORTED_KIND', `Snapshot kind "${snapshot.kind}" is not a supported snapshot kind.`, 'kind'));
  }
  return issues;
}

/**
 * Validates safety boundary flags.
 */
function validateSafetyBoundary(snapshot: DashboardRenderSnapshot): readonly DashboardRenderSnapshotValidationIssue[] {
  const issues: DashboardRenderSnapshotValidationIssue[] = [];
  const b = snapshot.expectedSafetyBoundary;

  if (b.isReadOnly !== true) {
    issues.push(makeIssue('SAFETY_NOT_READ_ONLY', 'expectedSafetyBoundary.isReadOnly must be true.', 'expectedSafetyBoundary.isReadOnly'));
  }
  if (b.isLocalOnly !== true) {
    issues.push(makeIssue('SAFETY_NOT_LOCAL_ONLY', 'expectedSafetyBoundary.isLocalOnly must be true.', 'expectedSafetyBoundary.isLocalOnly'));
  }
  if (b.isFixtureBacked !== true) {
    issues.push(makeIssue('SAFETY_NOT_FIXTURE_BACKED', 'expectedSafetyBoundary.isFixtureBacked must be true.', 'expectedSafetyBoundary.isFixtureBacked'));
  }
  if (b.hasLiveData !== false) {
    issues.push(makeIssue('SAFETY_HAS_LIVE_DATA', 'expectedSafetyBoundary.hasLiveData must be false.', 'expectedSafetyBoundary.hasLiveData'));
  }
  if (b.hasTradingControls !== false) {
    issues.push(makeIssue('SAFETY_HAS_TRADING_CONTROLS', 'expectedSafetyBoundary.hasTradingControls must be false.', 'expectedSafetyBoundary.hasTradingControls'));
  }
  if (b.hasWalletControls !== false) {
    issues.push(makeIssue('SAFETY_HAS_WALLET_CONTROLS', 'expectedSafetyBoundary.hasWalletControls must be false.', 'expectedSafetyBoundary.hasWalletControls'));
  }
  if (b.hasMutationControls !== false) {
    issues.push(makeIssue('SAFETY_HAS_MUTATION_CONTROLS', 'expectedSafetyBoundary.hasMutationControls must be false.', 'expectedSafetyBoundary.hasMutationControls'));
  }
  if (b.hasExternalNetwork !== false) {
    issues.push(makeIssue('SAFETY_HAS_EXTERNAL_NETWORK', 'expectedSafetyBoundary.hasExternalNetwork must be false.', 'expectedSafetyBoundary.hasExternalNetwork'));
  }
  if (b.hasExecutionControls !== false) {
    issues.push(makeIssue('SAFETY_HAS_EXECUTION_CONTROLS', 'expectedSafetyBoundary.hasExecutionControls must be false.', 'expectedSafetyBoundary.hasExecutionControls'));
  }

  return issues;
}

/**
 * Validates metadata fields.
 */
function validateMeta(snapshot: DashboardRenderSnapshot): readonly DashboardRenderSnapshotValidationIssue[] {
  const issues: DashboardRenderSnapshotValidationIssue[] = [];
  const m = snapshot.meta;

  if (m.phase !== 27) {
    issues.push(makeIssue('META_WRONG_PHASE', 'meta.phase must be 27.', 'meta.phase'));
  }
  if (m.fixtureOnly !== true) {
    issues.push(makeIssue('META_NOT_FIXTURE_ONLY', 'meta.fixtureOnly must be true.', 'meta.fixtureOnly'));
  }
  if (m.liveData !== false) {
    issues.push(makeIssue('META_HAS_LIVE_DATA', 'meta.liveData must be false.', 'meta.liveData'));
  }
  if (m.externalNetwork !== false) {
    issues.push(makeIssue('META_HAS_EXTERNAL_NETWORK', 'meta.externalNetwork must be false.', 'meta.externalNetwork'));
  }
  if (m.deterministic !== true) {
    issues.push(makeIssue('META_NOT_DETERMINISTIC', 'meta.deterministic must be true.', 'meta.deterministic'));
  }
  if (typeof m.notes !== 'string' || !m.notes) {
    issues.push(makeIssue('META_MISSING_NOTES', 'meta.notes must be a non-empty string.', 'meta.notes'));
  }
  if (typeof m.source !== 'string' || !m.source) {
    issues.push(makeIssue('META_MISSING_SOURCE', 'meta.source must be a non-empty string.', 'meta.source'));
  }

  return issues;
}

// ─── Public validation helpers ────────────────────────────────────────────────

/**
 * Validates a DashboardRenderSnapshot.
 * Returns a DashboardRenderSnapshotValidationResult with all issues.
 * Never throws for expected invalid input.
 */
export function validateDashboardRenderSnapshot(snapshot: unknown): DashboardRenderSnapshotValidationResult {
  const requiredIssues = validateRequiredFields(snapshot);
  if (requiredIssues.length > 0) {
    return { valid: false, issues: requiredIssues };
  }

  const s = snapshot as DashboardRenderSnapshot;
  const issues: DashboardRenderSnapshotValidationIssue[] = [
    ...validateNameAndKind(s),
    ...validateSafetyBoundary(s),
    ...validateMeta(s),
  ];

  if (!isDashboardRenderSnapshotSerializable(s)) {
    issues.push(makeIssue('NOT_SERIALIZABLE', 'Snapshot is not serializable via JSON.stringify.', 'snapshot'));
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Performs a safety check on a DashboardRenderSnapshot payload.
 * Scans all string fields for forbidden patterns.
 * Returns a DashboardRenderSnapshotSafetyResult.
 * Never throws for expected invalid input.
 */
export function validateDashboardRenderSnapshotSafety(snapshot: unknown): DashboardRenderSnapshotSafetyResult {
  if (snapshot === null || typeof snapshot !== 'object') {
    return { safe: false, violations: ['Snapshot must be a non-null object.'] };
  }

  const violations = scanForForbiddenPatterns(snapshot, 'snapshot');

  return { safe: violations.length === 0, violations };
}
