import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURE_MAP,
  listHistoricalSnapshotScenarioGeneratorFixtures,
  getHistoricalSnapshotScenarioGeneratorFixture,
  buildHistoricalSnapshotScenarioGeneratorFixture,
  buildHistoricalSnapshotGenerationPlan,
  buildSnapshotSourceSelection,
  buildGeneratedScenarioDescriptor,
  buildSnapshotReplayDescriptor,
  buildSnapshotScenarioLineage,
  buildSnapshotScenarioIntegrityContract,
  buildSnapshotScenarioValidationContract,
  buildSnapshotScenarioRejectionContract,
  buildSnapshotScenarioQualityLinkage,
  buildSnapshotScenarioReliabilityLinkage,
  buildSnapshotScenarioRiskLinkage,
  buildSnapshotScenarioAuditReport,
  buildSnapshotScenarioViewModel,
  buildSnapshotScenarioApiContract,
  selectHistoricalSnapshotScenarioGeneratorFixture,
  validateHistoricalSnapshotScenarioGeneratorFixture,
  validateHistoricalSnapshotScenarioGeneratorSafety,
  normalizeHistoricalSnapshotScenarioGeneratorFixture,
  serializeHistoricalSnapshotScenarioGeneratorFixture,
  areHistoricalSnapshotScenarioGeneratorFixturesEqual,
  stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum,
  getHistoricalSnapshotScenarioGeneratorCapabilities,
  PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE as ROOT_PHASE,
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../apps/dashboard/src/multi-provider-read-only-foundation/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../apps/dashboard/src/provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../apps/dashboard/src/provider-reliability-drift-audit/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../apps/dashboard/src/historical-snapshot-ingestion-contracts/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_72_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/historical-snapshot-scenario-generator');
const PHASE_72_FILES = [
  'types.ts',
  'generation-plans.ts',
  'source-selection.ts',
  'scenario-descriptors.ts',
  'replay-descriptors.ts',
  'lineage-models.ts',
  'generation-rules.ts',
  'integrity-contracts.ts',
  'validation-contracts.ts',
  'rejection-contracts.ts',
  'quality-linkage.ts',
  'reliability-linkage.ts',
  'risk-linkage.ts',
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

describe('Phase 72 — source file existence', () => {
  for (const file of PHASE_72_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_72_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 72 — constants and fixture table', () => {
  it('constants and root exports align', () => {
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE).toBe(72);
    expect(ROOT_PHASE).toBe(72);
    expect(ROOT_FIXTURES).toEqual(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES);
    expect(PHASE_72_HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
  });

  it('names/kinds/count/map/list/get are deterministic', () => {
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toHaveLength(8);
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_KINDS).toHaveLength(8);
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES).toHaveLength(8);
    expect(listHistoricalSnapshotScenarioGeneratorFixtures()).toEqual(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES);

    for (const fixture of HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES) {
      expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getHistoricalSnapshotScenarioGeneratorFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getHistoricalSnapshotScenarioGeneratorFixture('missing')).toBeNull();
  });
});

describe('Phase 72 — fixture structure and linkage', () => {
  it('fixtures include required deterministic surfaces and practical source linkage', () => {
    for (const fixture of HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES) {
      expect(fixture.phase).toBe(72);
      expect(fixture.generationPlan.liveData).toBe(false);
      expect(fixture.generationPlan.requiresNetwork).toBe(false);
      expect(fixture.generationPlan.requiresFilesystem).toBe(false);
      expect(fixture.replayDescriptor.liveReplayImport).toBe(false);
      expect(fixture.scenarioDescriptor.generatedFromSnapshot).toBe(true);
      expect(fixture.scenarioDescriptor.advisory).toBe(false);
      expect(fixture.sourcePhase65FixtureSnapshot).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES);
      expect(fixture.sourcePhase66FixtureSnapshot).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES);
      expect(fixture.sourcePhase67FixtureSnapshot).toEqual(CROSS_PROVIDER_DATA_QUALITY_NAMES);
      expect(fixture.sourcePhase68FixtureSnapshot).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES);
      expect(fixture.sourcePhase70FixtureSnapshot).toEqual(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES);
      expect(fixture.sourcePhase71FixtureSnapshot).toEqual(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES);
      expect(fixture.auditReport.safetySummary.toLowerCase()).toContain('no execution');
    }
  });

  it('required fixture names are present', () => {
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('healthy-snapshot-generates-clean-scenario');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('stale-snapshot-generates-warning-scenario');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('schema-drift-snapshot-generation-blocked');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('missing-critical-field-generation-rejected');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('partial-snapshot-generates-quarantined-scenario');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('replay-linked-snapshot-generates-replay-scenario');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('reliability-drift-snapshot-generates-drift-scenario');
    expect(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES).toContain('cross-provider-conflict-generates-conflict-scenario');
  });
});

