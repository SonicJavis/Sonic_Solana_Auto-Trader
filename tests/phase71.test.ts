import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURE_MAP,
  listHistoricalSnapshotIngestionContractFixtures,
  getHistoricalSnapshotIngestionContractFixture,
  buildHistoricalSnapshotIngestionContractFixture,
  buildSnapshotManifest,
  buildSnapshotSourceMetadata,
  buildSnapshotSchemaContract,
  buildSnapshotProvenanceContract,
  buildSnapshotNormalizationContract,
  buildSnapshotValidationContract,
  buildSnapshotFreshnessContract,
  buildSnapshotIntegrityContract,
  buildSnapshotImportPlan,
  buildSnapshotRejectionContract,
  buildSnapshotReplayLinkage,
  buildSnapshotReliabilityLinkage,
  buildHistoricalSnapshotAuditReport,
  buildHistoricalSnapshotViewModel,
  buildHistoricalSnapshotApiContract,
  selectHistoricalSnapshotIngestionContractFixture,
  validateHistoricalSnapshotIngestionContractFixture,
  validateHistoricalSnapshotIngestionContractSafety,
  normalizeHistoricalSnapshotIngestionContractFixture,
  serializeHistoricalSnapshotIngestionContractFixture,
  areHistoricalSnapshotIngestionContractFixturesEqual,
  stableDeterministicHistoricalSnapshotIngestionContractChecksum,
  getHistoricalSnapshotIngestionContractCapabilities,
  PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE as ROOT_PHASE,
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../apps/dashboard/src/provider-aware-replay-scenarios/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../apps/dashboard/src/live-smoke-safety-certification/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../apps/dashboard/src/provider-reliability-drift-audit/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_71_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/historical-snapshot-ingestion-contracts');
const PHASE_71_FILES = [
  'types.ts',
  'snapshot-manifests.ts',
  'source-metadata.ts',
  'schema-contracts.ts',
  'provenance-contracts.ts',
  'normalization-contracts.ts',
  'validation-contracts.ts',
  'freshness-contracts.ts',
  'integrity-contracts.ts',
  'import-plans.ts',
  'rejection-contracts.ts',
  'replay-linkage.ts',
  'reliability-linkage.ts',
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

describe('Phase 71 — source file existence', () => {
  for (const file of PHASE_71_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_71_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 71 — constants and fixture table', () => {
  it('constants and root exports align', () => {
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE).toBe(71);
    expect(ROOT_PHASE).toBe(71);
    expect(ROOT_FIXTURES).toEqual(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES);
    expect(PHASE_71_HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
  });

  it('names/kinds/count/map/list/get are deterministic', () => {
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toHaveLength(8);
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_KINDS).toHaveLength(8);
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES).toHaveLength(8);
    expect(listHistoricalSnapshotIngestionContractFixtures()).toEqual(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES);

    for (const fixture of HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES) {
      expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getHistoricalSnapshotIngestionContractFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getHistoricalSnapshotIngestionContractFixture('missing')).toBeNull();
  });
});

describe('Phase 71 — fixture structure and linkage', () => {
  it('fixtures include required deterministic surfaces and practical source linkage', () => {
    for (const fixture of HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES) {
      expect(fixture.phase).toBe(71);
      expect(fixture.manifest.liveData).toBe(false);
      expect(fixture.importPlan.requiresNetwork).toBe(false);
      expect(fixture.importPlan.requiresFilesystem).toBe(false);
      expect(fixture.importPlan.requiresSecrets).toBe(false);
      expect(fixture.sourcePhase65FixtureSnapshot).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES);
      expect(fixture.sourcePhase66FixtureSnapshot).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES);
      expect(fixture.sourcePhase67FixtureSnapshot).toEqual(CROSS_PROVIDER_DATA_QUALITY_NAMES);
      expect(fixture.sourcePhase68FixtureSnapshot).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES);
      expect(fixture.sourcePhase69FixtureSnapshot).toEqual(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES);
      expect(fixture.sourcePhase70FixtureSnapshot).toEqual(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES);
      expect(fixture.auditReport.safetySummary.toLowerCase()).toContain('non-advisory');
    }
  });

  it('required fixture names are present', () => {
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('healthy-provider-snapshot-contract');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('stale-provider-snapshot-warning');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('schema-drift-snapshot-rejected');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('missing-critical-field-snapshot-blocked');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('partial-provider-snapshot-quarantined');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('replay-linked-historical-snapshot');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('reliability-linked-drift-snapshot');
    expect(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES).toContain('cross-provider-quality-snapshot-conflict');
  });
});

