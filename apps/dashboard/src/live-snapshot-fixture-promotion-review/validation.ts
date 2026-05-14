import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
  type LiveSnapshotFixturePromotionReviewFixture,
  type LiveSnapshotFixturePromotionReviewSafetyResult,
  type LiveSnapshotFixturePromotionReviewValidationIssue,
  type LiveSnapshotFixturePromotionReviewValidationResult,
} from './types.js';
import {
  isValidLiveSnapshotFixturePromotionReviewGeneratedAt,
  isValidLiveSnapshotFixturePromotionReviewKind,
  isValidLiveSnapshotFixturePromotionReviewName,
  isValidLiveSnapshotFixturePromotionReviewSchemaVersion,
  isValidLiveSnapshotFixturePromotionReviewSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|endpoint|rpc|network)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:api[_-]?key|secret|token|credential|providerSdk)\b/i;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: LiveSnapshotFixturePromotionReviewValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanText(value: string, field: string, issues: LiveSnapshotFixturePromotionReviewValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secrets/provider SDK refs are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', field, 'Wallet/signing refs are forbidden.');
}

function scanRecursive(
  value: unknown,
  field: string,
  issues: LiveSnapshotFixturePromotionReviewValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const isAllowedRef =
      field.includes('.validationCommandRefs[') ||
      field.includes('.docsRefs[') ||
      field.includes('.safetyGrepRefs[') ||
      field.includes('.sourcePhase') ||
      field.includes('.sourceFixture') ||
      field.includes('.sourceRefs.') ||
      field.includes('.parityReviewLinkage.') ||
      field.includes('.snapshotCaptureLinkage.') ||
      field.includes('.report.') ||
      field.includes('.summary');
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

function validateSafetyBooleans(
  fixture: LiveSnapshotFixturePromotionReviewFixture,
  issues: LiveSnapshotFixturePromotionReviewValidationIssue[],
): void {
  if (fixture.reviewGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'reviewGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.reviewGate.automaticPromotionAllowed !== false)
    pushIssue(
      issues,
      'AUTO_PROMOTION_FORBIDDEN',
      'reviewGate.automaticPromotionAllowed',
      'automaticPromotionAllowed must be false.',
    );
  if (fixture.reviewGate.filesystemWriteAllowed !== false)
    pushIssue(
      issues,
      'FILESYSTEM_WRITE_FORBIDDEN',
      'reviewGate.filesystemWriteAllowed',
      'filesystemWriteAllowed must be false.',
    );
  if (fixture.candidate.persisted !== false)
    pushIssue(issues, 'PERSISTENCE_FORBIDDEN', 'candidate.persisted', 'candidate.persisted must be false.');
  if (fixture.candidate.promotionAllowed !== false)
    pushIssue(issues, 'PROMOTION_ALLOWED_FORBIDDEN', 'candidate.promotionAllowed', 'candidate.promotionAllowed must be false.');
  if (fixture.reviewPolicy.automaticApprovalAllowed !== false)
    pushIssue(
      issues,
      'AUTO_APPROVAL_FORBIDDEN',
      'reviewPolicy.automaticApprovalAllowed',
      'automaticApprovalAllowed must be false.',
    );
  if (fixture.reviewPolicy.automaticPromotionAllowed !== false)
    pushIssue(
      issues,
      'POLICY_AUTO_PROMOTION_FORBIDDEN',
      'reviewPolicy.automaticPromotionAllowed',
      'review policy automatic promotion must be false.',
    );
  if (fixture.reviewerDecision.approvalDoesNotPromote !== true)
    pushIssue(
      issues,
      'REVIEW_DECISION_SIDE_EFFECT_FORBIDDEN',
      'reviewerDecision.approvalDoesNotPromote',
      'reviewer decision must not promote fixtures.',
    );
  if (fixture.manifest.fileWriteAllowed !== false)
    pushIssue(issues, 'MANIFEST_FILE_WRITE_FORBIDDEN', 'manifest.fileWriteAllowed', 'manifest file writes are forbidden.');
  if (fixture.manifest.automaticCommitAllowed !== false)
    pushIssue(
      issues,
      'MANIFEST_AUTOCOMMIT_FORBIDDEN',
      'manifest.automaticCommitAllowed',
      'manifest automatic commit is forbidden.',
    );
  if (fixture.quarantineReview.releaseAllowed !== false)
    pushIssue(
      issues,
      'QUARANTINE_RELEASE_FORBIDDEN',
      'quarantineReview.releaseAllowed',
      'quarantine release must remain disabled.',
    );
  if (fixture.safety.noRuntimeCapture !== true)
    pushIssue(issues, 'RUNTIME_CAPTURE_FORBIDDEN', 'safety.noRuntimeCapture', 'runtime capture must remain disabled.');
  if (fixture.safety.noRuntimeReplay !== true)
    pushIssue(issues, 'RUNTIME_REPLAY_FORBIDDEN', 'safety.noRuntimeReplay', 'runtime replay must remain disabled.');
}

export function validateLiveSnapshotFixturePromotionReviewFixture(
  fixture: LiveSnapshotFixturePromotionReviewFixture,
): LiveSnapshotFixturePromotionReviewValidationResult {
  const issues: LiveSnapshotFixturePromotionReviewValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidLiveSnapshotFixturePromotionReviewName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidLiveSnapshotFixturePromotionReviewKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE}.`);
  if (!isValidLiveSnapshotFixturePromotionReviewSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidLiveSnapshotFixturePromotionReviewGeneratedAt(fixture.meta.generatedAt))
    pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidLiveSnapshotFixturePromotionReviewSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt))
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');

  if (!fixture.evidenceBundle.docsRefs.length)
    pushIssue(issues, 'MISSING_DOC_REFS', 'evidenceBundle.docsRefs', 'docsRefs is required.');
  if (!fixture.evidenceBundle.validationCommandRefs.length)
    pushIssue(
      issues,
      'MISSING_VALIDATION_COMMAND_REFS',
      'evidenceBundle.validationCommandRefs',
      'validationCommandRefs is required.',
    );
  if (!fixture.evidenceBundle.sourceFixtureRefs.length)
    pushIssue(issues, 'MISSING_SOURCE_REFS', 'evidenceBundle.sourceFixtureRefs', 'sourceFixtureRefs is required.');

  if (fixture.blocker.severity === 'critical' && !fixture.blocker.promotionBlocked) {
    pushIssue(
      issues,
      'CRITICAL_BLOCKER_MUST_BLOCK',
      'blocker.promotionBlocked',
      'critical blockers must set promotionBlocked=true.',
    );
  }
  if (fixture.quarantineReview.quarantined && fixture.quarantineReview.releaseAllowed) {
    pushIssue(
      issues,
      'QUARANTINE_RELEASE_CONFLICT',
      'quarantineReview.releaseAllowed',
      'quarantined snapshots cannot be release-allowed.',
    );
  }
  if (fixture.parityReviewLinkage.parityStatus === 'mismatch' && fixture.reviewGate.gateStatus === 'ready') {
    pushIssue(
      issues,
      'PARITY_MISMATCH_READY_CONFLICT',
      'reviewGate.gateStatus',
      'parity mismatch cannot keep the review gate ready.',
    );
  }

  const reportSummaries = [
    fixture.report.gateSummary,
    fixture.report.candidateSummary,
    fixture.report.policySummary,
    fixture.report.decisionSummary,
    fixture.report.evidenceSummary,
    fixture.report.manifestSummary,
    fixture.report.blockerSummary,
    fixture.report.quarantineSummary,
    fixture.report.safetySummary,
  ];
  if (reportSummaries.some(summary => FORBIDDEN_ADVISORY_PATTERN.test(summary))) {
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory/profit language is forbidden in reports.');
  }

  if (!Object.isFrozen(fixture.sourcePhase79FixtureSnapshot)) {
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase79FixtureSnapshot', 'source snapshots must be immutable.');
  }

  validateSafetyBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateLiveSnapshotFixturePromotionReviewSafety(
  fixture: LiveSnapshotFixturePromotionReviewFixture,
): LiveSnapshotFixturePromotionReviewSafetyResult {
  const violations: string[] = [];
  if (fixture.reviewGate.unlockAuthority !== false) violations.push('reviewGate.unlockAuthority must be false');
  if (fixture.reviewGate.filesystemWriteAllowed !== false) violations.push('reviewGate.filesystemWriteAllowed must be false');
  if (fixture.reviewGate.automaticPromotionAllowed !== false)
    violations.push('reviewGate.automaticPromotionAllowed must be false');
  if (fixture.candidate.persisted !== false) violations.push('candidate.persisted must be false');
  if (fixture.manifest.fileWriteAllowed !== false) violations.push('manifest.fileWriteAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateLiveSnapshotFixturePromotionReviewFixtureTable(
  fixtures: readonly LiveSnapshotFixturePromotionReviewFixture[],
): LiveSnapshotFixturePromotionReviewValidationResult {
  const issues: LiveSnapshotFixturePromotionReviewValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateLiveSnapshotFixturePromotionReviewFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName))
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
