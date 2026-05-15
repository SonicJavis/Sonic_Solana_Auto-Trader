import { TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE, type TransactionSendBoundarySafetyFixture, type TransactionSendBoundarySafetyResult, type TransactionSendBoundarySafetyValidationIssue, type TransactionSendBoundarySafetyValidationResult } from './types.js';
import { isValidTransactionSendBoundarySafetyGeneratedAt, isValidTransactionSendBoundarySafetyKind, isValidTransactionSendBoundarySafetyName, isValidTransactionSendBoundarySafetySchemaVersion, isValidTransactionSendBoundarySafetySource } from './normalization.js';

const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(issues: TransactionSendBoundarySafetyValidationIssue[], code: string, field: string, message: string, severity: 'error' | 'warning' = 'error'): void { issues.push({ code, field, message, severity }); }

export function validateTransactionSendBoundarySafetyFixture(fixture: TransactionSendBoundarySafetyFixture): TransactionSendBoundarySafetyValidationResult {
  const issues: TransactionSendBoundarySafetyValidationIssue[] = [];
  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidTransactionSendBoundarySafetyName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidTransactionSendBoundarySafetyKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase is invalid.');
  if (!isValidTransactionSendBoundarySafetySchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidTransactionSendBoundarySafetyGeneratedAt(fixture.meta.generatedAt) || !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  if (!isValidTransactionSendBoundarySafetySource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (fixture.boundaryGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'boundaryGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.boundaryGate.sendingAllowed !== false) pushIssue(issues, 'SENDING_ALLOWED_FORBIDDEN', 'boundaryGate.sendingAllowed', 'sendingAllowed must be false.');
  if (fixture.boundaryGate.networkSubmitAllowed !== false) pushIssue(issues, 'NETWORK_SUBMIT_ALLOWED_FORBIDDEN', 'boundaryGate.networkSubmitAllowed', 'networkSubmitAllowed must be false.');
  if (fixture.boundaryGate.broadcastAllowed !== false) pushIssue(issues, 'BROADCAST_ALLOWED_FORBIDDEN', 'boundaryGate.broadcastAllowed', 'broadcastAllowed must be false.');
  if (fixture.boundaryGate.dispatchAllowed !== false) pushIssue(issues, 'DISPATCH_ALLOWED_FORBIDDEN', 'boundaryGate.dispatchAllowed', 'dispatchAllowed must be false.');
  if (fixture.sendRequestDenial.sendRequestBlocked !== true) pushIssue(issues, 'SEND_REQUEST_BLOCK_REQUIRED', 'sendRequestDenial.sendRequestBlocked', 'sendRequestBlocked must be true.');
  if (fixture.sendRequestDenial.sendTransactionBlocked !== true) pushIssue(issues, 'SEND_TRANSACTION_BLOCK_REQUIRED', 'sendRequestDenial.sendTransactionBlocked', 'sendTransactionBlocked must be true.');
  if (fixture.sendRequestDenial.sendRawTransactionBlocked !== true) pushIssue(issues, 'SEND_RAW_TRANSACTION_BLOCK_REQUIRED', 'sendRequestDenial.sendRawTransactionBlocked', 'sendRawTransactionBlocked must be true.');
  if (fixture.sendRequestDenial.transactionIdProduced !== false) pushIssue(issues, 'TRANSACTION_ID_PRODUCED_FORBIDDEN', 'sendRequestDenial.transactionIdProduced', 'transactionIdProduced must be false.');
  if (fixture.networkSubmitDenial.networkSubmitBlocked !== true || fixture.networkSubmitDenial.rpcWriteBlocked !== true || fixture.networkSubmitDenial.endpointSubmitBlocked !== true) pushIssue(issues, 'NETWORK_SUBMIT_DENIAL_REQUIRED', 'networkSubmitDenial', 'network submit denial must be fully blocked.');
  if (fixture.broadcastDenial.broadcastBlocked !== true || fixture.broadcastDenial.mempoolBroadcastAllowed !== false || fixture.broadcastDenial.bundleSubmitAllowed !== false) pushIssue(issues, 'BROADCAST_DENIAL_REQUIRED', 'broadcastDenial', 'broadcast denial must be fully blocked.');
  if (fixture.dispatchDenial.dispatchBlocked !== true || fixture.dispatchDenial.queueDispatchAllowed !== false || fixture.dispatchDenial.workerDispatchAllowed !== false || fixture.dispatchDenial.routeDispatchAllowed !== false) pushIssue(issues, 'DISPATCH_DENIAL_REQUIRED', 'dispatchDenial', 'dispatch denial must be fully blocked.');
  if (fixture.preflightDenialPlaceholder.livePreflightAllowed !== false || fixture.preflightDenialPlaceholder.simulationAgainstLiveRpcAllowed !== false || fixture.preflightDenialPlaceholder.preflightResultProduced !== false) pushIssue(issues, 'PREFLIGHT_DENIAL_REQUIRED', 'preflightDenialPlaceholder', 'preflight denial placeholder must be blocked.');
  if (fixture.retryDenialContract.retryRuntimeAllowed !== false || fixture.confirmationDenialContract.confirmationPollingAllowed !== false || fixture.retryDenialContract.scheduledTimersAllowed !== false || fixture.confirmationDenialContract.scheduledTimersAllowed !== false) pushIssue(issues, 'RETRY_CONFIRMATION_DENIAL_REQUIRED', 'retry/confirmation', 'retry and confirmation must be blocked.');
  if (fixture.approvalBoundary.approvalAuthorizesSending !== false || fixture.approvalBoundary.separateSendingPhaseRequired !== true) pushIssue(issues, 'APPROVAL_BOUNDARY_INVALID', 'approvalBoundary', 'approval boundary must not authorize sending.');
  if (fixture.abortContract.runtimeSideEffectsAllowed !== false || fixture.rollbackContract.runtimeSideEffectsAllowed !== false) pushIssue(issues, 'RUNTIME_SIDE_EFFECTS_FORBIDDEN', 'abort/rollback', 'runtime side effects must be false.');
  if (Object.values(fixture.report).some(value => FORBIDDEN_ADVISORY_PATTERN.test(value))) pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory text is forbidden.');
  if (!fixture.evidenceBundle.docsRefs.length || !fixture.evidenceBundle.validationCommandRefs.length) pushIssue(issues, 'MISSING_EVIDENCE_REFS', 'evidenceBundle', 'evidence refs are required.');
  if (!Object.isFrozen(fixture.sourcePhase83FixtureSnapshot)) pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase83FixtureSnapshot', 'source snapshots must be immutable.');
  return { valid: issues.length === 0, issues };
}

export function validateTransactionSendBoundarySafety(fixture: TransactionSendBoundarySafetyFixture): TransactionSendBoundarySafetyResult {
  const violations: string[] = [];
  if (fixture.boundaryGate.sendingAllowed !== false) violations.push('boundaryGate.sendingAllowed must be false');
  if (fixture.sendRequestDenial.transactionIdProduced !== false) violations.push('sendRequestDenial.transactionIdProduced must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateTransactionSendBoundarySafetyFixtureTable(fixtures: readonly TransactionSendBoundarySafetyFixture[]): TransactionSendBoundarySafetyValidationResult {
  const issues: TransactionSendBoundarySafetyValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const fixture of fixtures) {
    const result = validateTransactionSendBoundarySafetyFixture(fixture);
    issues.push(...result.issues);
    if (ids.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    if (names.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    ids.add(fixture.fixtureId);
    names.add(fixture.fixtureName);
  }
  return { valid: issues.length === 0, issues };
}
