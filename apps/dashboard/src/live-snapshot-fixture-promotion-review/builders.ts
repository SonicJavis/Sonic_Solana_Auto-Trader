import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES } from '../live-snapshot-replay-parity-audit/index.js';
import { MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES } from '../manual-confirm-dry-run-control/index.js';
import { MANUAL_CONFIRM_LIVE_READINESS_NAMES } from '../manual-confirm-live-readiness/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES } from '../read-only-live-snapshot-capture/index.js';
import { buildFixturePromotionBlocker } from './blocker-taxonomy.js';
import { getLiveSnapshotFixturePromotionReviewCapabilities } from './capabilities.js';
import { buildFixturePromotionApiContract } from './contracts.js';
import { buildFixturePromotionCandidate } from './fixture-candidates.js';
import { buildFixturePromotionIntegrityReview } from './integrity-review.js';
import { stableDeterministicLiveSnapshotFixturePromotionReviewChecksum } from './normalization.js';
import { buildFixturePromotionParityReviewLinkage } from './parity-review-linkage.js';
import { buildFixturePromotionEvidenceBundle } from './promotion-evidence.js';
import { buildFixturePromotionManifest } from './promotion-manifests.js';
import { buildFixturePromotionReviewGate } from './promotion-review-gates.js';
import { buildFixturePromotionScorecard } from './promotion-scorecards.js';
import { buildFixturePromotionProvenanceReview } from './provenance-review.js';
import { buildFixturePromotionQuarantineReview } from './quarantine-review.js';
import { buildFixturePromotionReport } from './review-reports.js';
import { buildFixturePromotionReviewPolicy } from './review-policies.js';
import { buildFixturePromotionReviewerDecision } from './reviewer-decisions.js';
import { buildFixturePromotionSchemaReview } from './schema-review.js';
import { buildFixturePromotionSnapshotCaptureLinkage } from './snapshot-capture-linkage.js';
import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_VERSION,
  type BuildLiveSnapshotFixturePromotionReviewFixtureInput,
  type LiveSnapshotFixturePromotionReviewFixture,
  type LiveSnapshotFixturePromotionReviewKind,
  type LiveSnapshotFixturePromotionReviewName,
} from './types.js';
import { buildFixturePromotionViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: LiveSnapshotFixturePromotionReviewKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly candidateStatus: 'staged' | 'blocked' | 'review_required' | 'rejected';
  readonly policyStatus: 'active' | 'review_required' | 'blocked' | 'rejected';
  readonly decisionKind: 'approved' | 'rejected' | 'warning' | 'pending';
  readonly decisionStatus: 'recorded' | 'pending' | 'blocked';
  readonly manifestStatus: 'proposed' | 'blocked' | 'review_required' | 'rejected';
  readonly blockerSeverity: 'low' | 'medium' | 'high' | 'critical';
  readonly blockerReasonCode: string;
  readonly promotionBlocked: boolean;
  readonly quarantined: boolean;
  readonly quarantineReasonCodes: readonly string[];
  readonly parityStatus: 'clean' | 'warning' | 'mismatch';
  readonly parityLinkageStatus: 'linked' | 'warning' | 'blocked';
  readonly captureStatus: 'staged' | 'quarantined' | 'review_required';
  readonly captureLinkageStatus: 'linked' | 'warning' | 'blocked';
  readonly provenanceStatus: 'pass' | 'warning' | 'fail';
  readonly integrityStatus: 'pass' | 'warning' | 'fail';
  readonly schemaStatus: 'pass' | 'warning' | 'fail';
  readonly schemaWarningCodes: readonly string[];
  readonly schemaManualReviewRequired: boolean;
  readonly multipleReviewersRequired: number;
  readonly evidenceComplete: boolean;
}

