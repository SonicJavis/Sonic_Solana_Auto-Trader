import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
  type LiveSnapshotReplayParityAuditFixture,
  type LiveSnapshotReplayParityAuditSafetyResult,
  type LiveSnapshotReplayParityAuditValidationIssue,
  type LiveSnapshotReplayParityAuditValidationResult,
} from './types.js';
import {
  isValidLiveSnapshotReplayParityAuditGeneratedAt,
  isValidLiveSnapshotReplayParityAuditKind,
  isValidLiveSnapshotReplayParityAuditName,
  isValidLiveSnapshotReplayParityAuditSchemaVersion,
  isValidLiveSnapshotReplayParityAuditSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|endpoint|rpc|network)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:api[_-]?key|secret|token|credential)\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: LiveSnapshotReplayParityAuditValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanText(value: string, field: string, issues: LiveSnapshotReplayParityAuditValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secrets/token refs are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', field, 'Wallet/signing refs are forbidden.');
}

function scanRecursive(value: unknown, field: string, issues: LiveSnapshotReplayParityAuditValidationIssue[], depth = 0): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const isAllowedRef =
      field.includes('.evidence.validationCommandRefs[') ||
      field.includes('.evidence.docsRefs[') ||
      field.includes('.sourcePhase') ||
      field.includes('.sourceFixture') ||
      field.includes('.sourceRefs.') ||
      field.includes('.auditEvidence.sourceRefs[') ||
      field.includes('.provenanceAudit.sourcePhaseRefs[') ||
      field.includes('.provenanceAudit.sourceFixtureRefs[') ||
      field.includes('.parityReport.') ||
      field.includes('.report.');
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
  fixture: LiveSnapshotReplayParityAuditFixture,
  issues: LiveSnapshotReplayParityAuditValidationIssue[],
): void {
  if (fixture.parityGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'parityGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.parityGate.runtimeReplayAllowed !== false)
    pushIssue(issues, 'RUNTIME_REPLAY_FORBIDDEN', 'parityGate.runtimeReplayAllowed', 'runtimeReplayAllowed must be false.');
  if (fixture.parityGate.automaticPromotionAllowed !== false)
    pushIssue(issues, 'AUTO_PROMOTION_FORBIDDEN', 'parityGate.automaticPromotionAllowed', 'automaticPromotionAllowed must be false.');
  if (fixture.snapshotInput.runtimeCaptureAllowed !== false)
    pushIssue(issues, 'RUNTIME_CAPTURE_FORBIDDEN', 'snapshotInput.runtimeCaptureAllowed', 'runtimeCaptureAllowed must be false.');
  if (fixture.snapshotInput.networkAccessAllowed !== false)
    pushIssue(issues, 'NETWORK_ACCESS_FORBIDDEN', 'snapshotInput.networkAccessAllowed', 'networkAccessAllowed must be false.');
  if (fixture.promotionGate.automaticPromotionAllowed !== false)
    pushIssue(issues, 'PROMOTION_AUTO_FORBIDDEN', 'promotionGate.automaticPromotionAllowed', 'automaticPromotionAllowed must be false.');
  if (fixture.promotionGate.promotionAllowed !== false)
    pushIssue(issues, 'PROMOTION_ALLOWED_FORBIDDEN', 'promotionGate.promotionAllowed', 'promotionAllowed must be false.');
  if (fixture.promotionGate.manualReviewRequired !== true)
    pushIssue(issues, 'MANUAL_REVIEW_REQUIRED', 'promotionGate.manualReviewRequired', 'manualReviewRequired must be true.');
  if (fixture.quarantineContract.failClosed !== true)
    pushIssue(issues, 'QUARANTINE_FAIL_CLOSED_REQUIRED', 'quarantineContract.failClosed', 'quarantine must remain fail-closed.');
  if (fixture.quarantineContract.promotionAllowed !== false)
    pushIssue(issues, 'QUARANTINE_PROMOTION_FORBIDDEN', 'quarantineContract.promotionAllowed', 'promotionAllowed must be false.');
  if (fixture.quarantineContract.releaseAllowed !== false)
    pushIssue(issues, 'QUARANTINE_RELEASE_FORBIDDEN', 'quarantineContract.releaseAllowed', 'releaseAllowed must be false.');
}

export function validateLiveSnapshotReplayParityAuditFixture(
  fixture: LiveSnapshotReplayParityAuditFixture,
): LiveSnapshotReplayParityAuditValidationResult {
  const issues: LiveSnapshotReplayParityAuditValidationIssue[] = [];
  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidLiveSnapshotReplayParityAuditName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidLiveSnapshotReplayParityAuditKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE}.`);
  if (!isValidLiveSnapshotReplayParityAuditSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidLiveSnapshotReplayParityAuditGeneratedAt(fixture.meta.generatedAt))
    pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidLiveSnapshotReplayParityAuditSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt))
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');

  if (!fixture.auditEvidence.evidenceBundleId)
    pushIssue(issues, 'MISSING_EVIDENCE_BUNDLE', 'auditEvidence.evidenceBundleId', 'evidence bundle is required.');
  if (!fixture.auditEvidence.validationCommandRefs.length)
    pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'auditEvidence.validationCommandRefs', 'validationCommandRefs is required.');
  if (!fixture.auditEvidence.docsRefs.length)
    pushIssue(issues, 'MISSING_DOC_REFS', 'auditEvidence.docsRefs', 'docsRefs is required.');
  if (!fixture.auditEvidence.sourceRefs.length)
    pushIssue(issues, 'MISSING_SOURCE_REFS', 'auditEvidence.sourceRefs', 'sourceRefs is required.');

  if (fixture.parityComparison.mismatchCount < 0) {
    pushIssue(issues, 'INVALID_MISMATCH_COUNT', 'parityComparison.mismatchCount', 'mismatchCount must be non-negative.');
  }
  if (!fixture.replayExpectationLinkage.expectationPresent && fixture.parityComparison.parityStatus === 'clean') {
    pushIssue(
      issues,
      'REPLAY_EXPECTATION_MISSING_CANNOT_BE_CLEAN',
      'parityComparison.parityStatus',
      'Parity cannot be clean when replay expectation is missing.',
    );
  }
  if (fixture.mismatchTaxonomy.severity === 'critical' && fixture.parityGate.gateStatus === 'ready') {
    pushIssue(
      issues,
      'CRITICAL_MISMATCH_MUST_BLOCK',
      'parityGate.gateStatus',
      'Critical mismatch must not keep gate ready.',
    );
  }
  if (fixture.quarantineContract.quarantined && fixture.promotionGate.promotionAllowed !== false) {
    pushIssue(
      issues,
      'QUARANTINE_PROMOTION_CONFLICT',
      'promotionGate.promotionAllowed',
      'Quarantined snapshots cannot be promotion-allowed.',
    );
  }
  if (fixture.quarantineContract.quarantined && fixture.quarantineContract.reasonCodes.length === 0) {
    pushIssue(issues, 'QUARANTINE_REASON_REQUIRED', 'quarantineContract.reasonCodes', 'quarantined fixtures require reason codes.');
  }

  const reportSummaries = [
    fixture.parityReport.gateSummary,
    fixture.parityReport.snapshotSummary,
    fixture.parityReport.replaySummary,
    fixture.parityReport.scenarioSummary,
    fixture.parityReport.schemaSummary,
    fixture.parityReport.integritySummary,
    fixture.parityReport.driftSummary,
    fixture.parityReport.promotionSummary,
    fixture.parityReport.safetySummary,
  ];
  if (reportSummaries.some(summary => FORBIDDEN_ADVISORY_PATTERN.test(summary))) {
    pushIssue(
      issues,
      'ADVISORY_LANGUAGE_FORBIDDEN',
      'parityReport',
      'advisory/profit language is forbidden in report summaries.',
    );
  }

  if (!Object.isFrozen(fixture.sourcePhase78FixtureSnapshot)) {
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase78FixtureSnapshot', 'source snapshots must be immutable.');
  }

  validateSafetyBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateLiveSnapshotReplayParityAuditSafety(
  fixture: LiveSnapshotReplayParityAuditFixture,
): LiveSnapshotReplayParityAuditSafetyResult {
  const violations: string[] = [];
  if (fixture.parityGate.unlockAuthority !== false) violations.push('parityGate.unlockAuthority must be false');
  if (fixture.parityGate.runtimeReplayAllowed !== false) violations.push('parityGate.runtimeReplayAllowed must be false');
  if (fixture.promotionGate.automaticPromotionAllowed !== false)
    violations.push('promotionGate.automaticPromotionAllowed must be false');
  if (fixture.snapshotInput.networkAccessAllowed !== false) violations.push('snapshotInput.networkAccessAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateLiveSnapshotReplayParityAuditFixtureTable(
  fixtures: readonly LiveSnapshotReplayParityAuditFixture[],
): LiveSnapshotReplayParityAuditValidationResult {
  const issues: LiveSnapshotReplayParityAuditValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateLiveSnapshotReplayParityAuditFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName))
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
