import { CROSS_PROVIDER_DATA_QUALITY_FIXTURES, CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../first-read-only-provider-adapter/index.js';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
} from '../multi-provider-read-only-foundation/index.js';
import {
  PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES,
  PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
} from '../provider-aware-replay-scenarios/index.js';
import { getLiveSmokeSafetyCertificationCapabilities } from './capabilities.js';
import { buildProviderCertificationGate } from './certification-gates.js';
import { buildLiveSmokeSafetyApiContract } from './contracts.js';
import { buildNetworkIsolationPolicy } from './network-isolation.js';
import { buildOfflineCiCertificationContract } from './offline-ci-contracts.js';
import { buildProviderSmokeEligibilityCheck } from './provider-eligibility.js';
import { buildReadOnlySmokeCheck } from './read-only-checks.js';
import { buildLiveSmokeCertificationReport } from './reports.js';
import { buildSafetyCertificate } from './safety-certificates.js';
import { buildLiveSmokeConfig } from './smoke-config.js';
import { buildSmokeGuardPolicy } from './smoke-guard-policy.js';
import { buildSmokePlan } from './smoke-plans.js';
import { buildSmokeResult } from './smoke-results.js';
import type {
  BuildLiveSmokeSafetyCertificationFixtureInput,
  LiveSmokeResultStatus,
  LiveSmokeSafetyCertificationFixture,
  LiveSmokeSafetyCertificationKind,
  LiveSmokeSafetyCertificationName,
  ReadOnlySmokeCheckKind,
} from './types.js';
import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_VERSION,
} from './types.js';
import { buildLiveSmokeSafetyViewModel } from './view-models.js';

