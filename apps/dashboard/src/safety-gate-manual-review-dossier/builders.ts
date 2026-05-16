import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES } from '../execution-outcome-audit-contracts/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../launch-risk-engine/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES } from '../live-snapshot-fixture-promotion-review/index.js';
import { LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES } from '../live-snapshot-replay-parity-audit/index.js';
import { MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES } from '../manual-confirm-dry-run-control/index.js';
import { MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES } from '../manual-confirm-execution-boundary/index.js';
import { MANUAL_CONFIRM_LIVE_READINESS_NAMES } from '../manual-confirm-live-readiness/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES } from '../outcome-risk-feedback-contracts/index.js';
import { POST_SEND_OBSERVATION_BOUNDARY_NAMES } from '../post-send-observation-boundary/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES } from '../read-only-live-snapshot-capture/index.js';
import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES,
} from '../risk-feedback-safety-gate-reevaluation/index.js';
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../risk-explanation-evidence/index.js';
import { SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES } from '../signing-boundary-safety-contracts/index.js';
import { TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES } from '../transaction-construction-contract-mocks/index.js';
import { TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES } from '../transaction-send-boundary-safety/index.js';
import { buildDossierAbortContract } from './abort-contracts.js';
import { buildApprovalDenialContract } from './approval-denial-contracts.js';
import { buildDossierAuditTrailLinkage } from './audit-trail-linkage.js';
import { buildDossierCapabilityAudit } from './capability-audits.js';
import { getSafetyGateManualReviewDossierCapabilities } from './capabilities.js';
import { buildDossierCertificationLinkage } from './certification-linkage.js';
import { buildDossierReport } from './dossier-reports.js';
import { buildDossierScorecard } from './dossier-scorecards.js';
import { buildDossierGate } from './dossier-gates.js';
import { buildEvidencePacket } from './evidence-packets.js';
import { buildEscalationReviewPlaceholder } from './escalation-review-placeholders.js';
import { buildDossierFeedbackLinkage } from './feedback-linkage.js';
import { stableDeterministicSafetyGateManualReviewDossierChecksum } from './normalization.js';
import { buildDossierOutcomeLinkage } from './outcome-linkage.js';
import { buildPolicyReviewPlaceholder } from './policy-review-placeholders.js';
import { buildReadinessReviewPlaceholder } from './readiness-review-placeholders.js';
import { buildDossierReevaluationLinkage } from './reevaluation-linkage.js';
import { buildReviewDossierHeader } from './review-dossier-headers.js';
import { buildReviewerChecklist } from './reviewer-checklists.js';
import { buildDossierRiskLinkage } from './risk-linkage.js';
import { buildDossierRollbackContract } from './rollback-contracts.js';
import { buildDossierSafetyInvariants } from './safety-invariants.js';
import { buildSignoffPlaceholder } from './signoff-placeholders.js';
import {
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_VERSION,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type BuildSafetyGateManualReviewDossierFixtureInput,
  type DossierReport,
  type SafetyGateManualReviewDossierFixture,
  type SafetyGateManualReviewDossierKind,
  type SafetyGateManualReviewDossierName,
  type SafetyGateManualReviewDossierViewModel,
} from './types.js';
import { buildUnresolvedBlockerSummary } from './unresolved-blocker-summaries.js';

interface Blueprint {
  readonly fixtureKind: SafetyGateManualReviewDossierKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
  readonly blockerCode: string;
  readonly auditScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly evidenceComplete: boolean;
  readonly checklistComplete: boolean;
  readonly unresolvedBlockerCount: number;
  readonly hasReevaluationRef: boolean;
}

