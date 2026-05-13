import {
  MANUAL_CONFIRM_LIVE_READINESS_PHASE,
  type ManualConfirmLiveReadinessFixture,
  type ManualConfirmLiveReadinessSafetyResult,
  type ManualConfirmLiveReadinessValidationIssue,
  type ManualConfirmLiveReadinessValidationResult,
} from './types.js';
import {
  isValidManualConfirmGeneratedAt,
  isValidManualConfirmLiveReadinessKind,
  isValidManualConfirmLiveReadinessName,
  isValidManualConfirmSchemaVersion,
  isValidManualConfirmSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|endpoint|providersdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB|download)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:apiKey|secret|token-drainer|drainer|postinstall)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: ManualConfirmLiveReadinessValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: ManualConfirmLiveReadinessValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory/profit references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_SECRET_OR_SDK_REFERENCE', fieldPath, 'Secret/api-key/provider-sdk references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: ManualConfirmLiveReadinessValidationIssue[],
  depth = 0,
): void {
  if (depth > 24) return;
  if (typeof value === 'string') {
    if (!fieldPath.endsWith('fixtureId') && !fieldPath.endsWith('fixtureName')) {
      scanUnsafeText(value, fieldPath, issues);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      scanRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

function isDeterministicTimestamp(value: string): boolean {
  return TIMESTAMP_PATTERN.test(value);
}

function validateSafetyBooleans(
  fixture: ManualConfirmLiveReadinessFixture,
  issues: ManualConfirmLiveReadinessValidationIssue[],
): void {
  if (fixture.readinessGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'readinessGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.readinessGate.manualLiveAllowed !== false)
    pushIssue(issues, 'UNSAFE_MANUAL_LIVE', 'readinessGate.manualLiveAllowed', 'manualLiveAllowed must be false.');
  if (fixture.readinessGate.executionAllowed !== false)
    pushIssue(issues, 'UNSAFE_EXECUTION_ALLOWED', 'readinessGate.executionAllowed', 'executionAllowed must be false.');
  if (fixture.approvalPolicy.automaticApprovalAllowed !== false)
    pushIssue(
      issues,
      'AUTO_APPROVAL_FORBIDDEN',
      'approvalPolicy.automaticApprovalAllowed',
      'automaticApprovalAllowed must be false.',
    );
  if (fixture.approvalPolicy.automaticPromotionAllowed !== false)
    pushIssue(
      issues,
      'AUTO_PROMOTION_FORBIDDEN',
      'approvalPolicy.automaticPromotionAllowed',
      'automaticPromotionAllowed must be false.',
    );
  if (fixture.approvalPolicy.limitedLiveUnlockAllowed !== false)
    pushIssue(
      issues,
      'LIMITED_LIVE_UNLOCK_FORBIDDEN',
      'approvalPolicy.limitedLiveUnlockAllowed',
      'limitedLiveUnlockAllowed must be false.',
    );
  if (fixture.approvalPolicy.fullAutoUnlockAllowed !== false)
    pushIssue(
      issues,
      'FULL_AUTO_UNLOCK_FORBIDDEN',
      'approvalPolicy.fullAutoUnlockAllowed',
      'fullAutoUnlockAllowed must be false.',
    );
  if (fixture.phraseContract.commandDispatchAllowed !== false)
    pushIssue(
      issues,
      'PHRASE_DISPATCH_FORBIDDEN',
      'phraseContract.commandDispatchAllowed',
      'commandDispatchAllowed must be false.',
    );
  if (fixture.phraseContract.executionAllowed !== false)
    pushIssue(
      issues,
      'PHRASE_EXECUTION_FORBIDDEN',
      'phraseContract.executionAllowed',
      'phraseContract.executionAllowed must be false.',
    );
  if (fixture.roleSeparation.sameActorAllowed !== false)
    pushIssue(issues, 'SAME_ACTOR_FORBIDDEN', 'roleSeparation.sameActorAllowed', 'sameActorAllowed must be false.');
  if (fixture.coolingOffPolicy.usesRuntimeTimers !== false)
    pushIssue(
      issues,
      'RUNTIME_TIMERS_FORBIDDEN',
      'coolingOffPolicy.usesRuntimeTimers',
      'usesRuntimeTimers must be false.',
    );
  if (fixture.coolingOffPolicy.automaticTransitionAllowed !== false)
    pushIssue(
      issues,
      'AUTO_TRANSITION_FORBIDDEN',
      'coolingOffPolicy.automaticTransitionAllowed',
      'automaticTransitionAllowed must be false.',
    );
  if (fixture.riskAcknowledgement.advisoryOutput !== false)
    pushIssue(
      issues,
      'ADVISORY_OUTPUT_FORBIDDEN',
      'riskAcknowledgement.advisoryOutput',
      'advisoryOutput must be false.',
    );
  if (fixture.riskAcknowledgement.recommendationOutput !== false)
    pushIssue(
      issues,
      'RECOMMENDATION_FORBIDDEN',
      'riskAcknowledgement.recommendationOutput',
      'recommendationOutput must be false.',
    );
  if (fixture.riskAcknowledgement.signalOutput !== false)
    pushIssue(issues, 'SIGNAL_FORBIDDEN', 'riskAcknowledgement.signalOutput', 'signalOutput must be false.');
  if (fixture.certificationLinkage.certificationDoesNotUnlockLive !== true)
    pushIssue(
      issues,
      'LIVE_UNLOCK_CLAIM_FORBIDDEN',
      'certificationLinkage.certificationDoesNotUnlockLive',
      'certificationDoesNotUnlockLive must be true.',
    );
  if (fixture.rejectionContract.unlockAuthority !== false)
    pushIssue(
      issues,
      'REJECTION_UNLOCK_FORBIDDEN',
      'rejectionContract.unlockAuthority',
      'rejectionContract.unlockAuthority must be false.',
    );
  if (fixture.rejectionContract.manualLiveAllowed !== false)
    pushIssue(
      issues,
      'REJECTION_MANUAL_LIVE_FORBIDDEN',
      'rejectionContract.manualLiveAllowed',
      'rejectionContract.manualLiveAllowed must be false.',
    );
}

function validateLinkageConsistency(
  fixture: ManualConfirmLiveReadinessFixture,
  issues: ManualConfirmLiveReadinessValidationIssue[],
): void {
  if (fixture.readinessGate.gateStatus === 'ready' && !fixture.smokeReadinessLinkage.smokeCertified) {
    pushIssue(
      issues,
      'SMOKE_CERTIFICATION_MISSING_WHILE_READY',
      'smokeReadinessLinkage.smokeCertified',
      'smoke certification missing but gate is ready.',
    );
  }
  if (fixture.readinessGate.gateStatus === 'ready' && !fixture.replayReadinessLinkage.replayImportComplete) {
    pushIssue(
      issues,
      'REPLAY_IMPORT_INCOMPLETE_WHILE_READY',
      'replayReadinessLinkage.replayImportComplete',
      'replay import incomplete but gate is ready.',
    );
  }
  if (
    fixture.readinessGate.gateStatus === 'ready' &&
    !fixture.roleSeparation.separationSatisfied
  ) {
    pushIssue(
      issues,
      'ROLE_SEPARATION_VIOLATION_WHILE_READY',
      'roleSeparation.separationSatisfied',
      'role separation not satisfied but gate is ready.',
    );
  }
  if (
    fixture.readinessGate.gateStatus === 'ready' &&
    fixture.phraseContract.phraseStatus !== 'phrase_matched'
  ) {
    pushIssue(
      issues,
      'PHRASE_NOT_MATCHED_WHILE_READY',
      'phraseContract.phraseStatus',
      'phrase not matched but gate is ready.',
    );
  }
  if (fixture.rejectionContract.rejectionKind === 'unsafe_capability' && fixture.readinessGate.failClosed !== true) {
    pushIssue(
      issues,
      'UNSAFE_CAPABILITY_NOT_FAIL_CLOSED',
      'readinessGate.failClosed',
      'unsafe capability states must be fail-closed.',
    );
  }
}

export function validateManualConfirmLiveReadinessFixture(
  fixture: ManualConfirmLiveReadinessFixture,
): ManualConfirmLiveReadinessValidationResult {
  const issues: ManualConfirmLiveReadinessValidationIssue[] = [];

  if (!isValidManualConfirmLiveReadinessName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidManualConfirmLiveReadinessKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== MANUAL_CONFIRM_LIVE_READINESS_PHASE) {
    pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${MANUAL_CONFIRM_LIVE_READINESS_PHASE}.`);
  }
  if (!isValidManualConfirmSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!fixture.fixtureId || typeof fixture.fixtureId !== 'string') {
    pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  }
  if (!isValidManualConfirmGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidManualConfirmSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'meta.source is invalid.');
  }
  if (!isDeterministicTimestamp(fixture.meta.generatedAt)) {
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');
  }
  if (fixture.preflightEvidence.sourcePhaseRefs.length < 10) {
    pushIssue(
      issues,
      'MISSING_SOURCE_PHASE_REFS',
      'preflightEvidence.sourcePhaseRefs',
      'sourcePhaseRefs must include phase 65..75 references.',
    );
  }
  if (!fixture.preflightEvidence.validationCommandRefs.length) {
    pushIssue(
      issues,
      'MISSING_VALIDATION_COMMAND_REFS',
      'preflightEvidence.validationCommandRefs',
      'validationCommandRefs is required.',
    );
  }
  if (!fixture.preflightEvidence.docsRefs.length) {
    pushIssue(issues, 'MISSING_DOC_REFS', 'preflightEvidence.docsRefs', 'docsRefs is required.');
  }
  if (!fixture.preflightEvidence.reviewRefs.length) {
    pushIssue(issues, 'MISSING_REVIEW_REFS', 'preflightEvidence.reviewRefs', 'reviewRefs is required.');
  }
  if (!fixture.preflightEvidence.safetyGrepRefs.length) {
    pushIssue(issues, 'MISSING_SAFETY_GREP_REFS', 'preflightEvidence.safetyGrepRefs', 'safetyGrepRefs is required.');
  }
  validateSafetyBooleans(fixture, issues);
  validateLinkageConsistency(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateManualConfirmLiveReadinessSafety(
  fixture: ManualConfirmLiveReadinessFixture,
): ManualConfirmLiveReadinessSafetyResult {
  const violations: string[] = [];

  if (fixture.readinessGate.unlockAuthority !== false) violations.push('readinessGate.unlockAuthority must be false');
  if (fixture.readinessGate.manualLiveAllowed !== false) violations.push('readinessGate.manualLiveAllowed must be false');
  if (fixture.readinessGate.executionAllowed !== false) violations.push('readinessGate.executionAllowed must be false');
  if (fixture.approvalPolicy.automaticApprovalAllowed !== false)
    violations.push('approvalPolicy.automaticApprovalAllowed must be false');
  if (fixture.approvalPolicy.automaticPromotionAllowed !== false)
    violations.push('approvalPolicy.automaticPromotionAllowed must be false');
  if (fixture.approvalPolicy.limitedLiveUnlockAllowed !== false)
    violations.push('approvalPolicy.limitedLiveUnlockAllowed must be false');
  if (fixture.approvalPolicy.fullAutoUnlockAllowed !== false)
    violations.push('approvalPolicy.fullAutoUnlockAllowed must be false');
  if (fixture.phraseContract.commandDispatchAllowed !== false)
    violations.push('phraseContract.commandDispatchAllowed must be false');
  if (fixture.phraseContract.executionAllowed !== false)
    violations.push('phraseContract.executionAllowed must be false');
  if (fixture.roleSeparation.sameActorAllowed !== false) violations.push('roleSeparation.sameActorAllowed must be false');
  if (fixture.coolingOffPolicy.usesRuntimeTimers !== false)
    violations.push('coolingOffPolicy.usesRuntimeTimers must be false');
  if (fixture.certificationLinkage.certificationDoesNotUnlockLive !== true)
    violations.push('certificationLinkage.certificationDoesNotUnlockLive must be true');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  if (!fixture.safety.readOnly) violations.push('safety.readOnly must be true');
  if (!fixture.safety.nonAdvisory) violations.push('safety.nonAdvisory must be true');
  if (!fixture.safety.notExecutable) violations.push('safety.notExecutable must be true');

  return { safe: violations.length === 0, violations };
}

export function validateManualConfirmLiveReadinessFixtureTable(
  fixtures: readonly ManualConfirmLiveReadinessFixture[],
): ManualConfirmLiveReadinessValidationResult {
  const issues: ManualConfirmLiveReadinessValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateManualConfirmLiveReadinessFixture(fixture);
    issues.push(...result.issues);

    if (seenIds.has(fixture.fixtureId)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    }
    seenIds.add(fixture.fixtureId);

    if (seenNames.has(fixture.fixtureName)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    }
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
