import {
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
  type SigningBoundarySafetyFixture,
  type SigningBoundarySafetyResult,
  type SigningBoundarySafetyValidationIssue,
  type SigningBoundarySafetyValidationResult,
} from './types.js';
import {
  isValidSigningBoundarySafetyGeneratedAt,
  isValidSigningBoundarySafetyKind,
  isValidSigningBoundarySafetyName,
  isValidSigningBoundarySafetySchemaVersion,
  isValidSigningBoundarySafetySource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|endpoint|rpc|network)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:api[_-]?key|secret|token|credential|providerSdk)\b/i;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: SigningBoundarySafetyValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanRecursive(value: unknown, field: string, issues: SigningBoundarySafetyValidationIssue[], depth = 0): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const allowed =
      field.includes('.validationCommandRefs[') ||
      field.includes('.docsRefs[') ||
      field.includes('.safetyGrepRefs[') ||
      field.includes('.sourcePhase') ||
      field.includes('.sourceFixture') ||
      field.includes('.sourceRefs.') ||
      field.includes('.report.') ||
      field.includes('.summary');
    if (!allowed && !field.endsWith('fixtureName') && !field.endsWith('fixtureId') && !field.endsWith('Id')) {
      if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL refs are forbidden.');
      if (FORBIDDEN_NETWORK_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network refs are forbidden.');
      if (FORBIDDEN_SECRET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secret/API/provider refs are forbidden.');
    }
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

function validateBooleans(fixture: SigningBoundarySafetyFixture, issues: SigningBoundarySafetyValidationIssue[]): void {
  if (fixture.boundaryGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'boundaryGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.boundaryGate.signingAllowed !== false) pushIssue(issues, 'SIGNING_ALLOWED_FORBIDDEN', 'boundaryGate.signingAllowed', 'signingAllowed must be false.');
  if (fixture.boundaryGate.walletPromptAllowed !== false) pushIssue(issues, 'WALLET_PROMPT_ALLOWED_FORBIDDEN', 'boundaryGate.walletPromptAllowed', 'walletPromptAllowed must be false.');
  if (fixture.boundaryGate.signatureOutputAllowed !== false) pushIssue(issues, 'SIGNATURE_OUTPUT_ALLOWED_FORBIDDEN', 'boundaryGate.signatureOutputAllowed', 'signatureOutputAllowed must be false.');

  if (fixture.signingRequestDenial.signingRequestBlocked !== true) pushIssue(issues, 'SIGNING_REQUEST_BLOCK_REQUIRED', 'signingRequestDenial.signingRequestBlocked', 'signingRequestBlocked must be true.');
  if (fixture.signingRequestDenial.signTransactionBlocked !== true) pushIssue(issues, 'SIGN_TRANSACTION_BLOCK_REQUIRED', 'signingRequestDenial.signTransactionBlocked', 'signTransactionBlocked must be true.');
  if (fixture.signingRequestDenial.signAllTransactionsBlocked !== true) pushIssue(issues, 'SIGN_ALL_TRANSACTIONS_BLOCK_REQUIRED', 'signingRequestDenial.signAllTransactionsBlocked', 'signAllTransactionsBlocked must be true.');
  if (fixture.signingRequestDenial.signatureOutputProduced !== false) pushIssue(issues, 'SIGNATURE_OUTPUT_PRODUCED_FORBIDDEN', 'signingRequestDenial.signatureOutputProduced', 'signatureOutputProduced must be false.');

  if (fixture.walletPromptDenial.walletPromptBlocked !== true) pushIssue(issues, 'WALLET_PROMPT_BLOCK_REQUIRED', 'walletPromptDenial.walletPromptBlocked', 'walletPromptBlocked must be true.');
  if (fixture.walletPromptDenial.walletAdapterAllowed !== false) pushIssue(issues, 'WALLET_ADAPTER_FORBIDDEN', 'walletPromptDenial.walletAdapterAllowed', 'walletAdapterAllowed must be false.');
  if (fixture.walletPromptDenial.browserWalletAccessAllowed !== false) pushIssue(issues, 'BROWSER_WALLET_ACCESS_FORBIDDEN', 'walletPromptDenial.browserWalletAccessAllowed', 'browserWalletAccessAllowed must be false.');

  if (fixture.keyMaterialDenial.privateKeyAccessAllowed !== false) pushIssue(issues, 'PRIVATE_KEY_ACCESS_FORBIDDEN', 'keyMaterialDenial.privateKeyAccessAllowed', 'privateKeyAccessAllowed must be false.');
  if (fixture.keyMaterialDenial.keypairAccessAllowed !== false) pushIssue(issues, 'KEYPAIR_ACCESS_FORBIDDEN', 'keyMaterialDenial.keypairAccessAllowed', 'keypairAccessAllowed must be false.');
  if (fixture.keyMaterialDenial.seedPhraseAccessAllowed !== false) pushIssue(issues, 'SEED_PHRASE_ACCESS_FORBIDDEN', 'keyMaterialDenial.seedPhraseAccessAllowed', 'seedPhraseAccessAllowed must be false.');
  if (fixture.keyMaterialDenial.mnemonicAccessAllowed !== false) pushIssue(issues, 'MNEMONIC_ACCESS_FORBIDDEN', 'keyMaterialDenial.mnemonicAccessAllowed', 'mnemonicAccessAllowed must be false.');
  if (fixture.keyMaterialDenial.secretStorageAllowed !== false) pushIssue(issues, 'SECRET_STORAGE_FORBIDDEN', 'keyMaterialDenial.secretStorageAllowed', 'secretStorageAllowed must be false.');

  if (fixture.signatureOutputDenial.signatureBytesProduced !== false) pushIssue(issues, 'SIGNATURE_BYTES_FORBIDDEN', 'signatureOutputDenial.signatureBytesProduced', 'signatureBytesProduced must be false.');
  if (fixture.signatureOutputDenial.signedTransactionProduced !== false) pushIssue(issues, 'SIGNED_TRANSACTION_FORBIDDEN', 'signatureOutputDenial.signedTransactionProduced', 'signedTransactionProduced must be false.');
  if (fixture.signatureOutputDenial.signedMessageProduced !== false) pushIssue(issues, 'SIGNED_MESSAGE_FORBIDDEN', 'signatureOutputDenial.signedMessageProduced', 'signedMessageProduced must be false.');

  if (fixture.signerIdentityPlaceholder.realPublicKeyRequired !== false) pushIssue(issues, 'REAL_PUBLIC_KEY_REQUIRED_FORBIDDEN', 'signerIdentityPlaceholder.realPublicKeyRequired', 'realPublicKeyRequired must be false.');
  if (fixture.signerIdentityPlaceholder.signerAuthorityGranted !== false) pushIssue(issues, 'SIGNER_AUTHORITY_FORBIDDEN', 'signerIdentityPlaceholder.signerAuthorityGranted', 'signerAuthorityGranted must be false.');

  if (fixture.approvalBoundary.approvalAuthorizesSigning !== false) pushIssue(issues, 'APPROVAL_AUTHORIZES_SIGNING_FORBIDDEN', 'approvalBoundary.approvalAuthorizesSigning', 'approvalAuthorizesSigning must be false.');
  if (fixture.approvalBoundary.separateSigningPhaseRequired !== true) pushIssue(issues, 'SEPARATE_SIGNING_PHASE_REQUIRED', 'approvalBoundary.separateSigningPhaseRequired', 'separateSigningPhaseRequired must be true.');

  if (fixture.abortContract.runtimeSideEffectsAllowed !== false) pushIssue(issues, 'RUNTIME_SIDE_EFFECTS_FORBIDDEN', 'abortContract.runtimeSideEffectsAllowed', 'runtimeSideEffectsAllowed must be false.');
  if (fixture.rollbackContract.runtimeSideEffectsAllowed !== false) pushIssue(issues, 'ROLLBACK_RUNTIME_SIDE_EFFECTS_FORBIDDEN', 'rollbackContract.runtimeSideEffectsAllowed', 'runtimeSideEffectsAllowed must be false.');
  if (fixture.abortContract.scheduledTimersAllowed !== false) pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abortContract.scheduledTimersAllowed', 'scheduledTimersAllowed must be false.');
  if (fixture.rollbackContract.scheduledTimersAllowed !== false) pushIssue(issues, 'ROLLBACK_SCHEDULED_TIMERS_FORBIDDEN', 'rollbackContract.scheduledTimersAllowed', 'scheduledTimersAllowed must be false.');

  if (fixture.capabilities.signingFullAutoUnlock !== false) pushIssue(issues, 'FULL_AUTO_UNLOCK_FORBIDDEN', 'capabilities.signingFullAutoUnlock', 'FULL_AUTO unlock must be false.');
  if (fixture.capabilities.signingLimitedLiveUnlock !== false) pushIssue(issues, 'LIMITED_LIVE_UNLOCK_FORBIDDEN', 'capabilities.signingLimitedLiveUnlock', 'LIMITED_LIVE unlock must be false.');
}

export function validateSigningBoundarySafetyFixture(fixture: SigningBoundarySafetyFixture): SigningBoundarySafetyValidationResult {
  const issues: SigningBoundarySafetyValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidSigningBoundarySafetyName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidSigningBoundarySafetyKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE}.`);
  if (!isValidSigningBoundarySafetySchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidSigningBoundarySafetyGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidSigningBoundarySafetySource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic timestamp.');

  if (!fixture.evidenceBundle.docsRefs.length) pushIssue(issues, 'MISSING_DOC_REFS', 'evidenceBundle.docsRefs', 'docsRefs are required.');
  if (!fixture.evidenceBundle.validationCommandRefs.length) pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'evidenceBundle.validationCommandRefs', 'validationCommandRefs are required.');
  if (!fixture.evidenceBundle.sourceFixtureRefs.length) pushIssue(issues, 'MISSING_SOURCE_REFS', 'evidenceBundle.sourceFixtureRefs', 'sourceFixtureRefs are required.');

  if (!Object.isFrozen(fixture.sourcePhase82FixtureSnapshot)) pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase82FixtureSnapshot', 'source snapshots must be immutable.');

  if (Object.values(fixture.report).some(summary => FORBIDDEN_ADVISORY_PATTERN.test(summary))) {
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory/profit language is forbidden in reports.');
  }

  validateBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateSigningBoundarySafety(fixture: SigningBoundarySafetyFixture): SigningBoundarySafetyResult {
  const violations: string[] = [];
  if (fixture.boundaryGate.unlockAuthority !== false) violations.push('boundaryGate.unlockAuthority must be false');
  if (fixture.boundaryGate.signingAllowed !== false) violations.push('boundaryGate.signingAllowed must be false');
  if (fixture.signingRequestDenial.signingRequestBlocked !== true) violations.push('signingRequestDenial.signingRequestBlocked must be true');
  if (fixture.signatureOutputDenial.signatureBytesProduced !== false) violations.push('signatureOutputDenial.signatureBytesProduced must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateSigningBoundarySafetyFixtureTable(fixtures: readonly SigningBoundarySafetyFixture[]): SigningBoundarySafetyValidationResult {
  const issues: SigningBoundarySafetyValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateSigningBoundarySafetyFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