const BLUEPRINTS: Record<SafetyGateManualReviewDossierName, Blueprint> = {
  'manual-review-dossier-ready': {
    fixtureKind: 'manual_review_dossier_ready',
    gateStatus: 'ready',
    linkageStatus: 'linked',
    blockerCode: 'NONE',
    auditScore: 100,
    classification: 'ready',
    evidenceComplete: true,
    checklistComplete: true,
    unresolvedBlockerCount: 0,
    hasReevaluationRef: true,
  },
  'missing-reevaluation-ref-blocked': {
    fixtureKind: 'missing_reevaluation_ref_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'MISSING_REEVALUATION_REF',
    auditScore: 30,
    classification: 'blocked',
    evidenceComplete: true,
    checklistComplete: true,
    unresolvedBlockerCount: 1,
    hasReevaluationRef: false,
  },
  'missing-evidence-packet-blocked': {
    fixtureKind: 'missing_evidence_packet_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'MISSING_EVIDENCE_PACKET',
    auditScore: 20,
    classification: 'blocked',
    evidenceComplete: false,
    checklistComplete: true,
    unresolvedBlockerCount: 1,
    hasReevaluationRef: true,
  },
  'reviewer-checklist-incomplete-blocked': {
    fixtureKind: 'reviewer_checklist_incomplete_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'warning',
    blockerCode: 'REVIEWER_CHECKLIST_INCOMPLETE',
    auditScore: 40,
    classification: 'blocked',
    evidenceComplete: true,
    checklistComplete: false,
    unresolvedBlockerCount: 1,
    hasReevaluationRef: true,
  },
  'signoff-placeholder-only': {
    fixtureKind: 'signoff_placeholder_only',
    gateStatus: 'review_required',
    linkageStatus: 'warning',
    blockerCode: 'SIGNOFF_PLACEHOLDER_ONLY',
    auditScore: 70,
    classification: 'warning',
    evidenceComplete: true,
    checklistComplete: true,
    unresolvedBlockerCount: 1,
    hasReevaluationRef: true,
  },
  'unresolved-blockers-preserved': {
    fixtureKind: 'unresolved_blockers_preserved',
    gateStatus: 'blocked',
    linkageStatus: 'warning',
    blockerCode: 'UNRESOLVED_BLOCKERS_PRESERVED',
    auditScore: 60,
    classification: 'warning',
    evidenceComplete: true,
    checklistComplete: true,
    unresolvedBlockerCount: 3,
    hasReevaluationRef: true,
  },
  'automatic-approval-denied': {
    fixtureKind: 'automatic_approval_denied',
    gateStatus: 'review_required',
    linkageStatus: 'warning',
    blockerCode: 'AUTOMATIC_APPROVAL_DENIED',
    auditScore: 80,
    classification: 'warning',
    evidenceComplete: true,
    checklistComplete: true,
    unresolvedBlockerCount: 1,
    hasReevaluationRef: true,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    linkageStatus: 'blocked',
    blockerCode: 'UNSAFE_CAPABILITY_REJECTED',
    auditScore: 0,
    classification: 'rejected',
    evidenceComplete: false,
    checklistComplete: false,
    unresolvedBlockerCount: 4,
    hasReevaluationRef: true,
  },
};