describe('Phase 71 — helper builders and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildHistoricalSnapshotIngestionContractFixture({ fixtureName: 'replay-linked-historical-snapshot' });
    const b = buildHistoricalSnapshotIngestionContractFixture({ fixtureName: 'replay-linked-historical-snapshot' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const manifest = buildSnapshotManifest({
      fixtureId: 'phase71-sample',
      snapshotName: 'sample',
      snapshotKind: 'full_snapshot',
      capturedAt: '2026-05-13T00:40:00.000Z',
      sourceProviderId: 'provider-x',
      sourceReliabilityFixtureName: 'healthy-provider-stable-telemetry',
      schemaVersion: '1.0.0',
      phase: 71,
    });
    const sourceMetadata = buildSnapshotSourceMetadata({
      fixtureId: 'phase71-sample',
      sourceKind: 'provider_fixture',
      providerId: 'provider-x',
      providerName: 'Provider X',
      reliabilityBand: 'high',
      freshnessBand: 'fresh',
      observationWindow: 'window_slot_8_or_age_4s',
      sourceRefs: ['a'],
    });
    const schema = buildSnapshotSchemaContract({
      fixtureId: 'phase71-sample',
      expectedSchemaVersion: '1.0.0',
      compatibilityLevel: 'strict',
      requiredFields: ['snapshotId'],
      optionalFields: ['notes'],
      criticalFields: ['capturedAt'],
      failClosedOnCriticalDrift: true,
    });
    const provenance = buildSnapshotProvenanceContract({
      fixtureId: 'phase71-sample',
      sourcePhaseRefs: [65, 66, 67, 68, 69, 70],
      sourceFixtureRefs: ['a'],
      providerReliabilityRefs: ['b'],
      replayScenarioRefs: ['c'],
      dataQualityRefs: ['d'],
      lineageSummary: 'lineage',
    });
    const normalizationContract = buildSnapshotNormalizationContract({
      fixtureId: 'phase71-sample',
      normalizationMode: 'canonical_json',
      stableOrdering: true,
      deterministicChecksum: true,
      localeIndependent: true,
      mutationFree: true,
    });
    const validationContract = buildSnapshotValidationContract({
      fixtureId: 'phase71-sample',
      rules: ['required'],
      rejectionReasons: ['missing'],
      criticalFailureReasons: ['critical'],
      warningReasons: ['warn'],
      failClosed: true,
    });
    const freshness = buildSnapshotFreshnessContract({
      fixtureId: 'phase71-sample',
      snapshotAgeBucket: 'aging',
      stale: false,
      staleReasonCode: 'NONE',
      freshnessWindow: 'window',
      sourceTelemetryRefs: ['t1'],
    });
    const integrity = buildSnapshotIntegrityContract({
      fixtureId: 'phase71-sample',
      checksum: 'fnv1a32:11111111',
      manifestHash: 'fnv1a32:22222222',
      sourceHash: 'fnv1a32:33333333',
    });
    const plan = buildSnapshotImportPlan({
      fixtureId: 'phase71-sample',
      plannedSteps: ['validate'],
      expectedOutcome: 'ok',
    });
    const rejection = buildSnapshotRejectionContract({
      fixtureId: 'phase71-sample',
      rejectionKind: 'unsafe_state',
      severity: 'warning',
      reasonCode: 'NONE',
      failClosed: false,
      safetyNotes: ['safe'],
    });
    const replayLinkage = buildSnapshotReplayLinkage({
      fixtureId: 'phase71-sample',
      replayScenarioRef: 'high-confidence-provider-agreement-scenario',
      parityStatus: 'passed',
      failClosed: false,
      sourceRefs: ['r'],
    });
    const reliabilityLinkage = buildSnapshotReliabilityLinkage({
      fixtureId: 'phase71-sample',
      providerReliabilityRef: 'healthy-provider-stable-telemetry',
      driftSeverity: 'low',
      driftCompatible: true,
      failClosed: false,
      sourceRefs: ['s'],
    });
    const report = buildHistoricalSnapshotAuditReport({
      fixtureId: 'phase71-sample',
      manifest,
      schemaContract: schema,
      provenanceContract: provenance,
      freshnessContract: freshness,
      integrityContract: integrity,
      validationContract,
      replayLinkage,
      reliabilityLinkage,
    });
    const viewModel = buildHistoricalSnapshotViewModel({
      fixtureId: 'phase71-sample',
      fixtureName: 'healthy-provider-snapshot-contract',
      manifest,
      freshnessContract: freshness,
      rejectionContract: rejection,
    });
    const contract = buildHistoricalSnapshotApiContract({
      fixtureId: 'phase71-sample',
      viewModel,
      fixtureIds: ['phase71-sample'],
    });

    expect(sourceMetadata.providerName).toBe('Provider X');
    expect(schema.failClosedOnCriticalDrift).toBe(true);
    expect(provenance.sourcePhaseRefs).toEqual([65, 66, 67, 68, 69, 70]);
    expect(normalizationContract.localeIndependent).toBe(true);
    expect(validationContract.failClosed).toBe(true);
    expect(freshness.stale).toBe(false);
    expect(integrity.deterministic).toBe(true);
    expect(plan.requiresNetwork).toBe(false);
    expect(rejection.rejectionKind).toBe('unsafe_state');
    expect(replayLinkage.parityStatus).toBe('passed');
    expect(reliabilityLinkage.driftSeverity).toBe('low');
    expect(report.reportId).toContain('phase71-sample');
    expect(contract.list.contractKind).toBe('list');
  });
});

