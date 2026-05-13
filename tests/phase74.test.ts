import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES,
  CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURE_MAP,
  CONTROLLED_LIVE_SMOKE_HARNESS_KINDS,
  CONTROLLED_LIVE_SMOKE_HARNESS_NAMES,
  CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT,
  areControlledLiveSmokeHarnessFixturesEqual,
  buildControlledLiveSmokeHarnessFixture,
  buildControlledSmokePlan,
  buildManualEnableSmokePolicy,
  buildReadOnlySmokeCheckContract,
  buildSmokeApiContract,
  buildSmokeCertificationReport,
  buildSmokeEligibilityModel,
  buildSmokeEnvironmentContract,
  buildSmokeFailureTaxonomy,
  buildSmokeGuardContract,
  buildSmokeReadinessViewModel,
  buildSmokeResultFixture,
  buildSmokeSecretDenialContract,
  buildSmokeSkipFixture,
  getControlledLiveSmokeHarnessCapabilities,
  getControlledLiveSmokeHarnessFixture,
  isValidControlledLiveSmokeHarnessGeneratedAt,
  isValidControlledLiveSmokeHarnessKind,
  isValidControlledLiveSmokeHarnessName,
  isValidControlledLiveSmokeHarnessSchemaVersion,
  isValidControlledLiveSmokeHarnessSource,
  listControlledLiveSmokeHarnessFixtures,
  normalizeControlledLiveSmokeHarnessFixture,
  selectControlledLiveSmokeHarnessFixture,
  serializeControlledLiveSmokeHarnessFixture,
  stableDeterministicControlledLiveSmokeHarnessChecksum,
  validateControlledLiveSmokeHarnessFixture,
  validateControlledLiveSmokeHarnessSafety,
  getDashboardUiShellCapabilities,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../apps/dashboard/src/live-smoke-safety-certification/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../apps/dashboard/src/provider-reliability-drift-audit/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../apps/dashboard/src/provider-aware-replay-import-contracts/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_74_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/controlled-live-smoke-harness');
