import {
  MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
  type ManualConfirmDryRunControlFixture,
  type ManualConfirmDryRunControlSafetyResult,
  type ManualConfirmDryRunControlValidationIssue,
  type ManualConfirmDryRunControlValidationResult,
} from './types.js';
import {
  isValidManualConfirmDryRunControlGeneratedAt,
  isValidManualConfirmDryRunControlKind,
  isValidManualConfirmDryRunControlName,
  isValidManualConfirmDryRunControlSchemaVersion,
  isValidManualConfirmDryRunControlSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|endpoint|providersdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:api[_-]?key|secret|token|provider[_-]?sdk)\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_ADVISORY_PATTERN = /\b(?:recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: ManualConfirmDryRunControlValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanText(value: string, field: string, issues: ManualConfirmDryRunControlValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secrets/API keys/provider SDK refs are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', field, 'Wallet/signing refs are forbidden.');
}

function scanRecursive(value: unknown, field: string, issues: ManualConfirmDryRunControlValidationIssue[], depth = 0): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    if (!field.endsWith('fixtureName') && !field.endsWith('fixtureId')) scanText(value, field, issues);
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
  fixture: ManualConfirmDryRunControlFixture,
  issues: ManualConfirmDryRunControlValidationIssue[],
): void {
  if (fixture.dryRunGate.unlockAuthority !== false) pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'dryRunGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.dryRunGate.liveExecutionAllowed !== false) pushIssue(issues, 'LIVE_EXECUTION_FORBIDDEN', 'dryRunGate.liveExecutionAllowed', 'liveExecutionAllowed must be false.');
  if (fixture.operatorIntent.orderCreationAllowed !== false) pushIssue(issues, 'ORDER_CREATION_FORBIDDEN', 'operatorIntent.orderCreationAllowed', 'orderCreationAllowed must be false.');
  if (fixture.operatorIntent.transactionConstructionAllowed !== false) pushIssue(issues, 'TX_CONSTRUCTION_FORBIDDEN', 'operatorIntent.transactionConstructionAllowed', 'transactionConstructionAllowed must be false.');
  if (fixture.operatorIntent.dispatchAllowed !== false) pushIssue(issues, 'DISPATCH_FORBIDDEN', 'operatorIntent.dispatchAllowed', 'dispatchAllowed must be false.');
  if (fixture.dryRunControl.liveNetworkAllowed !== false) pushIssue(issues, 'LIVE_NETWORK_FORBIDDEN', 'dryRunControl.liveNetworkAllowed', 'liveNetworkAllowed must be false.');
  if (fixture.dryRunControl.executionAllowed !== false) pushIssue(issues, 'CONTROL_EXECUTION_FORBIDDEN', 'dryRunControl.executionAllowed', 'executionAllowed must be false.');
  if (fixture.dryRunControl.dispatchAllowed !== false) pushIssue(issues, 'CONTROL_DISPATCH_FORBIDDEN', 'dryRunControl.dispatchAllowed', 'dispatchAllowed must be false.');
  if (!fixture.dispatchBlock.dispatchBlocked) pushIssue(issues, 'DISPATCH_BLOCK_REQUIRED', 'dispatchBlock.dispatchBlocked', 'dispatchBlocked must be true.');
  if (!fixture.dispatchBlock.transactionSendBlocked) pushIssue(issues, 'TX_SEND_BLOCK_REQUIRED', 'dispatchBlock.transactionSendBlocked', 'transactionSendBlocked must be true.');
  if (fixture.abortContract.automaticTransitionAllowed !== false) pushIssue(issues, 'ABORT_AUTO_TRANSITION_FORBIDDEN', 'abortContract.automaticTransitionAllowed', 'automaticTransitionAllowed must be false.');
  if (fixture.abortContract.usesRuntimeTimers !== false) pushIssue(issues, 'ABORT_TIMERS_FORBIDDEN', 'abortContract.usesRuntimeTimers', 'usesRuntimeTimers must be false.');
  if (fixture.cancellationContract.automaticTransitionAllowed !== false) pushIssue(issues, 'CANCEL_AUTO_TRANSITION_FORBIDDEN', 'cancellationContract.automaticTransitionAllowed', 'automaticTransitionAllowed must be false.');
  if (fixture.cancellationContract.usesRuntimeTimers !== false) pushIssue(issues, 'CANCEL_TIMERS_FORBIDDEN', 'cancellationContract.usesRuntimeTimers', 'usesRuntimeTimers must be false.');
  if (fixture.simulatedDecision.advisoryOutput !== false) pushIssue(issues, 'ADVISORY_FORBIDDEN', 'simulatedDecision.advisoryOutput', 'advisoryOutput must be false.');
  if (fixture.simulatedDecision.recommendationOutput !== false) pushIssue(issues, 'RECOMMENDATION_FORBIDDEN', 'simulatedDecision.recommendationOutput', 'recommendationOutput must be false.');
  if (fixture.simulatedDecision.signalOutput !== false) pushIssue(issues, 'SIGNAL_FORBIDDEN', 'simulatedDecision.signalOutput', 'signalOutput must be false.');
}

