import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURE_MAP,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES,
  areProviderAwareReplayImportContractFixturesEqual,
  buildProviderAwareReplayImportContractFixture,
  buildReplayImportApiContract,
  buildReplayImportAuditReport,
  buildReplayImportCandidate,
  buildReplayImportCompatibilityContract,
  buildReplayImportGatePolicy,
  buildReplayImportIntegrityContract,
  buildReplayImportManifest,
  buildReplayImportNormalizationContract,
  buildReplayImportPlan,
  buildReplayImportProvenanceContract,
  buildReplayImportQualityLinkage,
  buildReplayImportRejectionContract,
  buildReplayImportReliabilityLinkage,
  buildReplayImportScenarioLinkage,
  buildReplayImportSnapshotLinkage,
  buildReplayImportSourceMetadata,
  buildReplayImportValidationContract,
  buildReplayImportViewModel,
  getDashboardUiShellCapabilities,
  getProviderAwareReplayImportContractCapabilities,
  getProviderAwareReplayImportContractFixture,
  listProviderAwareReplayImportContractFixtures,
  normalizeProviderAwareReplayImportContractFixture,
  selectProviderAwareReplayImportContractFixture,
  serializeProviderAwareReplayImportContractFixture,
  stableDeterministicProviderAwareReplayImportContractChecksum,
  validateProviderAwareReplayImportContractFixture,
  validateProviderAwareReplayImportContractSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../apps/dashboard/src/historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../apps/dashboard/src/historical-snapshot-scenario-generator/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_73_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/provider-aware-replay-import-contracts');
const PHASE_73_FILES = [
  'types.ts',
  'import-candidates.ts',
  'import-manifests.ts',
  'source-metadata.ts',
  'compatibility-contracts.ts',
  'gate-policies.ts',
  'import-plans.ts',
  'rejection-contracts.ts',
  'normalization-contracts.ts',
  'validation-contracts.ts',
  'integrity-contracts.ts',
  'provenance-contracts.ts',
  'scenario-linkage.ts',
  'snapshot-linkage.ts',
  'reliability-linkage.ts',
  'quality-linkage.ts',
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

describe('Phase 73 — source files and docs', () => {
  for (const file of PHASE_73_FILES) {
    it(`${file} exists`, () => {
      expect(readFileSync(resolve(PHASE_73_SRC, file), 'utf-8').length).toBeGreaterThan(0);
    });
  }

  it('docs/PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS.md exists', () => {
    expect(readFileSync(resolve(REPO_ROOT, 'docs/PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS.md'), 'utf-8').length).toBeGreaterThan(0);
  });
});

describe('Phase 73 — constants and fixture map', () => {
  it('exports phase and deterministic generatedAt', () => {
    expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE).toBe(73);
    expect(PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
  });

  it('names/kinds/list/get/map are deterministic', () => {
    expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES).toHaveLength(8);
    expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS).toHaveLength(8);
    expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES).toHaveLength(8);
    expect(listProviderAwareReplayImportContractFixtures()).toEqual(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES);

    for (const fixture of PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES) {
      expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getProviderAwareReplayImportContractFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getProviderAwareReplayImportContractFixture('missing')).toBeNull();
  });
});

