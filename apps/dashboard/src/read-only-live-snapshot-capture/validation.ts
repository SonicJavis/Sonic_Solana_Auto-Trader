import {
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
  type ReadOnlyLiveSnapshotCaptureFixture,
  type ReadOnlyLiveSnapshotCaptureSafetyResult,
  type ReadOnlyLiveSnapshotCaptureValidationIssue,
  type ReadOnlyLiveSnapshotCaptureValidationResult,
} from './types.js';
import {
  isValidReadOnlyLiveSnapshotCaptureGeneratedAt,
  isValidReadOnlyLiveSnapshotCaptureKind,
  isValidReadOnlyLiveSnapshotCaptureName,
  isValidReadOnlyLiveSnapshotCaptureSchemaVersion,
  isValidReadOnlyLiveSnapshotCaptureSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|endpoint|providersdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:api[_-]?key|secret|provider[_-]?sdk)\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: ReadOnlyLiveSnapshotCaptureValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanText(value: string, field: string, issues: ReadOnlyLiveSnapshotCaptureValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secrets/API keys/provider SDK refs are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', field, 'Wallet/signing refs are forbidden.');
}

function scanRecursive(value: unknown, field: string, issues: ReadOnlyLiveSnapshotCaptureValidationIssue[], depth = 0): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const isAllowedRef = field.includes('.evidence.validationCommandRefs[') || field.includes('.evidence.docsRefs[');
    if (!isAllowedRef && !field.endsWith('fixtureName') && !field.endsWith('fixtureId')) scanText(value, field, issues);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanRecursive(entry, `${field}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      scanRecursive(nested, `${field}.${key}`, issues, depth + 1);
    }
  }
}

function validateSafetyBooleans(fixture: ReadOnlyLiveSnapshotCaptureFixture, issues: ReadOnlyLiveSnapshotCaptureValidationIssue[]): void {
  if (fixture.captureGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'captureGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.captureGate.liveCaptureRuntimeAllowed !== false) pushIssue(issues, 'LIVE_RUNTIME_CAPTURE_FORBIDDEN', 'captureGate.liveCaptureRuntimeAllowed', 'liveCaptureRuntimeAllowed must be false.');
  if (fixture.captureRequest.writeMethodAllowed !== false) pushIssue(issues, 'WRITE_METHOD_FORBIDDEN', 'captureRequest.writeMethodAllowed', 'writeMethodAllowed must be false.');
  if (fixture.captureRequest.dispatchAllowed !== false) pushIssue(issues, 'DISPATCH_FORBIDDEN', 'captureRequest.dispatchAllowed', 'dispatchAllowed must be false.');
  if (fixture.captureScope.transactionWriteAllowed !== false) pushIssue(issues, 'SCOPE_TX_WRITE_FORBIDDEN', 'captureScope.transactionWriteAllowed', 'transactionWriteAllowed must be false.');
  if (fixture.captureBounds.usesRuntimeTimers !== false) pushIssue(issues, 'RUNTIME_TIMERS_FORBIDDEN', 'captureBounds.usesRuntimeTimers', 'usesRuntimeTimers must be false.');
  if (fixture.captureBounds.scheduledCaptureAllowed !== false) pushIssue(issues, 'SCHEDULED_CAPTURE_FORBIDDEN', 'captureBounds.scheduledCaptureAllowed', 'scheduledCaptureAllowed must be false.');
  if (fixture.responseStaging.persisted !== false) pushIssue(issues, 'STAGING_PERSISTENCE_FORBIDDEN', 'responseStaging.persisted', 'persisted must be false.');
  if (fixture.responseStaging.filesystemWriteAllowed !== false) pushIssue(issues, 'STAGING_FILESYSTEM_FORBIDDEN', 'responseStaging.filesystemWriteAllowed', 'filesystemWriteAllowed must be false.');
  if (fixture.quarantineContract.failClosed !== true) pushIssue(issues, 'QUARANTINE_FAIL_CLOSED_REQUIRED', 'quarantineContract.failClosed', 'quarantine must remain fail-closed.');
  if (fixture.quarantineContract.promotionAllowed !== false) pushIssue(issues, 'QUARANTINE_PROMOTION_FORBIDDEN', 'quarantineContract.promotionAllowed', 'promotionAllowed must be false.');
  if (fixture.promotionCandidate.manualReviewRequired !== true) pushIssue(issues, 'MANUAL_REVIEW_REQUIRED', 'promotionCandidate.manualReviewRequired', 'manualReviewRequired must be true.');
  if (fixture.promotionCandidate.automaticPromotionAllowed !== false) pushIssue(issues, 'AUTO_PROMOTION_FORBIDDEN', 'promotionCandidate.automaticPromotionAllowed', 'automaticPromotionAllowed must be false.');
  if (fixture.fixtureCandidateContract.persistenceAllowed !== false) pushIssue(issues, 'FIXTURE_PERSISTENCE_FORBIDDEN', 'fixtureCandidateContract.persistenceAllowed', 'persistenceAllowed must be false.');
}

export function validateReadOnlyLiveSnapshotCaptureFixture(
  fixture: ReadOnlyLiveSnapshotCaptureFixture,
): ReadOnlyLiveSnapshotCaptureValidationResult {
  const issues: ReadOnlyLiveSnapshotCaptureValidationIssue[] = [];
  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidReadOnlyLiveSnapshotCaptureName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidReadOnlyLiveSnapshotCaptureKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE}.`);
  if (!isValidReadOnlyLiveSnapshotCaptureSchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidReadOnlyLiveSnapshotCaptureGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidReadOnlyLiveSnapshotCaptureSource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');

  if (!fixture.evidence.evidenceBundleId) pushIssue(issues, 'MISSING_EVIDENCE_BUNDLE', 'evidence.evidenceBundleId', 'evidence bundle is required.');
  if (!fixture.evidence.validationCommandRefs.length) pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'evidence.validationCommandRefs', 'validationCommandRefs is required.');
  if (!fixture.evidence.docsRefs.length) pushIssue(issues, 'MISSING_DOC_REFS', 'evidence.docsRefs', 'docsRefs is required.');
  if (!fixture.evidence.sourcePhaseRefs.length) pushIssue(issues, 'MISSING_SOURCE_PHASE_REFS', 'evidence.sourcePhaseRefs', 'sourcePhaseRefs is required.');

  if (fixture.captureBounds.maxRequestCount <= 0 || fixture.captureBounds.maxObservationCount <= 0) {
    pushIssue(issues, 'INVALID_CAPTURE_BOUNDS', 'captureBounds', 'bounds counts must be positive.');
  }
  if (fixture.responseStaging.stagingStatus === 'quarantined' && !fixture.quarantineContract.quarantined) {
    pushIssue(issues, 'QUARANTINE_REQUIRED', 'quarantineContract.quarantined', 'quarantined staging must set quarantined=true.');
  }
  if (!fixture.captureReport.safetySummary || FORBIDDEN_ADVISORY_PATTERN.test(fixture.captureReport.safetySummary)) {
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'captureReport.safetySummary', 'advisory/profit language is forbidden.');
  }
  if (FORBIDDEN_ADVISORY_PATTERN.test(fixture.captureReport.promotionSummary)) {
    pushIssue(issues, 'ADVISORY_PROMOTION_FORBIDDEN', 'captureReport.promotionSummary', 'promotion summary cannot use advisory/profit wording.');
  }
  if (!Object.isFrozen(fixture.sourcePhase77FixtureSnapshot)) {
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase77FixtureSnapshot', 'source snapshots must be immutable.');
  }

  validateSafetyBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateReadOnlyLiveSnapshotCaptureSafety(
  fixture: ReadOnlyLiveSnapshotCaptureFixture,
): ReadOnlyLiveSnapshotCaptureSafetyResult {
  const violations: string[] = [];
  if (fixture.captureGate.unlockAuthority !== false) violations.push('captureGate.unlockAuthority must be false');
  if (fixture.captureGate.liveCaptureRuntimeAllowed !== false) violations.push('captureGate.liveCaptureRuntimeAllowed must be false');
  if (fixture.captureRequest.writeMethodAllowed !== false) violations.push('captureRequest.writeMethodAllowed must be false');
  if (fixture.captureRequest.dispatchAllowed !== false) violations.push('captureRequest.dispatchAllowed must be false');
  if (fixture.captureScope.transactionWriteAllowed !== false) violations.push('captureScope.transactionWriteAllowed must be false');
  if (fixture.captureBounds.scheduledCaptureAllowed !== false) violations.push('captureBounds.scheduledCaptureAllowed must be false');
  if (fixture.promotionCandidate.automaticPromotionAllowed !== false) violations.push('promotionCandidate.automaticPromotionAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateReadOnlyLiveSnapshotCaptureFixtureTable(
  fixtures: readonly ReadOnlyLiveSnapshotCaptureFixture[],
): ReadOnlyLiveSnapshotCaptureValidationResult {
  const issues: ReadOnlyLiveSnapshotCaptureValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateReadOnlyLiveSnapshotCaptureFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }
  return { valid: issues.length === 0, issues };
}
