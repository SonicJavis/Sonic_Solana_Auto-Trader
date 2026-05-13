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
import { getReadOnlyLiveSnapshotCaptureCapabilities } from './capabilities.js';
import { buildLiveSnapshotCaptureBounds } from './capture-bounds.js';
import { buildLiveSnapshotCaptureCertification } from './capture-certification.js';
import { buildLiveSnapshotCaptureGate } from './capture-gates.js';
import { buildLiveSnapshotCaptureRequest } from './capture-requests.js';
import { buildLiveSnapshotCaptureReport } from './capture-reports.js';
import { buildLiveSnapshotCaptureScope } from './capture-scope.js';
import { buildLiveSnapshotApiContract } from './contracts.js';
import { buildLiveSnapshotFixtureCandidateContract } from './fixture-candidate-contracts.js';
import { buildLiveSnapshotIntegrityContract } from './integrity-contracts.js';
import { buildLiveSnapshotNormalizationContract } from './normalization-contracts.js';
import { stableDeterministicReadOnlyLiveSnapshotCaptureChecksum } from './normalization.js';
import { buildLiveSnapshotPromotionCandidate } from './promotion-candidates.js';
import { buildLiveSnapshotProvenanceContract } from './provenance-contracts.js';
import { buildLiveSnapshotProviderTarget } from './provider-targets.js';
import { buildLiveSnapshotQuarantineContract } from './quarantine-contracts.js';
import { buildLiveSnapshotResponseStaging } from './response-staging.js';
import { buildLiveSnapshotSchemaValidationContract } from './schema-validation.js';
import {
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT,
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION,
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE,
  PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_VERSION,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
  type BuildReadOnlyLiveSnapshotCaptureFixtureInput,
  type ReadOnlyLiveSnapshotCaptureFixture,
  type ReadOnlyLiveSnapshotCaptureKind,
  type ReadOnlyLiveSnapshotCaptureName,
} from './types.js';
import { buildLiveSnapshotViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: ReadOnlyLiveSnapshotCaptureKind;
  readonly gateStatus: 'ready' | 'blocked' | 'rejected' | 'review_required';
  readonly requestStatus: 'ready' | 'blocked' | 'rejected' | 'review_required';
  readonly scopeStatus: 'ready' | 'blocked' | 'rejected' | 'review_required';
  readonly stagingStatus: 'staged' | 'quarantined' | 'review_required' | 'rejected';
  readonly promotionStatus: 'candidate' | 'blocked' | 'review_required' | 'rejected';
  readonly providerEligible: boolean;
  readonly quarantined: boolean;
  readonly schemaStatus: 'pass' | 'warning' | 'fail';
  readonly schemaReviewRequired: boolean;
  readonly blockingReasonCodes: readonly string[];
  readonly warningCodes: readonly string[];
  readonly accountSnapshotAllowed: boolean;
  readonly mintSnapshotAllowed: boolean;
  readonly poolSnapshotAllowed: boolean;
  readonly maxRequestCount: number;
  readonly maxObservationCount: number;
  readonly evidenceComplete: boolean;
}