describe('Phase 73 — required fixture coverage and structure', () => {
  it('contains all required fixture names', () => {
    expect(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES).toEqual([
      'clean-scenario-import-contract',
      'stale-snapshot-import-warning',
      'schema-drift-import-blocked',
      'missing-critical-field-import-rejected',
      'quarantined-scenario-import-blocked',
      'replay-linked-import-ready-fixture-only',
      'reliability-drift-import-warning',
      'cross-provider-conflict-import-rejected',
    ]);
  });

  it('fixtures stay fixture-only and fail-closed where required', () => {
    for (const fixture of PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES) {
      expect(fixture.importCandidate.liveImport).toBe(false);
      expect(fixture.importCandidate.runtimeImport).toBe(false);
      expect(fixture.gatePolicy.disabledByDefault).toBe(true);
      expect(fixture.gatePolicy.requiresManualEnable).toBe(true);
      expect(fixture.gatePolicy.allowsLiveImport).toBe(false);
      expect(fixture.gatePolicy.allowsFilesystemImport).toBe(false);
      expect(fixture.gatePolicy.allowsRuntimeIngestion).toBe(false);
      expect(fixture.importPlan.requiresNetwork).toBe(false);
      expect(fixture.importPlan.requiresFilesystem).toBe(false);
      expect(fixture.importPlan.requiresSecrets).toBe(false);
      expect(fixture.sourcePhase71FixtureSnapshot).toEqual(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES);
      expect(fixture.sourcePhase72FixtureSnapshot).toEqual(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES);
    }
  });
});

