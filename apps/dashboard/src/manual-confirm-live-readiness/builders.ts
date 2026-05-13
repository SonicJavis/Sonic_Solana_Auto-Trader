import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { buildManualConfirmApprovalPolicy } from './approval-policies.js';
import { buildManualConfirmCapabilityAudit } from './capability-audits.js';
import { getManualConfirmLiveReadinessCapabilities } from './capabilities.js';
import { buildManualConfirmCertificationLinkage } from './certification-linkage.js';
import { buildManualConfirmPhraseContract } from './confirmation-phrases.js';
import { buildManualConfirmApiContract } from './contracts.js';
import { buildManualConfirmCoolingOffPolicy } from './cooling-off-policies.js';
import { buildManualConfirmOperatorChecklist } from './operator-checklists.js';
import { buildManualConfirmPreflightEvidence } from './preflight-evidence.js';
import { buildManualConfirmProviderReadinessLinkage } from './provider-readiness-linkage.js';
import { buildManualConfirmReadinessGate } from './readiness-gates.js';
import { buildManualConfirmReadinessReport } from './readiness-reports.js';
import { buildManualConfirmRejectionContract } from './rejection-contracts.js';
import { buildManualConfirmReplayReadinessLinkage } from './replay-readiness-linkage.js';
import { buildManualConfirmRiskAcknowledgement } from './risk-acknowledgements.js';
import { buildManualConfirmRoleSeparation } from './role-separation.js';
import { buildManualConfirmSafetyInvariant } from './safety-invariants.js';
import { buildManualConfirmScenarioReadinessLinkage } from './scenario-readiness-linkage.js';
import { buildManualConfirmScorecard } from './scorecards.js';
import { buildManualConfirmSmokeReadinessLinkage } from './smoke-readiness-linkage.js';
import { buildManualConfirmViewModel } from './view-models.js';
import { stableDeterministicManualConfirmChecksum } from './normalization.js';
import {
  MANUAL_CONFIRM_LIVE_READINESS_PHASE,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_VERSION,
  type BuildManualConfirmLiveReadinessFixtureInput,
  type ManualConfirmApprovalStatus,
  type ManualConfirmChecklistStatus,
  type ManualConfirmCoolingOffStatus,
  type ManualConfirmGateStatus,
  type ManualConfirmLiveReadinessFixture,
  type ManualConfirmLiveReadinessKind,
  type ManualConfirmLiveReadinessName,
  type ManualConfirmPhraseStatus,
  type ManualConfirmRejectionKind,
  type ManualConfirmRejectionSeverity,
  type ManualConfirmRoleStatus,
} from './types.js';

interface Blueprint {
  readonly fixtureKind: ManualConfirmLiveReadinessKind;
  readonly gateStatus: ManualConfirmGateStatus;
  readonly checklistStatus: ManualConfirmChecklistStatus;
  readonly approvalStatus: ManualConfirmApprovalStatus;
  readonly phraseStatus: ManualConfirmPhraseStatus;
  readonly roleSeparationStatus: ManualConfirmRoleStatus;
  readonly coolingOffStatus: ManualConfirmCoolingOffStatus;
  readonly separationSatisfied: boolean;
  readonly phraseMatched: boolean;
  readonly smokeCertified: boolean;
  readonly replayImportComplete: boolean;
  readonly certificationVerified: boolean;
  readonly evidenceComplete: boolean;
  readonly riskAcknowledged: boolean;
  readonly coolingOffRequired: boolean;
  readonly multipleApproversRequired: boolean;
  readonly score: number;
  readonly blockingReasonCodes: readonly string[];
  readonly rejectionKind: ManualConfirmRejectionKind;
  readonly rejectionSeverity: ManualConfirmRejectionSeverity;
  readonly checklistCounts: {
    readonly passed: number;
    readonly failed: number;
    readonly warning: number;
  };
}

