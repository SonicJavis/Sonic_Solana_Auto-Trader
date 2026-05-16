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
import { buildFeedbackAbortContract } from './abort-contracts.js';
import { buildFeedbackCapabilityAudit } from './capability-audits.js';
import { getOutcomeRiskFeedbackCapabilities } from './capabilities.js';
import { buildConfidenceDeltaPlaceholder } from './confidence-delta-placeholders.js';
import { buildOutcomeRiskFeedbackApiContract } from './contracts.js';
import { buildEvidenceFeedbackBundle } from './evidence-feedback-bundles.js';
import { buildFeedbackBlocker } from './feedback-blocker-taxonomy.js';
import { buildFeedbackLoopGate } from './feedback-loop-gates.js';
import { buildFeedbackOutcomeAuditLinkage } from './outcome-audit-linkage.js';
import { buildOutcomeFeedbackEvent } from './outcome-feedback-events.js';
import { buildOutcomeRiskFeedbackReport } from './feedback-reports.js';
import { buildFeedbackReplayLinkage } from './feedback-replay-linkage.js';
import { buildFeedbackScorecard } from './feedback-scorecards.js';
import { stableDeterministicOutcomeRiskFeedbackChecksum } from './normalization.js';
import { buildFeedbackObservationBoundaryLinkage } from './observation-boundary-linkage.js';
import { buildRiskDeltaPlaceholder } from './risk-delta-placeholders.js';
import { buildRiskFeedbackLink } from './risk-feedback-links.js';
import { buildRiskReassessmentPlaceholder } from './risk-reassessment-placeholders.js';
import { buildFeedbackRollbackContract } from './rollback-contracts.js';
import { buildSafetyGateFeedbackLink } from './safety-gate-feedback-links.js';
import { buildFeedbackSafetyInvariants } from './safety-invariants.js';
import { buildFeedbackEvidenceModelLinkage } from './evidence-model-linkage.js';
import { buildFeedbackRiskEngineLinkage } from './risk-engine-linkage.js';
import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_VERSION,
  type BuildOutcomeRiskFeedbackFixtureInput,
  type OutcomeRiskFeedbackContractKind,
  type OutcomeRiskFeedbackContractName,
  type OutcomeRiskFeedbackFixture,
} from './types.js';
import { buildOutcomeRiskFeedbackViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: OutcomeRiskFeedbackContractKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
  readonly blockerCode: string;
  readonly blockerSeverity: 'low' | 'medium' | 'high' | 'critical';
  readonly blockerReason: string;
  readonly auditScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly evidenceComplete: boolean;
}

const BLUEPRINTS: Record<OutcomeRiskFeedbackContractName, Blueprint> = {
  'feedback-loop-design-ready': {
    fixtureKind: 'feedback_loop_design_ready',
    gateStatus: 'ready',
    linkageStatus: 'linked',
    blockerCode: 'NONE',
    blockerSeverity: 'low',
    blockerReason: 'Outcome-to-risk feedback loop contracts are deterministic, fixture-only, and fail-closed.',
    auditScore: 100,
    classification: 'ready',
    evidenceComplete: true,
  },
  'missing-outcome-audit-blocked': {
    fixtureKind: 'missing_outcome_audit_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'MISSING_OUTCOME_AUDIT',
    blockerSeverity: 'high',
    blockerReason: 'Outcome audit prerequisite linkage from Phase 86 is missing.',
    auditScore: 20,
    classification: 'blocked',
    evidenceComplete: true,
  },
  'missing-risk-evidence-blocked': {
    fixtureKind: 'missing_risk_evidence_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'MISSING_RISK_EVIDENCE',
    blockerSeverity: 'high',
    blockerReason: 'Risk evidence references from Phase 58/59 are incomplete.',
    auditScore: 25,
    classification: 'blocked',
    evidenceComplete: true,
  },
  'live-risk-update-denied': {
    fixtureKind: 'live_risk_update_denied',
    gateStatus: 'review_required',
    linkageStatus: 'warning',
    blockerCode: 'LIVE_RISK_UPDATE_DENIED',
    blockerSeverity: 'high',
    blockerReason: 'Live risk updates are denied; deterministic labels only.',
    auditScore: 70,
    classification: 'warning',
    evidenceComplete: true,
  },
  'safety-gate-mutation-denied': {
    fixtureKind: 'safety_gate_mutation_denied',
    gateStatus: 'review_required',
    linkageStatus: 'warning',
    blockerCode: 'SAFETY_GATE_MUTATION_DENIED',
    blockerSeverity: 'high',
    blockerReason: 'Automatic safety-gate mutation is denied and manual review is required.',
    auditScore: 68,
    classification: 'warning',
    evidenceComplete: true,
  },
  'risk-delta-live-computation-denied': {
    fixtureKind: 'risk_delta_live_computation_denied',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'LIVE_DELTA_COMPUTATION_DENIED',
    blockerSeverity: 'high',
    blockerReason: 'Risk and confidence deltas are placeholders and cannot use live data.',
    auditScore: 35,
    classification: 'blocked',
    evidenceComplete: true,
  },
  'evidence-feedback-incomplete-blocked': {
    fixtureKind: 'evidence_feedback_incomplete_blocked',
    gateStatus: 'blocked',
    linkageStatus: 'blocked',
    blockerCode: 'EVIDENCE_FEEDBACK_INCOMPLETE',
    blockerSeverity: 'high',
    blockerReason: 'Evidence feedback bundle is incomplete and blocks progression.',
    auditScore: 15,
    classification: 'blocked',
    evidenceComplete: false,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    linkageStatus: 'blocked',
    blockerCode: 'UNSAFE_CAPABILITY_DETECTED',
    blockerSeverity: 'critical',
    blockerReason: 'Unsafe capability intent was detected and rejected.',
    auditScore: 0,
    classification: 'rejected',
    evidenceComplete: false,
  },
};

