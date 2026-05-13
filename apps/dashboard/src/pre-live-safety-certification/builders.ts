import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { buildPreLiveApprovalPolicy } from './approval-policies.js';
import { buildPreLiveCapabilityAudit } from './capability-audits.js';
import { getPreLiveSafetyCertificationCapabilities } from './capabilities.js';
import { buildPreLiveCertificationContract } from './certification-contracts.js';
import { buildPreLiveCertificationReport } from './certification-reports.js';
import { buildPreLiveApiContract } from './contracts.js';
import { buildPreLiveEvidenceBundle } from './evidence-bundles.js';
import { stableDeterministicPreLiveSafetyCertificationChecksum } from './normalization.js';
import { buildPreLiveProviderReadinessLinkage } from './provider-readiness-linkage.js';
import { buildPreLiveReadinessChecklist } from './readiness-checklists.js';
import { buildPreLiveRejectionContract } from './rejection-contracts.js';
import { buildPreLiveReplayReadinessLinkage } from './replay-readiness-linkage.js';
import { buildPreLiveReport } from './reports.js';
import { buildPreLiveRiskReadinessLinkage } from './risk-readiness-linkage.js';
import { buildPreLiveScenarioReadinessLinkage } from './scenario-readiness-linkage.js';
import { buildPreLiveSafetyGate } from './safety-gates.js';
import { buildPreLiveSafetyInvariant } from './safety-invariants.js';
import { buildPreLiveSignoffModel } from './signoff-models.js';
import { buildPreLiveSmokeReadinessLinkage } from './smoke-readiness-linkage.js';
import { buildPreLiveCertificationScorecard } from './scorecards.js';
import {
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_VERSION,
  PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
  type BuildPreLiveSafetyCertificationFixtureInput,
  type PreLiveCertificationStatus,
  type PreLiveGateStatus,
  type PreLiveSafetyCertificationFixture,
  type PreLiveSafetyCertificationKind,
  type PreLiveSafetyCertificationName,
  type PreLiveSignoffStatus,
} from './types.js';
import { buildPreLiveViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: PreLiveSafetyCertificationKind;
  readonly gateStatus: PreLiveGateStatus;
  readonly checklistStatus: 'passed' | 'warning' | 'failed' | 'blocked';
  readonly certificationStatus: PreLiveCertificationStatus;
  readonly signoffStatus: PreLiveSignoffStatus;
  readonly readOnlyCertified: boolean;
  readonly noExecutionCertified: boolean;
  readonly noWalletCertified: boolean;
  readonly noAdvisoryCertified: boolean;
  readonly offlineCiCertified: boolean;
  readonly evidenceComplete: boolean;
  readonly requiresMultipleApprovers: boolean;
  readonly replayImportComplete: boolean;
  readonly smokeCertified: boolean;
  readonly linked: boolean;
  readonly riskBand: 'low' | 'medium' | 'high';
  readonly score: number;
  readonly blockingReasonCodes: readonly string[];
  readonly rejectionKind: 'missing_evidence' | 'unsafe_capability' | 'policy_violation' | 'documentation_gap';
  readonly rejectionSeverity: 'warning' | 'error' | 'critical';
  readonly checklistCounts: {
    readonly required: number;
    readonly passed: number;
    readonly failed: number;
    readonly warning: number;
  };
}

