import {
  POST_SEND_OBSERVATION_BOUNDARY_PHASE,
  type PostSendObservationBoundaryFixture,
  type PostSendObservationBoundarySafetyResult,
  type PostSendObservationBoundaryValidationIssue,
  type PostSendObservationBoundaryValidationResult,
} from './types.js';
import {
  isValidPostSendObservationBoundaryGeneratedAt,
  isValidPostSendObservationBoundaryKind,
  isValidPostSendObservationBoundaryName,
  isValidPostSendObservationBoundarySchemaVersion,
  isValidPostSendObservationBoundarySource,
} from './normalization.js';

const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_URL_PROVIDER_PATTERN = /\b(?:https?:\/\/|providerSdk|unsafe-endpoint|drainer)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: PostSendObservationBoundaryValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

export function validatePostSendObservationBoundaryFixture(
  fixture: PostSendObservationBoundaryFixture,
): PostSendObservationBoundaryValidationResult {
  const issues: PostSendObservationBoundaryValidationIssue[] = [];
  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidPostSendObservationBoundaryName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidPostSendObservationBoundaryKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== POST_SEND_OBSERVATION_BOUNDARY_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase is invalid.');
  if (!isValidPostSendObservationBoundarySchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidPostSendObservationBoundaryGeneratedAt(fixture.meta.generatedAt) || !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  if (!isValidPostSendObservationBoundarySource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (fixture.boundaryGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'boundaryGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.boundaryGate.liveObservationAllowed !== false) pushIssue(issues, 'LIVE_OBSERVATION_ALLOWED_FORBIDDEN', 'boundaryGate.liveObservationAllowed', 'liveObservationAllowed must be false.');
  if (fixture.boundaryGate.pollingAllowed !== false) pushIssue(issues, 'POLLING_ALLOWED_FORBIDDEN', 'boundaryGate.pollingAllowed', 'pollingAllowed must be false.');
  if (fixture.boundaryGate.subscriptionAllowed !== false) pushIssue(issues, 'SUBSCRIPTION_ALLOWED_FORBIDDEN', 'boundaryGate.subscriptionAllowed', 'subscriptionAllowed must be false.');
  if (fixture.boundaryGate.networkReadAllowed !== false) pushIssue(issues, 'NETWORK_READ_ALLOWED_FORBIDDEN', 'boundaryGate.networkReadAllowed', 'networkReadAllowed must be false.');
  if (fixture.observationRequestDenial.observationRequestBlocked !== true) pushIssue(issues, 'OBSERVATION_REQUEST_BLOCK_REQUIRED', 'observationRequestDenial.observationRequestBlocked', 'observationRequestBlocked must be true.');
  if (fixture.observationRequestDenial.confirmationLookupBlocked !== true) pushIssue(issues, 'CONFIRMATION_LOOKUP_BLOCK_REQUIRED', 'observationRequestDenial.confirmationLookupBlocked', 'confirmationLookupBlocked must be true.');
  if (fixture.observationRequestDenial.transactionLookupBlocked !== true) pushIssue(issues, 'TRANSACTION_LOOKUP_BLOCK_REQUIRED', 'observationRequestDenial.transactionLookupBlocked', 'transactionLookupBlocked must be true.');
  if (fixture.confirmationStatusPlaceholder.liveConfirmationFetched !== false) pushIssue(issues, 'LIVE_CONFIRMATION_FETCH_FORBIDDEN', 'confirmationStatusPlaceholder.liveConfirmationFetched', 'liveConfirmationFetched must be false.');
  if (fixture.confirmationStatusPlaceholder.confirmationStatusProduced !== false) pushIssue(issues, 'CONFIRMATION_STATUS_PRODUCED_FORBIDDEN', 'confirmationStatusPlaceholder.confirmationStatusProduced', 'confirmationStatusProduced must be false.');
  if (fixture.signatureStatusPlaceholder.realSignatureRequired !== false) pushIssue(issues, 'REAL_SIGNATURE_REQUIRED_FORBIDDEN', 'signatureStatusPlaceholder.realSignatureRequired', 'realSignatureRequired must be false.');
  if (fixture.signatureStatusPlaceholder.liveSignatureLookupAllowed !== false) pushIssue(issues, 'LIVE_SIGNATURE_LOOKUP_FORBIDDEN', 'signatureStatusPlaceholder.liveSignatureLookupAllowed', 'liveSignatureLookupAllowed must be false.');
  if (fixture.signatureStatusPlaceholder.signatureStatusProduced !== false) pushIssue(issues, 'SIGNATURE_STATUS_PRODUCED_FORBIDDEN', 'signatureStatusPlaceholder.signatureStatusProduced', 'signatureStatusProduced must be false.');
  if (fixture.slotObservationPlaceholder.liveSlotFetchAllowed !== false) pushIssue(issues, 'LIVE_SLOT_FETCH_FORBIDDEN', 'slotObservationPlaceholder.liveSlotFetchAllowed', 'liveSlotFetchAllowed must be false.');
  if (fixture.finalityObservationPlaceholder.liveFinalityFetchAllowed !== false) pushIssue(issues, 'LIVE_FINALITY_FETCH_FORBIDDEN', 'finalityObservationPlaceholder.liveFinalityFetchAllowed', 'liveFinalityFetchAllowed must be false.');
  if (fixture.retryObservationDenial.retryRuntimeAllowed !== false) pushIssue(issues, 'RETRY_RUNTIME_FORBIDDEN', 'retryObservationDenial.retryRuntimeAllowed', 'retryRuntimeAllowed must be false.');
  if (fixture.pollingDenialContract.pollingRuntimeAllowed !== false) pushIssue(issues, 'POLLING_RUNTIME_FORBIDDEN', 'pollingDenialContract.pollingRuntimeAllowed', 'pollingRuntimeAllowed must be false.');
  if (fixture.subscriptionDenialContract.subscriptionRuntimeAllowed !== false) pushIssue(issues, 'SUBSCRIPTION_RUNTIME_FORBIDDEN', 'subscriptionDenialContract.subscriptionRuntimeAllowed', 'subscriptionRuntimeAllowed must be false.');
  if (fixture.networkReadDenial.networkReadRuntimeAllowed !== false) pushIssue(issues, 'NETWORK_READ_RUNTIME_FORBIDDEN', 'networkReadDenial.networkReadRuntimeAllowed', 'networkReadRuntimeAllowed must be false.');
  if (fixture.abortContract.scheduledTimersAllowed !== false || fixture.rollbackContract.scheduledTimersAllowed !== false) pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abort/rollback', 'scheduled timers must be false.');
  if (fixture.capabilities.observationSending || fixture.capabilities.observationDispatch || fixture.capabilities.observationSigning || fixture.capabilities.observationWalletLogic) pushIssue(issues, 'SEND_DISPATCH_SIGN_WALLET_FORBIDDEN', 'capabilities', 'sending/dispatch/signing/wallet must be false.');
  if (fixture.capabilities.observationAutomaticPromotion) pushIssue(issues, 'AUTO_PROMOTION_FORBIDDEN', 'capabilities.observationAutomaticPromotion', 'automatic promotion must be false.');
  if (fixture.capabilities.observationFilesystemWrites || fixture.capabilities.observationPersistence) pushIssue(issues, 'FILESYSTEM_PERSISTENCE_FORBIDDEN', 'capabilities', 'filesystem/persistence must be false.');
  if (fixture.capabilities.observationRecommendations || fixture.capabilities.observationTradingSignals || fixture.capabilities.observationInvestmentAdvice) pushIssue(issues, 'ADVISORY_CAPABILITIES_FORBIDDEN', 'capabilities', 'recommendations/signals/advice must be false.');
  if (fixture.capabilities.observationRealOrders || fixture.capabilities.observationRealFunds || fixture.capabilities.observationRealPnL) pushIssue(issues, 'REAL_FUNDS_PNL_FORBIDDEN', 'capabilities', 'real orders/funds/PnL must be false.');
  if (fixture.capabilities.observationFullAutoUnlock || fixture.capabilities.observationLimitedLiveUnlock || fixture.capabilities.observationUnlockAuthority) pushIssue(issues, 'UNLOCK_FLAGS_FORBIDDEN', 'capabilities', 'unlock flags must be false.');
  if (fixture.capabilities.observationLiveNetworkDefault) pushIssue(issues, 'LIVE_NETWORK_DEFAULT_FORBIDDEN', 'capabilities.observationLiveNetworkDefault', 'live network default must be false.');
  if (fixture.capabilities.observationRuntimeMonitoring || fixture.capabilities.observationRuntimeCollectors) pushIssue(issues, 'RUNTIME_MONITORING_COLLECTORS_FORBIDDEN', 'capabilities', 'runtime monitoring/collectors must be false.');
  if (fixture.capabilities.observationProviderExpansion) pushIssue(issues, 'PROVIDER_EXPANSION_FORBIDDEN', 'capabilities.observationProviderExpansion', 'provider expansion must be false.');
  if (fixture.capabilities.observationSecretsRequired || fixture.capabilities.observationApiKeyRequired) pushIssue(issues, 'SECRETS_REQUIRED_FORBIDDEN', 'capabilities', 'secrets/API key required must be false.');
  if (fixture.capabilities.observationRouteHandlers || fixture.capabilities.observationRuntimeRequests || fixture.capabilities.observationUiRendering || fixture.capabilities.observationDomAccess) pushIssue(issues, 'ROUTE_RUNTIME_UI_DOM_FORBIDDEN', 'capabilities', 'route/runtime/UI/DOM must be false.');
  if (Object.values(fixture.report).some(value => FORBIDDEN_ADVISORY_PATTERN.test(value))) pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory text is forbidden.');
  if (FORBIDDEN_URL_PROVIDER_PATTERN.test(JSON.stringify(fixture))) pushIssue(issues, 'UNSAFE_URL_PROVIDER_REF', 'fixture', 'unsafe URL/provider refs are forbidden.');
  if (!fixture.evidenceBundle.docsRefs.length || !fixture.evidenceBundle.validationCommandRefs.length) pushIssue(issues, 'MISSING_EVIDENCE_REFS', 'evidenceBundle', 'evidence refs are required.');
  if (!Object.isFrozen(fixture.sourcePhase84FixtureSnapshot)) pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase84FixtureSnapshot', 'source snapshots must be immutable.');
  return { valid: issues.length === 0, issues };
}

export function validatePostSendObservationBoundarySafety(
  fixture: PostSendObservationBoundaryFixture,
): PostSendObservationBoundarySafetyResult {
  const violations: string[] = [];
  if (fixture.boundaryGate.liveObservationAllowed !== false) violations.push('boundaryGate.liveObservationAllowed must be false');
  if (fixture.pollingDenialContract.pollingRuntimeAllowed !== false) violations.push('pollingDenialContract.pollingRuntimeAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validatePostSendObservationBoundaryFixtureTable(
  fixtures: readonly PostSendObservationBoundaryFixture[],
): PostSendObservationBoundaryValidationResult {
  const issues: PostSendObservationBoundaryValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const fixture of fixtures) {
    const result = validatePostSendObservationBoundaryFixture(fixture);
    issues.push(...result.issues);
    if (ids.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    if (names.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    ids.add(fixture.fixtureId);
    names.add(fixture.fixtureName);
  }
  return { valid: issues.length === 0, issues };
}