const BLUEPRINTS: Record<ReadOnlyLiveSnapshotCaptureName, Blueprint> = {
  'read-only-snapshot-capture-ready': {
    fixtureKind: 'read_only_snapshot_capture_ready',
    gateStatus: 'ready',
    requestStatus: 'ready',
    scopeStatus: 'ready',
    stagingStatus: 'staged',
    promotionStatus: 'candidate',
    providerEligible: true,
    quarantined: false,
    schemaStatus: 'pass',
    schemaReviewRequired: false,
    blockingReasonCodes: [],
    warningCodes: [],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: true,
    maxRequestCount: 3,
    maxObservationCount: 12,
    evidenceComplete: true,
  },
  'missing-manual-dry-run-readiness-blocked': {
    fixtureKind: 'missing_manual_dry_run_readiness_blocked',
    gateStatus: 'blocked',
    requestStatus: 'blocked',
    scopeStatus: 'blocked',
    stagingStatus: 'rejected',
    promotionStatus: 'blocked',
    providerEligible: true,
    quarantined: true,
    schemaStatus: 'fail',
    schemaReviewRequired: true,
    blockingReasonCodes: ['MISSING_MANUAL_DRY_RUN_READINESS'],
    warningCodes: ['READINESS_REFERENCE_MISSING'],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: false,
    poolSnapshotAllowed: false,
    maxRequestCount: 1,
    maxObservationCount: 1,
    evidenceComplete: false,
  },
  'provider-not-eligible-blocked': {
    fixtureKind: 'provider_not_eligible_blocked',
    gateStatus: 'blocked',
    requestStatus: 'blocked',
    scopeStatus: 'blocked',
    stagingStatus: 'quarantined',
    promotionStatus: 'blocked',
    providerEligible: false,
    quarantined: true,
    schemaStatus: 'warning',
    schemaReviewRequired: true,
    blockingReasonCodes: ['PROVIDER_NOT_ELIGIBLE'],
    warningCodes: ['READ_ONLY_ELIGIBILITY_FAILED'],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: false,
    maxRequestCount: 1,
    maxObservationCount: 2,
    evidenceComplete: true,
  },
  'capture-scope-too-wide-rejected': {
    fixtureKind: 'capture_scope_too_wide_rejected',
    gateStatus: 'rejected',
    requestStatus: 'rejected',
    scopeStatus: 'rejected',
    stagingStatus: 'rejected',
    promotionStatus: 'rejected',
    providerEligible: true,
    quarantined: true,
    schemaStatus: 'fail',
    schemaReviewRequired: true,
    blockingReasonCodes: ['CAPTURE_SCOPE_TOO_WIDE'],
    warningCodes: ['SCOPE_REDUCTION_REQUIRED'],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: true,
    maxRequestCount: 10,
    maxObservationCount: 200,
    evidenceComplete: true,
  },
  'staged-response-quarantined': {
    fixtureKind: 'staged_response_quarantined',
    gateStatus: 'blocked',
    requestStatus: 'ready',
    scopeStatus: 'ready',
    stagingStatus: 'quarantined',
    promotionStatus: 'blocked',
    providerEligible: true,
    quarantined: true,
    schemaStatus: 'warning',
    schemaReviewRequired: true,
    blockingReasonCodes: ['STAGED_RESPONSE_QUARANTINED'],
    warningCodes: ['ANOMALOUS_PROVIDER_PAYLOAD'],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: false,
    maxRequestCount: 2,
    maxObservationCount: 6,
    evidenceComplete: true,
  },
  'schema-validation-warning-review-required': {
    fixtureKind: 'schema_validation_warning_review_required',
    gateStatus: 'review_required',
    requestStatus: 'review_required',
    scopeStatus: 'review_required',
    stagingStatus: 'review_required',
    promotionStatus: 'review_required',
    providerEligible: true,
    quarantined: false,
    schemaStatus: 'warning',
    schemaReviewRequired: true,
    blockingReasonCodes: ['SCHEMA_WARNING_REVIEW_REQUIRED'],
    warningCodes: ['OPTIONAL_FIELD_COERCED'],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: true,
    maxRequestCount: 2,
    maxObservationCount: 8,
    evidenceComplete: true,
  },
  'promotion-candidate-manual-review-required': {
    fixtureKind: 'promotion_candidate_manual_review_required',
    gateStatus: 'review_required',
    requestStatus: 'ready',
    scopeStatus: 'ready',
    stagingStatus: 'staged',
    promotionStatus: 'review_required',
    providerEligible: true,
    quarantined: false,
    schemaStatus: 'pass',
    schemaReviewRequired: false,
    blockingReasonCodes: ['MANUAL_REVIEW_REQUIRED_FOR_PROMOTION'],
    warningCodes: [],
    accountSnapshotAllowed: true,
    mintSnapshotAllowed: true,
    poolSnapshotAllowed: true,
    maxRequestCount: 3,
    maxObservationCount: 10,
    evidenceComplete: true,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    requestStatus: 'rejected',
    scopeStatus: 'rejected',
    stagingStatus: 'rejected',
    promotionStatus: 'rejected',
    providerEligible: false,
    quarantined: true,
    schemaStatus: 'fail',
    schemaReviewRequired: true,
    blockingReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
    warningCodes: ['CAPABILITY_REVIEW_REQUIRED'],
    accountSnapshotAllowed: false,
    mintSnapshotAllowed: false,
    poolSnapshotAllowed: false,
    maxRequestCount: 1,
    maxObservationCount: 1,
    evidenceComplete: false,
  },
};

