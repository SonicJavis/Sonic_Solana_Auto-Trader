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
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../risk-explanation-evidence/index.js';
import { SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES } from '../signing-boundary-safety-contracts/index.js';
import { TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES } from '../transaction-construction-contract-mocks/index.js';
import { TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES } from '../transaction-send-boundary-safety/index.js';
import { buildReevaluationAbortContract } from './abort-contracts.js';
import { buildReevaluationCapabilityAudit } from './capability-audits.js';
import { getRiskFeedbackSafetyGateReevaluationCapabilities } from './capabilities.js';
import { buildReevaluationRollbackContract } from './rollback-contracts.js';
import { buildReevaluationSafetyInvariants } from './safety-invariants.js';
import { buildReevaluationScorecard } from './reevaluation-scorecards.js';
import { buildReevaluationReport } from './reevaluation-reports.js';
import { buildReevaluationGate } from './reevaluation-gates.js';
import { buildFeedbackReviewEvent } from './feedback-review-events.js';
import { buildSafetyGateReevaluationLink } from './safety-gate-reevaluation-links.js';
import { buildManualReviewPlaceholder } from './manual-review-placeholders.js';
import { buildGateStatusPlaceholder } from './gate-status-placeholders.js';
import { buildBlockerReviewContract } from './blocker-review-contracts.js';
import { buildEscalationContract } from './escalation-contracts.js';
import { buildEvidenceReviewBundle } from './evidence-review-bundles.js';
import { buildPolicyCheckPlaceholder } from './policy-check-placeholders.js';
import { buildReadinessImpactPlaceholder } from './readiness-impact-placeholders.js';
import {
  buildReevaluationFeedbackLinkage,
  buildReevaluationRiskLinkage,
  buildReevaluationOutcomeLinkage,
  buildReevaluationCertificationLinkage,
} from './feedback-linkage.js';
import { stableDeterministicRiskFeedbackSafetyGateReevaluationChecksum } from './normalization.js';
import {
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_VERSION,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type BuildRiskFeedbackSafetyGateReevaluationFixtureInput,
  type ReevaluationReport,
  type RiskFeedbackSafetyGateReevaluationFixture,
  type RiskFeedbackSafetyGateReevaluationKind,
  type RiskFeedbackSafetyGateReevaluationName,
  type RiskFeedbackSafetyGateReevaluationViewModel,
} from './types.js';

interface Blueprint {
  readonly fixtureKind: RiskFeedbackSafetyGateReevaluationKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly linkStatus: 'linked' | 'warning' | 'blocked';
  readonly blockerCode: string;
  readonly auditScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly evidenceComplete: boolean;
  readonly reviewStatus: 'pending' | 'in_review' | 'approved' | 'denied';
}

const BLUEPRINTS: Record<RiskFeedbackSafetyGateReevaluationName, Blueprint> = {
  'reevaluation-design-ready': {
    fixtureKind: 'reevaluation_design_ready',
    gateStatus: 'ready',
    linkStatus: 'linked',
    blockerCode: 'NONE',
    auditScore: 100,
    classification: 'ready',
    evidenceComplete: true,
    reviewStatus: 'approved',
  },
  'missing-feedback-loop-blocked': {
    fixtureKind: 'missing_feedback_loop_blocked',
    gateStatus: 'blocked',
    linkStatus: 'blocked',
    blockerCode: 'MISSING_FEEDBACK_LOOP',
    auditScore: 20,
    classification: 'blocked',
    evidenceComplete: true,
    reviewStatus: 'pending',
  },
  'missing-safety-gate-ref-blocked': {
    fixtureKind: 'missing_safety_gate_ref_blocked',
    gateStatus: 'blocked',
    linkStatus: 'blocked',
    blockerCode: 'MISSING_SAFETY_GATE_REF',
    auditScore: 25,
    classification: 'blocked',
    evidenceComplete: true,
    reviewStatus: 'pending',
  },
  'automatic-gate-mutation-denied': {
    fixtureKind: 'automatic_gate_mutation_denied',
    gateStatus: 'review_required',
    linkStatus: 'warning',
    blockerCode: 'AUTOMATIC_GATE_MUTATION_DENIED',
    auditScore: 68,
    classification: 'warning',
    evidenceComplete: true,
    reviewStatus: 'in_review',
  },
  'automatic-unlock-denied': {
    fixtureKind: 'automatic_unlock_denied',
    gateStatus: 'review_required',
    linkStatus: 'warning',
    blockerCode: 'AUTOMATIC_UNLOCK_DENIED',
    auditScore: 70,
    classification: 'warning',
    evidenceComplete: true,
    reviewStatus: 'in_review',
  },
  'manual-review-required': {
    fixtureKind: 'manual_review_required',
    gateStatus: 'review_required',
    linkStatus: 'warning',
    blockerCode: 'MANUAL_REVIEW_REQUIRED',
    auditScore: 72,
    classification: 'warning',
    evidenceComplete: true,
    reviewStatus: 'pending',
  },
  'evidence-review-incomplete-blocked': {
    fixtureKind: 'evidence_review_incomplete_blocked',
    gateStatus: 'blocked',
    linkStatus: 'blocked',
    blockerCode: 'EVIDENCE_REVIEW_INCOMPLETE',
    auditScore: 15,
    classification: 'blocked',
    evidenceComplete: false,
    reviewStatus: 'pending',
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    linkStatus: 'blocked',
    blockerCode: 'UNSAFE_CAPABILITY_REJECTED',
    auditScore: 0,
    classification: 'rejected',
    evidenceComplete: false,
    reviewStatus: 'denied',
  },
};

