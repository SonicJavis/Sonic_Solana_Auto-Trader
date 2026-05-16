import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
  type OutcomeRiskFeedbackFixture,
  type OutcomeRiskFeedbackSafetyResult,
  type OutcomeRiskFeedbackValidationIssue,
  type OutcomeRiskFeedbackValidationResult,
} from './types.js';
import {
  isValidOutcomeRiskFeedbackContractKind,
  isValidOutcomeRiskFeedbackContractName,
  isValidOutcomeRiskFeedbackGeneratedAt,
  isValidOutcomeRiskFeedbackSchemaVersion,
  isValidOutcomeRiskFeedbackSource,
} from './normalization.js';

const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_URL_PROVIDER_PATTERN = /\b(?:https?:\/\/|providerSdk|unsafe-endpoint|drainer|api[_-]?key)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: OutcomeRiskFeedbackValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

export function validateOutcomeRiskFeedbackFixture(
  fixture: OutcomeRiskFeedbackFixture,
): OutcomeRiskFeedbackValidationResult {
  const issues: OutcomeRiskFeedbackValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidOutcomeRiskFeedbackContractName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidOutcomeRiskFeedbackContractKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase is invalid.');
  if (!isValidOutcomeRiskFeedbackSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (
    !isValidOutcomeRiskFeedbackGeneratedAt(fixture.meta.generatedAt) ||
    !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)
  )
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  if (!isValidOutcomeRiskFeedbackSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');

  if (fixture.feedbackLoopGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'feedbackLoopGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.feedbackLoopGate.liveRiskUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_UPDATE_FORBIDDEN', 'feedbackLoopGate.liveRiskUpdateAllowed', 'liveRiskUpdateAllowed must be false.');
  if (fixture.feedbackLoopGate.automaticRiskMutationAllowed !== false)
    pushIssue(issues, 'AUTO_RISK_MUTATION_FORBIDDEN', 'feedbackLoopGate.automaticRiskMutationAllowed', 'automaticRiskMutationAllowed must be false.');
  if (fixture.feedbackLoopGate.safetyGateMutationAllowed !== false)
    pushIssue(issues, 'SAFETY_GATE_MUTATION_FORBIDDEN', 'feedbackLoopGate.safetyGateMutationAllowed', 'safetyGateMutationAllowed must be false.');

  if (fixture.outcomeFeedbackEvent.liveOutcomeLookupAllowed !== false)
    pushIssue(issues, 'LIVE_OUTCOME_LOOKUP_FORBIDDEN', 'outcomeFeedbackEvent.liveOutcomeLookupAllowed', 'liveOutcomeLookupAllowed must be false.');
  if (fixture.outcomeFeedbackEvent.realOutcomeEventRequired !== false)
    pushIssue(issues, 'REAL_OUTCOME_EVENT_REQUIRED_FORBIDDEN', 'outcomeFeedbackEvent.realOutcomeEventRequired', 'realOutcomeEventRequired must be false.');

  if (fixture.riskFeedbackLink.liveRiskRefreshAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_REFRESH_FORBIDDEN', 'riskFeedbackLink.liveRiskRefreshAllowed', 'liveRiskRefreshAllowed must be false.');

  if (fixture.riskReassessmentPlaceholder.liveReassessmentAllowed !== false)
    pushIssue(issues, 'LIVE_REASSESSMENT_FORBIDDEN', 'riskReassessmentPlaceholder.liveReassessmentAllowed', 'liveReassessmentAllowed must be false.');
  if (fixture.riskReassessmentPlaceholder.reassessmentOutputProduced !== false)
    pushIssue(issues, 'REASSESSMENT_OUTPUT_FORBIDDEN', 'riskReassessmentPlaceholder.reassessmentOutputProduced', 'reassessmentOutputProduced must be false.');

  if (fixture.safetyGateFeedbackLink.automaticUnlockAllowed !== false)
    pushIssue(issues, 'AUTOMATIC_UNLOCK_FORBIDDEN', 'safetyGateFeedbackLink.automaticUnlockAllowed', 'automaticUnlockAllowed must be false.');

  if (fixture.riskDeltaPlaceholder.deltaComputedFromLiveData !== false)
    pushIssue(issues, 'RISK_DELTA_LIVE_DATA_FORBIDDEN', 'riskDeltaPlaceholder.deltaComputedFromLiveData', 'deltaComputedFromLiveData must be false.');
  if (fixture.riskDeltaPlaceholder.liveDeltaOutputProduced !== false)
    pushIssue(issues, 'RISK_DELTA_OUTPUT_FORBIDDEN', 'riskDeltaPlaceholder.liveDeltaOutputProduced', 'liveDeltaOutputProduced must be false.');
  if (fixture.confidenceDeltaPlaceholder.deltaComputedFromLiveData !== false)
    pushIssue(issues, 'CONFIDENCE_DELTA_LIVE_DATA_FORBIDDEN', 'confidenceDeltaPlaceholder.deltaComputedFromLiveData', 'deltaComputedFromLiveData must be false.');
  if (fixture.confidenceDeltaPlaceholder.liveDeltaOutputProduced !== false)
    pushIssue(issues, 'CONFIDENCE_DELTA_OUTPUT_FORBIDDEN', 'confidenceDeltaPlaceholder.liveDeltaOutputProduced', 'liveDeltaOutputProduced must be false.');

  if (
    fixture.abortContract.scheduledTimersAllowed !== false ||
    fixture.rollbackContract.scheduledTimersAllowed !== false
  ) {
    pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abort/rollback', 'scheduled timers must be false.');
  }

  const caps = fixture.capabilities;
  if (
    caps.feedbackRuntimeFeedback ||
    caps.feedbackLiveRiskUpdate ||
    caps.feedbackAutomaticRiskMutation ||
    caps.feedbackSafetyGateMutation ||
    caps.feedbackAutomaticUnlock
  )
    pushIssue(issues, 'LIVE_FEEDBACK_MUTATION_FORBIDDEN', 'capabilities', 'live feedback/mutation toggles must be false.');

  if (
    caps.feedbackLiveOutcomeLookup ||
    caps.feedbackLiveRiskRefresh ||
    caps.feedbackLiveDeltaComputation ||
    caps.feedbackNetworkRead
  )
    pushIssue(issues, 'LIVE_LOOKUP_REFRESH_NETWORK_FORBIDDEN', 'capabilities', 'live lookup/refresh/network toggles must be false.');

  if (caps.feedbackPollingRuntime || caps.feedbackSubscriptionRuntime || caps.feedbackRetryRuntime)
    pushIssue(issues, 'POLLING_SUBSCRIPTION_RETRY_FORBIDDEN', 'capabilities', 'polling/subscription/retry must be false.');

  if (caps.feedbackScheduledTimers)
    pushIssue(issues, 'SCHEDULED_TIMERS_FLAG_FORBIDDEN', 'capabilities.feedbackScheduledTimers', 'scheduled timers must be false.');

  if (caps.feedbackUnlockAuthority || caps.feedbackLimitedLiveUnlock || caps.feedbackFullAutoUnlock)
    pushIssue(issues, 'UNLOCK_FLAGS_FORBIDDEN', 'capabilities', 'unlock authority/LIMITED_LIVE/FULL_AUTO must be false.');

  if (caps.feedbackSending || caps.feedbackDispatch || caps.feedbackSigning || caps.feedbackWalletLogic)
    pushIssue(issues, 'SEND_DISPATCH_SIGN_WALLET_FORBIDDEN', 'capabilities', 'sending/dispatch/signing/wallet must be false.');

  if (
    caps.feedbackPrivateKeyHandling ||
    caps.feedbackKeypairHandling ||
    caps.feedbackSeedPhraseHandling ||
    caps.feedbackMnemonicHandling
  )
    pushIssue(issues, 'KEY_MATERIAL_FORBIDDEN', 'capabilities', 'private key/keypair/seed/mnemonic handling must be false.');

  if (caps.feedbackOrderCreation || caps.feedbackRuntimeExecution || caps.feedbackAutomaticPromotion)
    pushIssue(issues, 'ORDER_EXEC_PROMOTION_FORBIDDEN', 'capabilities', 'order creation/runtime execution/automatic promotion must be false.');

  if (caps.feedbackRecommendations || caps.feedbackTradingSignals || caps.feedbackInvestmentAdvice)
    pushIssue(issues, 'ADVISORY_CAPABILITIES_FORBIDDEN', 'capabilities', 'recommendations/signals/advice must be false.');

  if (caps.feedbackRealOrders || caps.feedbackRealFunds || caps.feedbackRealPnL)
    pushIssue(issues, 'REAL_FUNDS_PNL_FORBIDDEN', 'capabilities', 'real orders/funds/PnL must be false.');

  if (caps.feedbackLiveNetworkDefault || caps.feedbackRuntimeMonitoring || caps.feedbackRuntimeCollectors)
    pushIssue(issues, 'LIVE_NETWORK_MONITORING_FORBIDDEN', 'capabilities', 'live network default and runtime monitoring/collectors must be false.');

  if (caps.feedbackProviderExpansion || caps.feedbackSecretsRequired || caps.feedbackApiKeyRequired)
    pushIssue(issues, 'PROVIDER_SECRET_APIKEY_FORBIDDEN', 'capabilities', 'provider expansion/secrets/API key required must be false.');

  if (caps.feedbackFilesystemWrites || caps.feedbackPersistence)
    pushIssue(issues, 'FILESYSTEM_PERSISTENCE_FORBIDDEN', 'capabilities', 'filesystem writes/persistence must be false.');

  if (
    caps.feedbackRouteHandlers ||
    caps.feedbackRuntimeRequests ||
    caps.feedbackUiRendering ||
    caps.feedbackDomAccess ||
    caps.feedbackBackgroundJobs
  )
    pushIssue(issues, 'ROUTE_RUNTIME_UI_DOM_BACKGROUND_FORBIDDEN', 'capabilities', 'route/runtime/UI/DOM/background jobs must be false.');

  if (Object.values(fixture.report).some(value => FORBIDDEN_ADVISORY_PATTERN.test(value)))
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory text is forbidden.');

  const runtimeSurface = [
    fixture.report.gateSummary,
    fixture.report.outcomeFeedbackSummary,
    fixture.report.riskLinkSummary,
    fixture.report.reassessmentSummary,
    fixture.report.safetyGateFeedbackSummary,
    fixture.report.deltaSummary,
    fixture.report.evidenceSummary,
    fixture.report.safetySummary,
    fixture.feedbackLoopGate.feedbackLoopGateName,
    fixture.feedbackLoopGate.blockingReasonCodes.join('|'),
    fixture.outcomeFeedbackEvent.sourceOutcomeAuditRef,
    fixture.outcomeFeedbackEvent.reasonCodes.join('|'),
  ].join('::');
  if (FORBIDDEN_URL_PROVIDER_PATTERN.test(runtimeSurface))
    pushIssue(issues, 'UNSAFE_URL_PROVIDER_REF', 'fixture', 'unsafe URL/provider/API key refs are forbidden.');

  if (
    !fixture.evidenceBundle.docsRefs.length ||
    !fixture.evidenceBundle.validationCommandRefs.length ||
    !fixture.evidenceBundle.outcomeAuditRefs.length ||
    !fixture.evidenceBundle.riskEvidenceRefs.length
  )
    pushIssue(issues, 'MISSING_EVIDENCE_REFS', 'evidenceBundle', 'docs/validation/outcome/risk evidence refs are required.');

  if (!Object.isFrozen(fixture.sourcePhase86FixtureSnapshot) || !Object.isFrozen(fixture.sourcePhase59FixtureSnapshot))
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourceSnapshots', 'source snapshots must be immutable.');

  return { valid: issues.length === 0, issues };
}

export function validateOutcomeRiskFeedbackSafety(
  fixture: OutcomeRiskFeedbackFixture,
): OutcomeRiskFeedbackSafetyResult {
  const violations: string[] = [];
  if (fixture.feedbackLoopGate.liveRiskUpdateAllowed !== false)
    violations.push('feedbackLoopGate.liveRiskUpdateAllowed must be false');
  if (fixture.feedbackLoopGate.automaticRiskMutationAllowed !== false)
    violations.push('feedbackLoopGate.automaticRiskMutationAllowed must be false');
  if (fixture.feedbackLoopGate.safetyGateMutationAllowed !== false)
    violations.push('feedbackLoopGate.safetyGateMutationAllowed must be false');
  if (fixture.outcomeFeedbackEvent.liveOutcomeLookupAllowed !== false)
    violations.push('outcomeFeedbackEvent.liveOutcomeLookupAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateOutcomeRiskFeedbackFixtureTable(
  fixtures: readonly OutcomeRiskFeedbackFixture[],
): OutcomeRiskFeedbackValidationResult {
  const issues: OutcomeRiskFeedbackValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const fixture of fixtures) {
    const result = validateOutcomeRiskFeedbackFixture(fixture);
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
