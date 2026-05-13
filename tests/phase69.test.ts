import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE,
  LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
  LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS,
  LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES,
  LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURE_MAP,
  listLiveSmokeSafetyCertificationFixtures,
  getLiveSmokeSafetyCertificationFixture,
  buildLiveSmokeSafetyCertificationFixture,
  buildLiveSmokeConfig,
  buildSmokeGuardPolicy,
  buildSmokePlan,
  buildReadOnlySmokeCheck,
  buildProviderSmokeEligibilityCheck,
  buildNetworkIsolationPolicy,
  buildSmokeResult,
  buildProviderCertificationGate,
  buildSafetyCertificate,
  buildOfflineCiCertificationContract,
  buildLiveSmokeCertificationReport,
  buildLiveSmokeSafetyViewModel,
  buildLiveSmokeSafetyApiContract,
  selectLiveSmokeSafetyCertificationFixture,
  validateLiveSmokeSafetyCertificationFixture,
  validateLiveSmokeSafetyCertificationSafety,
  normalizeLiveSmokeSafetyCertificationFixture,
  serializeLiveSmokeSafetyCertificationFixture,
  areLiveSmokeSafetyCertificationFixturesEqual,
  stableDeterministicLiveSmokeSafetyCertificationChecksum,
  getLiveSmokeSafetyCertificationCapabilities,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT,
  LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE as ROOT_PHASE,
  LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../apps/dashboard/src/provider-aware-replay-scenarios/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_69_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/live-smoke-safety-certification');
const PHASE_69_FILES = [
  'types.ts',
  'smoke-config.ts',
  'smoke-guard-policy.ts',
  'smoke-plans.ts',
  'read-only-checks.ts',
  'provider-eligibility.ts',
  'network-isolation.ts',
  'smoke-results.ts',
  'certification-gates.ts',
  'safety-certificates.ts',
  'offline-ci-contracts.ts',
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

describe('Phase 69 — source file existence', () => {
  for (const file of PHASE_69_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_69_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/LIVE_SMOKE_SAFETY_CERTIFICATION.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SMOKE_SAFETY_CERTIFICATION.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 69 — constants and fixture table', () => {
  it('constants and root exports align', () => {
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE).toBe(69);
    expect(ROOT_PHASE).toBe(69);
    expect(ROOT_FIXTURES).toEqual(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES);
    expect(PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('names/kinds/count/map/list/get are deterministic', () => {
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toHaveLength(8);
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS).toHaveLength(8);
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES).toHaveLength(8);
    expect(listLiveSmokeSafetyCertificationFixtures()).toEqual(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES);

    for (const fixture of LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getLiveSmokeSafetyCertificationFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getLiveSmokeSafetyCertificationFixture('missing')).toBeNull();
  });
});

describe('Phase 69 — fixture structure and linkage', () => {
  it('fixtures include required surfaces and source linkage to phases 65/66/67/68', () => {
    for (const fixture of LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(fixture.phase).toBe(69);
      expect(fixture.smokeConfig.liveChecksEnabled).toBe(false);
      expect(fixture.smokeGuardPolicy.skipByDefault).toBe(true);
      expect(fixture.networkIsolationPolicy.standardCiNetworkAccess).toBe(false);
      expect(fixture.networkIsolationPolicy.manualSmokeNetworkAccessAllowed).toBe(false);
      expect(fixture.networkIsolationPolicy.apiKeyRequired).toBe(false);
      expect(fixture.offlineCiContract.liveChecksRun).toBe(false);
      expect(fixture.offlineCiContract.networkAccess).toBe(false);
      expect(fixture.sourcePhase65FixtureSnapshot).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES);
      expect(fixture.sourcePhase66FixtureSnapshot).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES);
      expect(fixture.sourcePhase67FixtureSnapshot).toEqual(CROSS_PROVIDER_DATA_QUALITY_NAMES);
      expect(fixture.sourcePhase68FixtureSnapshot).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES);
    }
  });

  it('required fixture names are present', () => {
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('standard-ci-smoke-skipped');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('manual-smoke-disabled-by-default');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('read-only-provider-certified-offline');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('unsafe-capability-blocked');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('missing-provider-config-blocked');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('stale-provider-certification-warning');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('cross-provider-quality-gate-blocked');
    expect(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES).toContain('provider-aware-replay-certification-ready');
  });
});

