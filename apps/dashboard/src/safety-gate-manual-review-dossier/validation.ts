import { EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES } from '../execution-outcome-audit-contracts/index.js';
import { OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES } from '../outcome-risk-feedback-contracts/index.js';
import { RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES } from '../risk-feedback-safety-gate-reevaluation/index.js';
import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type SafetyGateManualReviewDossierFixture,
  type SafetyGateManualReviewDossierSafetyResult,
  type SafetyGateManualReviewDossierValidationIssue,
  type SafetyGateManualReviewDossierValidationResult,
} from './types.js';
import {
  isValidSafetyGateManualReviewDossierGeneratedAt,
  isValidSafetyGateManualReviewDossierKind,
  isValidSafetyGateManualReviewDossierName,
  isValidSafetyGateManualReviewDossierSchemaVersion,
  isValidSafetyGateManualReviewDossierSource,
} from './normalization.js';

const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_URL_PROVIDER_PATTERN = /\b(?:https?:\/\/|providerSdk|unsafe-endpoint|drainer|api[_-]?key|endpoint)\b/i;

function pushIssue(
  issues: SafetyGateManualReviewDossierValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function validateSafetyGateManualReviewDossierFixture(
  fixture: SafetyGateManualReviewDossierFixture,
): SafetyGateManualReviewDossierValidationResult {
  const issues: SafetyGateManualReviewDossierValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidSafetyGateManualReviewDossierName(fixture.fixtureName))
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidSafetyGateManualReviewDossierKind(fixture.fixtureKind))
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE)
    pushIssue(issues, 'WRONG_PHASE', 'phase', 'phase must be 89.');
  if (!isValidSafetyGateManualReviewDossierSchemaVersion(fixture.schemaVersion))
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (
    !isValidSafetyGateManualReviewDossierGeneratedAt(fixture.meta.generatedAt) ||
    !TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)
  ) {
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic.');
  }
  if (!isValidSafetyGateManualReviewDossierSource(fixture.meta.source))
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');

  if (fixture.dossierGate.approvalAuthority !== false)
    pushIssue(issues, 'APPROVAL_AUTHORITY_FORBIDDEN', 'dossierGate.approvalAuthority', 'approvalAuthority must be false.');
  if (fixture.dossierGate.unlockAuthority !== false)
    pushIssue(issues, 'UNLOCK_AUTHORITY_FORBIDDEN', 'dossierGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.dossierGate.automaticApprovalAllowed !== false)
    pushIssue(issues, 'AUTOMATIC_APPROVAL_FORBIDDEN', 'dossierGate.automaticApprovalAllowed', 'automaticApprovalAllowed must be false.');
  if (fixture.dossierGate.automaticUnlockAllowed !== false)
    pushIssue(issues, 'AUTOMATIC_UNLOCK_FORBIDDEN', 'dossierGate.automaticUnlockAllowed', 'automaticUnlockAllowed must be false.');
  if (fixture.reviewDossierHeader.approvalAuthorizesUnlock !== false)
    pushIssue(issues, 'APPROVAL_UNLOCK_FORBIDDEN', 'reviewDossierHeader.approvalAuthorizesUnlock', 'approvalAuthorizesUnlock must be false.');
  if (fixture.reviewerChecklist.liveReviewerLookupAllowed !== false)
    pushIssue(issues, 'LIVE_REVIEWER_LOOKUP_FORBIDDEN', 'reviewerChecklist.liveReviewerLookupAllowed', 'liveReviewerLookupAllowed must be false.');
  if (fixture.signoffPlaceholder.realSignoffCaptured !== false)
    pushIssue(issues, 'REAL_SIGNOFF_FORBIDDEN', 'signoffPlaceholder.realSignoffCaptured', 'realSignoffCaptured must be false.');
  if (fixture.signoffPlaceholder.signoffAuthorizesUnlock !== false)
    pushIssue(issues, 'SIGNOFF_UNLOCK_FORBIDDEN', 'signoffPlaceholder.signoffAuthorizesUnlock', 'signoffAuthorizesUnlock must be false.');
  if (fixture.signoffPlaceholder.separateFuturePhaseRequired !== true)
    pushIssue(issues, 'SEPARATE_PHASE_REQUIRED', 'signoffPlaceholder.separateFuturePhaseRequired', 'separateFuturePhaseRequired must be true.');
  if (fixture.unresolvedBlockerSummary.blockersPreserved !== true)
    pushIssue(issues, 'BLOCKERS_PRESERVED_REQUIRED', 'unresolvedBlockerSummary.blockersPreserved', 'blockersPreserved must be true.');
  if (fixture.unresolvedBlockerSummary.blockerResolutionAllowed !== false)
    pushIssue(issues, 'BLOCKER_RESOLUTION_FORBIDDEN', 'unresolvedBlockerSummary.blockerResolutionAllowed', 'blockerResolutionAllowed must be false.');
  if (fixture.unresolvedBlockerSummary.automaticBlockerClearAllowed !== false)
    pushIssue(issues, 'AUTO_BLOCKER_CLEAR_FORBIDDEN', 'unresolvedBlockerSummary.automaticBlockerClearAllowed', 'automaticBlockerClearAllowed must be false.');
  if (fixture.approvalDenialContract.approvalDeniedByDefault !== true)
    pushIssue(issues, 'APPROVAL_DENIAL_REQUIRED', 'approvalDenialContract.approvalDeniedByDefault', 'approvalDeniedByDefault must be true.');
  if (fixture.approvalDenialContract.automaticApprovalBlocked !== true)
    pushIssue(issues, 'AUTOMATIC_APPROVAL_BLOCK_REQUIRED', 'approvalDenialContract.automaticApprovalBlocked', 'automaticApprovalBlocked must be true.');
  if (fixture.approvalDenialContract.unlockBlocked !== true)
    pushIssue(issues, 'UNLOCK_BLOCK_REQUIRED', 'approvalDenialContract.unlockBlocked', 'unlockBlocked must be true.');

  if (fixture.reevaluationLinkage.liveGateStatusFetchAllowed !== false)
    pushIssue(issues, 'LIVE_GATE_STATUS_FORBIDDEN', 'reevaluationLinkage.liveGateStatusFetchAllowed', 'liveGateStatusFetchAllowed must be false.');
  if (fixture.feedbackLinkage.liveFeedbackLookupAllowed !== false)
    pushIssue(issues, 'LIVE_FEEDBACK_LOOKUP_FORBIDDEN', 'feedbackLinkage.liveFeedbackLookupAllowed', 'liveFeedbackLookupAllowed must be false.');
  if (fixture.riskLinkage.liveRiskUpdateAllowed !== false)
    pushIssue(issues, 'LIVE_RISK_FORBIDDEN', 'riskLinkage.liveRiskUpdateAllowed', 'liveRiskUpdateAllowed must be false.');
  if (fixture.outcomeLinkage.liveOutcomeLookupAllowed !== false)
    pushIssue(issues, 'LIVE_OUTCOME_FORBIDDEN', 'outcomeLinkage.liveOutcomeLookupAllowed', 'liveOutcomeLookupAllowed must be false.');

  if (fixture.evidencePacket.validationCommandRefs.length === 0)
    pushIssue(issues, 'MISSING_VALIDATION_REFS', 'evidencePacket.validationCommandRefs', 'validationCommandRefs is required.');
  if (fixture.evidencePacket.docsRefs.length === 0)
    pushIssue(issues, 'MISSING_DOCS_REFS', 'evidencePacket.docsRefs', 'docsRefs is required.');

  if (!arraysEqual(fixture.sourcePhase88FixtureSnapshot, [...RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES]))
    pushIssue(issues, 'MUTATED_SOURCE_SNAPSHOT', 'sourcePhase88FixtureSnapshot', 'source snapshots must remain immutable.');
  if (!arraysEqual(fixture.sourcePhase87FixtureSnapshot, [...OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES]))
    pushIssue(issues, 'MUTATED_SOURCE_SNAPSHOT', 'sourcePhase87FixtureSnapshot', 'source snapshots must remain immutable.');
  if (!arraysEqual(fixture.sourcePhase86FixtureSnapshot, [...EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES]))
    pushIssue(issues, 'MUTATED_SOURCE_SNAPSHOT', 'sourcePhase86FixtureSnapshot', 'source snapshots must remain immutable.');

  const caps = fixture.capabilities;
  if (
    caps.dossierApprovalAuthority ||
    caps.dossierUnlockAuthority ||
    caps.dossierAutomaticApproval ||
    caps.dossierAutomaticUnlock ||
    caps.dossierAutomaticGateMutation ||
    caps.dossierAutomaticBlockerClear ||
    caps.dossierLiveReviewerLookup ||
    caps.dossierLiveRiskUpdate ||
    caps.dossierLiveFeedbackLookup ||
    caps.dossierLiveGateStatusFetch ||
    caps.dossierNetworkRead ||
    caps.dossierPollingRuntime ||
    caps.dossierSubscriptionRuntime ||
    caps.dossierRetryRuntime ||
    caps.dossierScheduledTimers ||
    caps.dossierSending ||
    caps.dossierDispatch ||
    caps.dossierSigning ||
    caps.dossierWalletLogic ||
    caps.dossierRuntimeExecution ||
    caps.dossierProviderExpansion ||
    caps.dossierFilesystemWrites ||
    caps.dossierPersistence ||
    caps.dossierRuntimeMonitoring ||
    caps.dossierRuntimeCollectors ||
    caps.dossierLiveTrading ||
    caps.dossierLimitedLiveUnlock ||
    caps.dossierFullAutoUnlock ||
    caps.dossierRecommendations ||
    caps.dossierTradingSignals ||
    caps.dossierInvestmentAdvice ||
    caps.dossierRealOrders ||
    caps.dossierRealFunds ||
    caps.dossierRealPnL ||
    caps.dossierRouteHandlers ||
    caps.dossierRuntimeRequests ||
    caps.dossierUiRendering ||
    caps.dossierDomAccess ||
    caps.dossierLiveNetworkDefault ||
    caps.dossierAutomaticPromotion ||
    caps.dossierSecretsRequired ||
    caps.dossierApiKeyRequired
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAGS', 'capabilities', 'Unsafe capability flag must remain false.');
  }

  const textToInspect = [
    fixture.report.gateSummary,
    fixture.report.headerSummary,
    fixture.report.checklistSummary,
    fixture.report.safetySummary,
    fixture.reviewDossierHeader.dossierName,
  ].join(' ');

  if (FORBIDDEN_ADVISORY_PATTERN.test(textToInspect)) {
    pushIssue(issues, 'FORBIDDEN_ADVISORY_TEXT', 'report', 'Unsafe advisory/profit text is forbidden.');
  }

  const urlRiskText = JSON.stringify({
    docsRefs: fixture.evidencePacket.docsRefs,
    validationCommandRefs: fixture.evidencePacket.validationCommandRefs,
    sourceFixtureRefs: fixture.evidencePacket.sourceFixtureRefs,
  });
  if (FORBIDDEN_URL_PROVIDER_PATTERN.test(urlRiskText)) {
    pushIssue(issues, 'FORBIDDEN_URL_PROVIDER_REF', 'evidencePacket', 'Unsafe URL/provider/API key refs are forbidden.');
  }

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}

