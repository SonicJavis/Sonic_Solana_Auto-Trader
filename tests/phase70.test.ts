import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURE_MAP,
  listProviderReliabilityDriftAuditFixtures,
  getProviderReliabilityDriftAuditFixture,
  buildProviderReliabilityDriftAuditFixture,
  buildProviderTelemetrySample,
  buildProviderFreshnessModel,
  buildProviderReliabilityScore,
  buildProviderDriftAudit,
  buildProviderSchemaDrift,
  buildProviderConfidenceTrend,
  buildProviderInstabilityEvent,
  buildProviderStaleDataAudit,
  buildProviderConformanceDrift,
  buildProviderCertificationTelemetryLinkage,
  buildProviderReplayDriftLinkage,
  buildProviderReliabilityReport,
  buildProviderReliabilityViewModel,
  buildProviderReliabilityApiContract,
  selectProviderReliabilityDriftAuditFixture,
  validateProviderReliabilityDriftAuditFixture,
  validateProviderReliabilityDriftAuditSafety,
  normalizeProviderReliabilityDriftAuditFixture,
  serializeProviderReliabilityDriftAuditFixture,
  areProviderReliabilityDriftAuditFixturesEqual,
  stableDeterministicProviderReliabilityDriftAuditChecksum,
  getProviderReliabilityDriftAuditCapabilities,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE as ROOT_PHASE,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../apps/dashboard/src/provider-aware-replay-scenarios/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../apps/dashboard/src/live-smoke-safety-certification/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_70_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/provider-reliability-drift-audit');
const PHASE_70_FILES = [
  'types.ts',
  'telemetry-models.ts',
  'freshness-models.ts',
  'reliability-scoring.ts',
  'drift-detection.ts',
  'schema-drift.ts',
  'confidence-trends.ts',
  'instability-events.ts',
  'stale-data-audits.ts',
  'conformance-drift.ts',
  'certification-linkage.ts',
  'replay-drift-linkage.ts',
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

describe('Phase 70 — source file existence', () => {
  for (const file of PHASE_70_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_70_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/PROVIDER_RELIABILITY_DRIFT_AUDIT.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PROVIDER_RELIABILITY_DRIFT_AUDIT.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 70 — constants and fixture table', () => {
  it('constants and root exports align', () => {
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE).toBe(70);
    expect(ROOT_PHASE).toBe(70);
    expect(ROOT_FIXTURES).toEqual(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES);
    expect(PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
  });

  it('names/kinds/count/map/list/get are deterministic', () => {
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toHaveLength(8);
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS).toHaveLength(8);
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES).toHaveLength(8);
    expect(listProviderReliabilityDriftAuditFixtures()).toEqual(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES);

    for (const fixture of PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES) {
      expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getProviderReliabilityDriftAuditFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getProviderReliabilityDriftAuditFixture('missing')).toBeNull();
  });
});

describe('Phase 70 — fixture structure and linkage', () => {
  it('fixtures include required deterministic surfaces and practical source linkage', () => {
    for (const fixture of PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES) {
      expect(fixture.phase).toBe(70);
      expect(fixture.telemetrySample.liveData).toBe(false);
      expect(fixture.telemetrySample.fixtureOnly).toBe(true);
      expect(fixture.sourcePhase65FixtureSnapshot).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES);
      expect(fixture.sourcePhase66FixtureSnapshot).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES);
      expect(fixture.sourcePhase67FixtureSnapshot).toEqual(CROSS_PROVIDER_DATA_QUALITY_NAMES);
      expect(fixture.sourcePhase68FixtureSnapshot).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES);
      expect(fixture.sourcePhase69FixtureSnapshot).toEqual(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES);
      expect(fixture.reliabilityReport.safetySummary.toLowerCase()).toContain('non-advisory');
    }
  });

  it('required fixture names are present', () => {
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('healthy-provider-stable-telemetry');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('stale-provider-drift-warning');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('schema-drift-fail-closed');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('conformance-regression-blocked');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('intermittent-provider-instability');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('cross-provider-mismatch-telemetry');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('certification-drift-blocked');
    expect(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES).toContain('replay-scenario-drift-linked');
  });
});

