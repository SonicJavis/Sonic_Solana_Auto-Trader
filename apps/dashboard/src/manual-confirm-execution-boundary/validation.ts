import {
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE,
  type ManualConfirmExecutionBoundaryFixture,
  type ManualConfirmExecutionBoundarySafetyResult,
  type ManualConfirmExecutionBoundaryValidationIssue,
  type ManualConfirmExecutionBoundaryValidationResult,
} from './types.js';
import {
  isValidManualConfirmExecutionBoundaryGeneratedAt,
  isValidManualConfirmExecutionBoundaryKind,
  isValidManualConfirmExecutionBoundaryName,
  isValidManualConfirmExecutionBoundarySchemaVersion,
  isValidManualConfirmExecutionBoundarySource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /https?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /(?:fetch\(|axios|request\(|endpoint|rpc|network|websocket)/i;
const FORBIDDEN_SECRET_PATTERN = /(?:api[_-]?key|secret|token|credential|providerSdk)/i;
const FORBIDDEN_WALLET_PATTERN =
  /(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)/i;
const FORBIDDEN_ADVISORY_PATTERN = /(?:recommendation|signal|investment\s+advice|profit|pnl)/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: ManualConfirmExecutionBoundaryValidationIssue[],
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): void {
  issues.push({ code, field, message, severity });
}

function scanText(value: string, field: string, issues: ManualConfirmExecutionBoundaryValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(value)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', field, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', field, 'Network references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_SECRET_REFERENCE', field, 'Secrets/provider SDK refs are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(value))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', field, 'Wallet/signing refs are forbidden.');
}

function scanRecursive(
  value: unknown,
  field: string,
  issues: ManualConfirmExecutionBoundaryValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const isAllowedRef =
      field.includes('.validationCommandRefs[') ||
      field.includes('.docsRefs[') ||
      field.includes('.safetyGrepRefs[') ||
      field.includes('.sourcePhase') ||
      field.includes('.sourceFixture') ||
      field.includes('.sourceRefs.') ||
      field.includes('.operatorIntentLinkage.') ||
      field.includes('.dryRunLinkage.') ||
      field.includes('.readinessLinkage.') ||
      field.includes('.promotionReviewLinkage.') ||
      field.includes('.riskAcknowledgementLinkage.') ||
      field.includes('.report.') ||
      field.includes('.summary');
    if (!isAllowedRef && !field.endsWith('fixtureName') && !field.endsWith('fixtureId')) scanText(value, field, issues);
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
  fixture: ManualConfirmExecutionBoundaryFixture,
  issues: ManualConfirmExecutionBoundaryValidationIssue[],
): void {
  if (fixture.boundaryGate.unlockAuthority !== false)
    pushIssue(issues, 'UNSAFE_UNLOCK_AUTHORITY', 'boundaryGate.unlockAuthority', 'unlockAuthority must be false.');
  if (fixture.boundaryGate.executionAllowed !== false)
    pushIssue(issues, 'EXECUTION_FORBIDDEN', 'boundaryGate.executionAllowed', 'executionAllowed must be false.');
  if (fixture.boundaryGate.transactionConstructionAllowed !== false)
    pushIssue(issues, 'TRANSACTION_CONSTRUCTION_FORBIDDEN', 'boundaryGate.transactionConstructionAllowed', 'transactionConstructionAllowed must be false.');
  if (fixture.boundaryGate.transactionSerializationAllowed !== false)
    pushIssue(issues, 'TRANSACTION_SERIALIZATION_FORBIDDEN', 'boundaryGate.transactionSerializationAllowed', 'transactionSerializationAllowed must be false.');
  if (fixture.boundaryGate.transactionSimulationAllowed !== false)
    pushIssue(issues, 'TRANSACTION_SIMULATION_FORBIDDEN', 'boundaryGate.transactionSimulationAllowed', 'transactionSimulationAllowed must be false.');
  if (fixture.boundaryGate.signingAllowed !== false)
    pushIssue(issues, 'SIGNING_ALLOWED_FORBIDDEN', 'boundaryGate.signingAllowed', 'signingAllowed must be false.');
  if (fixture.boundaryGate.dispatchAllowed !== false)
    pushIssue(issues, 'DISPATCH_ALLOWED_FORBIDDEN', 'boundaryGate.dispatchAllowed', 'dispatchAllowed must be false.');
  if (fixture.boundaryGate.sendAllowed !== false)
    pushIssue(issues, 'SEND_ALLOWED_FORBIDDEN', 'boundaryGate.sendAllowed', 'sendAllowed must be false.');

  if (fixture.approvalBoundary.approvalAuthorizesExecution !== false)
    pushIssue(issues, 'APPROVAL_AUTHORIZES_EXECUTION_FORBIDDEN', 'approvalBoundary.approvalAuthorizesExecution', 'approval cannot authorize execution.');
  if (fixture.boundaryState.futurePhaseRequired !== true)
    pushIssue(issues, 'FUTURE_PHASE_REQUIRED', 'boundaryState.futurePhaseRequired', 'futurePhaseRequired must be true.');
  if (fixture.abortContract.runtimeSideEffectsAllowed !== false)
    pushIssue(issues, 'RUNTIME_SIDE_EFFECTS_FORBIDDEN', 'abortContract.runtimeSideEffectsAllowed', 'runtime side effects must remain disabled.');
  if (fixture.rollbackContract.runtimeSideEffectsAllowed !== false)
    pushIssue(issues, 'ROLLBACK_RUNTIME_SIDE_EFFECTS_FORBIDDEN', 'rollbackContract.runtimeSideEffectsAllowed', 'rollback runtime side effects must remain disabled.');
  if (fixture.abortContract.scheduledTimersAllowed !== false)
    pushIssue(issues, 'SCHEDULED_TIMERS_FORBIDDEN', 'abortContract.scheduledTimersAllowed', 'scheduled timers are forbidden.');
  if (fixture.rollbackContract.scheduledTimersAllowed !== false)
    pushIssue(issues, 'ROLLBACK_SCHEDULED_TIMERS_FORBIDDEN', 'rollbackContract.scheduledTimersAllowed', 'rollback scheduled timers are forbidden.');

  for (const [field, value] of Object.entries(fixture.capabilities)) {
    if (field.startsWith('executionBoundary') && field !== 'executionBoundaryGates' && field !== 'executionBoundaryStates' &&
      field !== 'executionBoundaryEvidenceBundles' && field !== 'executionBoundaryBlockerTaxonomy' &&
      field !== 'executionBoundaryCapabilityAudits' && field !== 'executionBoundaryScorecards' &&
      field !== 'executionBoundaryReports' && field !== 'executionBoundaryViewModels' &&
      field !== 'executionBoundaryApiContracts' && field !== 'executionBoundarySelectors' &&
      typeof value === 'boolean' && /RuntimeExecution|UnlockAuthority|LiveTrading|LimitedLiveUnlock|FullAutoUnlock|OrderCreation|TransactionBuilding|TransactionSerialization|TransactionSimulation|TransactionSending|WalletLogic|PrivateKeyHandling|KeypairHandling|Signing|Dispatch|TradingSignals|Recommendations|InvestmentAdvice|RealOrders|RealFunds|RealPnL|LiveNetworkDefault|ScheduledJobs|RuntimeMonitoring|RuntimeCollectors|ProviderExpansion|SecretsRequired|ApiKeyRequired|FilesystemWrites|Persistence|RouteHandlers|RuntimeRequests|UiRendering|DomAccess|BackgroundJobs|AutomaticPromotion/.test(field) && value !== false) {
      pushIssue(issues, 'UNSAFE_CAPABILITY', `capabilities.${field}`, `${field} must be false.`);
    }
  }
}

export function validateManualConfirmExecutionBoundaryFixture(
  fixture: ManualConfirmExecutionBoundaryFixture,
): ManualConfirmExecutionBoundaryValidationResult {
  const issues: ManualConfirmExecutionBoundaryValidationIssue[] = [];

  if (!fixture.fixtureId) pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  if (!isValidManualConfirmExecutionBoundaryName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidManualConfirmExecutionBoundaryKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE) pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE}.`);
  if (!isValidManualConfirmExecutionBoundarySchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidManualConfirmExecutionBoundaryGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'generatedAt is invalid.');
  if (!isValidManualConfirmExecutionBoundarySource(fixture.meta.source)) pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'source is invalid.');
  if (!TIMESTAMP_PATTERN.test(fixture.meta.generatedAt)) pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'meta.generatedAt', 'generatedAt must be deterministic ISO timestamp.');

  if (!fixture.evidenceBundle.docsRefs.length) pushIssue(issues, 'MISSING_DOC_REFS', 'evidenceBundle.docsRefs', 'docsRefs is required.');
  if (!fixture.evidenceBundle.validationCommandRefs.length) pushIssue(issues, 'MISSING_VALIDATION_COMMAND_REFS', 'evidenceBundle.validationCommandRefs', 'validationCommandRefs is required.');
  if (!fixture.evidenceBundle.sourceFixtureRefs.length) pushIssue(issues, 'MISSING_SOURCE_REFS', 'evidenceBundle.sourceFixtureRefs', 'sourceFixtureRefs is required.');

  if (!Object.isFrozen(fixture.sourcePhase80FixtureSnapshot)) pushIssue(issues, 'SOURCE_FIXTURE_MUTABLE', 'sourcePhase80FixtureSnapshot', 'source snapshots must be immutable.');

  if (Object.values(fixture.report).some(summary => FORBIDDEN_ADVISORY_PATTERN.test(summary))) {
    pushIssue(issues, 'ADVISORY_LANGUAGE_FORBIDDEN', 'report', 'advisory/profit language is forbidden in reports.');
  }

  validateSafetyBooleans(fixture, issues);
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateManualConfirmExecutionBoundarySafety(
  fixture: ManualConfirmExecutionBoundaryFixture,
): ManualConfirmExecutionBoundarySafetyResult {
  const violations: string[] = [];
  if (fixture.boundaryGate.unlockAuthority !== false) violations.push('boundaryGate.unlockAuthority must be false');
  if (fixture.boundaryGate.executionAllowed !== false) violations.push('boundaryGate.executionAllowed must be false');
  if (fixture.boundaryGate.transactionConstructionAllowed !== false) violations.push('boundaryGate.transactionConstructionAllowed must be false');
  if (fixture.boundaryGate.signingAllowed !== false) violations.push('boundaryGate.signingAllowed must be false');
  if (fixture.boundaryGate.dispatchAllowed !== false) violations.push('boundaryGate.dispatchAllowed must be false');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  return { safe: violations.length === 0, violations };
}

export function validateManualConfirmExecutionBoundaryFixtureTable(
  fixtures: readonly ManualConfirmExecutionBoundaryFixture[],
): ManualConfirmExecutionBoundaryValidationResult {
  const issues: ManualConfirmExecutionBoundaryValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateManualConfirmExecutionBoundaryFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName)) pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    seenNames.add(fixture.fixtureName);
  }

  return { valid: issues.length === 0, issues };
}