const BLUEPRINTS: Record<ManualConfirmLiveReadinessName, Blueprint> = {
  'manual-confirm-readiness-complete': {
    fixtureKind: 'manual_confirm_readiness_complete',
    gateStatus: 'ready',
    checklistStatus: 'passed',
    approvalStatus: 'approved',
    phraseStatus: 'phrase_matched',
    roleSeparationStatus: 'separation_satisfied',
    coolingOffStatus: 'completed_by_label',
    separationSatisfied: true,
    phraseMatched: true,
    smokeCertified: true,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: true,
    riskAcknowledged: true,
    coolingOffRequired: true,
    multipleApproversRequired: true,
    score: 100,
    blockingReasonCodes: [],
    rejectionKind: 'policy_violation',
    rejectionSeverity: 'warning',
    checklistCounts: { passed: 14, failed: 0, warning: 0 },
  },
  'missing-prelive-certification-blocked': {
    fixtureKind: 'missing_prelive_certification_blocked',
    gateStatus: 'blocked',
    checklistStatus: 'failed',
    approvalStatus: 'pending_manual_review',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'pending_assignment',
    coolingOffStatus: 'not_required',
    separationSatisfied: false,
    phraseMatched: false,
    smokeCertified: false,
    replayImportComplete: false,
    certificationVerified: false,
    evidenceComplete: false,
    riskAcknowledged: false,
    coolingOffRequired: false,
    multipleApproversRequired: true,
    score: 20,
    blockingReasonCodes: ['MISSING_PRELIVE_CERTIFICATION', 'MISSING_SMOKE_CERTIFICATION'],
    rejectionKind: 'missing_evidence',
    rejectionSeverity: 'critical',
    checklistCounts: { passed: 3, failed: 8, warning: 3 },
  },
  'smoke-readiness-warning-review-required': {
    fixtureKind: 'smoke_readiness_warning_review_required',
    gateStatus: 'review_required',
    checklistStatus: 'warning',
    approvalStatus: 'pending_manual_review',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'pending_assignment',
    coolingOffStatus: 'not_required',
    separationSatisfied: false,
    phraseMatched: false,
    smokeCertified: false,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: false,
    riskAcknowledged: false,
    coolingOffRequired: false,
    multipleApproversRequired: true,
    score: 58,
    blockingReasonCodes: ['SMOKE_READINESS_WARNING'],
    rejectionKind: 'missing_evidence',
    rejectionSeverity: 'error',
    checklistCounts: { passed: 8, failed: 2, warning: 4 },
  },
  'role-separation-violation-rejected': {
    fixtureKind: 'role_separation_violation_rejected',
    gateStatus: 'rejected',
    checklistStatus: 'failed',
    approvalStatus: 'rejected',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'violation_detected',
    coolingOffStatus: 'not_required',
    separationSatisfied: false,
    phraseMatched: false,
    smokeCertified: true,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: true,
    riskAcknowledged: false,
    coolingOffRequired: false,
    multipleApproversRequired: true,
    score: 35,
    blockingReasonCodes: ['ROLE_SEPARATION_VIOLATION', 'SAME_ACTOR_DETECTED'],
    rejectionKind: 'role_separation_violation',
    rejectionSeverity: 'critical',
    checklistCounts: { passed: 5, failed: 7, warning: 2 },
  },
  'confirmation-phrase-missing-blocked': {
    fixtureKind: 'confirmation_phrase_missing_blocked',
    gateStatus: 'blocked',
    checklistStatus: 'failed',
    approvalStatus: 'pending_manual_review',
    phraseStatus: 'phrase_missing',
    roleSeparationStatus: 'separation_satisfied',
    coolingOffStatus: 'completed_by_label',
    separationSatisfied: true,
    phraseMatched: false,
    smokeCertified: true,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: true,
    riskAcknowledged: true,
    coolingOffRequired: true,
    multipleApproversRequired: true,
    score: 60,
    blockingReasonCodes: ['CONFIRMATION_PHRASE_MISSING'],
    rejectionKind: 'phrase_missing',
    rejectionSeverity: 'error',
    checklistCounts: { passed: 9, failed: 3, warning: 2 },
  },
  'cooling-off-required-pending': {
    fixtureKind: 'cooling_off_required_pending',
    gateStatus: 'cooling_off_pending',
    checklistStatus: 'warning',
    approvalStatus: 'pending_manual_review',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'separation_satisfied',
    coolingOffStatus: 'pending',
    separationSatisfied: true,
    phraseMatched: false,
    smokeCertified: true,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: true,
    riskAcknowledged: false,
    coolingOffRequired: true,
    multipleApproversRequired: true,
    score: 72,
    blockingReasonCodes: ['COOLING_OFF_REQUIRED', 'COOLING_OFF_LABEL_PENDING'],
    rejectionKind: 'cooling_off_required',
    rejectionSeverity: 'warning',
    checklistCounts: { passed: 10, failed: 1, warning: 3 },
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    checklistStatus: 'failed',
    approvalStatus: 'rejected',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'pending_assignment',
    coolingOffStatus: 'not_required',
    separationSatisfied: false,
    phraseMatched: false,
    smokeCertified: false,
    replayImportComplete: false,
    certificationVerified: false,
    evidenceComplete: false,
    riskAcknowledged: false,
    coolingOffRequired: false,
    multipleApproversRequired: true,
    score: 0,
    blockingReasonCodes: ['UNSAFE_CAPABILITY_DETECTED', 'FULL_AUTO_CAPABILITY_PRESENT'],
    rejectionKind: 'unsafe_capability',
    rejectionSeverity: 'critical',
    checklistCounts: { passed: 0, failed: 14, warning: 0 },
  },
  'documentation-review-warning': {
    fixtureKind: 'documentation_review_warning',
    gateStatus: 'review_required',
    checklistStatus: 'warning',
    approvalStatus: 'pending_manual_review',
    phraseStatus: 'phrase_required',
    roleSeparationStatus: 'pending_assignment',
    coolingOffStatus: 'not_required',
    separationSatisfied: false,
    phraseMatched: false,
    smokeCertified: true,
    replayImportComplete: true,
    certificationVerified: true,
    evidenceComplete: false,
    riskAcknowledged: false,
    coolingOffRequired: false,
    multipleApproversRequired: true,
    score: 50,
    blockingReasonCodes: ['DOCUMENTATION_GAP_DETECTED'],
    rejectionKind: 'documentation_gap',
    rejectionSeverity: 'warning',
    checklistCounts: { passed: 7, failed: 2, warning: 5 },
  },
};