export function buildReadOnlyLiveSnapshotCaptureFixture(
  input: BuildReadOnlyLiveSnapshotCaptureFixtureInput,
): ReadOnlyLiveSnapshotCaptureFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase78-${fixtureName}`;

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

  const captureGate = buildLiveSnapshotCaptureGate({
    captureGateId: `${fixtureId}-gate`,
    captureGateName: `phase78-gate-${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.blockingReasonCodes,
  });
  const providerTarget = buildLiveSnapshotProviderTarget({
    targetId: `${fixtureId}-provider-target`,
    providerId: `provider-${phase65Ref}`,
    providerKind: 'read_only_provider_candidate',
    readOnlyEligible: blueprint.providerEligible,
    capabilityRefs: [`phase66:${phase66Ref}`, `phase67:${phase67Ref}`],
  });
  const captureRequest = buildLiveSnapshotCaptureRequest({
    requestId: `${fixtureId}-request`,
    requestKind: 'read_only_snapshot_observation_request',
    targetProviderId: providerTarget.providerId,
    requestStatus: blueprint.requestStatus,
  });
  const captureScope = buildLiveSnapshotCaptureScope({
    scopeId: `${fixtureId}-scope`,
    scopeKind: 'bounded_snapshot_scope',
    accountSnapshotAllowed: blueprint.accountSnapshotAllowed,
    mintSnapshotAllowed: blueprint.mintSnapshotAllowed,
    poolSnapshotAllowed: blueprint.poolSnapshotAllowed,
    scopeStatus: blueprint.scopeStatus,
  });
  const captureBounds = buildLiveSnapshotCaptureBounds({
    boundsId: `${fixtureId}-bounds`,
    maxRequestCount: blueprint.maxRequestCount,
    maxObservationCount: blueprint.maxObservationCount,
    deterministicWindowLabel: `phase78-window-${fixtureName}`,
  });
  const responseStaging = buildLiveSnapshotResponseStaging({
    stagingId: `${fixtureId}-staging`,
    stagedResponseKind: 'provider_response_staged_fixture',
    stagingStatus: blueprint.stagingStatus,
  });
  const quarantineContract = buildLiveSnapshotQuarantineContract({
    quarantineId: `${fixtureId}-quarantine`,
    quarantined: blueprint.quarantined,
    reasonCodes: blueprint.blockingReasonCodes.length ? blueprint.blockingReasonCodes : ['NO_QUARANTINE_REASON'],
  });
  const normalizationContract = buildLiveSnapshotNormalizationContract({
    normalizationId: `${fixtureId}-normalization`,
    schemaVersion: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION,
  });
  const provenanceContract = buildLiveSnapshotProvenanceContract({
    provenanceId: `${fixtureId}-provenance`,
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
    ],
    sourceFixtureRefs: [
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
    docsRefs: [
      'docs/READ_ONLY_LIVE_SNAPSHOT_CAPTURE.md',
      'docs/MANUAL_CONFIRM_DRY_RUN_CONTROL.md',
      'docs/MANUAL_CONFIRM_LIVE_READINESS.md',
      'docs/PRE_LIVE_SAFETY_CERTIFICATION.md',
      'docs/CONTROLLED_LIVE_SMOKE_HARNESS.md',
    ],
  });

  const evidenceBundleId = `${fixtureId}-evidence`;
  const deterministicSeed = stableDeterministicReadOnlyLiveSnapshotCaptureChecksum(
    `phase78:${fixtureName}:${PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT}`,
  );
  const integrityContract = buildLiveSnapshotIntegrityContract({
    integrityId: `${fixtureId}-integrity`,
    checksum: deterministicSeed,
    evidenceBundleId,
  });
  const schemaValidationContract = buildLiveSnapshotSchemaValidationContract({
    validationId: `${fixtureId}-schema-validation`,
    schemaVersion: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION,
    validationStatus: blueprint.schemaStatus,
    warningCodes: blueprint.warningCodes,
    reviewRequired: blueprint.schemaReviewRequired,
  });
  const promotionCandidate = buildLiveSnapshotPromotionCandidate({
    candidateId: `${fixtureId}-promotion-candidate`,
    promotionStatus: blueprint.promotionStatus,
  });
  const fixtureCandidateContract = buildLiveSnapshotFixtureCandidateContract({
    fixtureCandidateId: `${fixtureId}-fixture-candidate`,
    fixtureCandidatePath: `fixtures/phase78/${fixtureName}.json`,
  });
  const captureCertification = buildLiveSnapshotCaptureCertification({
    certificationId: `${fixtureId}-certification`,
    certificationStatus:
      blueprint.gateStatus === 'ready' ? 'pass' : blueprint.gateStatus === 'review_required' ? 'warning' : 'fail',
  });
  const captureReport = buildLiveSnapshotCaptureReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `Gate status: ${blueprint.gateStatus}.`,
    requestSummary: `Request status: ${blueprint.requestStatus}. Read-only only.`,
    providerSummary: `Provider eligible: ${providerTarget.readOnlyEligible}. No expansion allowed.`,
    scopeSummary: `Scope status: ${blueprint.scopeStatus}. Transaction writes disabled.`,
    boundsSummary: `Bounds ${captureBounds.maxRequestCount}/${captureBounds.maxObservationCount} in ${captureBounds.deterministicWindowLabel}.`,
    stagingSummary: `Staging status: ${responseStaging.stagingStatus}. Persisted=false.`,
    quarantineSummary: `Quarantined=${quarantineContract.quarantined}. Fail-closed quarantine contract enforced.`,
    promotionSummary: `Promotion status: ${promotionCandidate.promotionStatus}. Manual review required.`,
    safetySummary: 'Contract-only snapshot capture modeling. No runtime capture. No trading or execution authority.',
  });
  const viewModel = buildLiveSnapshotViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: blueprint.gateStatus,
    requestStatus: blueprint.requestStatus,
    promotionStatus: blueprint.promotionStatus,
  });
  const apiContract = buildLiveSnapshotApiContract({ fixtureId, fixtureIds: [fixtureId] });
  const capabilityFlags = getReadOnlyLiveSnapshotCaptureCapabilities();

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

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
    schemaVersion: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SCHEMA_VERSION,
    captureGate,
    captureRequest,
    providerTarget,
    captureScope,
    captureBounds,
    responseStaging,
    quarantineContract,
    normalizationContract,
    provenanceContract,
    integrityContract,
    schemaValidationContract,
    promotionCandidate,
    fixtureCandidateContract,
    captureCertification,
    captureReport,
    report: captureReport,
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
    },
    evidence: {
      evidenceBundleId,
      sourcePhaseRefs: provenanceContract.sourcePhaseRefs,
      sourceFixtureRefs: provenanceContract.sourceFixtureRefs,
      validationCommandRefs: [
        'corepack pnpm typecheck',
        'corepack pnpm lint',
        'corepack pnpm test',
        'corepack pnpm --filter @sonic/dashboard build',
        'corepack pnpm --filter @sonic/offline-intelligence build',
      ],
      docsRefs: provenanceContract.docsRefs,
      evidenceComplete: blueprint.evidenceComplete,
    },
    meta: {
      generatedAt: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_GENERATED_AT,
      source: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_SOURCE,
      version: PHASE_78_READ_ONLY_LIVE_SNAPSHOT_CAPTURE_VERSION,
      phase: READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
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