describe('Phase 69 — helper builders and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildLiveSmokeSafetyCertificationFixture({ fixtureName: 'provider-aware-replay-certification-ready' });
    const b = buildLiveSmokeSafetyCertificationFixture({ fixtureName: 'provider-aware-replay-certification-ready' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const smokeConfig = buildLiveSmokeConfig({
      fixtureId: 'phase69-sample',
      mode: 'manual_smoke_disabled',
      standardCi: false,
      requiresManualOptIn: true,
    });
    const policy = buildSmokeGuardPolicy({ fixtureId: 'phase69-sample' });
    const plan = buildSmokePlan({
      fixtureId: 'phase69-sample',
      sourceProviderId: 'provider-a',
      sourcePhase: 67,
      checkKinds: ['health_check_contract', 'safety_capability_check'],
      expectedOutcome: 'manual_required',
      safetyNotes: ['manual-only'],
    });
    const check = buildReadOnlySmokeCheck({
      fixtureId: 'phase69-sample',
      checkKind: 'safety_capability_check',
      providerId: 'provider-a',
      passed: false,
      reasonCode: 'MANUAL_REQUIRED',
      expectedCapability: 'read_only_fixture_smoke_contract',
      observedCapability: 'read_only_fixture_smoke_contract',
      sourceRefs: ['s-1'],
    });
    const eligibility = buildProviderSmokeEligibilityCheck({
      fixtureId: 'phase69-sample',
      providerId: 'provider-a',
      readOnlyProvider: true,
      unsafeCapabilitiesDetected: false,
      hasProviderConfig: true,
      crossProviderQualityReady: true,
      replayCertificationReady: true,
      reasonCodes: ['OK'],
    });
    const isolation = buildNetworkIsolationPolicy({
      fixtureId: 'phase69-sample',
      timeoutPolicy: 'metadata-only',
      retryPolicyMetadataOnly: 'retry-meta-only',
    });
    const smokeResult = buildSmokeResult({
      fixtureId: 'phase69-sample',
      planId: plan.smokePlanId,
      status: 'manual_required',
      reasonCodes: ['MANUAL_REQUIRED'],
      evidenceRefs: ['e-1'],
    });
    const gate = buildProviderCertificationGate({
      fixtureId: 'phase69-sample',
      providerId: 'provider-a',
      gateStatus: 'manual_review_required',
      reasonCodes: ['MANUAL_REQUIRED'],
    });
    const cert = buildSafetyCertificate({
      fixtureId: 'phase69-sample',
      providerId: 'provider-a',
      certifiedReadOnly: true,
      certifiedOfflineCi: true,
      certifiedNoSecrets: true,
      certifiedNoExecution: true,
      certifiedNoAdvisory: true,
      certificationStatus: 'manual_review_required',
      failureReasons: [],
    });
    const contract = buildOfflineCiCertificationContract({
      fixtureId: 'phase69-sample',
      validationCommands: ['pnpm test'],
    });
    const report = buildLiveSmokeCertificationReport({
      fixtureId: 'phase69-sample',
      smokeConfig,
      smokeGuardPolicy: policy,
      smokePlan: plan,
      smokeResult,
      safetyCertificate: cert,
      offlineCiContract: contract,
    });
    const viewModel = buildLiveSmokeSafetyViewModel({
      fixtureId: 'phase69-sample',
      fixtureName: 'manual-smoke-disabled-by-default',
      smokeResult,
      certificationGate: gate,
      safetyCertificate: cert,
    });
    const apiContract = buildLiveSmokeSafetyApiContract({
      fixtureId: 'phase69-sample',
      viewModel,
      fixtureIds: ['phase69-sample'],
    });

    expect(smokeConfig.liveChecksEnabled).toBe(false);
    expect(policy.failClosed).toBe(true);
    expect(plan.disabledByDefault).toBe(true);
    expect(check.writeMethodDetected).toBe(false);
    expect(eligibility.eligible).toBe(true);
    expect(isolation.standardCiNetworkAccess).toBe(false);
    expect(smokeResult.status).toBe('manual_required');
    expect(gate.gateStatus).toBe('manual_review_required');
    expect(cert.certificationStatus).toBe('manual_review_required');
    expect(contract.liveChecksRun).toBe(false);
    expect(report.safetySummary.toLowerCase()).toContain('read-only');
    expect(viewModel.summary).toContain('manual_review_required');
    expect(apiContract.list.contractKind).toBe('list');
  });
});

