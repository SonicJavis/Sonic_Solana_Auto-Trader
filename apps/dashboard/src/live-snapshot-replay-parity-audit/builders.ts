import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES } from '../manual-confirm-dry-run-control/index.js';
import { MANUAL_CONFIRM_LIVE_READINESS_NAMES } from '../manual-confirm-live-readiness/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES } from '../read-only-live-snapshot-capture/index.js';
import { buildLiveSnapshotAuditEvidence } from './audit-evidence.js';
import { getLiveSnapshotReplayParityAuditCapabilities } from './capabilities.js';
import { buildLiveSnapshotReplayParityAuditApiContract } from './contracts.js';
import { buildLiveSnapshotDriftClassification } from './drift-classification.js';
import { buildLiveSnapshotIntegrityParity } from './integrity-parity.js';
import { buildLiveSnapshotMismatchTaxonomy } from './mismatch-taxonomy.js';
import { stableDeterministicLiveSnapshotReplayParityAuditChecksum } from './normalization.js';
import { buildLiveSnapshotParityComparison } from './parity-comparisons.js';
import { buildLiveSnapshotReplayParityGate } from './parity-gates.js';
import { buildLiveSnapshotParityReport } from './parity-reports.js';
import { buildLiveSnapshotParityScorecard } from './parity-scorecards.js';
import { buildLiveSnapshotPromotionGate } from './promotion-gates.js';
import { buildLiveSnapshotProvenanceAudit } from './provenance-audits.js';
import { buildLiveSnapshotReplayParityQuarantineContract } from './quarantine-contracts.js';
import { buildLiveSnapshotReplayExpectationLinkage } from './replay-expectation-linkage.js';
import { buildLiveSnapshotScenarioExpectationLinkage } from './scenario-expectation-linkage.js';
import { buildLiveSnapshotSchemaParity } from './schema-parity.js';
import { buildLiveSnapshotReplaySnapshotInput } from './snapshot-inputs.js';
import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE,
  PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_VERSION,
  type BuildLiveSnapshotReplayParityAuditFixtureInput,
  type LiveSnapshotReplayParityAuditFixture,
  type LiveSnapshotReplayParityAuditKind,
  type LiveSnapshotReplayParityAuditName,
} from './types.js';
import { buildLiveSnapshotReplayParityAuditViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: LiveSnapshotReplayParityAuditKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly parityStatus: 'clean' | 'warning' | 'mismatch' | 'missing';
  readonly replayExpectationPresent: boolean;
  readonly replayLinkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
  readonly scenarioExpectationPresent: boolean;
  readonly scenarioLinkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
  readonly schemaStatus: 'pass' | 'warning' | 'fail';
  readonly integrityStatus: 'pass' | 'warning' | 'fail';
  readonly provenanceStatus: 'pass' | 'warning' | 'fail';
  readonly mismatchCodes: readonly string[];
  readonly mismatchSeverity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  readonly driftStatus: 'none' | 'warning' | 'drifted';
  readonly driftClass: 'none' | 'schema' | 'provenance' | 'integrity' | 'expectation';
  readonly promotionStatus: 'candidate' | 'blocked' | 'review_required' | 'rejected';
  readonly quarantined: boolean;
  readonly reviewRequired: boolean;
  readonly evidenceComplete: boolean;
}

