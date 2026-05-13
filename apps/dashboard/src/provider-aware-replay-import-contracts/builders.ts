import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { getProviderAwareReplayImportContractCapabilities } from './capabilities.js';
import { buildReplayImportCompatibilityContract } from './compatibility-contracts.js';
import { buildReplayImportApiContract } from './contracts.js';
import { buildReplayImportGatePolicy } from './gate-policies.js';
import { buildReplayImportCandidate } from './import-candidates.js';
import { buildReplayImportManifest } from './import-manifests.js';
import { buildReplayImportPlan } from './import-plans.js';
import { buildReplayImportIntegrityContract } from './integrity-contracts.js';
import { stableDeterministicProviderAwareReplayImportContractChecksum } from './normalization.js';
import { buildReplayImportNormalizationContract } from './normalization-contracts.js';
import { buildReplayImportProvenanceContract } from './provenance-contracts.js';
import { buildReplayImportQualityLinkage } from './quality-linkage.js';
import { buildReplayImportRejectionContract } from './rejection-contracts.js';
import { buildReplayImportReliabilityLinkage } from './reliability-linkage.js';
import { buildReplayImportAuditReport } from './reports.js';
import { buildReplayImportScenarioLinkage } from './scenario-linkage.js';
import { buildReplayImportSnapshotLinkage } from './snapshot-linkage.js';
import { buildReplayImportSourceMetadata } from './source-metadata.js';
import {
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT,
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION,
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE,
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_VERSION,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
  type BuildProviderAwareReplayImportContractFixtureInput,
  type ProviderAwareReplayImportContractFixture,
  type ProviderAwareReplayImportContractKind,
  type ProviderAwareReplayImportContractName,
} from './types.js';
import { buildReplayImportValidationContract } from './validation-contracts.js';
import { buildReplayImportViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: ProviderAwareReplayImportContractKind;
  readonly compatibilityStatus: 'compatible' | 'warning' | 'blocked' | 'rejected';
  readonly gateState: 'disabled' | 'warning' | 'blocked';
  readonly reliabilityStatus: 'stable' | 'degraded' | 'drifted';
  readonly driftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  readonly qualityStatus: 'clean' | 'warning' | 'blocked';
  readonly rejectionKind: 'none' | 'schema_drift' | 'missing_critical_field' | 'quarantined' | 'cross_provider_conflict' | 'reliability_drift';
  readonly rejectionSeverity: 'warning' | 'error' | 'critical';
  readonly failClosed: boolean;
}

const BLUEPRINTS: Record<ProviderAwareReplayImportContractName, Blueprint> = {
  'clean-scenario-import-contract': {
    fixtureKind: 'clean_scenario_import_contract',
    compatibilityStatus: 'compatible',
    gateState: 'disabled',
    reliabilityStatus: 'stable',
    driftSeverity: 'low',
    qualityStatus: 'clean',
    rejectionKind: 'none',
    rejectionSeverity: 'warning',
    failClosed: false,
  },
  'stale-snapshot-import-warning': {
    fixtureKind: 'stale_snapshot_import_warning',
    compatibilityStatus: 'warning',
    gateState: 'warning',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    qualityStatus: 'warning',
    rejectionKind: 'none',
    rejectionSeverity: 'warning',
    failClosed: false,
  },
  'schema-drift-import-blocked': {
    fixtureKind: 'schema_drift_import_blocked',
    compatibilityStatus: 'blocked',
    gateState: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'critical',
    qualityStatus: 'blocked',
    rejectionKind: 'schema_drift',
    rejectionSeverity: 'critical',
    failClosed: true,
  },
  'missing-critical-field-import-rejected': {
    fixtureKind: 'missing_critical_field_import_rejected',
    compatibilityStatus: 'rejected',
    gateState: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'high',
    qualityStatus: 'blocked',
    rejectionKind: 'missing_critical_field',
    rejectionSeverity: 'critical',
    failClosed: true,
  },
  'quarantined-scenario-import-blocked': {
    fixtureKind: 'quarantined_scenario_import_blocked',
    compatibilityStatus: 'blocked',
    gateState: 'blocked',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    qualityStatus: 'warning',
    rejectionKind: 'quarantined',
    rejectionSeverity: 'error',
    failClosed: true,
  },
  'replay-linked-import-ready-fixture-only': {
    fixtureKind: 'replay_linked_import_ready_fixture_only',
    compatibilityStatus: 'compatible',
    gateState: 'disabled',
    reliabilityStatus: 'degraded',
    driftSeverity: 'moderate',
    qualityStatus: 'clean',
    rejectionKind: 'none',
    rejectionSeverity: 'warning',
    failClosed: false,
  },
  'reliability-drift-import-warning': {
    fixtureKind: 'reliability_drift_import_warning',
    compatibilityStatus: 'warning',
    gateState: 'warning',
    reliabilityStatus: 'drifted',
    driftSeverity: 'high',
    qualityStatus: 'warning',
    rejectionKind: 'reliability_drift',
    rejectionSeverity: 'warning',
    failClosed: true,
  },
  'cross-provider-conflict-import-rejected': {
    fixtureKind: 'cross_provider_conflict_import_rejected',
    compatibilityStatus: 'rejected',
    gateState: 'blocked',
    reliabilityStatus: 'drifted',
    driftSeverity: 'critical',
    qualityStatus: 'blocked',
    rejectionKind: 'cross_provider_conflict',
    rejectionSeverity: 'critical',
    failClosed: true,
  },
};