describe('Phase 69 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic matches and misses', () => {
    const fixture = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES[0]!;
    const found = selectLiveSmokeSafetyCertificationFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectLiveSmokeSafetyCertificationFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      readOnlyChecks: [...base.readOnlyChecks].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeLiveSmokeSafetyCertificationFixture(scrambled)).toEqual(
      normalizeLiveSmokeSafetyCertificationFixture(base),
    );
    expect(serializeLiveSmokeSafetyCertificationFixture(scrambled)).toBe(
      serializeLiveSmokeSafetyCertificationFixture(base),
    );
    expect(areLiveSmokeSafetyCertificationFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicLiveSmokeSafetyCertificationChecksum('phase69-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicLiveSmokeSafetyCertificationChecksum('phase69-check')).toBe(checksum);
  });
});

describe('Phase 69 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES) {
      expect(validateLiveSmokeSafetyCertificationFixture(fixture).valid).toBe(true);
      expect(validateLiveSmokeSafetyCertificationSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe network/live/api-key/execution drift', () => {
    const fixture = clone(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      smokeConfig: { ...fixture.smokeConfig, liveChecksEnabled: true as never },
      networkIsolationPolicy: {
        ...fixture.networkIsolationPolicy,
        standardCiNetworkAccess: true as never,
        apiKeyRequired: true as never,
      },
      safetyCertificate: {
        ...fixture.safetyCertificate,
        certifiedNoExecution: false,
      },
      offlineCiContract: {
        ...fixture.offlineCiContract,
        networkAccess: true as never,
        liveChecksRun: true as never,
      },
      capabilityFlags: {
        ...fixture.capabilityFlags,
        liveSmokeExecution: true as never,
      },
    };

    const validation = validateLiveSmokeSafetyCertificationFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'LIVE_CHECKS_ENABLED_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'STANDARD_CI_NETWORK_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'API_KEY_REQUIRED_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'CERTIFICATE_NO_EXECUTION_REQUIRED')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'OFFLINE_CONTRACT_LIVE_CHECKS_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects advisory text and snapshot mutation', () => {
    const fixture = clone(LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      smokePlan: {
        ...fixture.smokePlan,
        safetyNotes: ['buy signal for profit via wallet and fetch( endpoint https://unsafe.example'],
      },
      sourcePhase68FixtureSnapshot: ['mutated'] as never,
    };

    const validation = validateLiveSmokeSafetyCertificationFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_NETWORK_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MUTATED_PHASE68_SOURCE_SNAPSHOT')).toBe(true);
  });
});

describe('Phase 69 — scenario expectations and capabilities', () => {
  it('scenario fixtures include expected statuses', () => {
    const skipped = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(f => f.fixtureName === 'standard-ci-smoke-skipped');
    const manual = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'manual-smoke-disabled-by-default',
    );
    const certified = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'read-only-provider-certified-offline',
    );
    const unsafe = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(f => f.fixtureName === 'unsafe-capability-blocked');
    const missingConfig = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'missing-provider-config-blocked',
    );
    const stale = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'stale-provider-certification-warning',
    );
    const qualityBlocked = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'cross-provider-quality-gate-blocked',
    );
    const replayReady = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(
      f => f.fixtureName === 'provider-aware-replay-certification-ready',
    );

    expect(skipped?.smokeResult.status).toBe('skipped');
    expect(manual?.smokeResult.status).toBe('manual_required');
    expect(certified?.smokeResult.status).toBe('certified_offline');
    expect(unsafe?.smokeResult.status).toBe('blocked');
    expect(missingConfig?.smokeResult.status).toBe('blocked');
    expect(stale?.smokeResult.status).toBe('manual_required');
    expect(qualityBlocked?.smokeResult.status).toBe('blocked');
    expect(replayReady?.smokeResult.status).toBe('certified_offline');
  });

  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getLiveSmokeSafetyCertificationCapabilities();
    expect(caps.liveSmokeSafetyCertification).toBe(true);
    expect(caps.offlineCiCertificationContracts).toBe(true);
    expect(caps.liveSmokeExecution).toBe(false);
    expect(caps.liveSmokeRecommendations).toBe(false);
    expect(caps.liveSmokeApiKeyRequired).toBe(false);
  });

  it('dashboard and read-only API capabilities include phase69 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.liveSmokeSafetyCertification).toBe(true);
    expect(dashboard.liveSmokeExecution).toBe(false);
    expect(api.liveSmokeSafetyCertification).toBe(true);
    expect(api.liveSmokeExecution).toBe(false);
  });
});

describe('Phase 69 — safety scans and docs', () => {
  it('phase69 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];

    for (const file of PHASE_69_FILES) {
      const content = readFileSync(resolve(PHASE_69_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 70 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/LIVE_SMOKE_SAFETY_CERTIFICATION.md'), 'utf-8');
    expect(doc).toContain('Phase 70');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