export function buildRiskFeedbackSafetyGateReevaluationFixture(
  input: BuildRiskFeedbackSafetyGateReevaluationFixtureInput,
): RiskFeedbackSafetyGateReevaluationFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const fixtureId = `phase88-${fixtureName}`;

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

  const reevaluationGate = buildReevaluationGate({
    id: `${fixtureId}-gate`,
    name: `Phase 88 Re-Evaluation Gate: ${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes:
      blueprint.gateStatus !== 'ready' ? [blueprint.blockerCode, 'FAIL_CLOSED'] : [],
  });

  const feedbackReviewEvent = buildFeedbackReviewEvent({
    id: `${fixtureId}-feedback-review-event`,
    sourceFeedbackFixtureRef: `phase87-${phase87Ref}`,
    reasonCodes: [blueprint.blockerCode],
  });

  const safetyGateReevaluationLink = buildSafetyGateReevaluationLink({
    id: `${fixtureId}-safety-gate-link`,
    sourceSafetyGateRef: `phase87-safety-gate-${phase87Ref}`,
    sourceFeedbackFixtureRef: `phase87-${phase87Ref}`,
    linkStatus: blueprint.linkStatus,
  });

  const manualReviewPlaceholder = buildManualReviewPlaceholder({
    id: `${fixtureId}-manual-review`,
    reviewStatus: blueprint.reviewStatus,
  });

  const gateStatusPlaceholder = buildGateStatusPlaceholder({
    id: `${fixtureId}-gate-status`,
    reasonCodes: [blueprint.blockerCode, 'DETERMINISTIC_LABEL_ONLY'],
  });

  const blockerReviewContract = buildBlockerReviewContract({
    id: `${fixtureId}-blocker-review`,
    reasonCodes: [blueprint.blockerCode],
  });

  const escalationContract = buildEscalationContract({
    id: `${fixtureId}-escalation`,
    reasonCodes: [blueprint.blockerCode],
  });

  const evidenceReviewBundle = buildEvidenceReviewBundle({
    id: `${fixtureId}-evidence-bundle`,
    sourcePhaseRefs: [
      'phase87', 'phase86', 'phase85', 'phase84', 'phase83', 'phase82',
      'phase81', 'phase80', 'phase79', 'phase78', 'phase77', 'phase76',
      'phase75', 'phase74', 'phase73', 'phase72', 'phase70', 'phase69',
      'phase68', 'phase67', 'phase66', 'phase65', 'phase59', 'phase58',
    ],
    sourceFixtureRefs,
    feedbackRefs: [`phase87-${phase87Ref}`],
    riskRefs: [`phase58-${phase58Ref}`, `phase59-${phase59Ref}`],
    outcomeRefs: [`phase86-${phase86Ref}`],
    certificationRefs: [`phase75-${phase75Ref}`, `phase69-${phase69Ref}`],
    validationCommandRefs: [
      'corepack pnpm@10.17.0 typecheck',
      'corepack pnpm@10.17.0 lint',
      'corepack pnpm@10.17.0 test tests/phase88.test.ts',
      'corepack pnpm@10.17.0 --filter @sonic/dashboard build',
    ],
    safetyGrepRefs: [
      'privateKey', 'secretKey', 'seedPhrase', 'mnemonic', 'Keypair',
      'signTransaction', 'sendTransaction', 'wallet', 'execute',
      'swap', 'buy', 'sell', 'trade', 'order',
    ],
    docsRefs: [
      'docs/RISK_FEEDBACK_SAFETY_GATE_REEVALUATION.md',
      'docs/OUTCOME_RISK_FEEDBACK_CONTRACTS.md',
      'docs/SAFETY_RULES.md',
      'docs/ARCHITECTURE.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const policyCheckPlaceholder = buildPolicyCheckPlaceholder({
    id: `${fixtureId}-policy-check`,
    reasonCodes: [blueprint.blockerCode, 'POLICY_DETERMINISTIC_ONLY'],
  });

  const readinessImpactPlaceholder = buildReadinessImpactPlaceholder({
    id: `${fixtureId}-readiness-impact`,
    reasonCodes: [blueprint.blockerCode, 'READINESS_DETERMINISTIC_ONLY'],
  });

  const feedbackLinkage = buildReevaluationFeedbackLinkage({
    id: `${fixtureId}-feedback-linkage`,
    sourceFeedbackFixtureRefs: [phase87Ref],
    feedbackLinkStatus: blueprint.linkStatus,
  });

  const riskLinkage = buildReevaluationRiskLinkage({
    id: `${fixtureId}-risk-linkage`,
    sourceRiskPhases: [58, 59],
    sourceRiskRefs: [phase59Ref],
    riskLinkStatus: blueprint.linkStatus,
  });

  const outcomeLinkage = buildReevaluationOutcomeLinkage({
    id: `${fixtureId}-outcome-linkage`,
    sourceOutcomeRefs: [phase86Ref],
    outcomeLinkStatus: blueprint.linkStatus,
  });

  const certificationLinkage = buildReevaluationCertificationLinkage({
    id: `${fixtureId}-cert-linkage`,
    sourceCertPhases: [75, 69],
    sourceCertRefs: [phase75Ref, phase69Ref],
    certLinkStatus: blueprint.linkStatus,
  });

  const abortContract = buildReevaluationAbortContract({
    id: `${fixtureId}-abort`,
    reasonCodes: [blueprint.blockerCode],
  });

  const rollbackContract = buildReevaluationRollbackContract({
    id: `${fixtureId}-rollback`,
    reasonCodes: [blueprint.blockerCode],
  });

  const safetyInvariants = buildReevaluationSafetyInvariants({
    id: `${fixtureId}-safety-invariants`,
  });

  const capabilityAudit = buildReevaluationCapabilityAudit({
    id: `${fixtureId}-capability-audit`,
    auditScore: blueprint.auditScore,
    passedChecks:
      fixtureName !== 'unsafe-capability-rejected'
        ? [
            'fail-closed',
            'no-live-gate-mutation',
            'no-automatic-unlock',
            'no-live-risk-update',
            'no-network-read',
          ]
        : [],
    failedChecks: fixtureName === 'unsafe-capability-rejected' ? ['unsafe-capability-detected'] : [],
  });

  const scorecard = buildReevaluationScorecard({
    id: `${fixtureId}-scorecard`,
    score: blueprint.auditScore,
    classification: blueprint.classification,
  });

  const report = buildReevaluationReport({
    id: `${fixtureId}-report`,
    gateSummary: `gate=${reevaluationGate.gateStatus}; failClosed=${String(reevaluationGate.failClosed)}; automaticGateMutationAllowed=${String(reevaluationGate.automaticGateMutationAllowed)}`,
    feedbackReviewSummary: `placeholderOnly=${String(feedbackReviewEvent.placeholderOnly)}; liveFeedbackLookupAllowed=${String(feedbackReviewEvent.liveFeedbackLookupAllowed)}; manualReviewRequired=${String(feedbackReviewEvent.manualReviewRequired)}`,
    safetyGateLinkSummary: `linkStatus=${safetyGateReevaluationLink.linkStatus}; gateMutationAllowed=${String(safetyGateReevaluationLink.gateMutationAllowed)}`,
    manualReviewSummary: `reviewAuthorizesUnlock=${String(manualReviewPlaceholder.reviewAuthorizesUnlock)}; separateFuturePhaseRequired=${String(manualReviewPlaceholder.separateFuturePhaseRequired)}`,
    gateStatusSummary: `deterministicLabelOnly=${String(gateStatusPlaceholder.deterministicLabelOnly)}; liveGateStatusFetched=${String(gateStatusPlaceholder.liveGateStatusFetched)}`,
    blockerEscalationSummary: `blockersPreserved=${String(blockerReviewContract.blockersPreserved)}; automaticEscalationAllowed=${String(blockerReviewContract.automaticEscalationAllowed)}`,
    evidenceSummary: `evidenceComplete=${String(evidenceReviewBundle.evidenceComplete)}; phaseRefs=${evidenceReviewBundle.sourcePhaseRefs.length}`,
    safetySummary:
      'Phase 88 contracts are read-only, fixture-only, fail-closed. No automatic gate mutation. No automatic unlock. No live risk update. No live feedback lookup. No live gate status fetch. No network reads. No sending, dispatch, signing. No filesystem writes.',
  });

  const capabilities = getRiskFeedbackSafetyGateReevaluationCapabilities();

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

  const deterministicSeed = [
    fixtureId,
    fixtureName,
    blueprint.fixtureKind,
    reevaluationGate.gateStatus,
    blueprint.blockerCode,
    sourceFixtureRefs.join('|'),
  ].join('::');

  const fixtureWithoutChecksum: Omit<RiskFeedbackSafetyGateReevaluationFixture, 'checksum'> = {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
    schemaVersion: PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION,
    reevaluationGate,
    feedbackReviewEvent,
    safetyGateReevaluationLink,
    manualReviewPlaceholder,
    gateStatusPlaceholder,
    blockerReviewContract,
    escalationContract,
    evidenceReviewBundle,
    policyCheckPlaceholder,
    readinessImpactPlaceholder,
    feedbackLinkage,
    riskLinkage,
    outcomeLinkage,
    certificationLinkage,
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
    },
    meta: {
      generatedAt: PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT,
      source: PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE,
      version: PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_VERSION,
      phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noAutomaticGateMutation: true,
      noAutomaticUnlock: true,
      noLiveRiskUpdate: true,
      noLiveFeedbackLookup: true,
      noLiveGateStatusFetch: true,
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
    checksum: stableDeterministicRiskFeedbackSafetyGateReevaluationChecksum(fixtureWithoutChecksum),
  };
}

export function buildRiskFeedbackSafetyGateReevaluationReport(input: {
  reportId: string;
  gateSummary: string;
  feedbackReviewSummary: string;
  safetyGateLinkSummary: string;
  manualReviewSummary: string;
  gateStatusSummary: string;
  blockerEscalationSummary: string;
  evidenceSummary: string;
  safetySummary: string;
}): ReevaluationReport {
  return buildReevaluationReport({
    id: input.reportId,
    gateSummary: input.gateSummary,
    feedbackReviewSummary: input.feedbackReviewSummary,
    safetyGateLinkSummary: input.safetyGateLinkSummary,
    manualReviewSummary: input.manualReviewSummary,
    gateStatusSummary: input.gateStatusSummary,
    blockerEscalationSummary: input.blockerEscalationSummary,
    evidenceSummary: input.evidenceSummary,
    safetySummary: input.safetySummary,
  });
}

export function buildRiskFeedbackSafetyGateReevaluationViewModelFromFixture(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): RiskFeedbackSafetyGateReevaluationViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-vm`,
    fixtureName: fixture.fixtureName,
    phase: fixture.phase,
    gateStatus: fixture.reevaluationGate.gateStatus,
    safetyConfirmed: true,
    deterministicOnly: true,
    failClosed: true,
  };
}