const SOURCE_INDEXES: Record<ProviderAwareReplayImportContractName, number> = {
  'clean-scenario-import-contract': 0,
  'stale-snapshot-import-warning': 1,
  'schema-drift-import-blocked': 2,
  'missing-critical-field-import-rejected': 3,
  'quarantined-scenario-import-blocked': 4,
  'replay-linked-import-ready-fixture-only': 5,
  'reliability-drift-import-warning': 6,
  'cross-provider-conflict-import-rejected': 7,
};

export function buildProviderAwareReplayImportContractFixture(
  input: BuildProviderAwareReplayImportContractFixtureInput,
): ProviderAwareReplayImportContractFixture {
  const fixtureId = `phase73-${input.fixtureName}`;
  const blueprint = BLUEPRINTS[input.fixtureName];
  const sourceIndex = SOURCE_INDEXES[input.fixtureName];

  const sourceScenarioFixtureName = PROVIDER_AWARE_REPLAY_SCENARIO_NAMES[sourceIndex]!;
  const sourceSnapshotFixtureName = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES[sourceIndex]!;
  const sourceReliabilityFixtureName = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[sourceIndex]!;
  const sourceQualityFixtureName = CROSS_PROVIDER_DATA_QUALITY_NAMES[sourceIndex]!;
  const sourcePhase72FixtureName = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES[sourceIndex]!;

  const deterministicSeed = `phase73-seed-${input.fixtureName}`;
  const checksumBase = stableDeterministicProviderAwareReplayImportContractChecksum(
    `${fixtureId}|${input.fixtureName}|${deterministicSeed}`,
  );

  const importCandidate = buildReplayImportCandidate({
    fixtureId,
    candidateName: input.fixtureName,
    candidateKind: blueprint.fixtureKind,
    sourceScenarioFixtureName,
    sourceSnapshotFixtureName,
    phase: PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
    failClosed: blueprint.failClosed,
  });

  const manifest = buildReplayImportManifest({
    fixtureId,
    manifestName: `${input.fixtureName}-manifest`,
    generatedAt: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT,
    schemaVersion: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION,
    sourceCandidateIds: [importCandidate.candidateId],
    checksum: checksumBase,
  });

  const sourceMetadata = buildReplayImportSourceMetadata({
    sourceMetadataId: `${fixtureId}-source-metadata`,
    sourcePhaseRefs: [65, 66, 67, 68, 70, 71, 72],
    sourceFixtureRefs: [
      FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex]!,
      MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[sourceIndex]!,
      sourceQualityFixtureName,
      sourceScenarioFixtureName,
      sourceReliabilityFixtureName,
      sourceSnapshotFixtureName,
      sourcePhase72FixtureName,
    ],
    sourceProviderIds: [`provider-${sourceIndex + 1}`],
    sourceScenarioRefs: [sourceScenarioFixtureName],
    sourceSnapshotRefs: [sourceSnapshotFixtureName],
    sourceReliabilityRefs: [sourceReliabilityFixtureName],
  });

  const compatibilityContract = buildReplayImportCompatibilityContract({
    fixtureId,
    replaySchemaCompatible: blueprint.compatibilityStatus === 'compatible' || blueprint.compatibilityStatus === 'warning',
    scenarioCompatible: blueprint.compatibilityStatus !== 'rejected',
    snapshotCompatible: blueprint.compatibilityStatus !== 'rejected',
    qualityCompatible: blueprint.qualityStatus !== 'blocked',
    reliabilityCompatible: blueprint.reliabilityStatus !== 'drifted' || blueprint.compatibilityStatus === 'warning',
    compatibilityStatus: blueprint.compatibilityStatus,
    incompatibilityReasonCodes:
      blueprint.compatibilityStatus === 'compatible' ? [] : [blueprint.rejectionKind.toUpperCase(), 'FAIL_CLOSED_POLICY'],
    failClosed: blueprint.failClosed,
  });

  const gatePolicy = buildReplayImportGatePolicy({
    fixtureId,
    gateState: blueprint.gateState,
    disabledByDefault: true,
    requiresManualEnable: true,
    allowsLiveImport: false,
    allowsFilesystemImport: false,
    allowsRuntimeIngestion: false,
    failClosed: blueprint.failClosed,
  });

  const importPlan = buildReplayImportPlan({
    fixtureId,
    planMode: 'fixture_contract_only',
    candidateIds: [importCandidate.candidateId],
    disabledRuntimeImport: true,
    disabledFilesystemImport: true,
    requiresNetwork: false,
    requiresFilesystem: false,
    requiresSecrets: false,
    expectedOutcome: blueprint.failClosed ? 'blocked_or_rejected' : 'fixture_only_ready',
  });

  const rejectionContract = buildReplayImportRejectionContract({
    fixtureId,
    rejectionKind: blueprint.rejectionKind,
    severity: blueprint.rejectionSeverity,
    reasonCode: blueprint.rejectionKind.toUpperCase(),
    failClosed: blueprint.failClosed,
    safetyNotes: ['fixture-only replay import contract', 'no live import', 'no runtime ingestion'],
  });

  const normalizationContract = buildReplayImportNormalizationContract({
    fixtureId,
    normalizationMode: 'canonical_json',
    stableOrdering: true,
    deterministicChecksum: true,
    localeIndependent: true,
    mutationFree: true,
  });

  const validationContract = buildReplayImportValidationContract({
    fixtureId,
    rules: [
      'required_fields_present',
      'phase_73_only',
      'deterministic_generated_at',
      'no_live_import_runtime_ingestion_filesystem_network',
      'no_wallet_signing_execution_advisory',
    ],
    rejectionReasons: ['schema_drift', 'missing_critical_field', 'cross_provider_conflict', 'unsafe_state'],
    criticalFailureReasons: ['live_import_forbidden', 'runtime_ingestion_forbidden', 'gate_policy_violation'],
    warningReasons: ['stale_snapshot_warning', 'reliability_drift_warning'],
    failClosed: true,
  });

  const integrityContract = buildReplayImportIntegrityContract({
    fixtureId,
    checksum: checksumBase,
    checksumAlgorithm: 'fnv1a32',
    manifestHash: stableDeterministicProviderAwareReplayImportContractChecksum(`${manifest.manifestId}|${manifest.checksum}`),
    sourceHash: stableDeterministicProviderAwareReplayImportContractChecksum(sourceMetadata.sourceFixtureRefs.join('|')),
    deterministic: true,
  });

  const provenanceContract = buildReplayImportProvenanceContract({
    fixtureId,
    sourceScenarioRefs: [sourceScenarioFixtureName],
    sourceSnapshotRefs: [sourceSnapshotFixtureName],
    sourceReliabilityRefs: [sourceReliabilityFixtureName],
    sourceQualityRefs: [sourceQualityFixtureName],
    lineageSummary: `phase72:${sourcePhase72FixtureName} -> phase73:${input.fixtureName}`,
  });

  const scenarioLinkage = buildReplayImportScenarioLinkage({
    fixtureId,
    scenarioFixtureRef: sourceScenarioFixtureName,
    scenarioStatus: blueprint.compatibilityStatus === 'compatible' ? 'aligned' : blueprint.compatibilityStatus === 'warning' ? 'warning' : 'blocked',
    failClosed: blueprint.failClosed,
  });

  const snapshotLinkage = buildReplayImportSnapshotLinkage({
    fixtureId,
    snapshotFixtureRef: sourceSnapshotFixtureName,
    snapshotStatus: blueprint.compatibilityStatus === 'compatible' ? 'aligned' : blueprint.compatibilityStatus === 'warning' ? 'warning' : 'blocked',
    failClosed: blueprint.failClosed,
  });

  const reliabilityLinkage = buildReplayImportReliabilityLinkage({
    fixtureId,
    sourceReliabilityFixtureRef: sourceReliabilityFixtureName,
    reliabilityStatus: blueprint.reliabilityStatus,
    driftSeverity: blueprint.driftSeverity,
    failClosed: blueprint.failClosed,
  });

  const qualityLinkage = buildReplayImportQualityLinkage({
    fixtureId,
    sourceQualityFixtureRef: sourceQualityFixtureName,
    qualityStatus: blueprint.qualityStatus,
    reasonCodes: [blueprint.qualityStatus.toUpperCase()],
    failClosed: blueprint.failClosed,
  });

  const auditReport = buildReplayImportAuditReport({
    fixtureId,
    candidateSummary: `${importCandidate.candidateName} (${importCandidate.candidateKind})`,
    manifestSummary: `${manifest.manifestId} deterministic=${manifest.deterministic}`,
    compatibilitySummary: `${compatibilityContract.compatibilityStatus} failClosed=${compatibilityContract.failClosed}`,
    gatePolicySummary: `${gatePolicy.gateState} disabledByDefault=${gatePolicy.disabledByDefault}`,
    importPlanSummary: `${importPlan.planMode} runtime=${importPlan.disabledRuntimeImport}`,
    provenanceSummary: provenanceContract.lineageSummary,
    integritySummary: `${integrityContract.checksumAlgorithm}:${integrityContract.checksum}`,
    safetySummary:
      'No live import, runtime import, ingestion, filesystem import, signing, execution, transfer, or advisory output.',
  });

  const viewModel = buildReplayImportViewModel({
    fixtureId,
    fixtureName: input.fixtureName,
    candidateId: importCandidate.candidateId,
    compatibilityStatus: compatibilityContract.compatibilityStatus,
    blocked: compatibilityContract.compatibilityStatus === 'blocked' || compatibilityContract.compatibilityStatus === 'rejected',
    warning: compatibilityContract.compatibilityStatus === 'warning',
  });

  const apiContract = buildReplayImportApiContract({
    fixtureId,
    viewModel,
    fixtureIds: [fixtureId],
  });

  const selectorExamples = [
    {
      selectorId: `${fixtureId}-selector-id`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: blueprint.fixtureKind,
      matched: true,
      source: 'deterministic_fixture_only' as const,
    },
    {
      selectorId: `${fixtureId}-selector-name`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: blueprint.fixtureKind,
      matched: true,
      source: 'deterministic_fixture_only' as const,
    },
  ] as const;

  const capabilityFlags = getProviderAwareReplayImportContractCapabilities();

  return {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
    schemaVersion: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION,
    importCandidate,
    manifest,
    sourceMetadata,
    compatibilityContract,
    gatePolicy,
    importPlan,
    rejectionContract,
    normalizationContract,
    validationContract,
    integrityContract,
    provenanceContract,
    scenarioLinkage,
    snapshotLinkage,
    reliabilityLinkage,
    qualityLinkage,
    auditReport,
    viewModel,
    apiContract,
    selectorExamples,
    capabilityFlags,
    sourcePhase65FixtureSnapshot: [...FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES],
    sourcePhase66FixtureSnapshot: [...MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES],
    sourcePhase67FixtureSnapshot: [...CROSS_PROVIDER_DATA_QUALITY_NAMES],
    sourcePhase68FixtureSnapshot: [...PROVIDER_AWARE_REPLAY_SCENARIO_NAMES],
    sourcePhase70FixtureSnapshot: [...PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES],
    sourcePhase71FixtureSnapshot: [...HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES],
    sourcePhase72FixtureSnapshot: [...HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES],
    sourceRefs: {
      phase65FixtureId: `${FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex]}`,
      phase66FixtureId: `${MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[sourceIndex]}`,
      phase67FixtureId: `${sourceQualityFixtureName}`,
      phase68FixtureId: `${sourceScenarioFixtureName}`,
      phase70FixtureId: `${sourceReliabilityFixtureName}`,
      phase71FixtureId: `${sourceSnapshotFixtureName}`,
      phase72FixtureId: `${sourcePhase72FixtureName}`,
    },
    meta: {
      generatedAt: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT,
      source: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE,
      version: PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_VERSION,
      phase: PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveImport: true,
      noRuntimeImport: true,
      noNetworkAccessByDefault: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
