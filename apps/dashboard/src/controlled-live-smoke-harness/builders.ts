import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { getControlledLiveSmokeHarnessCapabilities } from './capabilities.js';
import { buildSmokeCertificationReport } from './certification-reports.js';
import { buildSmokeApiContract } from './contracts.js';
import { buildSmokeEligibilityModel } from './eligibility-models.js';
import { buildSmokeEnvironmentContract } from './environment-contracts.js';
import { buildSmokeFailureTaxonomy } from './failure-taxonomy.js';
import { buildSmokeGuardContract } from './guard-contracts.js';
import { buildManualEnableSmokePolicy } from './manual-enable-policies.js';
import { stableDeterministicControlledLiveSmokeHarnessChecksum } from './normalization.js';
import { buildReadOnlySmokeCheckContract } from './read-only-check-contracts.js';
import { buildSmokeReadinessViewModel } from './readiness-view-models.js';
import { buildSmokeResultFixture } from './result-fixtures.js';
import { buildSmokeSecretDenialContract } from './secret-denial-contracts.js';
import { buildSmokeSkipFixture } from './skip-fixtures.js';
import { buildControlledSmokePlan } from './smoke-plans.js';
import {
  CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_VERSION,
  type BuildControlledLiveSmokeHarnessFixtureInput,
  type ControlledLiveSmokeHarnessFixture,
  type ControlledLiveSmokeHarnessKind,
  type ControlledLiveSmokeHarnessName,
  type SmokeFailureKind,
  type SmokeFailureSeverity,
  type SmokeGuardState,
  type SmokePlanKind,
  type SmokeResultKind,
  type SmokeResultStatus,
} from './types.js';

interface Blueprint {
  readonly fixtureKind: ControlledLiveSmokeHarnessKind;
  readonly smokePlanKind: SmokePlanKind;
  readonly guardState: SmokeGuardState;
  readonly resultKind: SmokeResultKind;
  readonly resultStatus: SmokeResultStatus;
  readonly skipped: boolean;
  readonly disabled: boolean;
  readonly unsafeCapabilityDetected: boolean;
  readonly eligibleForManualSmoke: boolean;
  readonly reliabilityCompatible: boolean;
  readonly certificationCompatible: boolean;
  readonly replayImportCompatible: boolean;
  readonly guardReasonCodes: readonly string[];
  readonly ineligibleReasonCodes: readonly string[];
  readonly failureKind: SmokeFailureKind;
  readonly failureSeverity: SmokeFailureSeverity;
  readonly failClosed: boolean;
  readonly standardCiMode: boolean;
  readonly manualOnlyMode: boolean;
}