const BLUEPRINTS: Record<PreLiveSafetyCertificationName, Blueprint> = {
  'complete-read-only-certification-ready': {
    fixtureKind: 'complete_read_only_certification_ready',
    gateStatus: 'ready',
    checklistStatus: 'passed',
    certificationStatus: 'certified',
    signoffStatus: 'approved',
    readOnlyCertified: true,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: true,
    requiresMultipleApprovers: true,
    replayImportComplete: true,
    smokeCertified: true,
    linked: true,
    riskBand: 'low',
    score: 100,
    blockingReasonCodes: [],
    rejectionKind: 'policy_violation',
    rejectionSeverity: 'warning',
    checklistCounts: { required: 12, passed: 12, failed: 0, warning: 0 },
  },
  'missing-smoke-certification-blocked': {
    fixtureKind: 'missing_smoke_certification_blocked',
    gateStatus: 'blocked',
    checklistStatus: 'failed',
    certificationStatus: 'blocked',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: false,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: false,
    requiresMultipleApprovers: true,
    replayImportComplete: true,
    smokeCertified: false,
    linked: true,
    riskBand: 'medium',
    score: 58,
    blockingReasonCodes: ['MISSING_SMOKE_CERTIFICATION'],
    rejectionKind: 'missing_evidence',
    rejectionSeverity: 'error',
    checklistCounts: { required: 12, passed: 8, failed: 2, warning: 2 },
  },
  'replay-import-incomplete-blocked': {
    fixtureKind: 'replay_import_incomplete_blocked',
    gateStatus: 'blocked',
    checklistStatus: 'failed',
    certificationStatus: 'blocked',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: false,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: false,
    requiresMultipleApprovers: true,
    replayImportComplete: false,
    smokeCertified: true,
    linked: true,
    riskBand: 'medium',
    score: 52,
    blockingReasonCodes: ['REPLAY_IMPORT_INCOMPLETE'],
    rejectionKind: 'missing_evidence',
    rejectionSeverity: 'error',
    checklistCounts: { required: 12, passed: 7, failed: 3, warning: 2 },
  },
  'reliability-drift-warning-review-required': {
    fixtureKind: 'reliability_drift_warning_review_required',
    gateStatus: 'review_required',
    checklistStatus: 'warning',
    certificationStatus: 'pending_review',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: true,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: true,
    requiresMultipleApprovers: true,
    replayImportComplete: true,
    smokeCertified: true,
    linked: true,
    riskBand: 'high',
    score: 76,
    blockingReasonCodes: ['RELIABILITY_DRIFT_WARNING'],
    rejectionKind: 'policy_violation',
    rejectionSeverity: 'warning',
    checklistCounts: { required: 12, passed: 10, failed: 0, warning: 2 },
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    checklistStatus: 'blocked',
    certificationStatus: 'rejected',
    signoffStatus: 'rejected',
    readOnlyCertified: false,
    noExecutionCertified: false,
    noWalletCertified: false,
    noAdvisoryCertified: false,
    offlineCiCertified: false,
    evidenceComplete: false,
    requiresMultipleApprovers: true,
    replayImportComplete: false,
    smokeCertified: false,
    linked: false,
    riskBand: 'high',
    score: 20,
    blockingReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    rejectionKind: 'unsafe_capability',
    rejectionSeverity: 'critical',
    checklistCounts: { required: 12, passed: 2, failed: 7, warning: 3 },
  },
  'missing-codeql-review-blocked': {
    fixtureKind: 'missing_codeql_review_blocked',
    gateStatus: 'blocked',
    checklistStatus: 'failed',
    certificationStatus: 'blocked',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: false,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: false,
    requiresMultipleApprovers: true,
    replayImportComplete: true,
    smokeCertified: true,
    linked: true,
    riskBand: 'medium',
    score: 60,
    blockingReasonCodes: ['MISSING_CODEQL_OR_REVIEW'],
    rejectionKind: 'missing_evidence',
    rejectionSeverity: 'error',
    checklistCounts: { required: 12, passed: 9, failed: 2, warning: 1 },
  },
  'manual-approval-required-pending': {
    fixtureKind: 'manual_approval_required_pending',
    gateStatus: 'pending_manual_approval',
    checklistStatus: 'passed',
    certificationStatus: 'pending_review',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: true,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: true,
    requiresMultipleApprovers: true,
    replayImportComplete: true,
    smokeCertified: true,
    linked: true,
    riskBand: 'low',
    score: 88,
    blockingReasonCodes: ['MANUAL_APPROVAL_PENDING'],
    rejectionKind: 'policy_violation',
    rejectionSeverity: 'warning',
    checklistCounts: { required: 12, passed: 12, failed: 0, warning: 0 },
  },
  'documentation-gap-warning': {
    fixtureKind: 'documentation_gap_warning',
    gateStatus: 'review_required',
    checklistStatus: 'warning',
    certificationStatus: 'pending_review',
    signoffStatus: 'pending_manual_review',
    readOnlyCertified: true,
    noExecutionCertified: true,
    noWalletCertified: true,
    noAdvisoryCertified: true,
    offlineCiCertified: true,
    evidenceComplete: false,
    requiresMultipleApprovers: false,
    replayImportComplete: true,
    smokeCertified: true,
    linked: true,
    riskBand: 'medium',
    score: 74,
    blockingReasonCodes: ['DOCUMENTATION_GAP'],
    rejectionKind: 'documentation_gap',
    rejectionSeverity: 'warning',
    checklistCounts: { required: 12, passed: 10, failed: 0, warning: 2 },
  },
};

