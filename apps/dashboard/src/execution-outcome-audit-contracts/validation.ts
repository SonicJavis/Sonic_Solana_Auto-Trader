import {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE,
  type ExecutionOutcomeAuditFixture,
  type ExecutionOutcomeAuditSafetyResult,
  type ExecutionOutcomeAuditValidationIssue,
  type ExecutionOutcomeAuditValidationResult,
} from './types.js';
import {
  isValidExecutionOutcomeAuditContractKind,
  isValidExecutionOutcomeAuditContractName,
  isValidExecutionOutcomeAuditGeneratedAt,
  isValidExecutionOutcomeAuditSchemaVersion,
  isValidExecutionOutcomeAuditSource,
} from './normalization.js';

const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_URL_PROVIDER_PATTERN = /\b(?:https?:\/\/|providerSdk|unsafe-endpoint|drainer|api[_-]?key)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: ExecutionOutcomeAuditValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

export function validateExecutionOutcomeAuditFixture(
  fixture: ExecutionOutcomeAuditFixture,
): ExecutionOutcomeAuditValidationResult {
  const issues: ExecutionOutcomeAuditValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidExecutionOutcomeAuditContractName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidExecutionOutcomeAuditContractKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase is invalid.');
  if (!isValidExecutionOutcomeAuditSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (
    !isValidExecutionOutcomeAuditGeneratedAt(fixture.meta.generatedAt) ||
    !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)
  )
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  if (!isValidExecutionOutcomeAuditSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');

  // Audit gate invariants
  if (fixture.auditGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'auditGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.auditGate.liveOutcomeObservationAllowed !== false)
    pushIssue(issues, 'LIVE_OUTCOME_OBSERVATION_FORBIDDEN', 'auditGate.liveOutcomeObservationAllowed', 'liveOutcomeObservationAllowed must be false.');
  if (fixture.auditGate.transactionLookupAllowed !== false)
    pushIssue(issues, 'TRANSACTION_LOOKUP_FORBIDDEN', 'auditGate.transactionLookupAllowed', 'transactionLookupAllowed must be false.');
  if (fixture.auditGate.confirmationLookupAllowed !== false)
    pushIssue(issues, 'CONFIRMATION_LOOKUP_FORBIDDEN', 'auditGate.confirmationLookupAllowed', 'confirmationLookupAllowed must be false.');
  if (fixture.auditGate.networkReadAllowed !== false)
    pushIssue(issues, 'NETWORK_READ_FORBIDDEN', 'auditGate.networkReadAllowed', 'networkReadAllowed must be false.');

  // Outcome event placeholder
  if (fixture.outcomeEventPlaceholder.realOutcomeEventProduced !== false)
    pushIssue(issues, 'REAL_OUTCOME_EVENT_FORBIDDEN', 'outcomeEventPlaceholder.realOutcomeEventProduced', 'realOutcomeEventProduced must be false.');
  if (fixture.outcomeEventPlaceholder.transactionSignatureRequired !== false)
    pushIssue(issues, 'TX_SIGNATURE_REQUIRED_FORBIDDEN', 'outcomeEventPlaceholder.transactionSignatureRequired', 'transactionSignatureRequired must be false.');

  // Outcome status placeholder
  if (fixture.outcomeStatusPlaceholder.liveStatusFetched !== false)
    pushIssue(issues, 'LIVE_STATUS_FETCHED_FORBIDDEN', 'outcomeStatusPlaceholder.liveStatusFetched', 'liveStatusFetched must be false.');
  if (fixture.outcomeStatusPlaceholder.outcomeStatusProduced !== false)
    pushIssue(issues, 'OUTCOME_STATUS_PRODUCED_FORBIDDEN', 'outcomeStatusPlaceholder.outcomeStatusProduced', 'outcomeStatusProduced must be false.');

  // Confirmation outcome placeholder
  if (fixture.confirmationOutcomePlaceholder.liveConfirmationFetched !== false)
    pushIssue(issues, 'LIVE_CONFIRMATION_FETCHED_FORBIDDEN', 'confirmationOutcomePlaceholder.liveConfirmationFetched', 'liveConfirmationFetched must be false.');

  // Finality outcome placeholder
  if (fixture.finalityOutcomePlaceholder.liveFinalityFetched !== false)
    pushIssue(issues, 'LIVE_FINALITY_FETCHED_FORBIDDEN', 'finalityOutcomePlaceholder.liveFinalityFetched', 'liveFinalityFetched must be false.');

  // Transaction result denial
  if (fixture.transactionResultDenial.transactionLookupBlocked !== true)
    pushIssue(issues, 'TRANSACTION_LOOKUP_BLOCK_REQUIRED', 'transactionResultDenial.transactionLookupBlocked', 'transactionLookupBlocked must be true.');
  if (fixture.transactionResultDenial.transactionResultProduced !== false)
    pushIssue(issues, 'TX_RESULT_PRODUCED_FORBIDDEN', 'transactionResultDenial.transactionResultProduced', 'transactionResultProduced must be false.');
  if (fixture.transactionResultDenial.transactionMetaProduced !== false)
    pushIssue(issues, 'TX_META_PRODUCED_FORBIDDEN', 'transactionResultDenial.transactionMetaProduced', 'transactionMetaProduced must be false.');

  // Network observation denial
  if (fixture.networkObservationDenial.networkReadBlocked !== true)
    pushIssue(issues, 'NETWORK_READ_BLOCK_REQUIRED', 'networkObservationDenial.networkReadBlocked', 'networkReadBlocked must be true.');
  if (fixture.networkObservationDenial.subscriptionBlocked !== true)
    pushIssue(issues, 'SUBSCRIPTION_BLOCK_REQUIRED', 'networkObservationDenial.subscriptionBlocked', 'subscriptionBlocked must be true.');
  if (fixture.networkObservationDenial.pollingBlocked !== true)
    pushIssue(issues, 'POLLING_BLOCK_REQUIRED', 'networkObservationDenial.pollingBlocked', 'pollingBlocked must be true.');

  // Abort/Rollback scheduled timers
  if (
    fixture.abortContract.scheduledTimersAllowed !== false ||
    fixture.rollbackContract.scheduledTimersAllowed !== false
  )
    pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abort/rollback', 'scheduled timers must be false.');

  // Capabilities safety checks
  if (
    fixture.capabilities.outcomeSending ||
    fixture.capabilities.outcomeDispatch ||
    fixture.capabilities.outcomeSigning ||
    fixture.capabilities.outcomeWalletLogic
  )
    pushIssue(issues, 'SEND_DISPATCH_SIGN_WALLET_FORBIDDEN', 'capabilities', 'sending/dispatch/signing/wallet must be false.');
  if (fixture.capabilities.outcomeAutomaticPromotion)
    pushIssue(issues, 'AUTO_PROMOTION_FORBIDDEN', 'capabilities.outcomeAutomaticPromotion', 'automatic promotion must be false.');
  if (fixture.capabilities.outcomeFilesystemWrites || fixture.capabilities.outcomePersistence)
    pushIssue(issues, 'FILESYSTEM_PERSISTENCE_FORBIDDEN', 'capabilities', 'filesystem/persistence must be false.');
  if (
    fixture.capabilities.outcomeRecommendations ||
    fixture.capabilities.outcomeTradingSignals ||
    fixture.capabilities.outcomeInvestmentAdvice
  )
    pushIssue(issues, 'ADVISORY_CAPABILITIES_FORBIDDEN', 'capabilities', 'recommendations/signals/advice must be false.');
  if (
    fixture.capabilities.outcomeRealOrders ||
    fixture.capabilities.outcomeRealFunds ||
    fixture.capabilities.outcomeRealPnL
  )
    pushIssue(issues, 'REAL_FUNDS_PNL_FORBIDDEN', 'capabilities', 'real orders/funds/PnL must be false.');
  if (
    fixture.capabilities.outcomeFullAutoUnlock ||
    fixture.capabilities.outcomeLimitedLiveUnlock ||
    fixture.capabilities.outcomeUnlockAuthority
  )
    pushIssue(issues, 'UNLOCK_FLAGS_FORBIDDEN', 'capabilities', 'unlock flags must be false.');
  if (fixture.capabilities.outcomeLiveNetworkDefault)
    pushIssue(issues, 'LIVE_NETWORK_DEFAULT_FORBIDDEN', 'capabilities.outcomeLiveNetworkDefault', 'live network default must be false.');
  if (fixture.capabilities.outcomeRuntimeMonitoring || fixture.capabilities.outcomeRuntimeCollectors)
    pushIssue(issues, 'RUNTIME_MONITORING_COLLECTORS_FORBIDDEN', 'capabilities', 'runtime monitoring/collectors must be false.');
  if (fixture.capabilities.outcomeProviderExpansion)
    pushIssue(issues, 'PROVIDER_EXPANSION_FORBIDDEN', 'capabilities.outcomeProviderExpansion', 'provider expansion must be false.');
  if (fixture.capabilities.outcomeSecretsRequired)
    pushIssue(issues, 'SECRETS_REQUIRED_FORBIDDEN', 'capabilities.outcomeSecretsRequired', 'secrets required must be false.');
  if (
    fixture.capabilities.outcomeRouteHandlers ||
    fixture.capabilities.outcomeRuntimeRequests ||
    fixture.capabilities.outcomeUiRendering ||
    fixture.capabilities.outcomeDomAccess
  )
    pushIssue(issues, 'ROUTE_RUNTIME_UI_DOM_FORBIDDEN', 'capabilities', 'route/runtime/UI/DOM must be false.');

  // Advisory language in report
  if (Object.values(fixture.report).some(value => FORBIDDEN_ADVISORY_PATTERN.test(value)))
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory text is forbidden.');

  // Unsafe URL/provider refs
  const runtimeSurface = JSON.stringify({
    gate: fixture.auditGate,
    outcomeEvent: fixture.outcomeEventPlaceholder,
    outcomeStatus: fixture.outcomeStatusPlaceholder,
    confirmationOutcome: fixture.confirmationOutcomePlaceholder,
    finalityOutcome: fixture.finalityOutcomePlaceholder,
    txResultDenial: fixture.transactionResultDenial,
    networkDenial: fixture.networkObservationDenial,
    report: fixture.report,
    capabilities: fixture.capabilities,
  });
  if (FORBIDDEN_URL_PROVIDER_PATTERN.test(runtimeSurface))
    pushIssue(issues, 'UNSAFE_URL_PROVIDER_REF', 'fixture', 'unsafe URL/provider refs are forbidden.');

  // Evidence refs
  if (!fixture.evidenceBundle.docsRefs.length || !fixture.evidenceBundle.validationCommandRefs.length)
    pushIssue(issues, 'MISSING_EVIDENCE_REFS', 'evidenceBundle', 'evidence refs are required.');

  // Source snapshot immutability
  if (!Object.isFrozen(fixture.sourcePhase85FixtureSnapshot))
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase85FixtureSnapshot', 'source snapshots must be immutable.');

  return { valid: issues.length === 0, issues };
}

export function validateExecutionOutcomeAuditSafety(
  fixture: ExecutionOutcomeAuditFixture,
): ExecutionOutcomeAuditSafetyResult {
  const violations: string[] = [];
  if (fixture.auditGate.liveOutcomeObservationAllowed !== false)
    violations.push('auditGate.liveOutcomeObservationAllowed must be false');
  if (fixture.auditGate.transactionLookupAllowed !== false)
    violations.push('auditGate.transactionLookupAllowed must be false');
  if (fixture.networkObservationDenial.networkReadBlocked !== true)
    violations.push('networkObservationDenial.networkReadBlocked must be true');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateExecutionOutcomeAuditFixtureTable(
  fixtures: readonly ExecutionOutcomeAuditFixture[],
): ExecutionOutcomeAuditValidationResult {
  const issues: ExecutionOutcomeAuditValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const fixture of fixtures) {
    const result = validateExecutionOutcomeAuditFixture(fixture);
    issues.push(...result.issues);
    if (ids.has(fixture.fixtureId))
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    if (names.has(fixture.fixtureName))
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    ids.add(fixture.fixtureId);
    names.add(fixture.fixtureName);
  }
  return { valid: issues.length === 0, issues };
}