export function buildOutcomeRiskFeedbackFixture(
  input: BuildOutcomeRiskFeedbackFixtureInput,
): OutcomeRiskFeedbackFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase87-${fixtureName}`;

  const phase58Ref =
    LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES[sourceIndex % LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES.length]!;
  const phase59Ref =
    RISK_EXPLANATION_EVIDENCE_NAMES[sourceIndex % RISK_EXPLANATION_EVIDENCE_NAMES.length]!;
  const phase65Ref =
    FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES[sourceIndex % FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.length]!;
  const phase66Ref =
    MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES[sourceIndex % MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.length]!;
  const phase67Ref =
    CROSS_PROVIDER_DATA_QUALITY_NAMES[sourceIndex % CROSS_PROVIDER_DATA_QUALITY_NAMES.length]!;
  const phase68Ref =
    PROVIDER_AWARE_REPLAY_SCENARIO_NAMES[sourceIndex % PROVIDER_AWARE_REPLAY_SCENARIO_NAMES.length]!;
  const phase69Ref =
    LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES[sourceIndex % LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase70Ref =
    PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES[sourceIndex % PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES.length]!;
  const phase72Ref =
    HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES[
      sourceIndex % HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES.length
    ]!;
  const phase73Ref =
    PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES[
      sourceIndex % PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.length
    ]!;
  const phase74Ref =
    CONTROLLED_LIVE_SMOKE_HARNESS_NAMES[sourceIndex % CONTROLLED_LIVE_SMOKE_HARNESS_NAMES.length]!;
  const phase75Ref =
    PRE_LIVE_SAFETY_CERTIFICATION_NAMES[sourceIndex % PRE_LIVE_SAFETY_CERTIFICATION_NAMES.length]!;
  const phase76Ref =
    MANUAL_CONFIRM_LIVE_READINESS_NAMES[sourceIndex % MANUAL_CONFIRM_LIVE_READINESS_NAMES.length]!;
  const phase77Ref =
    MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES[sourceIndex % MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES.length]!;
  const phase78Ref =
    READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES[sourceIndex % READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES.length]!;
  const phase79Ref =
    LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES[sourceIndex % LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES.length]!;
  const phase80Ref =
    LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES[
      sourceIndex % LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES.length
    ]!;
  const phase81Ref =
    MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES[sourceIndex % MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES.length]!;
  const phase82Ref =
    TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES[
      sourceIndex % TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES.length
    ]!;
  const phase83Ref =
    SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES[sourceIndex % SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES.length]!;
  const phase84Ref =
    TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES[sourceIndex % TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES.length]!;
  const phase85Ref =
    POST_SEND_OBSERVATION_BOUNDARY_NAMES[sourceIndex % POST_SEND_OBSERVATION_BOUNDARY_NAMES.length]!;
  const phase86Ref =
    EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES[sourceIndex % EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES.length]!;

  const reasonCodes = blueprint.gateStatus === 'ready' ? ['DESIGN_ONLY_FEEDBACK_CONTRACT'] : [blueprint.blockerCode];

  const feedbackLoopGate = buildFeedbackLoopGate({
    feedbackLoopGateId: `${fixtureId}-gate`,
    feedbackLoopGateName: `phase87-outcome-risk-feedback-${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.gateStatus === 'ready' ? [] : [blueprint.blockerCode],
  });

  const feedbackOutcomeAuditLinkage = buildFeedbackOutcomeAuditLinkage({
    feedbackOutcomeAuditLinkageId: `${fixtureId}-outcome-audit-linkage`,
    sourceOutcomeAuditRef: `phase86-${phase86Ref}`,
    linkageStatus: fixtureName === 'missing-outcome-audit-blocked' ? 'blocked' : blueprint.linkageStatus,
  });

  const outcomeFeedbackEvent = buildOutcomeFeedbackEvent({
    outcomeFeedbackEventId: `${fixtureId}-outcome-feedback-event`,
    sourceOutcomeAuditRef: feedbackOutcomeAuditLinkage.sourceOutcomeAuditRef,
    reasonCodes,
  });

  const riskFeedbackLink = buildRiskFeedbackLink({
    riskFeedbackLinkId: `${fixtureId}-risk-feedback-link`,
    sourceRiskFixtureRef: `phase58-${phase58Ref}`,
    sourceEvidenceFixtureRef: `phase59-${phase59Ref}`,
    sourceOutcomeAuditFixtureRef: `phase86-${phase86Ref}`,
    linkStatus: fixtureName === 'missing-risk-evidence-blocked' ? 'blocked' : blueprint.linkageStatus,
  });

  const riskReassessmentPlaceholder = buildRiskReassessmentPlaceholder({
    riskReassessmentPlaceholderId: `${fixtureId}-risk-reassessment`,
    reasonCodes,
  });

  const safetyGateFeedbackLink = buildSafetyGateFeedbackLink({
    safetyGateFeedbackLinkId: `${fixtureId}-safety-gate-feedback`,
    reasonCodes,
  });

  const riskDeltaPlaceholder = buildRiskDeltaPlaceholder({
    riskDeltaPlaceholderId: `${fixtureId}-risk-delta`,
    reasonCodes,
  });

  const confidenceDeltaPlaceholder = buildConfidenceDeltaPlaceholder({
    confidenceDeltaPlaceholderId: `${fixtureId}-confidence-delta`,
    reasonCodes,
  });

  const feedbackReplayLinkage = buildFeedbackReplayLinkage({
    feedbackReplayLinkageId: `${fixtureId}-replay-linkage`,
    sourceReplayFixtureRef: `phase73-${phase73Ref}`,
    linkageStatus: blueprint.linkageStatus,
  });

  const feedbackObservationBoundaryLinkage = buildFeedbackObservationBoundaryLinkage({
    feedbackObservationBoundaryLinkageId: `${fixtureId}-observation-linkage`,
    sourceObservationBoundaryRef: `phase85-${phase85Ref}`,
    linkageStatus: blueprint.linkageStatus,
  });

  const feedbackRiskEngineLinkage = buildFeedbackRiskEngineLinkage({
    feedbackRiskEngineLinkageId: `${fixtureId}-risk-engine-linkage`,
    sourceRiskEngineRef: `phase58-${phase58Ref}`,
    linkageStatus: fixtureName === 'missing-risk-evidence-blocked' ? 'blocked' : blueprint.linkageStatus,
  });

  const feedbackEvidenceModelLinkage = buildFeedbackEvidenceModelLinkage({
    feedbackEvidenceModelLinkageId: `${fixtureId}-evidence-model-linkage`,
    sourceEvidenceModelRef: `phase59-${phase59Ref}`,
    linkageStatus: fixtureName === 'missing-risk-evidence-blocked' ? 'blocked' : blueprint.linkageStatus,
  });

  const abortContract = buildFeedbackAbortContract({
    abortContractId: `${fixtureId}-abort`,
    status: blueprint.gateStatus === 'blocked' ? 'blocked' : 'ready',
  });

  const rollbackContract = buildFeedbackRollbackContract({
    rollbackContractId: `${fixtureId}-rollback`,
    status: blueprint.gateStatus === 'blocked' ? 'blocked' : 'ready',
  });

  const safetyInvariants = buildFeedbackSafetyInvariants({
    safetyInvariantId: `${fixtureId}-safety-invariants`,
  });

  const sourcePhaseRefs = [
    'phase58',
    'phase59',
    'phase65',
    'phase66',
    'phase67',
    'phase68',
    'phase69',
    'phase70',
    'phase72',
    'phase73',
    'phase74',
    'phase75',
    'phase76',
    'phase77',
    'phase78',
    'phase79',
    'phase80',
    'phase81',
    'phase82',
    'phase83',
    'phase84',
    'phase85',
    'phase86',
  ] as const;

  const sourceFixtureRefs = [
    `phase58-${phase58Ref}`,
    `phase59-${phase59Ref}`,
    `phase65-${phase65Ref}`,
    `phase66-${phase66Ref}`,
    `phase67-${phase67Ref}`,
    `phase68-${phase68Ref}`,
    `phase69-${phase69Ref}`,
    `phase70-${phase70Ref}`,
    `phase72-${phase72Ref}`,
    `phase73-${phase73Ref}`,
    `phase74-${phase74Ref}`,
    `phase75-${phase75Ref}`,
    `phase76-${phase76Ref}`,
    `phase77-${phase77Ref}`,
    `phase78-${phase78Ref}`,
    `phase79-${phase79Ref}`,
    `phase80-${phase80Ref}`,
    `phase81-${phase81Ref}`,
    `phase82-${phase82Ref}`,
    `phase83-${phase83Ref}`,
    `phase84-${phase84Ref}`,
    `phase85-${phase85Ref}`,
    `phase86-${phase86Ref}`,
  ] as const;

  const evidenceBundle = buildEvidenceFeedbackBundle({
    evidenceBundleId: `${fixtureId}-evidence`,
    sourcePhaseRefs,
    sourceFixtureRefs,
    outcomeAuditRefs: [`phase86-${phase86Ref}`],
    riskEvidenceRefs: [`phase58-${phase58Ref}`, `phase59-${phase59Ref}`],
    validationCommandRefs: [
      'corepack pnpm@10.17.0 typecheck',
      'corepack pnpm@10.17.0 lint',
      'corepack pnpm@10.17.0 test',
      'corepack pnpm@10.17.0 --filter @sonic/dashboard build',
      'corepack pnpm@10.17.0 --filter @sonic/offline-intelligence build',
      'corepack pnpm@10.17.0 test tests/phase79.test.ts tests/phase80.test.ts tests/phase81.test.ts tests/phase82.test.ts tests/phase83.test.ts tests/phase84.test.ts tests/phase85.test.ts tests/phase86.test.ts tests/phase87.test.ts',
    ],
    safetyGrepRefs: [
      'rg "privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction|wallet|execute|swap|buy|sell|trade|order|RPC|fetch\\(|WebSocket|axios|request|fs\\.|writeFile|createWriteStream|localStorage|indexedDB|document\\.|window\\.|setInterval|setTimeout|cron|worker|queue|route|handler|server|listen|pdf|csv|html|download|recommendation|signal|investment advice|profit|PnL|apiKey|providerSdk|endpoint|postinstall|drainer" apps/dashboard/src/outcome-risk-feedback-contracts tests/phase87.test.ts docs/OUTCOME_RISK_FEEDBACK_CONTRACTS.md',
    ],
    docsRefs: [
      'docs/OUTCOME_RISK_FEEDBACK_CONTRACTS.md',
      'docs/EXECUTION_OUTCOME_AUDIT_CONTRACTS.md',
      'docs/SAFETY_RULES.md',
      'docs/LAUNCH_RISK_ENGINE.md',
      'docs/RISK_EXPLANATION_EVIDENCE_MODELS.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const blocker = buildFeedbackBlocker({
    blockerId: `${fixtureId}-blocker`,
    blockerCode: blueprint.blockerCode,
    severity: blueprint.blockerSeverity,
    blocking: blueprint.gateStatus !== 'ready',
    reason: blueprint.blockerReason,
  });

  const capabilityAudit = buildFeedbackCapabilityAudit({
    capabilityAuditId: `${fixtureId}-capability-audit`,
    unsafeCapabilityDetected: fixtureName === 'unsafe-capability-rejected',
  });

  const scorecard = buildFeedbackScorecard({
    scorecardId: `${fixtureId}-scorecard`,
    auditScore: blueprint.auditScore,
    classification: blueprint.classification,
    reviewRequired: blueprint.gateStatus !== 'ready',
  });

  const report = buildOutcomeRiskFeedbackReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `gate=${feedbackLoopGate.gateStatus}; failClosed=${feedbackLoopGate.failClosed}; liveRiskUpdateAllowed=${feedbackLoopGate.liveRiskUpdateAllowed}`,
    outcomeFeedbackSummary: `placeholderOnly=${outcomeFeedbackEvent.placeholderOnly}; liveOutcomeLookupAllowed=${outcomeFeedbackEvent.liveOutcomeLookupAllowed}; realOutcomeEventRequired=${outcomeFeedbackEvent.realOutcomeEventRequired}`,
    riskLinkSummary: `riskLink=${riskFeedbackLink.linkStatus}; liveRiskRefreshAllowed=${riskFeedbackLink.liveRiskRefreshAllowed}; replayLink=${feedbackReplayLinkage.linkageStatus}`,
    reassessmentSummary: `deterministicLabelOnly=${riskReassessmentPlaceholder.deterministicLabelOnly}; liveReassessmentAllowed=${riskReassessmentPlaceholder.liveReassessmentAllowed}; reassessmentOutputProduced=${riskReassessmentPlaceholder.reassessmentOutputProduced}`,
    safetyGateFeedbackSummary: `manualReviewRequired=${safetyGateFeedbackLink.manualReviewRequired}; automaticUnlockAllowed=${safetyGateFeedbackLink.automaticUnlockAllowed}; safetyGateMutationAllowed=${safetyGateFeedbackLink.safetyGateMutationAllowed}`,
    deltaSummary: `riskDeltaLiveData=${riskDeltaPlaceholder.deltaComputedFromLiveData}; confidenceDeltaLiveData=${confidenceDeltaPlaceholder.deltaComputedFromLiveData}; liveDeltaOutputProduced=${riskDeltaPlaceholder.liveDeltaOutputProduced}`,
    evidenceSummary: `evidenceComplete=${evidenceBundle.evidenceComplete}; phaseRefs=${evidenceBundle.sourcePhaseRefs.length}; fixtureRefs=${evidenceBundle.sourceFixtureRefs.length}`,
    safetySummary:
      'Outcome-to-risk feedback contracts are read-only, fixture-only, fail-closed, with no live feedback, no live risk updates, no automatic risk mutation, no safety gate mutation, no live outcome lookup, no network reads, no polling/subscriptions/retry runtime, no sending/dispatch/signing/execution, no filesystem writes, and no advisory outputs.',
  });

  const viewModel = buildOutcomeRiskFeedbackViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: feedbackLoopGate.gateStatus,
  });

  const capabilities = getOutcomeRiskFeedbackCapabilities();
  const selectorExamples = [
    {
      selectorId: `${fixtureId}-selector-id`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: blueprint.fixtureKind,
      matched: true,
      source: 'deterministic_fixture_only' as const,
    },
  ] as const;
  const apiContract = buildOutcomeRiskFeedbackApiContract({ fixtureId, fixtureIds: [fixtureId] });

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

  const checksumInput = [
    fixtureId,
    fixtureName,
    blueprint.fixtureKind,
    feedbackLoopGate.gateStatus,
    blocker.blockerCode,
    sourceFixtureRefs.join('|'),
  ].join('::');

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
    schemaVersion: PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION,
    feedbackLoopGate,
    outcomeFeedbackEvent,
    riskFeedbackLink,
    riskReassessmentPlaceholder,
    safetyGateFeedbackLink,
    riskDeltaPlaceholder,
    confidenceDeltaPlaceholder,
    evidenceBundle,
    feedbackReplayLinkage,
    feedbackOutcomeAuditLinkage,
    feedbackObservationBoundaryLinkage,
    feedbackRiskEngineLinkage,
    feedbackEvidenceModelLinkage,
    abortContract,
    rollbackContract,
    safetyInvariants,
    blocker,
    capabilityAudit,
    scorecard,
    report,
    viewModel,
    apiContract,
    selectorExamples,
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
    },
    meta: {
      generatedAt: PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT,
      source: PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE,
      version: PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_VERSION,
      phase: OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
      deterministicSeed: stableDeterministicOutcomeRiskFeedbackChecksum(checksumInput),
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveFeedback: true,
      noLiveRiskUpdate: true,
      noAutomaticRiskMutation: true,
      noSafetyGateMutation: true,
      noLiveOutcomeLookup: true,
      noLiveRiskRefresh: true,
      noLiveDeltaComputation: true,
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
}