const BLUEPRINTS: Record<LiveSnapshotFixturePromotionReviewName, Blueprint> = {
  'fixture-promotion-review-ready': {
    fixtureKind: 'fixture_promotion_review_ready',
    gateStatus: 'ready',
    candidateStatus: 'staged',
    policyStatus: 'active',
    decisionKind: 'approved',
    decisionStatus: 'recorded',
    manifestStatus: 'proposed',
    blockerSeverity: 'low',
    blockerReasonCode: 'NONE',
    promotionBlocked: false,
    quarantined: false,
    quarantineReasonCodes: [],
    parityStatus: 'clean',
    parityLinkageStatus: 'linked',
    captureStatus: 'staged',
    captureLinkageStatus: 'linked',
    provenanceStatus: 'pass',
    integrityStatus: 'pass',
    schemaStatus: 'pass',
    schemaWarningCodes: [],
    schemaManualReviewRequired: false,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'parity-audit-mismatch-blocked': {
    fixtureKind: 'parity_audit_mismatch_blocked',
    gateStatus: 'blocked',
    candidateStatus: 'blocked',
    policyStatus: 'blocked',
    decisionKind: 'warning',
    decisionStatus: 'blocked',
    manifestStatus: 'blocked',
    blockerSeverity: 'critical',
    blockerReasonCode: 'PARITY_AUDIT_MISMATCH',
    promotionBlocked: true,
    quarantined: true,
    quarantineReasonCodes: ['PARITY_MISMATCH'],
    parityStatus: 'mismatch',
    parityLinkageStatus: 'blocked',
    captureStatus: 'staged',
    captureLinkageStatus: 'warning',
    provenanceStatus: 'warning',
    integrityStatus: 'warning',
    schemaStatus: 'warning',
    schemaWarningCodes: ['PARITY_MISMATCH_REVIEW_REQUIRED'],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'quarantined-snapshot-blocked': {
    fixtureKind: 'quarantined_snapshot_blocked',
    gateStatus: 'blocked',
    candidateStatus: 'blocked',
    policyStatus: 'blocked',
    decisionKind: 'warning',
    decisionStatus: 'blocked',
    manifestStatus: 'blocked',
    blockerSeverity: 'high',
    blockerReasonCode: 'QUARANTINED_SNAPSHOT',
    promotionBlocked: true,
    quarantined: true,
    quarantineReasonCodes: ['SNAPSHOT_QUARANTINED'],
    parityStatus: 'warning',
    parityLinkageStatus: 'warning',
    captureStatus: 'quarantined',
    captureLinkageStatus: 'blocked',
    provenanceStatus: 'warning',
    integrityStatus: 'warning',
    schemaStatus: 'warning',
    schemaWarningCodes: ['QUARANTINE_REVIEW_REQUIRED'],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'missing-reviewer-decision-pending': {
    fixtureKind: 'missing_reviewer_decision_pending',
    gateStatus: 'review_required',
    candidateStatus: 'review_required',
    policyStatus: 'review_required',
    decisionKind: 'pending',
    decisionStatus: 'pending',
    manifestStatus: 'review_required',
    blockerSeverity: 'medium',
    blockerReasonCode: 'REVIEW_DECISION_PENDING',
    promotionBlocked: true,
    quarantined: false,
    quarantineReasonCodes: [],
    parityStatus: 'clean',
    parityLinkageStatus: 'linked',
    captureStatus: 'review_required',
    captureLinkageStatus: 'warning',
    provenanceStatus: 'pass',
    integrityStatus: 'pass',
    schemaStatus: 'pass',
    schemaWarningCodes: [],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'manifest-write-path-rejected': {
    fixtureKind: 'manifest_write_path_rejected',
    gateStatus: 'rejected',
    candidateStatus: 'rejected',
    policyStatus: 'rejected',
    decisionKind: 'rejected',
    decisionStatus: 'recorded',
    manifestStatus: 'rejected',
    blockerSeverity: 'critical',
    blockerReasonCode: 'MANIFEST_WRITE_PATH_FORBIDDEN',
    promotionBlocked: true,
    quarantined: true,
    quarantineReasonCodes: ['MANIFEST_WRITE_PATH_FORBIDDEN'],
    parityStatus: 'warning',
    parityLinkageStatus: 'warning',
    captureStatus: 'staged',
    captureLinkageStatus: 'linked',
    provenanceStatus: 'warning',
    integrityStatus: 'warning',
    schemaStatus: 'fail',
    schemaWarningCodes: ['MANIFEST_FILE_WRITE_CLAIMED'],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'provenance-review-warning-required': {
    fixtureKind: 'provenance_review_warning_required',
    gateStatus: 'review_required',
    candidateStatus: 'review_required',
    policyStatus: 'review_required',
    decisionKind: 'warning',
    decisionStatus: 'recorded',
    manifestStatus: 'review_required',
    blockerSeverity: 'medium',
    blockerReasonCode: 'PROVENANCE_WARNING',
    promotionBlocked: true,
    quarantined: false,
    quarantineReasonCodes: [],
    parityStatus: 'warning',
    parityLinkageStatus: 'warning',
    captureStatus: 'staged',
    captureLinkageStatus: 'linked',
    provenanceStatus: 'warning',
    integrityStatus: 'pass',
    schemaStatus: 'pass',
    schemaWarningCodes: [],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'schema-review-warning-required': {
    fixtureKind: 'schema_review_warning_required',
    gateStatus: 'review_required',
    candidateStatus: 'review_required',
    policyStatus: 'review_required',
    decisionKind: 'warning',
    decisionStatus: 'recorded',
    manifestStatus: 'review_required',
    blockerSeverity: 'medium',
    blockerReasonCode: 'SCHEMA_WARNING_REVIEW_REQUIRED',
    promotionBlocked: true,
    quarantined: false,
    quarantineReasonCodes: [],
    parityStatus: 'warning',
    parityLinkageStatus: 'warning',
    captureStatus: 'staged',
    captureLinkageStatus: 'linked',
    provenanceStatus: 'pass',
    integrityStatus: 'pass',
    schemaStatus: 'warning',
    schemaWarningCodes: ['SCHEMA_OPTIONAL_FIELD_WARNING'],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: true,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    candidateStatus: 'rejected',
    policyStatus: 'rejected',
    decisionKind: 'rejected',
    decisionStatus: 'blocked',
    manifestStatus: 'rejected',
    blockerSeverity: 'critical',
    blockerReasonCode: 'UNSAFE_CAPABILITY_DETECTED',
    promotionBlocked: true,
    quarantined: true,
    quarantineReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    parityStatus: 'mismatch',
    parityLinkageStatus: 'blocked',
    captureStatus: 'quarantined',
    captureLinkageStatus: 'blocked',
    provenanceStatus: 'fail',
    integrityStatus: 'fail',
    schemaStatus: 'fail',
    schemaWarningCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    schemaManualReviewRequired: true,
    multipleReviewersRequired: 2,
    evidenceComplete: false,
  },
};

export function buildLiveSnapshotFixturePromotionReviewFixture(
  input: BuildLiveSnapshotFixturePromotionReviewFixtureInput,
): LiveSnapshotFixturePromotionReviewFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase80-${fixtureName}`;

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
  const phase79Ref = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES[sourceIndex % LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES.length]!;

  const blockingReasonCodes =
    blueprint.promotionBlocked || blueprint.gateStatus !== 'ready' ? [blueprint.blockerReasonCode] : [];
  const reviewGate = buildFixturePromotionReviewGate({
    reviewGateId: `${fixtureId}-gate`,
    reviewGateName: `phase80-gate-${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes,
  });

  const candidate = buildFixturePromotionCandidate({
    candidateId: `${fixtureId}-candidate`,
    sourceParityAuditFixtureRef: `phase79-${phase79Ref}`,
    sourceSnapshotCaptureFixtureRef: `phase78-${phase78Ref}`,
    candidateStatus: blueprint.candidateStatus,
  });

  const reviewPolicy = buildFixturePromotionReviewPolicy({
    policyId: `${fixtureId}-policy`,
    multipleReviewersRequired: blueprint.multipleReviewersRequired,
    policyStatus: blueprint.policyStatus,
  });

  const sourcePhaseRefs = [
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
    `phase79:${phase79Ref}`,
  ] as const;

  const sourceFixtureRefs = [
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
  ] as const;

  const evidenceBundleId = `${fixtureId}-evidence-bundle`;
  const reviewerDecision = buildFixturePromotionReviewerDecision({
    decisionId: `${fixtureId}-decision`,
    decisionKind: blueprint.decisionKind,
    reviewerSlot: 'reviewer-slot-a',
    decisionStatus: blueprint.decisionStatus,
    evidenceRefs: [evidenceBundleId, `phase79-${phase79Ref}`],
  });

  const evidenceBundle = buildFixturePromotionEvidenceBundle({
    evidenceBundleId,
    sourcePhaseRefs,
    sourceFixtureRefs,
    parityAuditRefs: [`phase79-${phase79Ref}`],
    validationCommandRefs: [
      'corepack pnpm@10.17.0 test tests/phase79.test.ts',
      'corepack pnpm@10.17.0 test tests/phase80.test.ts',
      'corepack pnpm@10.17.0 typecheck',
    ],
    safetyGrepRefs: [
      'rg --line-number "privateKey|secretKey|seedPhrase|mnemonic|signTransaction|sendTransaction|wallet|execute" apps/dashboard/src/live-snapshot-fixture-promotion-review tests/phase80.test.ts docs/LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW.md',
    ],
    docsRefs: [
      'docs/LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW.md',
      'docs/LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT.md',
      'docs/READ_ONLY_LIVE_SNAPSHOT_CAPTURE.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const manifest = buildFixturePromotionManifest({
    manifestId: `${fixtureId}-manifest`,
    manifestKind: 'proposed_offline_fixture_manifest',
    proposedFixtureName: `${fixtureName}.json`,
    proposedFixtureVersion: '1.0.0',
    manifestStatus: blueprint.manifestStatus,
  });

  const blocker = buildFixturePromotionBlocker({
    blockerId: `${fixtureId}-blocker`,
    blockerKind: 'promotion_blocker',
    severity: blueprint.blockerSeverity,
    reasonCode: blueprint.blockerReasonCode,
    promotionBlocked: blueprint.promotionBlocked,
  });

  const quarantineReview = buildFixturePromotionQuarantineReview({
    quarantineReviewId: `${fixtureId}-quarantine`,
    quarantined: blueprint.quarantined,
    quarantineReasonCodes: blueprint.quarantineReasonCodes,
  });

  const parityReviewLinkage = buildFixturePromotionParityReviewLinkage({
    parityReviewLinkageId: `${fixtureId}-parity-linkage`,
    sourceParityAuditFixtureRef: `phase79-${phase79Ref}`,
    parityStatus: blueprint.parityStatus,
    linkageStatus: blueprint.parityLinkageStatus,
  });

  const snapshotCaptureLinkage = buildFixturePromotionSnapshotCaptureLinkage({
    snapshotCaptureLinkageId: `${fixtureId}-snapshot-linkage`,
    sourceSnapshotCaptureFixtureRef: `phase78-${phase78Ref}`,
    captureStatus: blueprint.captureStatus,
    linkageStatus: blueprint.captureLinkageStatus,
  });

  const provenanceReview = buildFixturePromotionProvenanceReview({
    provenanceReviewId: `${fixtureId}-provenance-review`,
    reviewStatus: blueprint.provenanceStatus,
    sourcePhaseRefs,
    sourceFixtureRefs,
  });

  const deterministicSeed = stableDeterministicLiveSnapshotFixturePromotionReviewChecksum(
    `phase80:${fixtureName}:${PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT}`,
  );
  const expectedChecksum = deterministicSeed;
  const observedChecksum =
    blueprint.integrityStatus === 'pass'
      ? expectedChecksum
      : stableDeterministicLiveSnapshotFixturePromotionReviewChecksum(`${deterministicSeed}:integrity-mismatch`);

  const integrityReview = buildFixturePromotionIntegrityReview({
    integrityReviewId: `${fixtureId}-integrity-review`,
    expectedChecksum,
    observedChecksum,
    reviewStatus: blueprint.integrityStatus,
  });

  const schemaReview = buildFixturePromotionSchemaReview({
    schemaReviewId: `${fixtureId}-schema-review`,
    schemaVersion: PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION,
    reviewStatus: blueprint.schemaStatus,
    warningCodes: blueprint.schemaWarningCodes,
    manualReviewRequired: blueprint.schemaManualReviewRequired,
  });

  const scorecard = buildFixturePromotionScorecard({
    scorecardId: `${fixtureId}-scorecard`,
    promotionScore: Math.max(0, 100 - (blocker.promotionBlocked ? 40 : 0) - (quarantineReview.quarantined ? 30 : 0)),
    classification:
      reviewGate.gateStatus === 'rejected'
        ? 'rejected'
        : reviewGate.gateStatus === 'blocked'
          ? 'blocked'
          : reviewGate.gateStatus === 'ready'
            ? 'ready'
            : 'warning',
    reviewRequired: reviewGate.gateStatus !== 'ready',
  });

  const report = buildFixturePromotionReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `Gate status: ${reviewGate.gateStatus}.`,
    candidateSummary: `Candidate status: ${candidate.candidateStatus}; staged-only and non-persistent.`,
    policySummary: `Policy status: ${reviewPolicy.policyStatus}; manual review required.`,
    decisionSummary: `Reviewer decision: ${reviewerDecision.decisionKind}/${reviewerDecision.decisionStatus}; approval does not promote.`,
    evidenceSummary: `Evidence bundle complete: ${evidenceBundle.evidenceComplete}.`,
    manifestSummary: `Manifest status: ${manifest.manifestStatus}; file write disabled.`,
    blockerSummary: `Blocker ${blocker.reasonCode}; promotion blocked: ${blocker.promotionBlocked}.`,
    quarantineSummary: `Quarantined: ${quarantineReview.quarantined}; release remains disabled.`,
    safetySummary:
      'Promotion review contracts are deterministic, read-only, fail-closed, and contract-only with no runtime capture/replay or filesystem writes.',
  });

  const viewModel = buildFixturePromotionViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: reviewGate.gateStatus,
    candidateStatus: candidate.candidateStatus,
    manifestStatus: manifest.manifestStatus,
  });

  const apiContract = buildFixturePromotionApiContract({ fixtureId, fixtureIds: [fixtureId] });
  const capabilities = getLiveSnapshotFixturePromotionReviewCapabilities();

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
  const sourcePhase79FixtureSnapshot = Object.freeze([phase79Ref]) as readonly [typeof phase79Ref];

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
    schemaVersion: PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION,
    reviewGate,
    candidate,
    reviewPolicy,
    reviewerDecision,
    evidenceBundle,
    manifest,
    blocker,
    quarantineReview,
    parityReviewLinkage,
    snapshotCaptureLinkage,
    provenanceReview,
    integrityReview,
    schemaReview,
    scorecard,
    report,
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
    capabilities,
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
      phase79FixtureId: `phase79-${phase79Ref}`,
    },
    meta: {
      generatedAt: PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT,
      source: PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE,
      version: PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_VERSION,
      phase: LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveNetwork: true,
      noRuntimeCapture: true,
      noRuntimeReplay: true,
      nonAdvisory: true,
      noFilesystemWrites: true,
    },
  };
}