const BLUEPRINTS: Record<ControlledLiveSmokeHarnessName, Blueprint> = {
  'default-disabled-smoke-plan': {
    fixtureKind: 'default_disabled_smoke_plan',
    smokePlanKind: 'offline_fixture_only',
    guardState: 'disabled',
    resultKind: 'disabled',
    resultStatus: 'disabled',
    skipped: false,
    disabled: true,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: false,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['DEFAULT_DISABLED'],
    ineligibleReasonCodes: ['DEFAULT_DISABLED'],
    failureKind: 'guard_fail_closed',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'manual-trigger-required-plan': {
    fixtureKind: 'manual_trigger_required_plan',
    smokePlanKind: 'manual_only',
    guardState: 'manual_approval_required',
    resultKind: 'manual_required',
    resultStatus: 'manual_required',
    skipped: false,
    disabled: false,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: true,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['MANUAL_TRIGGER_REQUIRED'],
    ineligibleReasonCodes: [],
    failureKind: 'missing_manual_enable',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: false,
    manualOnlyMode: true,
  },
  'standard-ci-smoke-skipped': {
    fixtureKind: 'standard_ci_smoke_skipped',
    smokePlanKind: 'offline_fixture_only',
    guardState: 'skipped',
    resultKind: 'skipped',
    resultStatus: 'skipped',
    skipped: true,
    disabled: false,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: false,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['STANDARD_CI_SKIP'],
    ineligibleReasonCodes: ['STANDARD_CI_SKIP'],
    failureKind: 'guard_fail_closed',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'missing-manual-enable-blocked': {
    fixtureKind: 'missing_manual_enable_blocked',
    smokePlanKind: 'manual_only',
    guardState: 'blocked',
    resultKind: 'blocked',
    resultStatus: 'blocked',
    skipped: false,
    disabled: false,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: false,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['MISSING_MANUAL_ENABLE'],
    ineligibleReasonCodes: ['MISSING_MANUAL_ENABLE'],
    failureKind: 'missing_manual_enable',
    failureSeverity: 'error',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'unsafe-capability-smoke-rejected': {
    fixtureKind: 'unsafe_capability_smoke_rejected',
    smokePlanKind: 'offline_fixture_only',
    guardState: 'blocked',
    resultKind: 'blocked',
    resultStatus: 'blocked',
    skipped: false,
    disabled: false,
    unsafeCapabilityDetected: true,
    eligibleForManualSmoke: false,
    reliabilityCompatible: false,
    certificationCompatible: false,
    replayImportCompatible: false,
    guardReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    ineligibleReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    failureKind: 'unsafe_capability_detected',
    failureSeverity: 'critical',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'reliability-drift-smoke-warning': {
    fixtureKind: 'reliability_drift_smoke_warning',
    smokePlanKind: 'reliability_linked',
    guardState: 'skipped',
    resultKind: 'skipped',
    resultStatus: 'skipped',
    skipped: true,
    disabled: false,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: false,
    reliabilityCompatible: false,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['RELIABILITY_DRIFT_DETECTED'],
    ineligibleReasonCodes: ['RELIABILITY_DRIFT_DETECTED'],
    failureKind: 'reliability_drift_detected',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'replay-import-linked-smoke-plan': {
    fixtureKind: 'replay_import_linked_smoke_plan',
    smokePlanKind: 'replay_linked',
    guardState: 'disabled',
    resultKind: 'disabled',
    resultStatus: 'disabled',
    skipped: false,
    disabled: true,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: false,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['DEFAULT_DISABLED'],
    ineligibleReasonCodes: ['DEFAULT_DISABLED'],
    failureKind: 'guard_fail_closed',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: true,
    manualOnlyMode: false,
  },
  'read-only-provider-smoke-ready-contract': {
    fixtureKind: 'read_only_provider_smoke_ready_contract',
    smokePlanKind: 'read_only_check',
    guardState: 'manual_approval_required',
    resultKind: 'manual_required',
    resultStatus: 'manual_required',
    skipped: false,
    disabled: false,
    unsafeCapabilityDetected: false,
    eligibleForManualSmoke: true,
    reliabilityCompatible: true,
    certificationCompatible: true,
    replayImportCompatible: true,
    guardReasonCodes: ['MANUAL_TRIGGER_REQUIRED'],
    ineligibleReasonCodes: [],
    failureKind: 'environment_mismatch',
    failureSeverity: 'warning',
    failClosed: true,
    standardCiMode: false,
    manualOnlyMode: true,
  },
};

const SOURCE_INDEXES: Record<ControlledLiveSmokeHarnessName, number> = {
  'default-disabled-smoke-plan': 0,
  'manual-trigger-required-plan': 1,
  'standard-ci-smoke-skipped': 2,
  'missing-manual-enable-blocked': 3,
  'unsafe-capability-smoke-rejected': 4,
  'reliability-drift-smoke-warning': 5,
  'replay-import-linked-smoke-plan': 6,
  'read-only-provider-smoke-ready-contract': 7,
};

export function buildControlledLiveSmokeHarnessFixture(
  input: BuildControlledLiveSmokeHarnessFixtureInput,
): ControlledLiveSmokeHarnessFixture {
  const { fixtureName } = input;
  const blueprint = BLUEPRINTS[fixtureName];
  const fixtureId = `phase74-${fixtureName}`;
  const sourceIndex = SOURCE_INDEXES[fixtureName];

  const phase65Ref = FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex % FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.length]!;
  const phase69Ref = LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[sourceIndex % LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase70Ref = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[sourceIndex % PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.length]!;
  const phase73Ref = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.length]!;

  const providerId = `provider-phase74-${sourceIndex}`;

  const smokePlan = buildControlledSmokePlan({
    smokePlanId: `${fixtureId}-plan`,
    smokePlanName: fixtureName,
    smokePlanKind: blueprint.smokePlanKind,
    targetProviderId: providerId,
    sourceCertificationFixtureName: phase69Ref,
  });

  const manualEnablePolicy = buildManualEnableSmokePolicy({
    policyId: `${fixtureId}-policy`,
    policyName: `${fixtureName}-manual-enable-policy`,
  });

  const guardContract = buildSmokeGuardContract({
    guardId: `${fixtureId}-guard`,
    guardState: blueprint.guardState,
    unsafeCapabilityDetected: blueprint.unsafeCapabilityDetected,
    reasonCodes: blueprint.guardReasonCodes,
  });

  const readOnlyCheckContract = buildReadOnlySmokeCheckContract({
    checkId: `${fixtureId}-check`,
    checkKind: 'health_check_contract',
    expectedOutcome: `fixture-only-${blueprint.resultStatus}`,
  });

  const eligibilityModel = buildSmokeEligibilityModel({
    eligibilityId: `${fixtureId}-eligibility`,
    providerId,
    reliabilityCompatible: blueprint.reliabilityCompatible,
    certificationCompatible: blueprint.certificationCompatible,
    replayImportCompatible: blueprint.replayImportCompatible,
    eligibleForManualSmoke: blueprint.eligibleForManualSmoke,
    ineligibleReasonCodes: blueprint.ineligibleReasonCodes,
  });

  const environmentContract = buildSmokeEnvironmentContract({
    environmentContractId: `${fixtureId}-environment`,
    standardCiMode: blueprint.standardCiMode,
    manualOnlyMode: blueprint.manualOnlyMode,
  });

  const secretDenialContract = buildSmokeSecretDenialContract({
    denialId: `${fixtureId}-denial`,
    safetyNotes: 'No secrets or API keys required in standard CI. Read-only, fixture-only, non-advisory.',
  });

  const resultFixture = buildSmokeResultFixture({
    resultId: `${fixtureId}-result`,
    resultKind: blueprint.resultKind,
    status: blueprint.resultStatus,
    skipped: blueprint.skipped,
    disabled: blueprint.disabled,
    providerId,
    checkedAt: PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT,
    safetySummary: `Fixture-only result. Status: ${blueprint.resultStatus}. No live network. Fail-closed.`,
  });

  const skipFixture = buildSmokeSkipFixture({
    skipId: `${fixtureId}-skip`,
    skipKind: blueprint.skipped || blueprint.disabled ? 'standard_ci_skip' : 'manual_not_triggered',
    reason: blueprint.guardReasonCodes[0] ?? 'DEFAULT_DISABLED',
    standardCi: blueprint.standardCiMode,
    manualTriggerRequired: manualEnablePolicy.requiresManualTrigger,
  });

  const failureTaxonomy = buildSmokeFailureTaxonomy({
    failureId: `${fixtureId}-failure`,
    failureKind: blueprint.failureKind,
    severity: blueprint.failureSeverity,
    failClosed: blueprint.failClosed,
    reasonCode: blueprint.guardReasonCodes[0] ?? 'DEFAULT_DISABLED',
    recoveryHint: 'Enable manual smoke gate only via explicit flag in isolated manual workflow.',
  });

  const certificationReport = buildSmokeCertificationReport({
    reportId: `${fixtureId}-report`,
    planSummary: `Plan: ${blueprint.smokePlanKind} | disabled-by-default: ${smokePlan.disabledByDefault}`,
    guardSummary: `Guard: ${blueprint.guardState} | fail-closed: ${guardContract.failClosed}`,
    eligibilitySummary: `Eligible: ${blueprint.eligibleForManualSmoke} | reliable: ${blueprint.reliabilityCompatible}`,
    environmentSummary: `Standard CI: ${blueprint.standardCiMode} | manual only: ${blueprint.manualOnlyMode}`,
    resultSummary: `Result: ${blueprint.resultStatus} | skipped: ${blueprint.skipped} | live network: false`,
    failureSummary: `Failure kind: ${blueprint.failureKind} | severity: ${blueprint.failureSeverity}`,
    safetySummary:
      'Fixture-only. No live network. No secrets in CI. No provider expansion. Non-advisory. Non-executable. Fail-closed.',
  });

  const readinessViewModel = buildSmokeReadinessViewModel({
    viewModelId: `${fixtureId}-vm`,
    fixtureName,
    fixtureId,
    providerId,
    readinessStatus: blueprint.resultStatus,
    disabledByDefault: smokePlan.disabledByDefault,
    guardState: blueprint.guardState,
  });

  const allFixtureIds = [fixtureId];
  const apiContract = buildSmokeApiContract({
    fixtureId,
    viewModel: readinessViewModel,
    fixtureIds: allFixtureIds,
  });

  const capabilityFlags = getControlledLiveSmokeHarnessCapabilities();

  const deterministicSeed = stableDeterministicControlledLiveSmokeHarnessChecksum(
    `phase74:${fixtureName}:${PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT}`,
  );

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
    schemaVersion: PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION,
    smokePlan,
    manualEnablePolicy,
    guardContract,
    readOnlyCheckContract,
    eligibilityModel,
    environmentContract,
    secretDenialContract,
    resultFixture,
    skipFixture,
    failureTaxonomy,
    certificationReport,
    readinessViewModel,
    apiContract,
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector-name`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'deterministic_fixture_only',
      },
    ],
    capabilityFlags,
    sourcePhase65FixtureSnapshot: [phase65Ref],
    sourcePhase69FixtureSnapshot: [phase69Ref],
    sourcePhase70FixtureSnapshot: [phase70Ref],
    sourcePhase73FixtureSnapshot: [phase73Ref],
    sourceRefs: {
      phase65FixtureId: `phase65-${phase65Ref}`,
      phase69FixtureId: `phase69-${phase69Ref}`,
      phase70FixtureId: `phase70-${phase70Ref}`,
      phase73FixtureId: `phase73-${phase73Ref}`,
    },
    meta: {
      generatedAt: PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT,
      source: PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE,
      version: PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_VERSION,
      phase: CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveNetwork: true,
      noScheduledSmoke: true,
      noRuntimeMonitoring: true,
      noSecretsRequired: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