describe('Phase 70 — helper builders and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildProviderReliabilityDriftAuditFixture({ fixtureName: 'replay-scenario-drift-linked' });
    const b = buildProviderReliabilityDriftAuditFixture({ fixtureName: 'replay-scenario-drift-linked' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const telemetry = buildProviderTelemetrySample({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      providerName: 'Provider X',
      sourcePhase: 69,
      sampledAt: '2026-05-13T00:40:00.000Z',
      sampleKind: 'drift_observation',
      observedStatus: 'degraded',
      latencyBucket: '250ms_to_750ms',
      freshnessBucket: 'aging',
      schemaVersion: '1.0.0',
    });
    const freshness = buildProviderFreshnessModel({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      stale: true,
      staleReasonCode: 'STALE_SLOT_LAG_WARNING',
      observedSlotLagBucket: 'slot_lag_25_64',
      observedAgeBucket: 'age_8_20s',
      deterministicWindow: 'window_slot_16_or_age_10s',
      sourceRefs: ['s1'],
    });
    const score = buildProviderReliabilityScore({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      score: 62,
      scoreBand: 'medium',
      confidenceLabel: 'medium',
      reasonCodes: ['REVIEW_REQUIRED'],
      evidenceRefs: ['s1'],
      failClosed: false,
    });
    const driftAudit = buildProviderDriftAudit({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      driftKind: 'replay_drift',
      driftSeverity: 'moderate',
      expectedShapeId: 'shape-a',
      observedShapeId: 'shape-b',
      mismatchFields: ['field.a'],
      conformanceStatus: 'warning',
      failClosed: false,
    });
    const schemaDrift = buildProviderSchemaDrift({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      expectedSchemaVersion: '1.0.0',
      observedSchemaVersion: '1.1.0',
      missingFields: ['m1'],
      extraFields: ['e1'],
      incompatibleFields: ['i1'],
      safeToUse: false,
    });
    const trend = buildProviderConfidenceTrend({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      direction: 'degrading',
      confidenceLabel: 'medium',
      sampledTelemetryIds: [telemetry.telemetryId],
      sourceRefs: ['s1'],
    });
    const event = buildProviderInstabilityEvent({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      eventKind: 'stale_provider',
      severity: 'moderate',
      observedAt: '2026-05-13T00:41:00.000Z',
      sourceTelemetryIds: [telemetry.telemetryId],
      reasonCode: 'STALE_SLOT_LAG_WARNING',
      safetyNotes: ['model-only'],
    });
    const staleAudit = buildProviderStaleDataAudit({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      stale: true,
      staleReasonCode: 'STALE_SLOT_LAG_WARNING',
      observedAgeBucket: 'age_8_20s',
      sourceFreshnessId: freshness.freshnessId,
      failClosed: true,
    });
    const conformance = buildProviderConformanceDrift({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      expectedContractId: 'contract-a',
      observedContractId: 'contract-b',
      driftSeverity: 'high',
      failClosed: true,
      reasonCodes: ['CONFORMANCE_REGRESSION_BLOCKED'],
    });
    const cert = buildProviderCertificationTelemetryLinkage({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      sourceCertificateId: 'cert-a',
      certificationStatus: 'manual_review_required',
      telemetryCompatible: true,
      driftCompatible: false,
      failClosed: true,
    });
    const replay = buildProviderReplayDriftLinkage({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      replayScenarioName: 'stale-provider-replay-scenario',
      parityStatus: 'failed',
      driftCompatible: false,
      sourceRefs: ['s1'],
    });
    const report = buildProviderReliabilityReport({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      telemetrySample: telemetry,
      freshnessModel: freshness,
      reliabilityScore: score,
      driftAudit,
      certificationLinkage: cert,
    });
    const viewModel = buildProviderReliabilityViewModel({
      fixtureId: 'phase70-sample',
      fixtureName: 'stale-provider-drift-warning',
      providerId: 'provider-x',
      reliabilityScore: score,
      driftAudit,
      staleDataAudit: staleAudit,
    });
    const contract = buildProviderReliabilityApiContract({
      fixtureId: 'phase70-sample',
      providerId: 'provider-x',
      viewModel,
      fixtureIds: ['phase70-sample'],
    });

    expect(telemetry.liveData).toBe(false);
    expect(freshness.stale).toBe(true);
    expect(score.score).toBe(62);
    expect(driftAudit.driftKind).toBe('replay_drift');
    expect(schemaDrift.safeToUse).toBe(false);
    expect(trend.direction).toBe('degrading');
    expect(event.eventKind).toBe('stale_provider');
    expect(staleAudit.failClosed).toBe(true);
    expect(conformance.failClosed).toBe(true);
    expect(cert.failClosed).toBe(true);
    expect(replay.parityStatus).toBe('failed');
    expect(report.reportId).toContain('phase70-sample');
    expect(contract.list.contractKind).toBe('list');
  });
});