describe('Phase 73 — builders and layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildProviderAwareReplayImportContractFixture({ fixtureName: 'clean-scenario-import-contract' });
    const b = buildProviderAwareReplayImportContractFixture({ fixtureName: 'clean-scenario-import-contract' });
    expect(a).toEqual(b);
  });

  it('layer builders produce expected contract shapes', () => {
    const candidate = buildReplayImportCandidate({
      fixtureId: 'phase73-sample',
      candidateName: 'sample',
      candidateKind: 'clean_scenario_import_contract',
      sourceScenarioFixtureName: 'high-confidence-provider-agreement-scenario',
      sourceSnapshotFixtureName: 'healthy-provider-snapshot-contract',
      phase: 73,
      failClosed: false,
    });
    const manifest = buildReplayImportManifest({
      fixtureId: 'phase73-sample',
      manifestName: 'sample',
      generatedAt: '2026-05-13T00:00:00.000Z',
      schemaVersion: '1.0.0',
      sourceCandidateIds: [candidate.candidateId],
      checksum: 'fnv1a32:11111111',
    });
    const sourceMetadata = buildReplayImportSourceMetadata({
      sourceMetadataId: 'phase73-sample-source-metadata',
      sourcePhaseRefs: [65, 66, 67, 68, 70, 71, 72],
      sourceFixtureRefs: ['phase65', 'phase66'],
      sourceProviderIds: ['provider-a'],
      sourceScenarioRefs: ['high-confidence-provider-agreement-scenario'],
      sourceSnapshotRefs: ['healthy-provider-snapshot-contract'],
      sourceReliabilityRefs: ['healthy-provider-stable-telemetry'],
    });
    const compatibility = buildReplayImportCompatibilityContract({
      fixtureId: 'phase73-sample',
      replaySchemaCompatible: true,
      scenarioCompatible: true,
      snapshotCompatible: true,
      qualityCompatible: true,
      reliabilityCompatible: true,
      compatibilityStatus: 'compatible',
      incompatibilityReasonCodes: [],
      failClosed: false,
    });
    const gate = buildReplayImportGatePolicy({
      fixtureId: 'phase73-sample',
      gateState: 'disabled',
      disabledByDefault: true,
      requiresManualEnable: true,
      allowsLiveImport: false,
      allowsFilesystemImport: false,
      allowsRuntimeIngestion: false,
      failClosed: false,
    });
    const plan = buildReplayImportPlan({
      fixtureId: 'phase73-sample',
      planMode: 'fixture_contract_only',
      candidateIds: [candidate.candidateId],
      disabledRuntimeImport: true,
      disabledFilesystemImport: true,
      requiresNetwork: false,
      requiresFilesystem: false,
      requiresSecrets: false,
      expectedOutcome: 'fixture_only_ready',
    });
    const normalization = buildReplayImportNormalizationContract({
      fixtureId: 'phase73-sample',
      normalizationMode: 'canonical_json',
      stableOrdering: true,
      deterministicChecksum: true,
      localeIndependent: true,
      mutationFree: true,
    });
    const rejection = buildReplayImportRejectionContract({
      fixtureId: 'phase73-sample',
      rejectionKind: 'none',
      severity: 'warning',
      reasonCode: 'NONE',
      failClosed: false,
      safetyNotes: ['safe'],
    });
    const validation = buildReplayImportValidationContract({
      fixtureId: 'phase73-sample',
      rules: ['required'],
      rejectionReasons: ['schema_drift'],
      criticalFailureReasons: ['critical'],
      warningReasons: ['warning'],
      failClosed: true,
    });
    const integrity = buildReplayImportIntegrityContract({
      fixtureId: 'phase73-sample',
      checksum: 'fnv1a32:11111111',
      checksumAlgorithm: 'fnv1a32',
      manifestHash: 'fnv1a32:22222222',
      sourceHash: 'fnv1a32:33333333',
      deterministic: true,
    });
    const provenance = buildReplayImportProvenanceContract({
      fixtureId: 'phase73-sample',
      sourceScenarioRefs: ['high-confidence-provider-agreement-scenario'],
      sourceSnapshotRefs: ['healthy-provider-snapshot-contract'],
      sourceReliabilityRefs: ['healthy-provider-stable-telemetry'],
      sourceQualityRefs: ['all-providers-agree-high-confidence'],
      lineageSummary: 'lineage',
    });
    const scenario = buildReplayImportScenarioLinkage({
      fixtureId: 'phase73-sample',
      scenarioFixtureRef: 'high-confidence-provider-agreement-scenario',
      scenarioStatus: 'aligned',
      failClosed: false,
    });
    const snapshot = buildReplayImportSnapshotLinkage({
      fixtureId: 'phase73-sample',
      snapshotFixtureRef: 'healthy-provider-snapshot-contract',
      snapshotStatus: 'aligned',
      failClosed: false,
    });
    const reliability = buildReplayImportReliabilityLinkage({
      fixtureId: 'phase73-sample',
      sourceReliabilityFixtureRef: 'healthy-provider-stable-telemetry',
      reliabilityStatus: 'stable',
      driftSeverity: 'low',
      failClosed: false,
    });
    const quality = buildReplayImportQualityLinkage({
      fixtureId: 'phase73-sample',
      sourceQualityFixtureRef: 'all-providers-agree-high-confidence',
      qualityStatus: 'clean',
      reasonCodes: ['CLEAN'],
      failClosed: false,
    });
    const report = buildReplayImportAuditReport({
      fixtureId: 'phase73-sample',
      candidateSummary: 'candidate',
      manifestSummary: 'manifest',
      compatibilitySummary: 'compatible',
      gatePolicySummary: 'disabled',
      importPlanSummary: 'plan',
      provenanceSummary: 'provenance',
      integritySummary: 'integrity',
      safetySummary: 'safe',
    });
    const view = buildReplayImportViewModel({
      fixtureId: 'phase73-sample',
      fixtureName: 'clean-scenario-import-contract',
      candidateId: candidate.candidateId,
      compatibilityStatus: 'compatible',
      blocked: false,
      warning: false,
    });
    const api = buildReplayImportApiContract({
      fixtureId: 'phase73-sample',
      viewModel: view,
      fixtureIds: ['phase73-sample'],
    });

    expect(manifest.deterministic).toBe(true);
    expect(compatibility.compatibilityStatus).toBe('compatible');
    expect(sourceMetadata.sourceProviderIds).toEqual(['provider-a']);
    expect(gate.allowsLiveImport).toBe(false);
    expect(plan.disabledRuntimeImport).toBe(true);
    expect(normalization.mutationFree).toBe(true);
    expect(validation.failClosed).toBe(true);
    expect(rejection.rejectionKind).toBe('none');
    expect(integrity.deterministic).toBe(true);
    expect(provenance.sourceScenarioRefs).toHaveLength(1);
    expect(scenario.scenarioStatus).toBe('aligned');
    expect(snapshot.snapshotStatus).toBe('aligned');
    expect(reliability.reliabilityStatus).toBe('stable');
    expect(quality.qualityStatus).toBe('clean');
    expect(report.reportId).toContain('phase73-sample');
    expect(api.list.contractKind).toBe('list');
  });
});