export function validateManualConfirmDryRunControlFixture(
  fixture: ManualConfirmDryRunControlFixture,
): ManualConfirmDryRunControlValidationResult {
  const issues: ManualConfirmDryRunControlValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidManualConfirmDryRunControlName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidManualConfirmDryRunControlKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE}.`);
  if (!isValidManualConfirmDryRunControlSchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidManualConfirmDryRunControlGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidManualConfirmDryRunControlSource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');

  if (!fixture.dryRunEvidence.validationCommandRefs.length)
    pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'dryRunEvidence.validationCommandRefs', 'validationCommandRefs is required.');
  if (!fixture.dryRunEvidence.docsRefs.length)
    pushIssue(issues, 'MISSING_DOC_REFS', 'dryRunEvidence.docsRefs', 'docsRefs is required.');
  if (!fixture.dryRunEvidence.safetyGrepRefs.length)
    pushIssue(issues, 'MISSING_SAFETY_GREP_REFS', 'dryRunEvidence.safetyGrepRefs', 'safetyGrepRefs is required.');
  if (!fixture.dryRunEvidence.sourcePhaseRefs.length)
    pushIssue(issues, 'MISSING_SOURCE_PHASE_REFS', 'dryRunEvidence.sourcePhaseRefs', 'sourcePhaseRefs is required.');

  const decisionText = `${fixture.dryRunReport.decisionSummary} ${fixture.dryRunReport.safetySummary}`;
  if (FORBIDDEN_ADVISORY_PATTERN.test(decisionText)) {
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'dryRunReport.decisionSummary', 'Advisory/profit language is forbidden.');
  }

  if (fixture.dryRunReport.safetySummary.toLowerCase().includes('authorize live trading')) {
    pushIssue(issues, 'LIVE_AUTHORIZATION_CLAIM_FORBIDDEN', 'dryRunReport.safetySummary', 'Dry-run cannot authorize live trading.');
  }

  if (!Object.isFrozen(fixture.sourcePhase76FixtureSnapshot)) {
    pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase76FixtureSnapshot', 'Source snapshots must be immutable.');
  }

  validateSafetyBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateManualConfirmDryRunControlSafety(
  fixture: ManualConfirmDryRunControlFixture,
): ManualConfirmDryRunControlSafetyResult {
  const violations: string[] = [];
  if (fixture.dryRunGate.unlockAuthority !== false) violations.push('dryRunGate.unlockAuthority must be false');
  if (fixture.dryRunGate.liveExecutionAllowed !== false) violations.push('dryRunGate.liveExecutionAllowed must be false');
  if (fixture.operatorIntent.orderCreationAllowed !== false) violations.push('operatorIntent.orderCreationAllowed must be false');
  if (fixture.operatorIntent.transactionConstructionAllowed !== false)
    violations.push('operatorIntent.transactionConstructionAllowed must be false');
  if (fixture.operatorIntent.dispatchAllowed !== false) violations.push('operatorIntent.dispatchAllowed must be false');
  if (!fixture.dispatchBlock.dispatchBlocked) violations.push('dispatchBlock.dispatchBlocked must be true');
  if (!fixture.dispatchBlock.transactionSendBlocked) violations.push('dispatchBlock.transactionSendBlocked must be true');
  if (fixture.simulatedDecision.advisoryOutput !== false) violations.push('simulatedDecision.advisoryOutput must be false');
  if (fixture.simulatedDecision.recommendationOutput !== false)
    violations.push('simulatedDecision.recommendationOutput must be false');
  if (fixture.simulatedDecision.signalOutput !== false) violations.push('simulatedDecision.signalOutput must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateManualConfirmDryRunControlFixtureTable(
  fixtures: readonly ManualConfirmDryRunControlFixture[],
): ManualConfirmDryRunControlValidationResult {
  const issues: ManualConfirmDryRunControlValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateManualConfirmDryRunControlFixture(fixture);
    issues.push(...result.issues);

    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);

    if (seenNames.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