interface FixtureBlueprint {
  readonly fixtureKind: LiveSmokeSafetyCertificationKind;
  readonly sourceProviderId: string;
  readonly sourcePhase: 65 | 66 | 67 | 68;
  readonly sourcePhase65FixtureName: (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
  readonly sourcePhase66FixtureName: (typeof MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)[number];
  readonly sourcePhase67FixtureName: (typeof CROSS_PROVIDER_DATA_QUALITY_NAMES)[number];
  readonly sourcePhase68FixtureName: (typeof PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)[number];
  readonly mode: 'standard_ci_offline' | 'manual_smoke_disabled' | 'manual_smoke_ready';
  readonly standardCi: boolean;
  readonly expectedOutcome: LiveSmokeResultStatus;
  readonly gateStatus: 'passed' | 'blocked' | 'manual_review_required';
  readonly certificationStatus: 'certified_offline' | 'certification_failed' | 'manual_review_required';
  readonly readOnlyProvider: boolean;
  readonly unsafeCapabilitiesDetected: boolean;
  readonly hasProviderConfig: boolean;
  readonly crossProviderQualityReady: boolean;
  readonly replayCertificationReady: boolean;
  readonly checkKinds: readonly ReadOnlySmokeCheckKind[];
  readonly reasonCodes: readonly string[];
  readonly safetyNotes: readonly string[];
}

const BLUEPRINTS: Readonly<Record<LiveSmokeSafetyCertificationName, FixtureBlueprint>> = {
  'standard-ci-smoke-skipped': {
    fixtureKind: 'standard_ci_smoke_skipped',
    sourceProviderId: 'provider-a',
    sourcePhase: 66,
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'single-provider-healthy',
    sourcePhase67FixtureName: 'all-providers-agree-high-confidence',
    sourcePhase68FixtureName: 'high-confidence-provider-agreement-scenario',
    mode: 'standard_ci_offline',
    standardCi: true,
    expectedOutcome: 'skipped',
    gateStatus: 'blocked',
    certificationStatus: 'manual_review_required',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: true,
    replayCertificationReady: true,
    checkKinds: ['health_check_contract', 'safety_capability_check', 'cross_provider_quality_gate_check'],
    reasonCodes: ['STANDARD_CI_OFFLINE_SKIP', 'DISABLED_BY_DEFAULT'],
    safetyNotes: ['standard-ci-offline', 'optional-manual-smoke-not-executed'],
  },
  'manual-smoke-disabled-by-default': {
    fixtureKind: 'manual_smoke_disabled_by_default',
    sourceProviderId: 'provider-b',
    sourcePhase: 65,
    sourcePhase65FixtureName: 'gate-closed-rejected',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    mode: 'manual_smoke_disabled',
    standardCi: false,
    expectedOutcome: 'manual_required',
    gateStatus: 'manual_review_required',
    certificationStatus: 'manual_review_required',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: true,
    replayCertificationReady: true,
    checkKinds: ['provider_configuration_check', 'schema_compatibility_check', 'safety_capability_check'],
    reasonCodes: ['MANUAL_OPT_IN_REQUIRED', 'DISABLED_BY_DEFAULT'],
    safetyNotes: ['manual-gate-required', 'phase69-no-network-execution'],
  },
  'read-only-provider-certified-offline': {
    fixtureKind: 'read_only_provider_certified_offline',
    sourceProviderId: 'provider-c',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'offline-mint-authority-success',
    sourcePhase66FixtureName: 'multi-provider-healthy',
    sourcePhase67FixtureName: 'all-providers-agree-high-confidence',
    sourcePhase68FixtureName: 'high-confidence-provider-agreement-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'certified_offline',
    gateStatus: 'passed',
    certificationStatus: 'certified_offline',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: true,
    replayCertificationReady: true,
    checkKinds: ['health_check_contract', 'schema_compatibility_check', 'conformance_check', 'freshness_check'],
    reasonCodes: ['OFFLINE_CERTIFICATION_GRANTED'],
    safetyNotes: ['read-only-certified-offline', 'not-authorized-for-execution'],
  },
  'unsafe-capability-blocked': {
    fixtureKind: 'unsafe_capability_blocked',
    sourceProviderId: 'provider-unsafe',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'unsupported-write-capability-rejected',
    sourcePhase66FixtureName: 'capability-mismatch-rejected',
    sourcePhase67FixtureName: 'unsafe-provider-capability-rejected',
    sourcePhase68FixtureName: 'unsafe-provider-capability-blocked-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'blocked',
    gateStatus: 'blocked',
    certificationStatus: 'certification_failed',
    readOnlyProvider: false,
    unsafeCapabilitiesDetected: true,
    hasProviderConfig: true,
    crossProviderQualityReady: false,
    replayCertificationReady: false,
    checkKinds: ['safety_capability_check', 'conformance_check'],
    reasonCodes: ['UNSAFE_CAPABILITY_BLOCKED', 'FAIL_CLOSED_BLOCK'],
    safetyNotes: ['unsafe-capability-rejected', 'no-manual-override-in-phase69'],
  },
  'missing-provider-config-blocked': {
    fixtureKind: 'missing_provider_config_blocked',
    sourceProviderId: 'provider-missing',
    sourcePhase: 65,
    sourcePhase65FixtureName: 'malformed-response-error',
    sourcePhase66FixtureName: 'disabled-provider-blocked',
    sourcePhase67FixtureName: 'stale-provider-mismatch',
    sourcePhase68FixtureName: 'stale-provider-replay-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'blocked',
    gateStatus: 'blocked',
    certificationStatus: 'certification_failed',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: false,
    crossProviderQualityReady: false,
    replayCertificationReady: false,
    checkKinds: ['provider_configuration_check', 'health_check_contract'],
    reasonCodes: ['MISSING_PROVIDER_CONFIG', 'FAIL_CLOSED_BLOCK'],
    safetyNotes: ['missing-provider-config', 'cannot-certify-without-config'],
  },
  'stale-provider-certification-warning': {
    fixtureKind: 'stale_provider_certification_warning',
    sourceProviderId: 'provider-stale',
    sourcePhase: 66,
    sourcePhase65FixtureName: 'offline-token-metadata-success',
    sourcePhase66FixtureName: 'stale-primary-provider',
    sourcePhase67FixtureName: 'stale-provider-mismatch',
    sourcePhase68FixtureName: 'stale-provider-replay-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'manual_required',
    gateStatus: 'manual_review_required',
    certificationStatus: 'manual_review_required',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: true,
    replayCertificationReady: true,
    checkKinds: ['freshness_check', 'cross_provider_quality_gate_check'],
    reasonCodes: ['STALE_PROVIDER_WARNING', 'MANUAL_REVIEW_REQUIRED'],
    safetyNotes: ['stale-warning-non-executable', 'offline-contract-intact'],
  },
  'cross-provider-quality-gate-blocked': {
    fixtureKind: 'cross_provider_quality_gate_blocked',
    sourceProviderId: 'provider-quality-gate',
    sourcePhase: 67,
    sourcePhase65FixtureName: 'provider-unavailable-error',
    sourcePhase66FixtureName: 'all-providers-stale-fail-closed',
    sourcePhase67FixtureName: 'all-providers-conflict-fail-closed',
    sourcePhase68FixtureName: 'all-conflict-regeneration-blocked-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'blocked',
    gateStatus: 'blocked',
    certificationStatus: 'certification_failed',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: false,
    replayCertificationReady: true,
    checkKinds: ['cross_provider_quality_gate_check', 'provider_replay_certification_readiness_check'],
    reasonCodes: ['CROSS_PROVIDER_QUALITY_GATE_BLOCKED', 'FAIL_CLOSED_BLOCK'],
    safetyNotes: ['cross-provider-quality-block', 'certification-failed-offline'],
  },
  'provider-aware-replay-certification-ready': {
    fixtureKind: 'provider_aware_replay_certification_ready',
    sourceProviderId: 'provider-replay-ready',
    sourcePhase: 68,
    sourcePhase65FixtureName: 'offline-account-info-success',
    sourcePhase66FixtureName: 'fallback-to-secondary',
    sourcePhase67FixtureName: 'fallback-provider-reconciled',
    sourcePhase68FixtureName: 'fallback-reconciled-provider-scenario',
    mode: 'manual_smoke_ready',
    standardCi: false,
    expectedOutcome: 'certified_offline',
    gateStatus: 'passed',
    certificationStatus: 'certified_offline',
    readOnlyProvider: true,
    unsafeCapabilitiesDetected: false,
    hasProviderConfig: true,
    crossProviderQualityReady: true,
    replayCertificationReady: true,
    checkKinds: [
      'provider_replay_certification_readiness_check',
      'cross_provider_quality_gate_check',
      'schema_compatibility_check',
    ],
    reasonCodes: ['REPLAY_CERTIFICATION_READY', 'OFFLINE_CERTIFICATION_GRANTED'],
    safetyNotes: ['provider-aware-replay-ready', 'phase70-preview-only'],
  },
};

export function buildLiveSmokeSafetyCertificationFixture(
  input: BuildLiveSmokeSafetyCertificationFixtureInput,
): LiveSmokeSafetyCertificationFixture {
  const blueprint = BLUEPRINTS[input.fixtureName];
  const fixtureId = `phase69-fixture-${input.fixtureName}`;

  const source65 = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase65FixtureName,
  );
  const source66 = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase66FixtureName,
  );
  const source67 = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(fixture => fixture.fixtureName === blueprint.sourcePhase67FixtureName);
  const source68 = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(
    fixture => fixture.fixtureName === blueprint.sourcePhase68FixtureName,
  );

  if (!source65 || !source66 || !source67 || !source68) {
    throw new Error(`Phase 69 source linkage missing for ${input.fixtureName}`);
  }

  const smokeConfig = buildLiveSmokeConfig({
    fixtureId,
    mode: blueprint.mode,
    standardCi: blueprint.standardCi,
    requiresManualOptIn: true,
  });
  const smokeGuardPolicy = buildSmokeGuardPolicy({ fixtureId });
  const smokePlan = buildSmokePlan({
    fixtureId,
    sourceProviderId: blueprint.sourceProviderId,
    sourcePhase: blueprint.sourcePhase,
    checkKinds: blueprint.checkKinds,
    expectedOutcome: blueprint.expectedOutcome,
    safetyNotes: blueprint.safetyNotes,
  });

  const readOnlyChecks = blueprint.checkKinds.map(checkKind =>
    buildReadOnlySmokeCheck({
      fixtureId,
      checkKind,
      providerId: blueprint.sourceProviderId,
      passed: blueprint.expectedOutcome === 'certified_offline',
      reasonCode: blueprint.reasonCodes[0] ?? 'CHECK_CONTRACT_RECORDED',
      expectedCapability: 'read_only_fixture_smoke_contract',
      observedCapability: blueprint.unsafeCapabilitiesDetected
        ? 'unsafe_capability_detected'
        : 'read_only_fixture_smoke_contract',
      sourceRefs: [source65.fixtureId, source66.fixtureId, source67.fixtureId, source68.fixtureId],
    }),
  );

  const providerEligibility = buildProviderSmokeEligibilityCheck({
    fixtureId,
    providerId: blueprint.sourceProviderId,
    readOnlyProvider: blueprint.readOnlyProvider,
    unsafeCapabilitiesDetected: blueprint.unsafeCapabilitiesDetected,
    hasProviderConfig: blueprint.hasProviderConfig,
    crossProviderQualityReady: blueprint.crossProviderQualityReady,
    replayCertificationReady: blueprint.replayCertificationReady,
    reasonCodes: blueprint.reasonCodes,
  });

  const networkIsolationPolicy = buildNetworkIsolationPolicy({
    fixtureId,
    timeoutPolicy: 'metadata_only_timeout_policy_ms_1500',
    retryPolicyMetadataOnly: 'metadata_only_retry_policy_max_2_exponential_backoff_disabled_runtime',
  });

  const smokeResult = buildSmokeResult({
    fixtureId,
    planId: smokePlan.smokePlanId,
    status: blueprint.expectedOutcome,
    reasonCodes: blueprint.reasonCodes,
    evidenceRefs: [source65.fixtureId, source66.fixtureId, source67.fixtureId, source68.fixtureId],
  });

  const certificationGate = buildProviderCertificationGate({
    fixtureId,
    providerId: blueprint.sourceProviderId,
    gateStatus: blueprint.gateStatus,
    reasonCodes: blueprint.reasonCodes,
  });

  const safetyCertificate = buildSafetyCertificate({
    fixtureId,
    providerId: blueprint.sourceProviderId,
    certifiedReadOnly: blueprint.readOnlyProvider,
    certifiedOfflineCi: true,
    certifiedNoSecrets: true,
    certifiedNoExecution: true,
    certifiedNoAdvisory: true,
    certificationStatus: blueprint.certificationStatus,
    failureReasons: blueprint.certificationStatus === 'certification_failed' ? blueprint.reasonCodes : [],
  });

  const offlineCiContract = buildOfflineCiCertificationContract({
    fixtureId,
    validationCommands: [
      'pnpm typecheck',
      'pnpm lint',
      'pnpm test',
      'pnpm --filter @sonic/dashboard build',
      'pnpm --filter @sonic/offline-intelligence build',
    ],
  });

  const certificationReport = buildLiveSmokeCertificationReport({
    fixtureId,
    smokeConfig,
    smokeGuardPolicy,
    smokePlan,
    smokeResult,
    safetyCertificate,
    offlineCiContract,
  });

  const viewModel = buildLiveSmokeSafetyViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    smokeResult,
    certificationGate,
    safetyCertificate,
  });

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE,
    schemaVersion: PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
    smokeConfig,
    smokeGuardPolicy,
    smokePlan,
    readOnlyChecks,
    providerEligibility,
    networkIsolationPolicy,
    smokeResult,
    certificationGate,
    safetyCertificate,
    offlineCiContract,
    certificationReport,
    viewModel,
    apiContract: buildLiveSmokeSafetyApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] }),
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
    capabilityFlags: getLiveSmokeSafetyCertificationCapabilities(),
    sourcePhase65FixtureSnapshot: FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
    sourcePhase66FixtureSnapshot: MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
    sourcePhase67FixtureSnapshot: CROSS_PROVIDER_DATA_QUALITY_NAMES,
    sourcePhase68FixtureSnapshot: PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
    meta: {
      generatedAt: PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT,
      source: PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE,
      version: PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_VERSION,
      phase: LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE,
      deterministicSeed: `phase69-seed-${input.fixtureName}`,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveData: true,
      noNetworkAccessByDefault: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