const BLUEPRINTS: Record<LiveSnapshotReplayParityAuditName, Blueprint> = {
  'snapshot-replay-parity-clean': {
    fixtureKind: 'snapshot_replay_parity_clean',
    gateStatus: 'ready',
    parityStatus: 'clean',
    replayExpectationPresent: true,
    replayLinkageStatus: 'aligned',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'aligned',
    schemaStatus: 'pass',
    integrityStatus: 'pass',
    provenanceStatus: 'pass',
    mismatchCodes: [],
    mismatchSeverity: 'none',
    driftStatus: 'none',
    driftClass: 'none',
    promotionStatus: 'candidate',
    quarantined: false,
    reviewRequired: false,
    evidenceComplete: true,
  },
  'snapshot-schema-mismatch-quarantined': {
    fixtureKind: 'snapshot_schema_mismatch_quarantined',
    gateStatus: 'blocked',
    parityStatus: 'mismatch',
    replayExpectationPresent: true,
    replayLinkageStatus: 'warning',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'warning',
    schemaStatus: 'fail',
    integrityStatus: 'pass',
    provenanceStatus: 'pass',
    mismatchCodes: ['SCHEMA_MISMATCH'],
    mismatchSeverity: 'high',
    driftStatus: 'drifted',
    driftClass: 'schema',
    promotionStatus: 'blocked',
    quarantined: true,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'snapshot-provenance-mismatch-blocked': {
    fixtureKind: 'snapshot_provenance_mismatch_blocked',
    gateStatus: 'blocked',
    parityStatus: 'mismatch',
    replayExpectationPresent: true,
    replayLinkageStatus: 'blocked',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'warning',
    schemaStatus: 'pass',
    integrityStatus: 'pass',
    provenanceStatus: 'fail',
    mismatchCodes: ['PROVENANCE_MISMATCH'],
    mismatchSeverity: 'high',
    driftStatus: 'drifted',
    driftClass: 'provenance',
    promotionStatus: 'blocked',
    quarantined: true,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'snapshot-integrity-mismatch-blocked': {
    fixtureKind: 'snapshot_integrity_mismatch_blocked',
    gateStatus: 'blocked',
    parityStatus: 'mismatch',
    replayExpectationPresent: true,
    replayLinkageStatus: 'warning',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'warning',
    schemaStatus: 'pass',
    integrityStatus: 'fail',
    provenanceStatus: 'pass',
    mismatchCodes: ['INTEGRITY_MISMATCH'],
    mismatchSeverity: 'critical',
    driftStatus: 'drifted',
    driftClass: 'integrity',
    promotionStatus: 'blocked',
    quarantined: true,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'replay-expectation-missing-blocked': {
    fixtureKind: 'replay_expectation_missing_blocked',
    gateStatus: 'blocked',
    parityStatus: 'missing',
    replayExpectationPresent: false,
    replayLinkageStatus: 'missing',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'aligned',
    schemaStatus: 'warning',
    integrityStatus: 'warning',
    provenanceStatus: 'warning',
    mismatchCodes: ['REPLAY_EXPECTATION_MISSING'],
    mismatchSeverity: 'medium',
    driftStatus: 'drifted',
    driftClass: 'expectation',
    promotionStatus: 'blocked',
    quarantined: true,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'scenario-expectation-warning-review-required': {
    fixtureKind: 'scenario_expectation_warning_review_required',
    gateStatus: 'review_required',
    parityStatus: 'warning',
    replayExpectationPresent: true,
    replayLinkageStatus: 'aligned',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'warning',
    schemaStatus: 'warning',
    integrityStatus: 'pass',
    provenanceStatus: 'warning',
    mismatchCodes: ['SCENARIO_EXPECTATION_DRIFT'],
    mismatchSeverity: 'medium',
    driftStatus: 'warning',
    driftClass: 'expectation',
    promotionStatus: 'review_required',
    quarantined: false,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'promotion-gate-manual-review-required': {
    fixtureKind: 'promotion_gate_manual_review_required',
    gateStatus: 'review_required',
    parityStatus: 'warning',
    replayExpectationPresent: true,
    replayLinkageStatus: 'aligned',
    scenarioExpectationPresent: true,
    scenarioLinkageStatus: 'aligned',
    schemaStatus: 'pass',
    integrityStatus: 'pass',
    provenanceStatus: 'pass',
    mismatchCodes: ['MANUAL_REVIEW_REQUIRED'],
    mismatchSeverity: 'low',
    driftStatus: 'warning',
    driftClass: 'expectation',
    promotionStatus: 'review_required',
    quarantined: false,
    reviewRequired: true,
    evidenceComplete: true,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    parityStatus: 'mismatch',
    replayExpectationPresent: false,
    replayLinkageStatus: 'blocked',
    scenarioExpectationPresent: false,
    scenarioLinkageStatus: 'blocked',
    schemaStatus: 'fail',
    integrityStatus: 'fail',
    provenanceStatus: 'fail',
    mismatchCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    mismatchSeverity: 'critical',
    driftStatus: 'drifted',
    driftClass: 'integrity',
    promotionStatus: 'rejected',
    quarantined: true,
    reviewRequired: true,
    evidenceComplete: false,
  },
};

export function buildLiveSnapshotReplayParityAuditFixture(
  input: BuildLiveSnapshotReplayParityAuditFixtureInput,
): LiveSnapshotReplayParityAuditFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase79-${fixtureName}`;

  const phase65Ref = FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex % FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.length]!;
  const phase66Ref = MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[sourceIndex % MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.length]!;
  const phase67Ref = CROSS_PROVIDER_DATA_QUALITY_NAMES[sourceIndex % CROSS_PROVIDER_DATA_QUALITY_NAMES.length]!;
  const phase68Ref = PROVIDER_AWARE_REPLAY_SCENARIO_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_SCENARIO_NAMES.length]!;
  const phase69Ref = LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[sourceIndex % LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase70Ref = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[sourceIndex % PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.length]!;
  const phase72Ref = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES[sourceIndex % HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES.length]!;
  const phase73Ref = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.length]!;
  const phase74Ref = CONTROLLED_LIVE_SMOKE_HARNESS_NAMES[sourceIndex % CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length]!;
  const phase75Ref = PRE_LIVE_SAFETY_CERTIFICATION_NAMES[sourceIndex % PRE_LIVE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase76Ref = MANUAL_CONFIRM_LIVE_READINESS_NAMES[sourceIndex % MANUAL_CONFIRM_LIVE_READINESS_NAMES.length]!;
  const phase77Ref = MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES[sourceIndex % MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES.length]!;
  const phase78Ref = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES[sourceIndex % READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES.length]!;

  const reasonCodes = blueprint.mismatchCodes.length > 0 ? blueprint.mismatchCodes : ['PARITY_CLEAN'];
  const parityGate = buildLiveSnapshotReplayParityGate({
    parityGateId: `${fixtureId}-gate`,
    parityGateName: `phase79-gate-${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    reasonCodes,
  });

  const snapshotInput = buildLiveSnapshotReplaySnapshotInput({
    snapshotInputId: `${fixtureId}-snapshot-input`,
    snapshotInputKind: 'read_only_snapshot_replay_input',
    sourceFixtureRef: `phase78-${phase78Ref}`,
  });

  const replayExpectationLinkage = buildLiveSnapshotReplayExpectationLinkage({
    replayExpectationLinkageId: `${fixtureId}-replay-linkage`,
    replayExpectationRef: `phase73-${phase73Ref}`,
    expectationPresent: blueprint.replayExpectationPresent,
    linkageStatus: blueprint.replayLinkageStatus,
  });

  const scenarioExpectationLinkage = buildLiveSnapshotScenarioExpectationLinkage({
    scenarioExpectationLinkageId: `${fixtureId}-scenario-linkage`,
    scenarioExpectationRef: `phase72-${phase72Ref}`,
    expectationPresent: blueprint.scenarioExpectationPresent,
    linkageStatus: blueprint.scenarioLinkageStatus,
  });

  const mismatchCount = blueprint.mismatchCodes.length;
  const parityComparison = buildLiveSnapshotParityComparison({
    parityComparisonId: `${fixtureId}-parity-comparison`,
    parityStatus: blueprint.parityStatus,
    mismatchCount,
    comparedFields:
      mismatchCount === 0
        ? ['schema', 'provenance', 'integrity', 'replayExpectation', 'scenarioExpectation']
        : blueprint.mismatchCodes,
  });

  const mismatchTaxonomy = buildLiveSnapshotMismatchTaxonomy({
    mismatchTaxonomyId: `${fixtureId}-mismatch-taxonomy`,
    mismatchCodes: blueprint.mismatchCodes,
    severity: blueprint.mismatchSeverity,
    quarantined: blueprint.quarantined,
  });

  const driftClassification = buildLiveSnapshotDriftClassification({
    driftClassificationId: `${fixtureId}-drift`,
    driftStatus: blueprint.driftStatus,
    driftClass: blueprint.driftClass,
    reviewRequired: blueprint.reviewRequired,
  });

  const provenanceAudit = buildLiveSnapshotProvenanceAudit({
    provenanceAuditId: `${fixtureId}-provenance-audit`,
    auditStatus: blueprint.provenanceStatus,
    sourcePhaseRefs: [
      `phase65:${phase65Ref}`,
      `phase66:${phase66Ref}`,
      `phase67:${phase67Ref}`,
      `phase68:${phase68Ref}`,
      `phase69:${phase69Ref}`,
      `phase70:${phase70Ref}`,
      `phase72:${phase72Ref}`,
      `phase73:${phase73Ref}`,
      `phase74:${phase74Ref}`,
      `phase75:${phase75Ref}`,
      `phase76:${phase76Ref}`,
      `phase77:${phase77Ref}`,
      `phase78:${phase78Ref}`,
    ],
    sourceFixtureRefs: [
      `phase78-${phase78Ref}`,
      `phase77-${phase77Ref}`,
      `phase76-${phase76Ref}`,
      `phase75-${phase75Ref}`,
      `phase74-${phase74Ref}`,
      `phase73-${phase73Ref}`,
      `phase72-${phase72Ref}`,
      `phase70-${phase70Ref}`,
      `phase69-${phase69Ref}`,
      `phase68-${phase68Ref}`,
      `phase67-${phase67Ref}`,
      `phase66-${phase66Ref}`,
      `phase65-${phase65Ref}`,
    ],
    missingRefs: blueprint.provenanceStatus === 'fail' ? [`phase73-${phase73Ref}`] : [],
  });

  const schemaParity = buildLiveSnapshotSchemaParity({
    schemaParityId: `${fixtureId}-schema-parity`,
    schemaVersion: PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION,
    schemaStatus: blueprint.schemaStatus,
    mismatchFields: blueprint.schemaStatus === 'pass' ? [] : ['schema.version', 'schema.requiredFields'],
  });

  const deterministicSeed = stableDeterministicLiveSnapshotReplayParityAuditChecksum(
    `phase79:${fixtureName}:${PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT}`,
  );
  const expectedChecksum = deterministicSeed;
  const actualChecksum =
    blueprint.integrityStatus === 'pass'
      ? expectedChecksum
      : stableDeterministicLiveSnapshotReplayParityAuditChecksum(`${deterministicSeed}:mismatch`);

  const integrityParity = buildLiveSnapshotIntegrityParity({
    integrityParityId: `${fixtureId}-integrity-parity`,
    expectedChecksum,
    actualChecksum,
    integrityStatus: blueprint.integrityStatus,
    parityMatch: blueprint.integrityStatus === 'pass',
  });

  const promotionGate = buildLiveSnapshotPromotionGate({
    promotionGateId: `${fixtureId}-promotion-gate`,
    promotionStatus: blueprint.promotionStatus,
  });

  const quarantineContract = buildLiveSnapshotReplayParityQuarantineContract({
    quarantineId: `${fixtureId}-quarantine`,
    quarantined: blueprint.quarantined,
    reasonCodes,
  });

  const sourceRefs = provenanceAudit.sourceFixtureRefs;
  const evidenceBundleId = `${fixtureId}-evidence-bundle`;
  const auditEvidence = buildLiveSnapshotAuditEvidence({
    evidenceId: `${fixtureId}-audit-evidence`,
    evidenceBundleId,
    sourceRefs,
    docsRefs: [
      'docs/LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT.md',
      'docs/READ_ONLY_LIVE_SNAPSHOT_CAPTURE.md',
      'docs/PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS.md',
    ],
    validationCommandRefs: [
      'corepack pnpm@10.17.0 test tests/phase79.test.ts',
      'corepack pnpm@10.17.0 test',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const parityScorecard = buildLiveSnapshotParityScorecard({
    parityScorecardId: `${fixtureId}-scorecard`,
    parityScore: Math.max(0, 100 - mismatchCount * 20 - (blueprint.reviewRequired ? 10 : 0)),
    classification:
      blueprint.gateStatus === 'rejected'
        ? 'rejected'
        : blueprint.gateStatus === 'blocked'
          ? 'blocked'
          : blueprint.parityStatus === 'clean'
            ? 'clean'
            : 'warning',
    reviewRequired: blueprint.reviewRequired,
  });

  const parityReport = buildLiveSnapshotParityReport({
    reportId: `${fixtureId}-parity-report`,
    gateSummary: `Gate status: ${blueprint.gateStatus}.`,
    snapshotSummary: `Snapshot input: ${snapshotInput.snapshotInputKind}. Read-only and fixture-only.`,
    replaySummary: `Replay expectation status: ${replayExpectationLinkage.linkageStatus}.`,
    scenarioSummary: `Scenario expectation status: ${scenarioExpectationLinkage.linkageStatus}.`,
    schemaSummary: `Schema parity status: ${schemaParity.schemaStatus}.`,
    integritySummary: `Integrity parity status: ${integrityParity.integrityStatus}.`,
    driftSummary: `Drift status: ${driftClassification.driftStatus}/${driftClassification.driftClass}.`,
    promotionSummary: `Promotion status: ${promotionGate.promotionStatus}. Manual review required.`,
    safetySummary: 'Contract-only parity audit. No runtime replay, no external calls, no execution, and no advisory output.',
  });

  const viewModel = buildLiveSnapshotReplayParityAuditViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: blueprint.gateStatus,
    parityStatus: blueprint.parityStatus,
    promotionStatus: blueprint.promotionStatus,
  });

  const apiContract = buildLiveSnapshotReplayParityAuditApiContract({ fixtureId, fixtureIds: [fixtureId] });
  const capabilityFlags = getLiveSnapshotReplayParityAuditCapabilities();

  const sourcePhase65FixtureSnapshot = Object.freeze([phase65Ref]) as readonly [typeof phase65Ref];
  const sourcePhase66FixtureSnapshot = Object.freeze([phase66Ref]) as readonly [typeof phase66Ref];
  const sourcePhase67FixtureSnapshot = Object.freeze([phase67Ref]) as readonly [typeof phase67Ref];
  const sourcePhase68FixtureSnapshot = Object.freeze([phase68Ref]) as readonly [typeof phase68Ref];
  const sourcePhase69FixtureSnapshot = Object.freeze([phase69Ref]) as readonly [typeof phase69Ref];
  const sourcePhase70FixtureSnapshot = Object.freeze([phase70Ref]) as readonly [typeof phase70Ref];
  const sourcePhase72FixtureSnapshot = Object.freeze([phase72Ref]) as readonly [typeof phase72Ref];
  const sourcePhase73FixtureSnapshot = Object.freeze([phase73Ref]) as readonly [typeof phase73Ref];
  const sourcePhase74FixtureSnapshot = Object.freeze([phase74Ref]) as readonly [typeof phase74Ref];
  const sourcePhase75FixtureSnapshot = Object.freeze([phase75Ref]) as readonly [typeof phase75Ref];
  const sourcePhase76FixtureSnapshot = Object.freeze([phase76Ref]) as readonly [typeof phase76Ref];
  const sourcePhase77FixtureSnapshot = Object.freeze([phase77Ref]) as readonly [typeof phase77Ref];
  const sourcePhase78FixtureSnapshot = Object.freeze([phase78Ref]) as readonly [typeof phase78Ref];

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
    schemaVersion: PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SCHEMA_VERSION,
    parityGate,
    snapshotInput,
    replayExpectationLinkage,
    scenarioExpectationLinkage,
    parityComparison,
    mismatchTaxonomy,
    driftClassification,
    provenanceAudit,
    schemaParity,
    integrityParity,
    promotionGate,
    quarantineContract,
    auditEvidence,
    parityScorecard,
    parityReport,
    report: parityReport,
    viewModel,
    apiContract,
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: blueprint.fixtureKind,
        matched: true,
        source: 'deterministic_fixture_only',
      },
    ],
    capabilityFlags,
    sourcePhase65FixtureSnapshot,
    sourcePhase66FixtureSnapshot,
    sourcePhase67FixtureSnapshot,
    sourcePhase68FixtureSnapshot,
    sourcePhase69FixtureSnapshot,
    sourcePhase70FixtureSnapshot,
    sourcePhase72FixtureSnapshot,
    sourcePhase73FixtureSnapshot,
    sourcePhase74FixtureSnapshot,
    sourcePhase75FixtureSnapshot,
    sourcePhase76FixtureSnapshot,
    sourcePhase77FixtureSnapshot,
    sourcePhase78FixtureSnapshot,
    sourceRefs: {
      phase65FixtureId: `phase65-${phase65Ref}`,
      phase66FixtureId: `phase66-${phase66Ref}`,
      phase67FixtureId: `phase67-${phase67Ref}`,
      phase68FixtureId: `phase68-${phase68Ref}`,
      phase69FixtureId: `phase69-${phase69Ref}`,
      phase70FixtureId: `phase70-${phase70Ref}`,
      phase72FixtureId: `phase72-${phase72Ref}`,
      phase73FixtureId: `phase73-${phase73Ref}`,
      phase74FixtureId: `phase74-${phase74Ref}`,
      phase75FixtureId: `phase75-${phase75Ref}`,
      phase76FixtureId: `phase76-${phase76Ref}`,
      phase77FixtureId: `phase77-${phase77Ref}`,
      phase78FixtureId: `phase78-${phase78Ref}`,
    },
    evidence: {
      evidenceBundleId,
      sourcePhaseRefs: provenanceAudit.sourcePhaseRefs,
      sourceFixtureRefs: provenanceAudit.sourceFixtureRefs,
      validationCommandRefs: auditEvidence.validationCommandRefs,
      docsRefs: auditEvidence.docsRefs,
      evidenceComplete: auditEvidence.evidenceComplete,
    },
    meta: {
      generatedAt: PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_GENERATED_AT,
      source: PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_SOURCE,
      version: PHASE_79_LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_VERSION,
      phase: LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveNetwork: true,
      noRuntimeReplay: true,
      noProviderExpansion: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