const PHASE_74_FILES = [
  'types.ts',
  'smoke-plans.ts',
  'manual-enable-policies.ts',
  'guard-contracts.ts',
  'read-only-check-contracts.ts',
  'eligibility-models.ts',
  'environment-contracts.ts',
  'secret-denial-contracts.ts',
  'result-fixtures.ts',
  'skip-fixtures.ts',
  'failure-taxonomy.ts',
  'certification-reports.ts',
  'readiness-view-models.ts',
  'reports.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 74 — Controlled Live Smoke-Test Harness Expansion v1', () => {
  describe('module files', () => {
    it('all expected files exist', () => {
      for (const file of PHASE_74_FILES) {
        const path = resolve(PHASE_74_SRC, file);
        expect(() => readFileSync(path, 'utf8'), `missing: ${file}`).not.toThrow();
      }
    });
  });

  describe('constants', () => {
    it('phase is 74', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_PHASE).toBe(74);
    });

    it('has 8 names', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length).toBe(8);
    });

    it('has 8 kinds', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_KINDS.length).toBe(8);
    });

    it('names and kinds have equal cardinality', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length).toBe(CONTROLLED_LIVE_SMOKE_HARNESS_KINDS.length);
    });

    it('contains all required fixture names', () => {
      const required = [
        'default-disabled-smoke-plan',
        'manual-trigger-required-plan',
        'standard-ci-smoke-skipped',
        'missing-manual-enable-blocked',
        'unsafe-capability-smoke-rejected',
        'reliability-drift-smoke-warning',
        'replay-import-linked-smoke-plan',
        'read-only-provider-smoke-ready-contract',
      ] as const;
      for (const name of required) {
        expect(CONTROLLED_LIVE_SMOKE_HARNESS_NAMES).toContain(name);
      }
    });

    it('generatedAt is deterministic', () => {
      expect(PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    });
  });

  describe('fixtures', () => {
    it('has >= 8 fixtures', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    });

    it('fixture map has correct count', () => {
      expect(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURE_MAP.size).toBe(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.length);
    });

    it('all fixtures have phase 74', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.phase).toBe(74);
      }
    });

    it('all fixture IDs are unique', () => {
      const ids = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.map(f => f.fixtureId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all fixture names are unique', () => {
      const names = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.map(f => f.fixtureName);
      expect(new Set(names).size).toBe(names.length);
    });

    it('all fixtures are disabled/skipped by default', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        const isDisabledOrSkipped =
          fixture.smokePlan.disabledByDefault === true ||
          fixture.guardContract.defaultDecision === 'skipped' ||
          fixture.resultFixture.disabled === true ||
          fixture.resultFixture.skipped === true ||
          fixture.guardContract.guardState === 'disabled' ||
          fixture.guardContract.guardState === 'skipped' ||
          fixture.guardContract.guardState === 'blocked' ||
          fixture.guardContract.guardState === 'manual_approval_required';
        expect(isDisabledOrSkipped, `fixture ${fixture.fixtureName} should be disabled/skipped`).toBe(true);
      }
    });

    it('all fixtures have no live network by default', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.smokePlan.liveNetworkDefault).toBe(false);
        expect(fixture.guardContract.liveNetworkAllowedByDefault).toBe(false);
        expect(fixture.resultFixture.liveNetworkUsed).toBe(false);
      }
    });

    it('all fixtures have safety block', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.safety.fixtureOnly).toBe(true);
        expect(fixture.safety.readOnly).toBe(true);
        expect(fixture.safety.failClosed).toBe(true);
        expect(fixture.safety.noLiveNetwork).toBe(true);
        expect(fixture.safety.noSecretsRequired).toBe(true);
        expect(fixture.safety.nonAdvisory).toBe(true);
        expect(fixture.safety.notExecutable).toBe(true);
      }
    });

    it('all fixtures have certification report with safety summary', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.certificationReport.safetySummary).toBeTruthy();
        expect(fixture.certificationReport.safetySummary.length).toBeGreaterThan(0);
      }
    });

    it('all manual enable policies reject standard CI and scheduled runs', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.manualEnablePolicy.allowsStandardCi).toBe(false);
        expect(fixture.manualEnablePolicy.allowsScheduledRuns).toBe(false);
        expect(fixture.manualEnablePolicy.requiresManualTrigger).toBe(true);
        expect(fixture.manualEnablePolicy.requiresExplicitFlag).toBe(true);
        expect(fixture.manualEnablePolicy.requiresSecretsInCi).toBe(false);
      }
    });

    it('all environment contracts deny secrets in CI', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.environmentContract.secretsRequiredInStandardCi).toBe(false);
        expect(fixture.environmentContract.providerKeyRequiredInStandardCi).toBe(false);
        expect(fixture.environmentContract.networkDisabledByDefault).toBe(true);
      }
    });

    it('all secret denial contracts deny secrets', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.secretDenialContract.deniesSecretRead).toBe(true);
        expect(fixture.secretDenialContract.deniesSecretLogging).toBe(true);
        expect(fixture.secretDenialContract.deniesApiKeyRequirementInCi).toBe(true);
      }
    });

    it('all read-only check contracts are read-only', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.readOnlyCheckContract.readOnly).toBe(true);
        expect(fixture.readOnlyCheckContract.mutationAllowed).toBe(false);
        expect(fixture.readOnlyCheckContract.transactionAllowed).toBe(false);
        expect(fixture.readOnlyCheckContract.deterministicFixtureOnly).toBe(true);
      }
    });

    it('all guard contracts are fail-closed', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.guardContract.failClosed).toBe(true);
        expect(fixture.guardContract.defaultDecision).toBe('skipped');
      }
    });

    it('all eligibility models are fail-closed', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.eligibilityModel.failClosed).toBe(true);
      }
    });

    it('all smoke plans are disabled by default with no live network', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.smokePlan.disabledByDefault).toBe(true);
        expect(fixture.smokePlan.liveNetworkDefault).toBe(false);
        expect(fixture.smokePlan.fixtureOnly).toBe(true);
        expect(fixture.smokePlan.failClosed).toBe(true);
        expect(fixture.smokePlan.phase).toBe(74);
      }
    });

    it('all skip fixtures are fail-closed', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.skipFixture.failClosed).toBe(true);
      }
    });

    it('all failure taxonomies have required fields', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.failureTaxonomy.failureId).toBeTruthy();
        expect(fixture.failureTaxonomy.failureKind).toBeTruthy();
        expect(fixture.failureTaxonomy.severity).toBeTruthy();
        expect(fixture.failureTaxonomy.reasonCode).toBeTruthy();
        expect(fixture.failureTaxonomy.recoveryHint).toBeTruthy();
      }
    });

    it('all readiness view models have required fields', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.readinessViewModel.viewModelId).toBeTruthy();
        expect(fixture.readinessViewModel.fixtureName).toBe(fixture.fixtureName);
        expect(fixture.readinessViewModel.fixtureId).toBe(fixture.fixtureId);
        expect(fixture.readinessViewModel.summary).toBeTruthy();
      }
    });

    it('all API contracts have list and get', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.apiContract.list.fixtureOnly).toBe(true);
        expect(fixture.apiContract.list.readOnly).toBe(true);
        expect(fixture.apiContract.list.localOnly).toBe(true);
        expect(fixture.apiContract.get.fixtureOnly).toBe(true);
        expect(fixture.apiContract.get.readOnly).toBe(true);
        expect(fixture.apiContract.get.localOnly).toBe(true);
        expect(fixture.apiContract.list.statusCode).toBe(200);
        expect(fixture.apiContract.get.statusCode).toBe(200);
      }
    });

    it('all fixtures have deterministic meta', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.meta.generatedAt).toBe('2026-05-13T00:00:00.000Z');
        expect(fixture.meta.phase).toBe(74);
        expect(fixture.meta.source).toBe('phase74_controlled_live_smoke_harness_expansion_v1');
        expect(fixture.meta.version).toBe('1.0.0');
        expect(fixture.meta.deterministicSeed).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
      }
    });

    it('all fixtures have source phase refs', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        expect(fixture.sourcePhase65FixtureSnapshot.length).toBeGreaterThan(0);
        expect(fixture.sourcePhase69FixtureSnapshot.length).toBeGreaterThan(0);
        expect(fixture.sourcePhase70FixtureSnapshot.length).toBeGreaterThan(0);
        expect(fixture.sourcePhase73FixtureSnapshot.length).toBeGreaterThan(0);
        expect(fixture.sourceRefs.phase65FixtureId).toBeTruthy();
        expect(fixture.sourceRefs.phase69FixtureId).toBeTruthy();
        expect(fixture.sourceRefs.phase70FixtureId).toBeTruthy();
        expect(fixture.sourceRefs.phase73FixtureId).toBeTruthy();
      }
    });
  });

  describe('specific fixtures by name', () => {
    it('default-disabled-smoke-plan is disabled', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'default-disabled-smoke-plan')!;
      expect(fixture).toBeDefined();
      expect(fixture.resultFixture.disabled).toBe(true);
      expect(fixture.guardContract.guardState).toBe('disabled');
      expect(fixture.resultFixture.status).toBe('disabled');
    });

    it('manual-trigger-required-plan requires manual trigger', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'manual-trigger-required-plan')!;
      expect(fixture).toBeDefined();
      expect(fixture.manualEnablePolicy.requiresManualTrigger).toBe(true);
      expect(fixture.guardContract.guardState).toBe('manual_approval_required');
    });

    it('standard-ci-smoke-skipped is skipped in standard CI', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'standard-ci-smoke-skipped')!;
      expect(fixture).toBeDefined();
      expect(fixture.resultFixture.skipped).toBe(true);
      expect(fixture.guardContract.guardState).toBe('skipped');
      expect(fixture.environmentContract.standardCiMode).toBe(true);
    });

    it('missing-manual-enable-blocked is blocked', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'missing-manual-enable-blocked')!;
      expect(fixture).toBeDefined();
      expect(fixture.guardContract.guardState).toBe('blocked');
      expect(fixture.eligibilityModel.eligibleForManualSmoke).toBe(false);
      expect(fixture.eligibilityModel.ineligibleReasonCodes).toContain('MISSING_MANUAL_ENABLE');
    });

    it('unsafe-capability-smoke-rejected has unsafe capability detected', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'unsafe-capability-smoke-rejected')!;
      expect(fixture).toBeDefined();
      expect(fixture.guardContract.unsafeCapabilityDetected).toBe(true);
      expect(fixture.guardContract.guardState).toBe('blocked');
      expect(fixture.eligibilityModel.reliabilityCompatible).toBe(false);
      expect(fixture.failureTaxonomy.failureKind).toBe('unsafe_capability_detected');
      expect(fixture.failureTaxonomy.severity).toBe('critical');
    });

    it('reliability-drift-smoke-warning links to reliability drift', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'reliability-drift-smoke-warning')!;
      expect(fixture).toBeDefined();
      expect(fixture.eligibilityModel.reliabilityCompatible).toBe(false);
      expect(fixture.failureTaxonomy.failureKind).toBe('reliability_drift_detected');
      expect(fixture.sourcePhase70FixtureSnapshot.length).toBeGreaterThan(0);
    });

    it('replay-import-linked-smoke-plan links to Phase 73', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(f => f.fixtureName === 'replay-import-linked-smoke-plan')!;
      expect(fixture).toBeDefined();
      expect(fixture.smokePlan.smokePlanKind).toBe('replay_linked');
      expect(fixture.sourcePhase73FixtureSnapshot.length).toBeGreaterThan(0);
    });

    it('read-only-provider-smoke-ready-contract is read-only check', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(
        f => f.fixtureName === 'read-only-provider-smoke-ready-contract',
      )!;
      expect(fixture).toBeDefined();
      expect(fixture.smokePlan.smokePlanKind).toBe('read_only_check');
      expect(fixture.readOnlyCheckContract.readOnly).toBe(true);
      expect(fixture.eligibilityModel.eligibleForManualSmoke).toBe(true);
    });
  });

  describe('get/list helpers', () => {
    it('listControlledLiveSmokeHarnessFixtures returns all fixtures', () => {
      const list = listControlledLiveSmokeHarnessFixtures();
      expect(list.length).toBe(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.length);
    });

    it('getControlledLiveSmokeHarnessFixture returns fixture by id', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const found = getControlledLiveSmokeHarnessFixture(fixture.fixtureId);
      expect(found).not.toBeNull();
      expect(found!.fixtureId).toBe(fixture.fixtureId);
    });

    it('getControlledLiveSmokeHarnessFixture returns null for unknown id', () => {
      const found = getControlledLiveSmokeHarnessFixture('not-a-real-id-xyz-999');
      expect(found).toBeNull();
    });
  });

  describe('builder helpers', () => {
    it('buildControlledSmokePlan returns valid plan', () => {
      const plan = buildControlledSmokePlan({
        smokePlanId: 'test-plan-id',
        smokePlanName: 'test-plan',
        smokePlanKind: 'offline_fixture_only',
        targetProviderId: 'test-provider',
        sourceCertificationFixtureName: LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[0]!,
      });
      expect(plan.disabledByDefault).toBe(true);
      expect(plan.liveNetworkDefault).toBe(false);
      expect(plan.failClosed).toBe(true);
      expect(plan.fixtureOnly).toBe(true);
      expect(plan.phase).toBe(74);
    });

    it('buildManualEnableSmokePolicy returns valid policy', () => {
      const policy = buildManualEnableSmokePolicy({ policyId: 'test-policy', policyName: 'test' });
      expect(policy.requiresManualTrigger).toBe(true);
      expect(policy.requiresExplicitFlag).toBe(true);
      expect(policy.allowsStandardCi).toBe(false);
      expect(policy.allowsScheduledRuns).toBe(false);
      expect(policy.requiresSecretsInCi).toBe(false);
      expect(policy.failClosed).toBe(true);
    });

    it('buildSmokeGuardContract returns valid guard', () => {
      const guard = buildSmokeGuardContract({
        guardId: 'test-guard',
        guardState: 'disabled',
        unsafeCapabilityDetected: false,
        reasonCodes: ['TEST'],
      });
      expect(guard.defaultDecision).toBe('skipped');
      expect(guard.liveNetworkAllowedByDefault).toBe(false);
      expect(guard.failClosed).toBe(true);
    });

    it('buildReadOnlySmokeCheckContract returns valid check', () => {
      const check = buildReadOnlySmokeCheckContract({
        checkId: 'test-check',
        checkKind: 'health_check_contract',
        expectedOutcome: 'fixture-pass',
      });
      expect(check.readOnly).toBe(true);
      expect(check.mutationAllowed).toBe(false);
      expect(check.transactionAllowed).toBe(false);
      expect(check.deterministicFixtureOnly).toBe(true);
    });

    it('buildSmokeEligibilityModel returns valid eligibility', () => {
      const eligibility = buildSmokeEligibilityModel({
        eligibilityId: 'test-elig',
        providerId: 'test-provider',
        reliabilityCompatible: true,
        certificationCompatible: true,
        replayImportCompatible: true,
        eligibleForManualSmoke: false,
        ineligibleReasonCodes: ['DEFAULT_DISABLED'],
      });
      expect(eligibility.failClosed).toBe(true);
    });

    it('buildSmokeEnvironmentContract returns valid contract', () => {
      const env = buildSmokeEnvironmentContract({
        environmentContractId: 'test-env',
        standardCiMode: true,
        manualOnlyMode: false,
      });
      expect(env.networkDisabledByDefault).toBe(true);
      expect(env.secretsRequiredInStandardCi).toBe(false);
      expect(env.providerKeyRequiredInStandardCi).toBe(false);
    });

    it('buildSmokeSecretDenialContract returns valid denial', () => {
      const denial = buildSmokeSecretDenialContract({ denialId: 'test-denial', safetyNotes: 'no secrets' });
      expect(denial.deniesSecretRead).toBe(true);
      expect(denial.deniesSecretLogging).toBe(true);
      expect(denial.deniesApiKeyRequirementInCi).toBe(true);
    });

    it('buildSmokeResultFixture returns valid result', () => {
      const result = buildSmokeResultFixture({
        resultId: 'test-result',
        resultKind: 'disabled',
        status: 'disabled',
        skipped: false,
        disabled: true,
        providerId: 'test-provider',
        checkedAt: '2026-05-13T00:00:00.000Z',
        safetySummary: 'test safety',
      });
      expect(result.liveNetworkUsed).toBe(false);
    });

    it('buildSmokeSkipFixture returns valid skip', () => {
      const skip = buildSmokeSkipFixture({
        skipId: 'test-skip',
        skipKind: 'standard_ci_skip',
        reason: 'TEST_REASON',
        standardCi: true,
        manualTriggerRequired: true,
      });
      expect(skip.failClosed).toBe(true);
    });

    it('buildSmokeFailureTaxonomy returns valid taxonomy', () => {
      const taxonomy = buildSmokeFailureTaxonomy({
        failureId: 'test-failure',
        failureKind: 'guard_fail_closed',
        severity: 'warning',
        failClosed: true,
        reasonCode: 'TEST',
        recoveryHint: 'test hint',
      });
      expect(taxonomy.failClosed).toBe(true);
    });

    it('buildSmokeCertificationReport returns valid report', () => {
      const report = buildSmokeCertificationReport({
        reportId: 'test-report',
        planSummary: 'plan',
        guardSummary: 'guard',
        eligibilitySummary: 'eligibility',
        environmentSummary: 'env',
        resultSummary: 'result',
        failureSummary: 'failure',
        safetySummary: 'safety',
      });
      expect(report.safetySummary).toBe('safety');
    });

    it('buildSmokeReadinessViewModel returns valid view model', () => {
      const vm = buildSmokeReadinessViewModel({
        viewModelId: 'test-vm',
        fixtureName: 'default-disabled-smoke-plan',
        fixtureId: 'test-id',
        providerId: 'test-provider',
        readinessStatus: 'disabled',
        disabledByDefault: true,
        guardState: 'disabled',
      });
      expect(vm.summary).toContain('default-disabled-smoke-plan');
    });

    it('buildSmokeApiContract returns valid contract', () => {
      const vm = buildSmokeReadinessViewModel({
        viewModelId: 'test-vm',
        fixtureName: 'default-disabled-smoke-plan',
        fixtureId: 'test-id',
        providerId: 'test-provider',
        readinessStatus: 'disabled',
        disabledByDefault: true,
        guardState: 'disabled',
      });
      const contract = buildSmokeApiContract({
        fixtureId: 'test-id',
        viewModel: vm,
        fixtureIds: ['test-id'],
      });
      expect(contract.list.fixtureOnly).toBe(true);
      expect(contract.get.fixtureOnly).toBe(true);
      expect(contract.list.statusCode).toBe(200);
    });
  });

  describe('selectors', () => {
    it('selectControlledLiveSmokeHarnessFixture matches by name', () => {
      const result = selectControlledLiveSmokeHarnessFixture({ fixtureName: 'default-disabled-smoke-plan' });
      expect(result.matched).toBe(true);
      expect(result.source).toBe('deterministic_fixture_only');
    });

    it('selectControlledLiveSmokeHarnessFixture returns miss for unknown', () => {
      const result = selectControlledLiveSmokeHarnessFixture({ fixtureId: 'not-a-real-id-xyz' });
      expect(result.matched).toBe(false);
    });

    it('selectControlledLiveSmokeHarnessFixture matches by id', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const result = selectControlledLiveSmokeHarnessFixture({ fixtureId: fixture.fixtureId });
      expect(result.matched).toBe(true);
      expect(result.selectedFixtureId).toBe(fixture.fixtureId);
    });
  });

  describe('normalization/serialization/equality', () => {
    it('normalizeControlledLiveSmokeHarnessFixture is stable', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const normalized = normalizeControlledLiveSmokeHarnessFixture(fixture);
      const normalizedAgain = normalizeControlledLiveSmokeHarnessFixture(normalized);
      expect(areControlledLiveSmokeHarnessFixturesEqual(normalized, normalizedAgain)).toBe(true);
    });

    it('serializeControlledLiveSmokeHarnessFixture produces stable JSON', () => {
      const fixture = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const serialized1 = serializeControlledLiveSmokeHarnessFixture(fixture);
      const serialized2 = serializeControlledLiveSmokeHarnessFixture(fixture);
      expect(serialized1).toBe(serialized2);
    });

    it('areControlledLiveSmokeHarnessFixturesEqual compares correctly', () => {
      const a = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const b = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      expect(areControlledLiveSmokeHarnessFixturesEqual(a, b)).toBe(true);
    });

    it('areControlledLiveSmokeHarnessFixturesEqual returns false for different fixtures', () => {
      const a = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!;
      const b = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[1]!;
      expect(areControlledLiveSmokeHarnessFixturesEqual(a, b)).toBe(false);
    });

    it('stableDeterministicControlledLiveSmokeHarnessChecksum is stable', () => {
      const c1 = stableDeterministicControlledLiveSmokeHarnessChecksum('test-content');
      const c2 = stableDeterministicControlledLiveSmokeHarnessChecksum('test-content');
      expect(c1).toBe(c2);
      expect(c1).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    });
  });

  describe('normalization guards', () => {
    it('isValidControlledLiveSmokeHarnessName', () => {
      expect(isValidControlledLiveSmokeHarnessName('default-disabled-smoke-plan')).toBe(true);
      expect(isValidControlledLiveSmokeHarnessName('not-a-valid-name')).toBe(false);
      expect(isValidControlledLiveSmokeHarnessName(42)).toBe(false);
    });

    it('isValidControlledLiveSmokeHarnessKind', () => {
      expect(isValidControlledLiveSmokeHarnessKind('default_disabled_smoke_plan')).toBe(true);
      expect(isValidControlledLiveSmokeHarnessKind('not_valid')).toBe(false);
    });

    it('isValidControlledLiveSmokeHarnessGeneratedAt', () => {
      expect(isValidControlledLiveSmokeHarnessGeneratedAt('2026-05-13T00:00:00.000Z')).toBe(true);
      expect(isValidControlledLiveSmokeHarnessGeneratedAt('2000-01-01T00:00:00.000Z')).toBe(false);
    });

    it('isValidControlledLiveSmokeHarnessSource', () => {
      expect(isValidControlledLiveSmokeHarnessSource('phase74_controlled_live_smoke_harness_expansion_v1')).toBe(true);
      expect(isValidControlledLiveSmokeHarnessSource('wrong')).toBe(false);
    });

    it('isValidControlledLiveSmokeHarnessSchemaVersion', () => {
      expect(isValidControlledLiveSmokeHarnessSchemaVersion('1.0.0')).toBe(true);
      expect(isValidControlledLiveSmokeHarnessSchemaVersion('2.0.0')).toBe(false);
    });
  });

  describe('validation', () => {
    it('validateControlledLiveSmokeHarnessFixture passes for all fixtures', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        const result = validateControlledLiveSmokeHarnessFixture(fixture);
        expect(result.valid, `fixture ${fixture.fixtureName} issues: ${JSON.stringify(result.issues)}`).toBe(true);
        expect(result.issues.length).toBe(0);
      }
    });

    it('validateControlledLiveSmokeHarnessSafety passes for all fixtures', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        const result = validateControlledLiveSmokeHarnessSafety(fixture);
        expect(result.safe, `fixture ${fixture.fixtureName} violations: ${JSON.stringify(result.violations)}`).toBe(true);
        expect(result.violations.length).toBe(0);
      }
    });

    it('validateControlledLiveSmokeHarnessFixture fails for wrong phase', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture as Record<string, unknown>)['phase'] = 99;
      const result = validateControlledLiveSmokeHarnessFixture(fixture as typeof fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'WRONG_PHASE')).toBe(true);
    });

    it('validateControlledLiveSmokeHarnessFixture fails for live network default true', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture.smokePlan as Record<string, unknown>)['liveNetworkDefault'] = true as unknown as false;
      const result = validateControlledLiveSmokeHarnessFixture(fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'LIVE_NETWORK_DEFAULT_TRUE')).toBe(true);
    });

    it('validateControlledLiveSmokeHarnessFixture fails for missing manual enable policy allowsStandardCi true', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture.manualEnablePolicy as Record<string, unknown>)['allowsStandardCi'] = true as unknown as false;
      const result = validateControlledLiveSmokeHarnessFixture(fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'POLICY_ALLOWS_CI')).toBe(true);
    });

    it('validateControlledLiveSmokeHarnessFixture fails for secrets required in CI', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture.environmentContract as Record<string, unknown>)['secretsRequiredInStandardCi'] = true as unknown as false;
      const result = validateControlledLiveSmokeHarnessFixture(fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'SECRETS_REQUIRED_IN_CI')).toBe(true);
    });

    it('validateControlledLiveSmokeHarnessFixture fails for missing safety summary', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture.certificationReport as Record<string, unknown>)['safetySummary'] = '';
      const result = validateControlledLiveSmokeHarnessFixture(fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'MISSING_SAFETY_SUMMARY')).toBe(true);
    });

    it('validateControlledLiveSmokeHarnessFixture fails for guard allowing live network', () => {
      const fixture = clone(CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES[0]!);
      (fixture.guardContract as Record<string, unknown>)['liveNetworkAllowedByDefault'] = true as unknown as false;
      const result = validateControlledLiveSmokeHarnessFixture(fixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'GUARD_LIVE_NETWORK_ALLOWED')).toBe(true);
    });
  });

  describe('capability flags', () => {
    it('getControlledLiveSmokeHarnessCapabilities returns correct positive flags', () => {
      const caps = getControlledLiveSmokeHarnessCapabilities();
      expect(caps.controlledLiveSmokeHarness).toBe(true);
      expect(caps.deterministicSmokeHarnessFixtures).toBe(true);
      expect(caps.disabledByDefaultSmokePlans).toBe(true);
      expect(caps.manualEnableSmokePolicies).toBe(true);
      expect(caps.smokeGuardContracts).toBe(true);
      expect(caps.readOnlySmokeCheckContracts).toBe(true);
      expect(caps.smokeEligibilityModels).toBe(true);
      expect(caps.smokeEnvironmentContracts).toBe(true);
      expect(caps.smokeSecretDenialContracts).toBe(true);
      expect(caps.smokeResultFixtures).toBe(true);
      expect(caps.smokeSkipFixtures).toBe(true);
      expect(caps.smokeFailureTaxonomy).toBe(true);
      expect(caps.smokeCertificationReports).toBe(true);
      expect(caps.smokeReadinessViewModels).toBe(true);
      expect(caps.smokeApiContracts).toBe(true);
      expect(caps.smokeSelectors).toBe(true);
    });

    it('getControlledLiveSmokeHarnessCapabilities returns correct negative flags', () => {
      const caps = getControlledLiveSmokeHarnessCapabilities();
      expect(caps.smokeLiveNetworkDefault).toBe(false);
      expect(caps.smokeRunsInStandardCi).toBe(false);
      expect(caps.smokeScheduledRuns).toBe(false);
      expect(caps.smokeRuntimeMonitoring).toBe(false);
      expect(caps.smokeRuntimeCollectors).toBe(false);
      expect(caps.smokeSecretsRequired).toBe(false);
      expect(caps.smokeProviderExpansion).toBe(false);
      expect(caps.smokeWriteMethods).toBe(false);
      expect(caps.smokeWalletLogic).toBe(false);
      expect(caps.smokePrivateKeyHandling).toBe(false);
      expect(caps.smokeSigning).toBe(false);
      expect(caps.smokeTransactionSending).toBe(false);
      expect(caps.smokeExecution).toBe(false);
      expect(caps.smokeTradingSignals).toBe(false);
      expect(caps.smokeRecommendations).toBe(false);
      expect(caps.smokeInvestmentAdvice).toBe(false);
      expect(caps.smokeRouteHandlers).toBe(false);
      expect(caps.smokeRuntimeRequests).toBe(false);
      expect(caps.smokeUiRendering).toBe(false);
      expect(caps.smokeDomAccess).toBe(false);
      expect(caps.smokePersistence).toBe(false);
      expect(caps.smokeFilesystemWrites).toBe(false);
      expect(caps.smokeBackgroundJobs).toBe(false);
      expect(caps.smokeScheduledJobs).toBe(false);
      expect(caps.smokeRealOrders).toBe(false);
      expect(caps.smokeRealFunds).toBe(false);
      expect(caps.smokeRealPnL).toBe(false);
    });
  });

  describe('dashboard capabilities propagation', () => {
    it('getDashboardUiShellCapabilities includes Phase 74 capabilities', () => {
      const caps = getDashboardUiShellCapabilities() as Record<string, unknown>;
      expect(caps['controlledLiveSmokeHarness']).toBe(true);
      expect(caps['deterministicSmokeHarnessFixtures']).toBe(true);
      expect(caps['disabledByDefaultSmokePlans']).toBe(true);
      expect(caps['smokeLiveNetworkDefault']).toBe(false);
      expect(caps['smokeRunsInStandardCi']).toBe(false);
    });
  });

  describe('read-only API capabilities propagation', () => {
    it('getLocalReadOnlyApiCapabilities includes Phase 74 capabilities', () => {
      const caps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
      expect(caps['controlledLiveSmokeHarness']).toBe(true);
      expect(caps['disabledByDefaultSmokePlans']).toBe(true);
      expect(caps['smokeLiveNetworkDefault']).toBe(false);
    });
  });

  describe('source phase linkage', () => {
    it('Phase 65 fixture snapshot names are valid', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        for (const name of fixture.sourcePhase65FixtureSnapshot) {
          expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES).toContain(name);
        }
      }
    });

    it('Phase 69 fixture snapshot names are valid', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        for (const name of fixture.sourcePhase69FixtureSnapshot) {
          expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain(name);
        }
      }
    });

    it('Phase 70 fixture snapshot names are valid', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        for (const name of fixture.sourcePhase70FixtureSnapshot) {
          expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain(name);
        }
      }
    });

    it('Phase 73 fixture snapshot names are valid', () => {
      for (const fixture of CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES) {
        for (const name of fixture.sourcePhase73FixtureSnapshot) {
          expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES).toContain(name);
        }
      }
    });
  });

  describe('determinism', () => {
    it('building the same fixture twice returns equal results', () => {
      for (const name of CONTROLLED_LIVE_SMOKE_HARNESS_NAMES) {
        const a = buildControlledLiveSmokeHarnessFixture({ fixtureName: name });
        const b = buildControlledLiveSmokeHarnessFixture({ fixtureName: name });
        expect(areControlledLiveSmokeHarnessFixturesEqual(a, b)).toBe(true);
      }
    });

    it('source fixtures are not mutated', () => {
      const original = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.map(f => serializeControlledLiveSmokeHarnessFixture(f));
      // Access and re-read
      listControlledLiveSmokeHarnessFixtures();
      const after = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.map(f => serializeControlledLiveSmokeHarnessFixture(f));
      expect(original).toEqual(after);
    });
  });

  describe('safety guards', () => {
    it('no Date.now usage in module source files', () => {
      for (const file of PHASE_74_FILES) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/Date\.now\(\)/);
      }
    });

    it('no Math.random usage in module source files', () => {
      for (const file of PHASE_74_FILES) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/Math\.random\(\)/);
      }
    });

    it('no randomUUID usage in module source files', () => {
      for (const file of PHASE_74_FILES) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/randomUUID\(\)/);
      }
    });

    it('no live fetch/HTTP calls in module source files (excluding validation pattern definitions)', () => {
      // Skip validation.ts — it defines forbidden patterns as regex strings, not actual calls
      const filesToCheck = PHASE_74_FILES.filter(f => f !== 'validation.ts');
      for (const file of filesToCheck) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/\bfetch\s*\(/);
        expect(content).not.toMatch(/\baxios\b/);
      }
    });

    it('no wallet/key/signing in module source files (excluding pattern definition files)', () => {
      // Skip validation.ts — contains forbidden pattern regex strings
      // Skip types.ts, capabilities.ts — contain negative capability flag names (e.g. smokePrivateKeyHandling)
      const filesToCheck = PHASE_74_FILES.filter(f => !['validation.ts', 'types.ts', 'capabilities.ts'].includes(f));
      for (const file of filesToCheck) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction/i);
      }
    });

    it('no filesystem writes in module source files (excluding validation pattern definitions)', () => {
      const filesToCheck = PHASE_74_FILES.filter(f => f !== 'validation.ts');
      for (const file of filesToCheck) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/fs\.writeFile|createWriteStream|localStorage|indexedDB/);
      }
    });

    it('no setInterval/setTimeout in module source files', () => {
      for (const file of PHASE_74_FILES) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        expect(content).not.toMatch(/setInterval|setTimeout/);
      }
    });

    it('no execute/buy/sell/trade in module source files', () => {
      for (const file of PHASE_74_FILES) {
        const content = readFileSync(resolve(PHASE_74_SRC, file), 'utf8');
        // Allow these words only in comments/strings describing rejection
        const lines = content.split('\n').filter(l => !l.trimStart().startsWith('//') && !l.trimStart().startsWith('*'));
        const codeOnly = lines.join('\n');
        expect(codeOnly).not.toMatch(/\b(execute|buy|sell|trade)\s*\(/i);
      }
    });
  });

  describe('Phase 75 preview (not implemented)', () => {
    it('no phase75 files exist', () => {
      expect(() =>
        readFileSync(resolve(REPO_ROOT, 'apps/dashboard/src/pre-live-safety-review-gate'), 'utf8'),
      ).toThrow();
    });
  });
});