describe('Phase 70 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic matches and misses', () => {
    const fixture = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES[0]!;
    const found = selectProviderReliabilityDriftAuditFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectProviderReliabilityDriftAuditFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      instabilityEvents: [...base.instabilityEvents].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeProviderReliabilityDriftAuditFixture(scrambled)).toEqual(
      normalizeProviderReliabilityDriftAuditFixture(base),
    );
    expect(serializeProviderReliabilityDriftAuditFixture(scrambled)).toBe(
      serializeProviderReliabilityDriftAuditFixture(base),
    );
    expect(areProviderReliabilityDriftAuditFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicProviderReliabilityDriftAuditChecksum('phase70-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicProviderReliabilityDriftAuditChecksum('phase70-check')).toBe(checksum);
  });
});

describe('Phase 70 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES) {
      expect(validateProviderReliabilityDriftAuditFixture(fixture).valid).toBe(true);
      expect(validateProviderReliabilityDriftAuditSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe live/runtime/capability drift', () => {
    const fixture = clone(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      telemetrySample: { ...fixture.telemetrySample, liveData: true as never, sampledAt: 'dynamic-now' },
      schemaDrift: { ...fixture.schemaDrift, safeToUse: true },
      driftAudit: { ...fixture.driftAudit, driftSeverity: 'critical' },
      certificationLinkage: { ...fixture.certificationLinkage, failClosed: false },
      capabilityFlags: { ...fixture.capabilityFlags, providerReliabilityExecution: true as never },
    };

    const validation = validateProviderReliabilityDriftAuditFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'DYNAMIC_TELEMETRY_TIMESTAMP_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'LIVE_TELEMETRY_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'CRITICAL_DRIFT_CANNOT_BE_SAFE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects advisory/wallet/network text and source snapshot mutation', () => {
    const fixture = clone(PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      reliabilityReport: {
        ...fixture.reliabilityReport,
        safetySummary: 'buy signal via wallet and fetch( endpoint https://unsafe.example with profit claims',
      },
      sourcePhase69FixtureSnapshot: ['mutated'] as never,
    };

    const validation = validateProviderReliabilityDriftAuditFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_NETWORK_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MUTATED_PHASE69_SOURCE_SNAPSHOT')).toBe(true);
  });
});

describe('Phase 70 — fixture-specific expectations', () => {
  it('critical drift fixtures are fail-closed', () => {
    const schema = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(f => f.fixtureName === 'schema-drift-fail-closed');
    const cert = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(f => f.fixtureName === 'certification-drift-blocked');

    expect(schema?.driftAudit.failClosed).toBe(true);
    expect(schema?.schemaDrift.safeToUse).toBe(false);
    expect(cert?.certificationLinkage.failClosed).toBe(true);
  });

  it('replay linkage and stale audit fixtures are present', () => {
    const stale = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(f => f.fixtureName === 'stale-provider-drift-warning');
    const replay = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(f => f.fixtureName === 'replay-scenario-drift-linked');

    expect(stale?.staleDataAudit.stale).toBe(true);
    expect(replay?.replayDriftLinkage.replayScenarioName).toBe('fallback-reconciled-provider-scenario');
  });
});

describe('Phase 70 — capabilities and propagation', () => {
  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getProviderReliabilityDriftAuditCapabilities();
    expect(caps.providerReliabilityDriftAudit).toBe(true);
    expect(caps.providerReliabilityDriftDetection).toBe(true);
    expect(caps.providerReliabilityExecution).toBe(false);
    expect(caps.providerReliabilityRecommendations).toBe(false);
    expect(caps.providerReliabilityApiKeyRequired).toBe(false);
  });

  it('dashboard and read-only API capabilities include phase70 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.providerReliabilityDriftAudit).toBe(true);
    expect(dashboard.providerReliabilityExecution).toBe(false);
    expect(api.providerReliabilityDriftAudit).toBe(true);
    expect(api.providerReliabilityExecution).toBe(false);
  });
});

describe('Phase 70 — safety scan assertions', () => {
  it('phase70 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];

    for (const file of PHASE_70_FILES) {
      const content = readFileSync(resolve(PHASE_70_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 71 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/PROVIDER_RELIABILITY_DRIFT_AUDIT.md'), 'utf-8');
    expect(doc).toContain('Phase 71');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