export function validateSafetyGateManualReviewDossierSafety(
  fixture: SafetyGateManualReviewDossierFixture,
): SafetyGateManualReviewDossierSafetyResult {
  const issues: SafetyGateManualReviewDossierValidationIssue[] = [];

  if (fixture.dossierGate.approvalAuthority !== false)
    pushIssue(issues, 'APPROVAL_AUTHORITY_FORBIDDEN', 'dossierGate.approvalAuthority', 'approvalAuthority must be false.');
  if (fixture.dossierGate.unlockAuthority !== false)
    pushIssue(issues, 'UNLOCK_AUTHORITY_FORBIDDEN', 'dossierGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.dossierGate.automaticApprovalAllowed !== false)
    pushIssue(issues, 'AUTOMATIC_APPROVAL_FORBIDDEN', 'dossierGate.automaticApprovalAllowed', 'automaticApprovalAllowed must be false.');
  if (fixture.dossierGate.automaticUnlockAllowed !== false)
    pushIssue(issues, 'AUTOMATIC_UNLOCK_FORBIDDEN', 'dossierGate.automaticUnlockAllowed', 'automaticUnlockAllowed must be false.');
  if (fixture.approvalDenialContract.approvalDeniedByDefault !== true)
    pushIssue(issues, 'APPROVAL_DENIAL_REQUIRED', 'approvalDenialContract.approvalDeniedByDefault', 'approvalDeniedByDefault must be true.');
  if (fixture.unresolvedBlockerSummary.automaticBlockerClearAllowed !== false)
    pushIssue(issues, 'AUTO_BLOCKER_CLEAR_FORBIDDEN', 'unresolvedBlockerSummary.automaticBlockerClearAllowed', 'automaticBlockerClearAllowed must be false.');
  if (fixture.safetyInvariants.networkReadAllowed !== false)
    pushIssue(issues, 'NETWORK_READ_FORBIDDEN', 'safetyInvariants.networkReadAllowed', 'networkReadAllowed must be false.');
  if (fixture.safetyInvariants.signingAllowed !== false)
    pushIssue(issues, 'SIGNING_FORBIDDEN', 'safetyInvariants.signingAllowed', 'signingAllowed must be false.');
  if (fixture.safetyInvariants.sendingAllowed !== false)
    pushIssue(issues, 'SENDING_FORBIDDEN', 'safetyInvariants.sendingAllowed', 'sendingAllowed must be false.');

  return { safe: issues.length === 0, issues };
}

export function validateSafetyGateManualReviewDossierFixtureTable(
  fixtures: readonly SafetyGateManualReviewDossierFixture[],
): SafetyGateManualReviewDossierValidationResult {
  const issues: SafetyGateManualReviewDossierValidationIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  for (const fixture of fixtures) {
    if (ids.has(fixture.fixtureId))
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    ids.add(fixture.fixtureId);

    if (names.has(fixture.fixtureName))
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    names.add(fixture.fixtureName);

    const result = validateSafetyGateManualReviewDossierFixture(fixture);
    issues.push(...result.issues);
  }

  return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}
