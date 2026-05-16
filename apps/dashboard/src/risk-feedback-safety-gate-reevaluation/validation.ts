import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type RiskFeedbackSafetyGateReevaluationFixture,
  type RiskFeedbackSafetyGateReevaluationSafetyResult,
  type RiskFeedbackSafetyGateReevaluationValidationIssue,
  type RiskFeedbackSafetyGateReevaluationValidationResult,
} from './types.js';
import {
  isValidRiskFeedbackSafetyGateReevaluationContractKind,
  isValidRiskFeedbackSafetyGateReevaluationContractName,
  isValidRiskFeedbackSafetyGateReevaluationGeneratedAt,
  isValidRiskFeedbackSafetyGateReevaluationSchemaVersion,
  isValidRiskFeedbackSafetyGateReevaluationSource,
} from './normalization.js';

const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_URL_PROVIDER_PATTERN = /\b(?:https?:\/\/|providerSdk|unsafe-endpoint|drainer|api[_-]?key)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: RiskFeedbackSafetyGateReevaluationValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

export function validateRiskFeedbackSafetyGateReevaluationFixture(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): RiskFeedbackSafetyGateReevaluationValidationResult {
  const issues: RiskFeedbackSafetyGateReevaluationValidationIssue[] = [];

  if (!fixture.fixtureId)
    pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidRiskFeedbackSafetyGateReevaluationContractName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidRiskFeedbackSafetyGateReevaluationContractKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase must be 88.');
  if (!isValidRiskFeedbackSafetyGateReevaluationSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (
    !isValidRiskFeedbackSafetyGateReevaluationGeneratedAt(fixture.meta.generatedAt) ||
    !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)
  )
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  if (!isValidRiskFeedbackSafetyGateReevaluationSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');

  // Reevaluation gate checks
  if (fixture.reevaluationGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'reevaluationGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.reevaluationGate.automaticGateMutationAllowed !== false)
    pushIssue(issues, 'AUTO_GATE_MUTATION_FORBIDDEN', 'reevaluationGate.automaticGateMutationAllowed', 'automaticGateMutationAllowed must be false.');
  if (fixture.reevaluationGate.automaticUnlockAllowed !== false)
    pushIssue(issues, 'AUTO_UNLOCK_FORBIDDEN', 'reevaluationGate.automaticUnlockAllowed', 'automaticUnlockAllowed must be false.');
  if (fixture.reevaluationGate.liveRiskUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_UPDATE_FORBIDDEN', 'reevaluationGate.liveRiskUpdateAllowed', 'liveRiskUpdateAllowed must be false.');

  // Feedback review event checks
  if (fixture.feedbackReviewEvent.liveFeedbackLookupAllowed !== false)
    pushIssue(issues, 'LIVE_FEEDBACK_LOOKUP_FORBIDDEN', 'feedbackReviewEvent.liveFeedbackLookupAllowed', 'liveFeedbackLookupAllowed must be false.');
  if (fixture.feedbackReviewEvent.manualReviewRequired !== true)
    pushIssue(issues, 'MANUAL_REVIEW_REQUIRED', 'feedbackReviewEvent.manualReviewRequired', 'manualReviewRequired must be true.');

  // Safety gate reevaluation link checks
  if (fixture.safetyGateReevaluationLink.gateMutationAllowed !== false)
    pushIssue(issues, 'GATE_MUTATION_FORBIDDEN', 'safetyGateReevaluationLink.gateMutationAllowed', 'gateMutationAllowed must be false.');
  if (fixture.safetyGateReevaluationLink.automaticStatusChangeAllowed !== false)
    pushIssue(issues, 'AUTO_STATUS_CHANGE_FORBIDDEN', 'safetyGateReevaluationLink.automaticStatusChangeAllowed', 'automaticStatusChangeAllowed must be false.');

  // Manual review placeholder checks
  if (fixture.manualReviewPlaceholder.reviewAuthorizesUnlock !== false)
    pushIssue(issues, 'REVIEW_AUTHORIZES_UNLOCK_FORBIDDEN', 'manualReviewPlaceholder.reviewAuthorizesUnlock', 'reviewAuthorizesUnlock must be false.');
  if (fixture.manualReviewPlaceholder.separateFuturePhaseRequired !== true)
    pushIssue(issues, 'SEPARATE_PHASE_REQUIRED', 'manualReviewPlaceholder.separateFuturePhaseRequired', 'separateFuturePhaseRequired must be true.');

  // Gate status placeholder checks
  if (fixture.gateStatusPlaceholder.liveGateStatusFetched !== false)
    pushIssue(issues, 'LIVE_GATE_STATUS_FETCH_FORBIDDEN', 'gateStatusPlaceholder.liveGateStatusFetched', 'liveGateStatusFetched must be false.');
  if (fixture.gateStatusPlaceholder.gateStatusMutationProduced !== false)
    pushIssue(issues, 'GATE_STATUS_MUTATION_FORBIDDEN', 'gateStatusPlaceholder.gateStatusMutationProduced', 'gateStatusMutationProduced must be false.');

  // Blocker/escalation checks
  if (fixture.blockerReviewContract.automaticEscalationAllowed !== false)
    pushIssue(issues, 'AUTO_ESCALATION_FORBIDDEN', 'blockerReviewContract.automaticEscalationAllowed', 'automaticEscalationAllowed must be false.');
  if (fixture.escalationContract.automaticEscalationAllowed !== false)
    pushIssue(issues, 'AUTO_ESCALATION_FORBIDDEN', 'escalationContract.automaticEscalationAllowed', 'automaticEscalationAllowed must be false.');

  // Abort/rollback checks
  if (fixture.abortContract.scheduledTimersAllowed !== false)
    pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abortContract.scheduledTimersAllowed', 'scheduledTimersAllowed must be false.');
  if (fixture.rollbackContract.scheduledTimersAllowed !== false)
    pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'rollbackContract.scheduledTimersAllowed', 'scheduledTimersAllowed must be false.');

  // Safety invariant checks
  if (fixture.safetyInvariants.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'safetyInvariants.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.safetyInvariants.networkReadAllowed !== false)
    pushIssue(issues, 'NETWORK_READ_FORBIDDEN', 'safetyInvariants.networkReadAllowed', 'networkReadAllowed must be false.');
  if (fixture.safetyInvariants.sendingAllowed !== false)
    pushIssue(issues, 'SENDING_FORBIDDEN', 'safetyInvariants.sendingAllowed', 'sendingAllowed must be false.');
  if (fixture.safetyInvariants.signingAllowed !== false)
    pushIssue(issues, 'SIGNING_FORBIDDEN', 'safetyInvariants.signingAllowed', 'signingAllowed must be false.');
  if (fixture.safetyInvariants.persistenceAllowed !== false)
    pushIssue(issues, 'PERSISTENCE_FORBIDDEN', 'safetyInvariants.persistenceAllowed', 'persistenceAllowed must be false.');

  // Linkage checks
  if (fixture.feedbackLinkage.liveFeedbackUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_FEEDBACK_UPDATE_FORBIDDEN', 'feedbackLinkage.liveFeedbackUpdateAllowed', 'liveFeedbackUpdateAllowed must be false.');
  if (fixture.riskLinkage.liveRiskUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_UPDATE_FORBIDDEN', 'riskLinkage.liveRiskUpdateAllowed', 'liveRiskUpdateAllowed must be false.');
  if (fixture.outcomeLinkage.liveOutcomeLookupAllowed !== false)
    pushIssue(issues, 'LIVE_OUTCOME_LOOKUP_FORBIDDEN', 'outcomeLinkage.liveOutcomeLookupAllowed', 'liveOutcomeLookupAllowed must be false.');
  if (fixture.certificationLinkage.liveCertFetchAllowed !== false)
    pushIssue(issues, 'LIVE_CERT_FETCH_FORBIDDEN', 'certificationLinkage.liveCertFetchAllowed', 'liveCertFetchAllowed must be false.');

  // Capability checks
  const caps = fixture.capabilities;
  if (
    caps.reevaluationRuntimeReevaluation ||
    caps.reevaluationLiveGateMutation ||
    caps.reevaluationAutomaticGateMutation ||
    caps.reevaluationAutomaticUnlock ||
    caps.reevaluationLiveRiskUpdate ||
    caps.reevaluationLiveFeedbackLookup ||
    caps.reevaluationLiveGateStatusFetch
  )
    pushIssue(issues, 'UNSAFE_LIVE_CAP', 'capabilities', 'Live reevaluation capability flags must be false.');
  if (
    caps.reevaluationSending ||
    caps.reevaluationDispatch ||
    caps.reevaluationSigning ||
    caps.reevaluationWalletLogic ||
    caps.reevaluationPrivateKeyHandling ||
    caps.reevaluationKeypairHandling ||
    caps.reevaluationSeedPhraseHandling ||
    caps.reevaluationMnemonicHandling
  )
    pushIssue(issues, 'UNSAFE_SIGNING_CAP', 'capabilities', 'Signing/wallet capability flags must be false.');
  if (
    caps.reevaluationOrderCreation ||
    caps.reevaluationRuntimeExecution ||
    caps.reevaluationTradingSignals ||
    caps.reevaluationRecommendations ||
    caps.reevaluationInvestmentAdvice ||
    caps.reevaluationRealOrders ||
    caps.reevaluationRealFunds ||
    caps.reevaluationRealPnL
  )
    pushIssue(issues, 'UNSAFE_TRADING_CAP', 'capabilities', 'Trading/advisory capability flags must be false.');
  if (
    caps.reevaluationLiveTrading ||
    caps.reevaluationLimitedLiveUnlock ||
    caps.reevaluationFullAutoUnlock ||
    caps.reevaluationUnlockAuthority
  )
    pushIssue(issues, 'UNSAFE_UNLOCK_CAP', 'capabilities', 'Live unlock capability flags must be false.');
  if (
    caps.reevaluationNetworkRead ||
    caps.reevaluationPollingRuntime ||
    caps.reevaluationSubscriptionRuntime ||
    caps.reevaluationRetryRuntime ||
    caps.reevaluationScheduledTimers
  )
    pushIssue(issues, 'UNSAFE_NETWORK_CAP', 'capabilities', 'Network/polling capability flags must be false.');
  if (
    caps.reevaluationFilesystemWrites ||
    caps.reevaluationPersistence ||
    caps.reevaluationRouteHandlers ||
    caps.reevaluationRuntimeRequests ||
    caps.reevaluationUiRendering ||
    caps.reevaluationDomAccess ||
    caps.reevaluationBackgroundJobs ||
    caps.reevaluationAutomaticPromotion
  )
    pushIssue(issues, 'UNSAFE_RUNTIME_CAP', 'capabilities', 'Runtime/UI capability flags must be false.');
  if (caps.reevaluationSecretsRequired || caps.reevaluationProviderExpansion || caps.reevaluationLiveNetworkDefault)
    pushIssue(issues, 'UNSAFE_PROVIDER_CAP', 'capabilities', 'Provider/secrets capability flags must be false.');

  // Text safety checks
  const fixtureText = JSON.stringify(fixture);
  if (FORBIDDEN_ADVISORY_PATTERN.test(fixtureText)) {
    pushIssue(issues, 'FORBIDDEN_ADVISORY_TEXT', 'fixture', 'Fixture contains forbidden advisory text.', 'warning');
  }
  if (FORBIDDEN_URL_PROVIDER_PATTERN.test(fixtureText)) {
    pushIssue(issues, 'FORBIDDEN_URL_OR_PROVIDER', 'fixture', 'Fixture contains forbidden URL or provider SDK reference.', 'warning');
  }

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}

export function validateRiskFeedbackSafetyGateReevaluationSafety(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): RiskFeedbackSafetyGateReevaluationSafetyResult {
  const issues: RiskFeedbackSafetyGateReevaluationValidationIssue[] = [];

  if (fixture.reevaluationGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'reevaluationGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.reevaluationGate.automaticGateMutationAllowed !== false)
    pushIssue(issues, 'AUTO_GATE_MUTATION_FORBIDDEN', 'reevaluationGate.automaticGateMutationAllowed', 'Automatic gate mutation is forbidden.');
  if (fixture.reevaluationGate.automaticUnlockAllowed !== false)
    pushIssue(issues, 'AUTO_UNLOCK_FORBIDDEN', 'reevaluationGate.automaticUnlockAllowed', 'Automatic unlock is forbidden.');
  if (fixture.reevaluationGate.liveRiskUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_UPDATE_FORBIDDEN', 'reevaluationGate.liveRiskUpdateAllowed', 'Live risk updates are forbidden.');
  if (fixture.safetyGateReevaluationLink.gateMutationAllowed !== false)
    pushIssue(issues, 'GATE_MUTATION_FORBIDDEN', 'safetyGateReevaluationLink.gateMutationAllowed', 'Gate mutation is forbidden.');
  if (fixture.manualReviewPlaceholder.reviewAuthorizesUnlock !== false)
    pushIssue(issues, 'REVIEW_AUTHORIZES_UNLOCK_FORBIDDEN', 'manualReviewPlaceholder.reviewAuthorizesUnlock', 'reviewAuthorizesUnlock must be false.');
  if (fixture.safetyInvariants.sendingAllowed !== false)
    pushIssue(issues, 'SENDING_FORBIDDEN', 'safetyInvariants.sendingAllowed', 'Sending is forbidden.');
  if (fixture.safetyInvariants.signingAllowed !== false)
    pushIssue(issues, 'SIGNING_FORBIDDEN', 'safetyInvariants.signingAllowed', 'Signing is forbidden.');

  return { safe: issues.length === 0, issues };
}

export function validateRiskFeedbackSafetyGateReevaluationFixtureTable(
  fixtures: readonly RiskFeedbackSafetyGateReevaluationFixture[],
): RiskFeedbackSafetyGateReevaluationValidationResult {
  const issues: RiskFeedbackSafetyGateReevaluationValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  for (const fixture of fixtures) {
    if (ids.has(fixture.fixtureId)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    }
    ids.add(fixture.fixtureId);
    if (names.has(fixture.fixtureName)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    }
    names.add(fixture.fixtureName);
    const result = validateRiskFeedbackSafetyGateReevaluationFixture(fixture);
    issues.push(...result.issues);
  }

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}