const SOURCE_INDEXES: Record<PreLiveSafetyCertificationName, number> = {
  'complete-read-only-certification-ready': 0,
  'missing-smoke-certification-blocked': 1,
  'replay-import-incomplete-blocked': 2,
  'reliability-drift-warning-review-required': 3,
  'unsafe-capability-rejected': 4,
  'missing-codeql-review-blocked': 5,
  'manual-approval-required-pending': 6,
  'documentation-gap-warning': 7,
};

const CHECKLIST_ITEMS = [
  'source evidence completeness',
  'capability lock completeness',
  'validation completeness',
  'documentation completeness',
  'review completeness',
  'code quality completeness',
  'codeql completeness',
  'safety grep completeness',
  'provider readiness linkage completeness',
  'replay readiness linkage completeness',
  'scenario readiness linkage completeness',
  'smoke readiness linkage completeness',
] as const;

export function buildPreLiveSafetyCertificationFixture(
  input: BuildPreLiveSafetyCertificationFixtureInput,
): PreLiveSafetyCertificationFixture {
  const { fixtureName } = input;
  const blueprint = BLUEPRINTS[fixtureName];
  const fixtureId = `phase75-${fixtureName}`;
  const sourceIndex = SOURCE_INDEXES[fixtureName];

  const phase65Ref = FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex % FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.length]!;
  const phase66Ref = MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[sourceIndex % MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.length]!;
  const phase67Ref = CROSS_PROVIDER_DATA_QUALITY_NAMES[sourceIndex % CROSS_PROVIDER_DATA_QUALITY_NAMES.length]!;
  const phase68Ref = PROVIDER_AWARE_REPLAY_SCENARIO_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_SCENARIO_NAMES.length]!;
  const phase69Ref = LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[sourceIndex % LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase70Ref = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[sourceIndex % PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.length]!;
  const phase71Ref = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES[sourceIndex % HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES.length]!;
  const phase72Ref = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES[sourceIndex % HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES.length]!;
  const phase73Ref = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.length]!;
  const phase74Ref = CONTROLLED_LIVE_SMOKE_HARNESS_NAMES[sourceIndex % CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length]!;

  const readinessChecklist = buildPreLiveReadinessChecklist({
    checklistId: `${fixtureId}-checklist`,
    checklistName: `${fixtureName}-readiness-checklist`,
    checklistItems: CHECKLIST_ITEMS,
    requiredItemCount: blueprint.checklistCounts.required,
    passedItemCount: blueprint.checklistCounts.passed,
    failedItemCount: blueprint.checklistCounts.failed,
    warningItemCount: blueprint.checklistCounts.warning,
    checklistStatus: blueprint.checklistStatus,
  });

  const safetyGate = buildPreLiveSafetyGate({
    gateId: `${fixtureId}-gate`,
    gateName: `${fixtureName}-pre-live-gate`,
    gateKind: blueprint.gateStatus === 'ready' ? 'read_only_certification' : 'pre_live_safety_review',
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.blockingReasonCodes,
  });

  const certificationContract = buildPreLiveCertificationContract({
    certificationId: `${fixtureId}-certification`,
    certificationKind: 'read_only_readiness',
    readOnlyCertified: blueprint.readOnlyCertified,
    noExecutionCertified: blueprint.noExecutionCertified,
    noWalletCertified: blueprint.noWalletCertified,
    noAdvisoryCertified: blueprint.noAdvisoryCertified,
    offlineCiCertified: blueprint.offlineCiCertified,
    certificationStatus: blueprint.certificationStatus,
  });

  const evidenceBundle = buildPreLiveEvidenceBundle({
    evidenceBundleId: `${fixtureId}-evidence`,
    sourcePhaseRefs: ['phase65', 'phase66', 'phase67', 'phase68', 'phase69', 'phase70', 'phase71', 'phase72', 'phase73', 'phase74'],
    sourceFixtureRefs: [
      `phase65-${phase65Ref}`,
      `phase66-${phase66Ref}`,
      `phase67-${phase67Ref}`,
      `phase68-${phase68Ref}`,
      `phase69-${phase69Ref}`,
      `phase70-${phase70Ref}`,
      `phase71-${phase71Ref}`,
      `phase72-${phase72Ref}`,
      `phase73-${phase73Ref}`,
      `phase74-${phase74Ref}`,
    ],
    validationCommandRefs: [
      'corepack pnpm typecheck',
      'corepack pnpm lint',
      'corepack pnpm test',
      'corepack pnpm --filter @sonic/dashboard build',
      'corepack pnpm --filter @sonic/offline-intelligence build',
    ],
    safetyGrepRefs: ['phase75-safety-pattern-scan'],
    reviewRefs: [
      blueprint.blockingReasonCodes.includes('MISSING_CODEQL_OR_REVIEW') ? 'codeql:missing' : 'codeql:pass',
      blueprint.blockingReasonCodes.includes('MISSING_CODEQL_OR_REVIEW') ? 'code-review:missing' : 'code-review:pass',
    ],
    docsRefs: [
      'docs/PRE_LIVE_SAFETY_CERTIFICATION.md',
      'docs/CONTROLLED_LIVE_SMOKE_HARNESS.md',
      'docs/LIVE_SMOKE_SAFETY_CERTIFICATION.md',
      'docs/PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const signoffModel = buildPreLiveSignoffModel({
    signoffId: `${fixtureId}-signoff`,
    requiresMultipleApprovers: blueprint.requiresMultipleApprovers,
    approverSlots: blueprint.requiresMultipleApprovers
      ? ['safety-reviewer', 'release-reviewer']
      : ['safety-reviewer'],
    signoffStatus: blueprint.signoffStatus,
  });

  const approvalPolicy = buildPreLiveApprovalPolicy({ approvalPolicyId: `${fixtureId}-approval-policy` });
  const rejectionContract = buildPreLiveRejectionContract({
    rejectionId: `${fixtureId}-rejection`,
    rejectionKind: blueprint.rejectionKind,
    severity: blueprint.rejectionSeverity,
    reasonCode: blueprint.blockingReasonCodes[0] ?? 'NONE',
    safetyNotes:
      'Fail-closed pre-live review contract only. Does not authorize live trading or execution and does not imply profitability.',
  });

  const capabilityAudit = buildPreLiveCapabilityAudit({
    auditId: `${fixtureId}-capability-audit`,
    auditStatus: blueprint.gateStatus === 'ready' ? 'pass' : blueprint.gateStatus === 'rejected' ? 'fail' : 'warning',
  });

  const safetyInvariant = buildPreLiveSafetyInvariant({
    invariantId: `${fixtureId}-invariant`,
    invariantKind: 'no_unlock_authority',
    satisfied: blueprint.gateStatus !== 'rejected',
    violationSeverity: blueprint.gateStatus === 'rejected' ? 'critical' : 'warning',
    sourceRefs: ['approval-policy', 'capability-audit', 'safety-gate'],
  });

  const providerReadinessLinkage = buildPreLiveProviderReadinessLinkage({
    linkageId: `${fixtureId}-provider-linkage`,
    sourcePhase66FixtureName: phase66Ref,
    sourcePhase65FixtureName: phase65Ref,
    linked: blueprint.linked,
    reasonCodes: blueprint.blockingReasonCodes,
  });

  const replayReadinessLinkage = buildPreLiveReplayReadinessLinkage({
    linkageId: `${fixtureId}-replay-linkage`,
    sourcePhase73FixtureName: phase73Ref,
    sourcePhase68FixtureName: phase68Ref,
    linked: blueprint.linked,
    replayImportComplete: blueprint.replayImportComplete,
    reasonCodes: blueprint.blockingReasonCodes,
  });

  const scenarioReadinessLinkage = buildPreLiveScenarioReadinessLinkage({
    linkageId: `${fixtureId}-scenario-linkage`,
    sourcePhase72FixtureName: phase72Ref,
    sourcePhase71FixtureName: phase71Ref,
    linked: blueprint.linked,
    reasonCodes: blueprint.blockingReasonCodes,
  });

  const smokeReadinessLinkage = buildPreLiveSmokeReadinessLinkage({
    linkageId: `${fixtureId}-smoke-linkage`,
    sourcePhase74FixtureName: phase74Ref,
    sourcePhase69FixtureName: phase69Ref,
    smokeCertified: blueprint.smokeCertified,
    linked: blueprint.linked,
    reasonCodes: blueprint.blockingReasonCodes,
  });

  const riskReadinessLinkage = buildPreLiveRiskReadinessLinkage({
    linkageId: `${fixtureId}-risk-linkage`,
    sourcePhase70FixtureName: phase70Ref,
    sourcePhase67FixtureName: phase67Ref,
    linked: blueprint.linked,
    riskBand: blueprint.riskBand,
    reasonCodes: blueprint.blockingReasonCodes,
  });

  const scorecard = buildPreLiveCertificationScorecard({
    scorecardId: `${fixtureId}-scorecard`,
    score: blueprint.score,
    maxScore: 100,
    gateStatus: blueprint.gateStatus,
    checklistStatus: blueprint.checklistStatus,
    certificationStatus: blueprint.certificationStatus,
  });

  const certificationReport = buildPreLiveCertificationReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `Gate status: ${blueprint.gateStatus}. Fail-closed: true.`,
    checklistSummary: `Checklist status: ${blueprint.checklistStatus}. Passed ${blueprint.checklistCounts.passed}/${blueprint.checklistCounts.required}.`,
    certificationSummary: `Certification status: ${blueprint.certificationStatus}. Read-only only: ${blueprint.readOnlyCertified}.`,
    evidenceSummary: `Evidence complete: ${blueprint.evidenceComplete}.`,
    signoffSummary: `Signoff status: ${blueprint.signoffStatus}. Manual review required.`,
    approvalSummary: 'Manual approval required. Automatic promotion disabled. Unlock authority remains false.',
    rejectionSummary: `Reason codes: ${blueprint.blockingReasonCodes.join(',') || 'NONE'}.`,
    safetySummary:
      'Certification is contract-only and fail-closed. It does not unlock live trading, manual trading, or execution, and does not authorize advisory output.',
  });

  const report = buildPreLiveReport(certificationReport);
  const viewModel = buildPreLiveViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: blueprint.gateStatus,
    certificationStatus: blueprint.certificationStatus,
    signoffStatus: blueprint.signoffStatus,
  });

  const apiContract = buildPreLiveApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] });
  const capabilityFlags = getPreLiveSafetyCertificationCapabilities();
  const deterministicSeed = stableDeterministicPreLiveSafetyCertificationChecksum(
    `phase75:${fixtureName}:${PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT}`,
  );

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
    schemaVersion: PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
    safetyGate,
    readinessChecklist,
    certificationContract,
    evidenceBundle,
    signoffModel,
    approvalPolicy,
    rejectionContract,
    capabilityAudit,
    safetyInvariant,
    providerReadinessLinkage,
    replayReadinessLinkage,
    scenarioReadinessLinkage,
    smokeReadinessLinkage,
    riskReadinessLinkage,
    scorecard,
    certificationReport,
    report,
    viewModel,
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
    sourcePhase66FixtureSnapshot: [phase66Ref],
    sourcePhase67FixtureSnapshot: [phase67Ref],
    sourcePhase68FixtureSnapshot: [phase68Ref],
    sourcePhase69FixtureSnapshot: [phase69Ref],
    sourcePhase70FixtureSnapshot: [phase70Ref],
    sourcePhase71FixtureSnapshot: [phase71Ref],
    sourcePhase72FixtureSnapshot: [phase72Ref],
    sourcePhase73FixtureSnapshot: [phase73Ref],
    sourcePhase74FixtureSnapshot: [phase74Ref],
    sourceRefs: {
      phase65FixtureId: `phase65-${phase65Ref}`,
      phase66FixtureId: `phase66-${phase66Ref}`,
      phase67FixtureId: `phase67-${phase67Ref}`,
      phase68FixtureId: `phase68-${phase68Ref}`,
      phase69FixtureId: `phase69-${phase69Ref}`,
      phase70FixtureId: `phase70-${phase70Ref}`,
      phase71FixtureId: `phase71-${phase71Ref}`,
      phase72FixtureId: `phase72-${phase72Ref}`,
      phase73FixtureId: `phase73-${phase73Ref}`,
      phase74FixtureId: `phase74-${phase74Ref}`,
    },
    meta: {
      generatedAt: PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT,
      source: PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE,
      version: PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_VERSION,
      phase: PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveNetwork: true,
      noSecretsRequired: true,
      noProviderExpansion: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };
}