describe('Phase 72 — helper builders and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildHistoricalSnapshotScenarioGeneratorFixture({ fixtureName: 'healthy-snapshot-generates-clean-scenario' });
    const b = buildHistoricalSnapshotScenarioGeneratorFixture({ fixtureName: 'healthy-snapshot-generates-clean-scenario' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const generationPlan = buildHistoricalSnapshotGenerationPlan({
      fixtureId: 'phase72-sample',
      generationPlanName: 'sample',
      generationPlanKind: 'clean_generation_plan',
      sourceSnapshotFixtureName: 'healthy-provider-snapshot-contract',
      generatorMode: 'deterministic_fixture_only',
      deterministicSeedLabel: 'phase72-seed-sample',
      failClosed: false,
    });
    const sourceSelection = buildSnapshotSourceSelection({
      fixtureId: 'phase72-sample',
      selectedSnapshotIds: ['snapshot-1'],
      selectedProviderIds: ['provider-a'],
      selectedReliabilityRefs: ['healthy-provider-stable-telemetry'],
      selectionReasonCode: 'HEALTHY_SOURCE_SELECTED',
      selectionWarnings: [],
    });
    const scenarioDescriptor = buildGeneratedScenarioDescriptor({
      fixtureId: 'phase72-sample',
      scenarioName: 'sample scenario',
      scenarioKind: 'clean_scenario',
      sourceSnapshotId: 'snapshot-1',
      replayReady: true,
    });
    const replayDescriptor = buildSnapshotReplayDescriptor({
      fixtureId: 'phase72-sample',
      replayKind: 'baseline_replay',
      expectedStepCount: 4,
      expectedSnapshotCount: 2,
      expectedFinalStateKind: 'scenario_clean_completed',
    });
    const lineage = buildSnapshotScenarioLineage({
      fixtureId: 'phase72-sample',
      sourceSnapshotRefs: ['phase71-fixture'],
      sourceManifestRefs: ['snapshot-1'],
      sourceReliabilityRefs: ['phase70-fixture'],
      sourceReplayRefs: ['phase68-fixture'],
      generatedScenarioRefs: [scenarioDescriptor.scenarioId],
      lineageSummary: 'lineage',
    });
    const integrity = buildSnapshotScenarioIntegrityContract({
      fixtureId: 'phase72-sample',
      checksum: 'fnv1a32:11111111',
      sourceHash: 'fnv1a32:22222222',
      generatedScenarioHash: 'fnv1a32:33333333',
    });
    const validation = buildSnapshotScenarioValidationContract({
      fixtureId: 'phase72-sample',
      rules: ['required'],
      rejectionReasons: ['schema_drift'],
      criticalFailureReasons: ['critical'],
      warningReasons: ['warning'],
      failClosed: true,
    });
    const rejection = buildSnapshotScenarioRejectionContract({
      fixtureId: 'phase72-sample',
      rejectionKind: 'unsafe_state',
      severity: 'warning',
      reasonCode: 'NONE',
      failClosed: false,
      safetyNotes: ['safe'],
    });
    const quality = buildSnapshotScenarioQualityLinkage({
      fixtureId: 'phase72-sample',
      sourceQualityFixtureRef: 'all-providers-agree-high-confidence',
      qualityStatus: 'clean',
      qualityReasonCodes: ['ok'],
    });
    const reliability = buildSnapshotScenarioReliabilityLinkage({
      fixtureId: 'phase72-sample',
      sourceReliabilityFixtureRef: 'healthy-provider-stable-telemetry',
      reliabilityStatus: 'stable',
      driftSeverity: 'low',
    });
    const risk = buildSnapshotScenarioRiskLinkage({
      fixtureId: 'phase72-sample',
      riskStatus: 'low',
      riskReasonCodes: ['safe'],
      failClosed: false,
    });
    const report = buildSnapshotScenarioAuditReport({
      fixtureId: 'phase72-sample',
      generationPlan,
      sourceSelection,
      scenarioDescriptor,
      replayDescriptor,
      lineageModel: lineage,
      integrityContract: integrity,
      validationContract: validation,
    });
    const viewModel = buildSnapshotScenarioViewModel({
      fixtureId: 'phase72-sample',
      fixtureName: 'healthy-snapshot-generates-clean-scenario',
      scenarioDescriptor,
      rejectionContract: rejection,
    });
    const contract = buildSnapshotScenarioApiContract({
      fixtureId: 'phase72-sample',
      viewModel,
      fixtureIds: ['phase72-sample'],
    });

    expect(generationPlan.phase).toBe(72);
    expect(sourceSelection.selectedProviderIds).toEqual(['provider-a']);
    expect(scenarioDescriptor.generatedFromSnapshot).toBe(true);
    expect(replayDescriptor.liveReplayImport).toBe(false);
    expect(lineage.generatedScenarioRefs).toContain(scenarioDescriptor.scenarioId);
    expect(integrity.deterministic).toBe(true);
    expect(validation.failClosed).toBe(true);
    expect(rejection.rejectionKind).toBe('unsafe_state');
    expect(quality.qualityStatus).toBe('clean');
    expect(reliability.driftSeverity).toBe('low');
    expect(risk.riskStatus).toBe('low');
    expect(report.reportId).toContain('phase72-sample');
    expect(contract.list.contractKind).toBe('list');
  });
});