export function buildSafetyGateManualReviewDossierFixture(
  input: BuildSafetyGateManualReviewDossierFixtureInput,
): SafetyGateManualReviewDossierFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const fixtureId = `phase89-${fixtureName}`;

  const phase88Ref = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES[0]!;
  const phase87Ref = OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES[0]!;
  const phase86Ref = EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES[0]!;
  const phase85Ref = POST_SEND_OBSERVATION_BOUNDARY_NAMES[0]!;
  const phase84Ref = TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES[0]!;
  const phase83Ref = SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES[0]!;
  const phase82Ref = TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES[0]!;
  const phase81Ref = MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES[0]!;
  const phase80Ref = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES[0]!;
  const phase79Ref = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES[0]!;
  const phase78Ref = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES[0]!;
  const phase77Ref = MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES[0]!;
  const phase76Ref = MANUAL_CONFIRM_LIVE_READINESS_NAMES[0]!;
  const phase75Ref = PRE_LIVE_SAFETY_CERTIFICATION_NAMES[0]!;
  const phase74Ref = CONTROLLED_LIVE_SMOKE_HARNESS_NAMES[0]!;
  const phase73Ref = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES[0]!;
  const phase72Ref = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES[0]!;
  const phase70Ref = PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[0]!;
  const phase69Ref = LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[0]!;
  const phase68Ref = PROVIDER_AWARE_REPLAY_SCENARIO_NAMES[0]!;
  const phase67Ref = CROSS_PROVIDER_DATA_QUALITY_NAMES[0]!;
  const phase66Ref = MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[0]!;
  const phase65Ref = FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[0]!;
  const phase59Ref = RISK_EXPLANATION_EVIDENCE_NAMES[0]!;
  const phase58Ref = LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES[0]!;

  const sourceFixtureRefs = [
    `phase88-${phase88Ref}`,
    `phase87-${phase87Ref}`,
    `phase86-${phase86Ref}`,
    `phase85-${phase85Ref}`,
    `phase84-${phase84Ref}`,
    `phase83-${phase83Ref}`,
    `phase82-${phase82Ref}`,
    `phase81-${phase81Ref}`,
    `phase80-${phase80Ref}`,
    `phase79-${phase79Ref}`,
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
    `phase59-${phase59Ref}`,
    `phase58-${phase58Ref}`,
  ];

  const dossierGate = buildDossierGate({
    id: `${fixtureId}-gate`,
    name: `Phase 89 Manual Review Dossier Gate: ${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.gateStatus === 'ready' ? [] : [blueprint.blockerCode, 'FAIL_CLOSED'],
  });

  const reviewDossierHeader = buildReviewDossierHeader({
    id: `${fixtureId}-header`,
    dossierName: `Manual Review Dossier ${fixtureName}`,
    sourceReevaluationFixtureRef: blueprint.hasReevaluationRef ? `phase88-${phase88Ref}` : 'missing-phase88-ref',
    sourceFeedbackFixtureRef: `phase87-${phase87Ref}`,
  });

  const reviewerChecklist = buildReviewerChecklist({
    id: `${fixtureId}-checklist`,
    checklistItems: blueprint.checklistComplete
      ? ['confirm-evidence-packet', 'confirm-maker-checker', 'confirm-fail-closed', 'confirm-no-unlock-authority']
      : ['confirm-evidence-packet'],
    requiredReviewerCount: 2,
  });

  const evidencePacket = buildEvidencePacket({
    id: `${fixtureId}-evidence-packet`,
    sourcePhaseRefs: [
      'phase88', 'phase87', 'phase86', 'phase85', 'phase84', 'phase83', 'phase82',
      'phase81', 'phase80', 'phase79', 'phase78', 'phase77', 'phase76', 'phase75',
      'phase74', 'phase73', 'phase72', 'phase70', 'phase69', 'phase68', 'phase67',
      'phase66', 'phase65', 'phase59', 'phase58',
    ],
    sourceFixtureRefs,
    reevaluationRefs: blueprint.hasReevaluationRef ? [`phase88-${phase88Ref}`] : [],
    feedbackRefs: [`phase87-${phase87Ref}`],
    riskRefs: [`phase58-${phase58Ref}`, `phase59-${phase59Ref}`],
    outcomeRefs: [`phase86-${phase86Ref}`],
    certificationRefs: [`phase75-${phase75Ref}`, `phase69-${phase69Ref}`],
    validationCommandRefs: [
      'corepack pnpm@10.17.0 typecheck',
      'corepack pnpm@10.17.0 lint',
      'corepack pnpm@10.17.0 test tests/phase89.test.ts',
      'corepack pnpm@10.17.0 --filter @sonic/dashboard build',
      'corepack pnpm@10.17.0 --filter @sonic/offline-intelligence build',
    ],
    safetyGrepRefs: [
      'privateKey', 'secretKey', 'seedPhrase', 'mnemonic', 'Keypair', 'signTransaction',
      'sendTransaction', 'wallet', 'execute', 'swap', 'buy', 'sell', 'trade', 'order',
      'RPC', 'fetch(', 'axios', 'request', 'writeFile', 'createWriteStream', 'setInterval',
      'setTimeout', 'queue', 'route handler', 'server listen', 'recommendation', 'signal',
      'investment advice', 'profit', 'PnL', 'apiKey', 'providerSdk', 'postinstall', 'drainer',
    ],
    docsRefs: [
      'docs/SAFETY_GATE_MANUAL_REVIEW_DOSSIER.md',
      'docs/RISK_FEEDBACK_SAFETY_GATE_REEVALUATION.md',
      'docs/SAFETY_RULES.md',
      'docs/ARCHITECTURE.md',
      'docs/PHASE_LOG.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const signoffPlaceholder = buildSignoffPlaceholder({
    id: `${fixtureId}-signoff`,
    reasonCodes: [blueprint.blockerCode, 'PLACEHOLDER_ONLY'],
  });

  const unresolvedBlockerSummary = buildUnresolvedBlockerSummary({
    id: `${fixtureId}-blocker-summary`,
    unresolvedBlockerCount: blueprint.unresolvedBlockerCount,
  });

  const escalationReviewPlaceholder = buildEscalationReviewPlaceholder({
    id: `${fixtureId}-escalation`,
    reasonCodes: [blueprint.blockerCode],
  });

  const policyReviewPlaceholder = buildPolicyReviewPlaceholder({
    id: `${fixtureId}-policy-review`,
    reasonCodes: [blueprint.blockerCode],
  });

  const readinessReviewPlaceholder = buildReadinessReviewPlaceholder({
    id: `${fixtureId}-readiness-review`,
    reasonCodes: [blueprint.blockerCode],
  });

  const approvalDenialContract = buildApprovalDenialContract({
    id: `${fixtureId}-approval-denial`,
    reasonCodes: [blueprint.blockerCode, 'APPROVAL_DENIED_BY_DEFAULT'],
  });

  const reevaluationLinkage = buildDossierReevaluationLinkage({
    id: `${fixtureId}-reevaluation-linkage`,
    sourceReevaluationFixtureRefs: blueprint.hasReevaluationRef ? [phase88Ref] : [],
    linkageStatus: blueprint.linkageStatus,
  });

  const feedbackLinkage = buildDossierFeedbackLinkage({
    id: `${fixtureId}-feedback-linkage`,
    sourceFeedbackFixtureRefs: [phase87Ref],
    linkageStatus: blueprint.linkageStatus,
  });

  const riskLinkage = buildDossierRiskLinkage({
    id: `${fixtureId}-risk-linkage`,
    sourceRiskPhases: [58, 59],
    sourceRiskRefs: [phase59Ref],
    linkageStatus: blueprint.linkageStatus,
  });

  const outcomeLinkage = buildDossierOutcomeLinkage({
    id: `${fixtureId}-outcome-linkage`,
    sourceOutcomeRefs: [phase86Ref],
    linkageStatus: blueprint.linkageStatus,
  });

  const certificationLinkage = buildDossierCertificationLinkage({
    id: `${fixtureId}-certification-linkage`,
    sourceCertPhases: [75, 69],
    sourceCertRefs: [phase75Ref, phase69Ref],
    linkageStatus: blueprint.linkageStatus,
  });

  const auditTrailLinkage = buildDossierAuditTrailLinkage({
    id: `${fixtureId}-audit-trail-linkage`,
    sourceAuditPhases: [86, 79, 80],
    sourceAuditRefs: [`phase86-${phase86Ref}`, `phase79-${phase79Ref}`, `phase80-${phase80Ref}`],
    linkageStatus: blueprint.linkageStatus,
  });

  const abortContract = buildDossierAbortContract({
    id: `${fixtureId}-abort`,
    reasonCodes: [blueprint.blockerCode],
  });

  const rollbackContract = buildDossierRollbackContract({
    id: `${fixtureId}-rollback`,
    reasonCodes: [blueprint.blockerCode],
  });

  const safetyInvariants = buildDossierSafetyInvariants({
    id: `${fixtureId}-safety-invariants`,
  });

  const capabilityAudit = buildDossierCapabilityAudit({
    id: `${fixtureId}-capability-audit`,
    auditScore: blueprint.auditScore,
    passedChecks:
      fixtureName !== 'unsafe-capability-rejected'
        ? ['fail-closed', 'approval-denied-by-default', 'manual-review-required', 'no-live-lookups']
        : [],
    failedChecks: fixtureName === 'unsafe-capability-rejected' ? ['unsafe-capability-detected'] : [],
  });

  const scorecard = buildDossierScorecard({
    id: `${fixtureId}-scorecard`,
    score: blueprint.auditScore,
    classification: blueprint.classification,
  });

  const report = buildDossierReport({
    id: `${fixtureId}-report`,
    gateSummary: `gateStatus=${dossierGate.gateStatus}; failClosed=${String(dossierGate.failClosed)}; automaticApprovalAllowed=${String(dossierGate.automaticApprovalAllowed)}`,
    headerSummary: `manualReviewRequired=${String(reviewDossierHeader.manualReviewRequired)}; approvalAuthorizesUnlock=${String(reviewDossierHeader.approvalAuthorizesUnlock)}`,
    checklistSummary: `items=${reviewerChecklist.checklistItems.length}; requiredReviewerCount=${reviewerChecklist.requiredReviewerCount}; makerCheckerRequired=${String(reviewerChecklist.makerCheckerRequired)}`,
    evidenceSummary: `evidenceComplete=${String(evidencePacket.evidenceComplete)}; phaseRefs=${evidencePacket.sourcePhaseRefs.length}`,
    signoffSummary: `placeholderOnly=${String(signoffPlaceholder.placeholderOnly)}; realSignoffCaptured=${String(signoffPlaceholder.realSignoffCaptured)}`,
    blockerSummary: `blockersPreserved=${String(unresolvedBlockerSummary.blockersPreserved)}; unresolvedCount=${unresolvedBlockerSummary.unresolvedBlockerCount}`,
    approvalDenialSummary: `approvalDeniedByDefault=${String(approvalDenialContract.approvalDeniedByDefault)}; unlockBlocked=${String(approvalDenialContract.unlockBlocked)}`,
    linkageSummary: `reevaluation=${reevaluationLinkage.linkageStatus}; feedback=${feedbackLinkage.linkageStatus}; risk=${riskLinkage.linkageStatus}; outcome=${outcomeLinkage.linkageStatus}; certification=${certificationLinkage.linkageStatus}`,
    safetySummary:
      'Phase 89 dossier contracts are read-only, fixture-only, fail-closed. No approval authority. No automatic approval or unlock. No safety gate mutation. No blocker clearing. No live lookups. No network reads. No sending, dispatch, signing, wallet logic, persistence, or advisory behavior.',
  });

  const capabilities = getSafetyGateManualReviewDossierCapabilities();

  const sourcePhase58FixtureSnapshot = Object.freeze([...LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES]);
  const sourcePhase59FixtureSnapshot = Object.freeze([...RISK_EXPLANATION_EVIDENCE_NAMES]);
  const sourcePhase65FixtureSnapshot = Object.freeze([...FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES]);
  const sourcePhase66FixtureSnapshot = Object.freeze([...MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES]);
  const sourcePhase67FixtureSnapshot = Object.freeze([...CROSS_PROVIDER_DATA_QUALITY_NAMES]);
  const sourcePhase68FixtureSnapshot = Object.freeze([...PROVIDER_AWARE_REPLAY_SCENARIO_NAMES]);
  const sourcePhase69FixtureSnapshot = Object.freeze([...LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES]);
  const sourcePhase70FixtureSnapshot = Object.freeze([...PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES]);
  const sourcePhase72FixtureSnapshot = Object.freeze([...HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES]);
  const sourcePhase73FixtureSnapshot = Object.freeze([...PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES]);
  const sourcePhase74FixtureSnapshot = Object.freeze([...CONTROLLED_LIVE_SMOKE_HARNESS_NAMES]);
  const sourcePhase75FixtureSnapshot = Object.freeze([...PRE_LIVE_SAFETY_CERTIFICATION_NAMES]);
  const sourcePhase76FixtureSnapshot = Object.freeze([...MANUAL_CONFIRM_LIVE_READINESS_NAMES]);
  const sourcePhase77FixtureSnapshot = Object.freeze([...MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES]);
  const sourcePhase78FixtureSnapshot = Object.freeze([...READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES]);
  const sourcePhase79FixtureSnapshot = Object.freeze([...LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES]);
  const sourcePhase80FixtureSnapshot = Object.freeze([...LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES]);
  const sourcePhase81FixtureSnapshot = Object.freeze([...MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES]);
  const sourcePhase82FixtureSnapshot = Object.freeze([...TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES]);
  const sourcePhase83FixtureSnapshot = Object.freeze([...SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES]);
  const sourcePhase84FixtureSnapshot = Object.freeze([...TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES]);
  const sourcePhase85FixtureSnapshot = Object.freeze([...POST_SEND_OBSERVATION_BOUNDARY_NAMES]);
  const sourcePhase86FixtureSnapshot = Object.freeze([...EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES]);
  const sourcePhase87FixtureSnapshot = Object.freeze([...OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES]);
  const sourcePhase88FixtureSnapshot = Object.freeze([...RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES]);

  const deterministicSeed = [
    fixtureId,
    fixtureName,
    blueprint.fixtureKind,
    dossierGate.gateStatus,
    blueprint.blockerCode,
    sourceFixtureRefs.join('|'),
  ].join('::');

  const fixtureWithoutChecksum: Omit<SafetyGateManualReviewDossierFixture, 'checksum'> = {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
    schemaVersion: PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION,
    dossierGate,
    reviewDossierHeader,
    reviewerChecklist,
    evidencePacket,
    signoffPlaceholder,
    unresolvedBlockerSummary,
    escalationReviewPlaceholder,
    policyReviewPlaceholder,
    readinessReviewPlaceholder,
    approvalDenialContract,
    reevaluationLinkage,
    feedbackLinkage,
    riskLinkage,
    outcomeLinkage,
    certificationLinkage,
    auditTrailLinkage,
    abortContract,
    rollbackContract,
    safetyInvariants,
    capabilityAudit,
    scorecard,
    report,
    capabilities,
    sourcePhase58FixtureSnapshot,
    sourcePhase59FixtureSnapshot,
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
    sourcePhase79FixtureSnapshot,
    sourcePhase80FixtureSnapshot,
    sourcePhase81FixtureSnapshot,
    sourcePhase82FixtureSnapshot,
    sourcePhase83FixtureSnapshot,
    sourcePhase84FixtureSnapshot,
    sourcePhase85FixtureSnapshot,
    sourcePhase86FixtureSnapshot,
    sourcePhase87FixtureSnapshot,
    sourcePhase88FixtureSnapshot,
    sourceRefs: {
      phase58FixtureId: `phase58-${phase58Ref}`,
      phase59FixtureId: `phase59-${phase59Ref}`,
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
      phase79FixtureId: `phase79-${phase79Ref}`,
      phase80FixtureId: `phase80-${phase80Ref}`,
      phase81FixtureId: `phase81-${phase81Ref}`,
      phase82FixtureId: `phase82-${phase82Ref}`,
      phase83FixtureId: `phase83-${phase83Ref}`,
      phase84FixtureId: `phase84-${phase84Ref}`,
      phase85FixtureId: `phase85-${phase85Ref}`,
      phase86FixtureId: `phase86-${phase86Ref}`,
      phase87FixtureId: `phase87-${phase87Ref}`,
      phase88FixtureId: `phase88-${phase88Ref}`,
    },
    meta: {
      generatedAt: PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
      source: PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE,
      version: PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_VERSION,
      phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noApprovalAuthority: true,
      noAutomaticApproval: true,
      noAutomaticUnlock: true,
      noSafetyGateMutation: true,
      noBlockerClearing: true,
      noLiveReviewerLookup: true,
      noLiveRiskFeedbackGateOutcomeLookup: true,
      noNetworkRead: true,
      noPollingOrSubscriptions: true,
      noRetryRuntime: true,
      noScheduledJobs: true,
      noSendingDispatchSigningExecution: true,
      noFilesystemWrites: true,
      noPersistence: true,
      nonAdvisory: true,
    },
  };

  return {
    ...fixtureWithoutChecksum,
    checksum: stableDeterministicSafetyGateManualReviewDossierChecksum(fixtureWithoutChecksum),
  };
}

export function buildSafetyGateManualReviewDossierReport(input: {
  id: string;
  gateSummary: string;
  headerSummary: string;
  checklistSummary: string;
  evidenceSummary: string;
  signoffSummary: string;
  blockerSummary: string;
  approvalDenialSummary: string;
  linkageSummary: string;
  safetySummary: string;
}): DossierReport {
  return buildDossierReport(input);
}

export function buildSafetyGateManualReviewDossierViewModelFromFixture(
  fixture: SafetyGateManualReviewDossierFixture,
): SafetyGateManualReviewDossierViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-vm`,
    fixtureName: fixture.fixtureName,
    phase: fixture.phase,
    gateStatus: fixture.dossierGate.gateStatus,
    safetyConfirmed: true,
    deterministicOnly: true,
    failClosed: true,
  };
}