export function buildManualConfirmLiveReadinessFixture(
  input: BuildManualConfirmLiveReadinessFixtureInput,
): ManualConfirmLiveReadinessFixture {
  const fixtureName: ManualConfirmLiveReadinessName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = MANUAL_CONFIRM_LIVE_READINESS_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase76-${fixtureName}`;

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
  const phase75Ref = PRE_LIVE_SAFETY_CERTIFICATION_NAMES[sourceIndex % PRE_LIVE_SAFETY_CERTIFICATION_NAMES.length]!;

  const totalItems = blueprint.checklistCounts.passed + blueprint.checklistCounts.failed + blueprint.checklistCounts.warning;
  const checklistItems = Array.from({ length: Math.max(totalItems, 1) }, (_, i) => {
    const status =
      i < blueprint.checklistCounts.passed
        ? ('passed' as const)
        : i < blueprint.checklistCounts.passed + blueprint.checklistCounts.failed
          ? ('failed' as const)
          : ('warning' as const);
    return {
      itemId: `${fixtureId}-checklist-item-${i + 1}`,
      description: `Readiness item ${i + 1} for ${fixtureName}`,
      status,
      phaseRef: `phase${65 + (i % 11)}`,
    };
  });

  const readinessGate = buildManualConfirmReadinessGate({
    readinessGateId: `${fixtureId}-gate`,
    readinessGateName: `phase76-gate-${fixtureName}`,
    readinessGateKind: 'manual_confirm_approval_gate',
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.blockingReasonCodes,
  });

  const approvalPolicy = buildManualConfirmApprovalPolicy({
    approvalPolicyId: `${fixtureId}-approval-policy`,
    multipleApproversRequired: blueprint.multipleApproversRequired,
    approvalStatus: blueprint.approvalStatus,
  });

  const phraseContract = buildManualConfirmPhraseContract({
    phraseId: `${fixtureId}-phrase`,
    phraseKind: 'manual_confirm_live_readiness',
    exactPhrase: 'I confirm I have read and understood the Phase 76 manual-confirm live readiness contract.',
    phraseMatched: blueprint.phraseMatched,
    phraseStatus: blueprint.phraseStatus,
  });

  const roleSeparation = buildManualConfirmRoleSeparation({
    roleSeparationId: `${fixtureId}-role-separation`,
    requesterRole: 'readiness-requester',
    reviewerRole: 'safety-reviewer',
    approverRole: 'release-approver',
    separationSatisfied: blueprint.separationSatisfied,
    violationReasonCodes: blueprint.separationSatisfied ? [] : blueprint.blockingReasonCodes.filter(c => c.includes('ROLE') || c.includes('ACTOR')),
    roleSeparationStatus: blueprint.roleSeparationStatus,
  });

  const coolingOffPolicy = buildManualConfirmCoolingOffPolicy({
    coolingOffId: `${fixtureId}-cooling-off`,
    coolingOffRequired: blueprint.coolingOffRequired,
    deterministicWindowLabel: blueprint.coolingOffRequired ? 'phase76-cooling-off-7d-label' : 'phase76-no-cooling-off',
    coolingOffStatus: blueprint.coolingOffStatus,
  });

  const riskAcknowledgement = buildManualConfirmRiskAcknowledgement({
    acknowledgementId: `${fixtureId}-risk-ack`,
    riskAcknowledged: blueprint.riskAcknowledged,
    sourceEvidenceRefs: [
      `phase65-evidence:${phase65Ref}`,
      `phase66-evidence:${phase66Ref}`,
      `phase75-evidence:${phase75Ref}`,
    ],
    acknowledgementStatus: blueprint.riskAcknowledged ? 'acknowledged' : 'pending',
  });

  const operatorChecklist = buildManualConfirmOperatorChecklist({
    checklistId: `${fixtureId}-checklist`,
    checklistItems,
    checklistStatus: blueprint.checklistStatus,
  });

  const preflightEvidence = buildManualConfirmPreflightEvidence({
    evidenceBundleId: `${fixtureId}-evidence`,
    sourcePhaseRefs: [
      `phase65:${phase65Ref}`,
      `phase66:${phase66Ref}`,
      `phase67:${phase67Ref}`,
      `phase68:${phase68Ref}`,
      `phase69:${phase69Ref}`,
      `phase70:${phase70Ref}`,
      `phase71:${phase71Ref}`,
      `phase72:${phase72Ref}`,
      `phase73:${phase73Ref}`,
      `phase74:${phase74Ref}`,
      `phase75:${phase75Ref}`,
    ],
    sourceFixtureRefs: [
      `phase65-${phase65Ref}`,
      `phase66-${phase66Ref}`,
      `phase74-${phase74Ref}`,
      `phase75-${phase75Ref}`,
    ],
    validationCommandRefs: [
      'corepack pnpm typecheck',
      'corepack pnpm lint',
      'corepack pnpm test',
      'corepack pnpm --filter @sonic/dashboard build',
    ],
    safetyGrepRefs: [
      'grep -r privateKey apps/',
      'grep -r signTransaction apps/',
      'grep -r sendTransaction apps/',
    ],
    reviewRefs: ['docs/MANUAL_CONFIRM_LIVE_READINESS.md', 'docs/SAFETY_RULES.md'],
    docsRefs: [
      'docs/MANUAL_CONFIRM_LIVE_READINESS.md',
      'docs/PRE_LIVE_SAFETY_CERTIFICATION.md',
      'docs/CONTROLLED_LIVE_SMOKE_HARNESS.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const rejectionContract = buildManualConfirmRejectionContract({
    rejectionId: `${fixtureId}-rejection`,
    rejectionKind: blueprint.rejectionKind,
    rejectionSeverity: blueprint.rejectionSeverity,
    rejectionReasonCodes: blueprint.blockingReasonCodes.length > 0 ? blueprint.blockingReasonCodes : ['NONE'],
  });

  const capabilityAudit = buildManualConfirmCapabilityAudit({
    auditId: `${fixtureId}-capability-audit`,
    auditStatus: blueprint.gateStatus === 'ready' ? 'pass' : blueprint.gateStatus === 'rejected' ? 'fail' : 'warning',
  });

  const safetyInvariant = buildManualConfirmSafetyInvariant({
    invariantId: `${fixtureId}-invariant`,
    invariantKind: 'no_unlock_authority',
    invariantHolds: blueprint.gateStatus !== 'rejected',
    evidenceRef: `${fixtureId}-capability-audit`,
  });

  const providerReadinessLinkage = buildManualConfirmProviderReadinessLinkage({
    linkageId: `${fixtureId}-provider-linkage`,
    phase65FixtureRef: phase65Ref,
    phase66FixtureRef: phase66Ref,
    providerReadinessVerified: blueprint.certificationVerified,
  });

  const smokeReadinessLinkage = buildManualConfirmSmokeReadinessLinkage({
    linkageId: `${fixtureId}-smoke-linkage`,
    phase69FixtureRef: phase69Ref,
    phase74FixtureRef: phase74Ref,
    smokeCertified: blueprint.smokeCertified,
    smokeStatus: blueprint.smokeCertified ? 'certified' : 'not_certified',
  });

  const certificationLinkage = buildManualConfirmCertificationLinkage({
    linkageId: `${fixtureId}-certification-linkage`,
    phase75FixtureRef: phase75Ref,
    certificationVerified: blueprint.certificationVerified,
    certificationStatus: blueprint.certificationVerified ? 'verified' : 'not_verified',
  });

  const replayReadinessLinkage = buildManualConfirmReplayReadinessLinkage({
    linkageId: `${fixtureId}-replay-linkage`,
    phase68FixtureRef: phase68Ref,
    phase73FixtureRef: phase73Ref,
    replayImportComplete: blueprint.replayImportComplete,
    replayStatus: blueprint.replayImportComplete ? 'complete' : 'incomplete',
  });

  const scenarioReadinessLinkage = buildManualConfirmScenarioReadinessLinkage({
    linkageId: `${fixtureId}-scenario-linkage`,
    phase72FixtureRef: phase72Ref,
    scenarioReadinessVerified: blueprint.certificationVerified,
    scenarioStatus: blueprint.certificationVerified ? 'verified' : 'not_verified',
  });

  const scorecard = buildManualConfirmScorecard({
    scorecardId: `${fixtureId}-scorecard`,
    score: blueprint.score,
    maxScore: 100,
    gateStatus: blueprint.gateStatus,
    checklistStatus: blueprint.checklistStatus,
    approvalStatus: blueprint.approvalStatus,
  });

  const readinessReport = buildManualConfirmReadinessReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `Gate status: ${blueprint.gateStatus}. Fail-closed: true.`,
    approvalSummary: `Approval: ${blueprint.approvalStatus}. Manual approval required. No automatic promotion.`,
    confirmationSummary: `Phrase status: ${blueprint.phraseStatus}. Command dispatch: disabled.`,
    roleSeparationSummary: `Role separation: ${blueprint.roleSeparationStatus}. Same actor: disabled.`,
    coolingOffSummary: `Cooling-off: ${blueprint.coolingOffStatus}. Runtime timers: disabled.`,
    riskAcknowledgementSummary: `Risk acknowledged: ${blueprint.riskAcknowledged}. Advisory: disabled.`,
    checklistSummary: `Checklist: ${blueprint.checklistStatus}. Passed ${blueprint.checklistCounts.passed}.`,
    evidenceSummary: `Evidence complete: ${blueprint.evidenceComplete}.`,
    safetySummary: 'Contract-only. Fail-closed. Does not unlock live mode or authorize execution.',
    overallStatus: blueprint.gateStatus,
  });

  const viewModel = buildManualConfirmViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: blueprint.gateStatus,
    approvalStatus: blueprint.approvalStatus,
    phraseStatus: blueprint.phraseStatus,
    roleSeparationStatus: blueprint.roleSeparationStatus,
    coolingOffStatus: blueprint.coolingOffStatus,
    checklistStatus: blueprint.checklistStatus,
  });

  const apiContract = buildManualConfirmApiContract({ fixtureId, viewModel, fixtureIds: [fixtureId] });
  const capabilityFlags = getManualConfirmLiveReadinessCapabilities();
  const deterministicSeed = stableDeterministicManualConfirmChecksum(
    `phase76:${fixtureName}:${PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT}`,
  );

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: MANUAL_CONFIRM_LIVE_READINESS_PHASE,
    schemaVersion: PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION,
    readinessGate,
    approvalPolicy,
    phraseContract,
    roleSeparation,
    coolingOffPolicy,
    riskAcknowledgement,
    operatorChecklist,
    preflightEvidence,
    rejectionContract,
    capabilityAudit,
    safetyInvariant,
    providerReadinessLinkage,
    smokeReadinessLinkage,
    certificationLinkage,
    replayReadinessLinkage,
    scenarioReadinessLinkage,
    scorecard,
    readinessReport,
    report: readinessReport,
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
    sourcePhase75FixtureSnapshot: [phase75Ref],
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
      phase75FixtureId: `phase75-${phase75Ref}`,
    },
    meta: {
      generatedAt: PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT,
      source: PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE,
      version: PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_VERSION,
      phase: MANUAL_CONFIRM_LIVE_READINESS_PHASE,
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