describe('Phase 72 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic matches and misses', () => {
    const fixture = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES[0]!;
    const found = selectHistoricalSnapshotScenarioGeneratorFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectHistoricalSnapshotScenarioGeneratorFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      validationContract: {
        ...base.validationContract,
        rules: [...base.validationContract.rules].reverse(),
      },
    };

    expect(normalizeHistoricalSnapshotScenarioGeneratorFixture(scrambled)).toEqual(
      normalizeHistoricalSnapshotScenarioGeneratorFixture(base),
    );
    expect(serializeHistoricalSnapshotScenarioGeneratorFixture(scrambled)).toBe(
      serializeHistoricalSnapshotScenarioGeneratorFixture(base),
    );
    expect(areHistoricalSnapshotScenarioGeneratorFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum('phase72-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicHistoricalSnapshotScenarioGeneratorChecksum('phase72-check')).toBe(checksum);
  });
});

describe('Phase 72 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES) {
      expect(validateHistoricalSnapshotScenarioGeneratorFixture(fixture).valid).toBe(true);
      expect(validateHistoricalSnapshotScenarioGeneratorSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe live/runtime/capability drift', () => {
    const fixture = clone(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      generationPlan: {
        ...fixture.generationPlan,
        liveData: true as never,
        requiresNetwork: true as never,
      },
      replayDescriptor: { ...fixture.replayDescriptor, liveReplayImport: true as never },
      scenarioDescriptor: { ...fixture.scenarioDescriptor, advisory: true as never },
      capabilityFlags: { ...fixture.capabilityFlags, snapshotScenarioExecution: true as never },
    };

    const validation = validateHistoricalSnapshotScenarioGeneratorFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'LIVE_DATA_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_GENERATION_PLAN_REQUIREMENTS')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'LIVE_REPLAY_IMPORT_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'ADVISORY_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects advisory/wallet/network text and source snapshot mutation', () => {
    const fixture = clone(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      auditReport: {
        ...fixture.auditReport,
        safetySummary: 'buy signal via wallet and fetch( endpoint https://unsafe.example with profit claims',
      },
      sourcePhase71FixtureSnapshot: ['mutated'] as never,
    };

    const validation = validateHistoricalSnapshotScenarioGeneratorFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_NETWORK_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MUTATED_PHASE71_SOURCE_SNAPSHOT')).toBe(true);
  });
});

describe('Phase 72 — fixture-specific expectations', () => {
  it('blocked and quarantined fixtures are fail-closed with expected states', () => {
    const schemaBlocked = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(
      f => f.fixtureName === 'schema-drift-snapshot-generation-blocked',
    );
    const partial = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(
      f => f.fixtureName === 'partial-snapshot-generates-quarantined-scenario',
    );
    const conflict = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(
      f => f.fixtureName === 'cross-provider-conflict-generates-conflict-scenario',
    );

    expect(schemaBlocked?.rejectionContract.failClosed).toBe(true);
    expect(schemaBlocked?.scenarioDescriptor.replayReady).toBe(false);
    expect(partial?.viewModel.quarantined).toBe(true);
    expect(conflict?.rejectionContract.failClosed).toBe(true);
  });

  it('replay-linked fixture is replay-ready and drift fixture is blocked', () => {
    const replay = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(
      f => f.fixtureName === 'replay-linked-snapshot-generates-replay-scenario',
    );
    const drift = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(
      f => f.fixtureName === 'reliability-drift-snapshot-generates-drift-scenario',
    );

    expect(replay?.scenarioDescriptor.replayReady).toBe(true);
    expect(drift?.rejectionContract.failClosed).toBe(true);
  });
});

describe('Phase 72 — capabilities and propagation', () => {
  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getHistoricalSnapshotScenarioGeneratorCapabilities();
    expect(caps.historicalSnapshotScenarioGenerator).toBe(true);
    expect(caps.snapshotScenarioValidationContracts).toBe(true);
    expect(caps.snapshotScenarioApiKeyRequired).toBe(false);
    expect(caps.snapshotScenarioExecution).toBe(false);
  });

  it('dashboard and read-only API capabilities include phase72 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.historicalSnapshotScenarioGenerator).toBe(true);
    expect(dashboard.snapshotScenarioExecution).toBe(false);
    expect(api.historicalSnapshotScenarioGenerator).toBe(true);
    expect(api.snapshotScenarioExecution).toBe(false);
  });
});

describe('Phase 72 — safety scan assertions', () => {
  it('phase72 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];

    for (const file of PHASE_72_FILES) {
      const content = readFileSync(resolve(PHASE_72_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 73 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR.md'), 'utf-8');
    expect(doc).toContain('Phase 73');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