describe('Phase 71 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic matches and misses', () => {
    const fixture = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES[0]!;
    const found = selectHistoricalSnapshotIngestionContractFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectHistoricalSnapshotIngestionContractFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      validationContract: {
        ...base.validationContract,
        rules: [...base.validationContract.rules].reverse(),
      },
    };

    expect(normalizeHistoricalSnapshotIngestionContractFixture(scrambled)).toEqual(
      normalizeHistoricalSnapshotIngestionContractFixture(base),
    );
    expect(serializeHistoricalSnapshotIngestionContractFixture(scrambled)).toBe(
      serializeHistoricalSnapshotIngestionContractFixture(base),
    );
    expect(areHistoricalSnapshotIngestionContractFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicHistoricalSnapshotIngestionContractChecksum('phase71-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicHistoricalSnapshotIngestionContractChecksum('phase71-check')).toBe(checksum);
  });
});

describe('Phase 71 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES) {
      expect(validateHistoricalSnapshotIngestionContractFixture(fixture).valid).toBe(true);
      expect(validateHistoricalSnapshotIngestionContractSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe live/runtime/capability drift', () => {
    const fixture = clone(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      manifest: { ...fixture.manifest, liveData: true as never, capturedAt: 'dynamic-now' },
      importPlan: { ...fixture.importPlan, requiresNetwork: true as never },
      capabilityFlags: { ...fixture.capabilityFlags, historicalSnapshotExecution: true as never },
    };

    const validation = validateHistoricalSnapshotIngestionContractFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'DYNAMIC_CAPTURED_AT_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'LIVE_DATA_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_IMPORT_PLAN_REQUIREMENTS')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects advisory/wallet/network text and source snapshot mutation', () => {
    const fixture = clone(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      auditReport: {
        ...fixture.auditReport,
        safetySummary: 'buy signal via wallet and fetch( endpoint https://unsafe.example with profit claims',
      },
      sourcePhase70FixtureSnapshot: ['mutated'] as never,
    };

    const validation = validateHistoricalSnapshotIngestionContractFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_NETWORK_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MUTATED_PHASE70_SOURCE_SNAPSHOT')).toBe(true);
  });
});

describe('Phase 71 — fixture-specific expectations', () => {
  it('critical drift and missing critical field fixtures are fail-closed', () => {
    const schema = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'schema-drift-snapshot-rejected',
    );
    const missing = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'missing-critical-field-snapshot-blocked',
    );
    const partial = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'partial-provider-snapshot-quarantined',
    );

    expect(schema?.schemaContract.failClosedOnCriticalDrift).toBe(true);
    expect(schema?.rejectionContract.failClosed).toBe(true);
    expect(missing?.rejectionContract.rejectionKind).toBe('missing_critical_field');
    expect(partial?.rejectionContract.failClosed).toBe(true);
  });

  it('replay and reliability link fixtures are present', () => {
    const replay = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'replay-linked-historical-snapshot',
    );
    const reliability = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'reliability-linked-drift-snapshot',
    );
    expect(replay?.replayLinkage.replayScenarioRef).toBe('fallback-reconciled-provider-scenario');
    expect(reliability?.reliabilityLinkage.providerReliabilityRef).toBe('certification-drift-blocked');
  });
});

describe('Phase 71 — capabilities and propagation', () => {
  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getHistoricalSnapshotIngestionContractCapabilities();
    expect(caps.historicalSnapshotIngestionContracts).toBe(true);
    expect(caps.snapshotValidationContracts).toBe(true);
    expect(caps.historicalSnapshotExecution).toBe(false);
    expect(caps.historicalSnapshotRecommendations).toBe(false);
    expect(caps.historicalSnapshotApiKeyRequired).toBe(false);
  });

  it('dashboard and read-only API capabilities include phase71 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.historicalSnapshotIngestionContracts).toBe(true);
    expect(dashboard.historicalSnapshotExecution).toBe(false);
    expect(api.historicalSnapshotIngestionContracts).toBe(true);
    expect(api.historicalSnapshotExecution).toBe(false);
  });
});

describe('Phase 71 — safety scan assertions', () => {
  it('phase71 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];

    for (const file of PHASE_71_FILES) {
      const content = readFileSync(resolve(PHASE_71_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 72 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS.md'), 'utf-8');
    expect(doc).toContain('Phase 72');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
