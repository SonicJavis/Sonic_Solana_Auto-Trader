import {
  PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
  type PreLiveSafetyCertificationFixture,
  type PreLiveSafetyCertificationSafetyResult,
  type PreLiveSafetyCertificationValidationIssue,
  type PreLiveSafetyCertificationValidationResult,
} from './types.js';
import {
  isValidPreLiveSafetyCertificationGeneratedAt,
  isValidPreLiveSafetyCertificationKind,
  isValidPreLiveSafetyCertificationName,
  isValidPreLiveSafetyCertificationSchemaVersion,
  isValidPreLiveSafetyCertificationSource,
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
  issues: PreLiveSafetyCertificationValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanUnsafeText(text: string, fieldPath: string, issues: PreLiveSafetyCertificationValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
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

function scanRecursive(value: unknown, fieldPath: string, issues: PreLiveSafetyCertificationValidationIssue[], depth = 0): void {
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
  fixture: PreLiveSafetyCertificationFixture,
  issues: PreLiveSafetyCertificationValidationIssue[],
): void {
  if (fixture.safetyGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'safetyGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.safetyGate.liveTradingAllowed !== false) pushIssue(issues, 'UNSAFE_LIVE_TRADING', 'safetyGate.liveTradingAllowed', 'liveTradingAllowed must be false.');
  if (fixture.safetyGate.manualTradingAllowed !== false)
    pushIssue(issues, 'UNSAFE_MANUAL_TRADING', 'safetyGate.manualTradingAllowed', 'manualTradingAllowed must be false.');
  if (fixture.safetyGate.executionAllowed !== false)
    pushIssue(issues, 'UNSAFE_EXECUTION_ALLOWED', 'safetyGate.executionAllowed', 'executionAllowed must be false.');
  if (fixture.approvalPolicy.automaticPromotionAllowed !== false)
    pushIssue(issues, 'AUTO_PROMOTION_FORBIDDEN', 'approvalPolicy.automaticPromotionAllowed', 'automaticPromotionAllowed must be false.');
  if (fixture.signoffModel.automaticApprovalAllowed !== false)
    pushIssue(issues, 'AUTO_APPROVAL_FORBIDDEN', 'signoffModel.automaticApprovalAllowed', 'automaticApprovalAllowed must be false.');
  if (fixture.certificationContract.certificationDoesNotUnlockLive !== true)
    pushIssue(issues, 'LIVE_UNLOCK_CLAIM_FORBIDDEN', 'certificationContract.certificationDoesNotUnlockLive', 'certification does not unlock live trading.');
}

function validateLinkageConsistency(
  fixture: PreLiveSafetyCertificationFixture,
  issues: PreLiveSafetyCertificationValidationIssue[],
): void {
  if (fixture.safetyGate.gateStatus === 'ready' && !fixture.smokeReadinessLinkage.smokeCertified) {
    pushIssue(issues, 'SMOKE_CERTIFICATION_MISSING_WHILE_READY', 'smokeReadinessLinkage.smokeCertified', 'smoke certification missing but gate is ready.');
  }
  if (fixture.safetyGate.gateStatus === 'ready' && !fixture.replayReadinessLinkage.replayImportComplete) {
    pushIssue(issues, 'REPLAY_IMPORT_INCOMPLETE_WHILE_READY', 'replayReadinessLinkage.replayImportComplete', 'replay import incomplete but gate is ready.');
  }
  if (fixture.rejectionContract.rejectionKind === 'unsafe_capability' && fixture.safetyGate.failClosed !== true) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_NOT_FAIL_CLOSED', 'safetyGate.failClosed', 'unsafe capability states must be fail-closed.');
  }
}

export function validatePreLiveSafetyCertificationFixture(
  fixture: PreLiveSafetyCertificationFixture,
): PreLiveSafetyCertificationValidationResult {
  const issues: PreLiveSafetyCertificationValidationIssue[] = [];

  if (!isValidPreLiveSafetyCertificationName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidPreLiveSafetyCertificationKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PRE_LIVE_SAFETY_CERTIFICATION_PHASE) {
    pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${PRE_LIVE_SAFETY_CERTIFICATION_PHASE}.`);
  }
  if (!isValidPreLiveSafetyCertificationSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!fixture.fixtureId || typeof fixture.fixtureId !== 'string') {
    pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  }
  if (!isValidPreLiveSafetyCertificationGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidPreLiveSafetyCertificationSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'meta.source is invalid.');
  }
  if (!isDeterministicTimestamp(fixture.meta.generatedAt)) {
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');
  }
  if (fixture.evidenceBundle.sourcePhaseRefs.length < 9) {
    pushIssue(issues, 'MISSING_SOURCE_PHASE_REFS', 'evidenceBundle.sourcePhaseRefs', 'sourcePhaseRefs must include phase 65..74 references.');
  }
  if (!fixture.evidenceBundle.validationCommandRefs.length) {
    pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'evidenceBundle.validationCommandRefs', 'validationCommandRefs is required.');
  }
  if (!fixture.evidenceBundle.docsRefs.length) {
    pushIssue(issues, 'MISSING_DOC_REFS', 'evidenceBundle.docsRefs', 'docsRefs is required.');
  }
  if (!fixture.evidenceBundle.reviewRefs.length) {
    pushIssue(issues, 'MISSING_REVIEW_REFS', 'evidenceBundle.reviewRefs', 'reviewRefs is required.');
  }
  if (!fixture.evidenceBundle.safetyGrepRefs.length) {
    pushIssue(issues, 'MISSING_SAFETY_GREP_REFS', 'evidenceBundle.safetyGrepRefs', 'safetyGrepRefs is required.');
  }
  validateSafetyBooleans(fixture, issues);
  validateLinkageConsistency(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validatePreLiveSafetyCertificationSafety(
  fixture: PreLiveSafetyCertificationFixture,
): PreLiveSafetyCertificationSafetyResult {
  const violations: string[] = [];

  if (fixture.safetyGate.unlockAuthority !== false) violations.push('safetyGate.unlockAuthority must be false');
  if (fixture.safetyGate.liveTradingAllowed !== false) violations.push('safetyGate.liveTradingAllowed must be false');
  if (fixture.safetyGate.manualTradingAllowed !== false) violations.push('safetyGate.manualTradingAllowed must be false');
  if (fixture.safetyGate.executionAllowed !== false) violations.push('safetyGate.executionAllowed must be false');
  if (fixture.signoffModel.automaticApprovalAllowed !== false) violations.push('signoffModel.automaticApprovalAllowed must be false');
  if (fixture.approvalPolicy.automaticPromotionAllowed !== false)
    violations.push('approvalPolicy.automaticPromotionAllowed must be false');
  if (fixture.certificationContract.certificationDoesNotUnlockLive !== true)
    violations.push('certificationContract.certificationDoesNotUnlockLive must be true');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  if (!fixture.safety.readOnly) violations.push('safety.readOnly must be true');
  if (!fixture.safety.nonAdvisory) violations.push('safety.nonAdvisory must be true');
  if (!fixture.safety.notExecutable) violations.push('safety.notExecutable must be true');

  return { safe: violations.length === 0, violations };
}

export function validatePreLiveSafetyCertificationFixtureTable(
  fixtures: readonly PreLiveSafetyCertificationFixture[],
): PreLiveSafetyCertificationValidationResult {
  const issues: PreLiveSafetyCertificationValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validatePreLiveSafetyCertificationFixture(fixture);
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