describe('Phase 73 — selectors, normalization, serialization, equality, checksum', () => {
  it('selectors match fixture and handle misses', () => {
    const fixture = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES[0]!;
    expect(selectProviderAwareReplayImportContractFixture({ fixtureId: fixture.fixtureId }).matched).toBe(true);
    expect(selectProviderAwareReplayImportContractFixture({ candidateId: fixture.importCandidate.candidateId }).matched).toBe(true);
    expect(selectProviderAwareReplayImportContractFixture({ fixtureId: 'missing' }).matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      validationContract: { ...base.validationContract, rules: [...base.validationContract.rules].reverse() },
    };

    expect(normalizeProviderAwareReplayImportContractFixture(scrambled)).toEqual(
      normalizeProviderAwareReplayImportContractFixture(base),
    );
    expect(serializeProviderAwareReplayImportContractFixture(scrambled)).toBe(
      serializeProviderAwareReplayImportContractFixture(base),
    );
    expect(areProviderAwareReplayImportContractFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicProviderAwareReplayImportContractChecksum('phase73-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
  });
});

describe('Phase 73 — validation and safety', () => {
  it('all fixtures validate and are safety-clean', () => {
    for (const fixture of PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES) {
      expect(validateProviderAwareReplayImportContractFixture(fixture).valid).toBe(true);
      expect(validateProviderAwareReplayImportContractSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe live/runtime/advisory drift', () => {
    const fixture = clone(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      importCandidate: { ...fixture.importCandidate, liveImport: true as never, runtimeImport: true as never },
      gatePolicy: { ...fixture.gatePolicy, allowsLiveImport: true as never },
      capabilityFlags: { ...fixture.capabilityFlags, replayImportExecution: true as never },
      auditReport: {
        ...fixture.auditReport,
        safetySummary: 'buy signal via wallet and fetch( endpoint https://unsafe.example with profit claims',
      },
    };

    const result = validateProviderAwareReplayImportContractFixture(unsafe as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'LIVE_OR_RUNTIME_IMPORT_FORBIDDEN')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_GATE_POLICY')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
  });
});

describe('Phase 73 — fixture behavior and capability propagation', () => {
  it('blocked/rejected fixtures are fail-closed', () => {
    const blocked = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.find(f => f.fixtureName === 'schema-drift-import-blocked');
    const rejected = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'cross-provider-conflict-import-rejected',
    );
    expect(blocked?.compatibilityContract.failClosed).toBe(true);
    expect(rejected?.rejectionContract.failClosed).toBe(true);
  });

  it('phase capability flags are exposed on dashboard and read-only-api', () => {
    const phaseCaps = getProviderAwareReplayImportContractCapabilities();
    expect(phaseCaps.providerAwareReplayImportContracts).toBe(true);
    expect(phaseCaps.replayImportExecution).toBe(false);

    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.providerAwareReplayImportContracts).toBe(true);
    expect(dashboard.replayImportExecution).toBe(false);
    expect(api.providerAwareReplayImportContracts).toBe(true);
    expect(api.replayImportExecution).toBe(false);
  });
});

describe('Phase 73 — deterministic safety scans and phase preview', () => {
  it('phase73 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];
    for (const file of PHASE_73_FILES) {
      const content = readFileSync(resolve(PHASE_73_SRC, file), 'utf-8');
      for (const pattern of forbidden) expect(content).not.toMatch(pattern);
    }
  });

  it('phase72 doc now points to Phase 74 preview only', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR.md'), 'utf-8').toLowerCase();
    expect(doc).toContain('phase 74');
    expect(doc).toContain('preview only');
    expect(doc).toContain('not implemented');
  });
});
