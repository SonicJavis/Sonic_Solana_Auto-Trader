import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MANUAL_CONFIRM_LIVE_READINESS_NAMES } from '../manual-confirm-live-readiness/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { buildManualConfirmAbortContract } from './abort-contracts.js';
import { buildManualConfirmDryRunCapabilityAudit } from './capability-audits.js';
import { getManualConfirmDryRunControlCapabilities } from './capabilities.js';
import { buildManualConfirmDryRunCertificationLinkage } from './certification-linkage.js';
import { buildManualConfirmConfirmationSnapshot } from './confirmation-snapshots.js';
import { buildManualConfirmDryRunApiContract } from './contracts.js';
import { buildManualConfirmDispatchBlock } from './dispatch-blocks.js';
import { buildManualConfirmDryRunControl } from './dry-run-controls.js';
import { buildManualConfirmDryRunEvidence } from './dry-run-evidence.js';
import { buildManualConfirmDryRunGate } from './dry-run-gates.js';
import { buildManualConfirmDryRunPreflight } from './dry-run-preflight.js';
import { buildManualConfirmDryRunReport } from './dry-run-reports.js';
import { stableDeterministicManualConfirmDryRunControlChecksum } from './normalization.js';
import { buildManualConfirmOperatorIntent } from './operator-intents.js';
import { buildManualConfirmDryRunReadinessLinkage } from './readiness-linkage.js';
import { buildManualConfirmDryRunReplayLinkage } from './replay-linkage.js';
import { buildManualConfirmCancellationContract } from './cancellation-contracts.js';
import { buildManualConfirmDryRunSafetyInvariant } from './safety-invariants.js';
import { buildManualConfirmDryRunScorecard } from './scorecards.js';
import { buildManualConfirmSimulatedDecision } from './simulated-decisions.js';
import { buildManualConfirmDryRunSmokeLinkage } from './smoke-linkage.js';
import {
  MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_VERSION,
  type BuildManualConfirmDryRunControlFixtureInput,
  type ManualConfirmDryRunControlFixture,
  type ManualConfirmDryRunControlKind,
  type ManualConfirmDryRunControlName,
} from './types.js';
import { buildManualConfirmDryRunViewModel } from './view-models.js';

interface Blueprint {
  readonly fixtureKind: ManualConfirmDryRunControlKind;
  readonly gateStatus: 'ready' | 'blocked' | 'rejected' | 'review_required';
  readonly preflightStatus: 'ready' | 'blocked' | 'incomplete' | 'review_required';
  readonly controlStatus: 'ready' | 'blocked' | 'rejected' | 'review_required';
  readonly intentStatus: 'ready' | 'blocked' | 'rejected';
  readonly decisionStatus: 'ready' | 'blocked' | 'review_required';
  readonly abortStatus: 'ready' | 'pending' | 'aborted';
  readonly cancellationStatus: 'ready' | 'pending' | 'cancelled';
  readonly snapshotStatus: 'ready' | 'blocked' | 'review_required';
  readonly evidenceComplete: boolean;
  readonly score: number;
  readonly blockingReasonCodes: readonly string[];
}

const BLUEPRINTS: Record<ManualConfirmDryRunControlName, Blueprint> = {
  'dry-run-control-ready': {
    fixtureKind: 'dry_run_control_ready', gateStatus: 'ready', preflightStatus: 'ready', controlStatus: 'ready', intentStatus: 'ready', decisionStatus: 'ready', abortStatus: 'ready', cancellationStatus: 'ready', snapshotStatus: 'ready', evidenceComplete: true, score: 100, blockingReasonCodes: [],
  },
  'missing-manual-confirm-readiness-blocked': {
    fixtureKind: 'missing_manual_confirm_readiness_blocked', gateStatus: 'blocked', preflightStatus: 'blocked', controlStatus: 'blocked', intentStatus: 'blocked', decisionStatus: 'blocked', abortStatus: 'ready', cancellationStatus: 'ready', snapshotStatus: 'blocked', evidenceComplete: false, score: 24, blockingReasonCodes: ['MISSING_MANUAL_CONFIRM_READINESS'],
  },
  'preflight-evidence-incomplete-blocked': {
    fixtureKind: 'preflight_evidence_incomplete_blocked', gateStatus: 'blocked', preflightStatus: 'incomplete', controlStatus: 'blocked', intentStatus: 'blocked', decisionStatus: 'blocked', abortStatus: 'ready', cancellationStatus: 'ready', snapshotStatus: 'review_required', evidenceComplete: false, score: 35, blockingReasonCodes: ['PREFLIGHT_EVIDENCE_INCOMPLETE'],
  },
  'dispatch-attempt-blocked': {
    fixtureKind: 'dispatch_attempt_blocked', gateStatus: 'blocked', preflightStatus: 'ready', controlStatus: 'blocked', intentStatus: 'blocked', decisionStatus: 'blocked', abortStatus: 'ready', cancellationStatus: 'ready', snapshotStatus: 'ready', evidenceComplete: true, score: 48, blockingReasonCodes: ['DISPATCH_ATTEMPT_BLOCKED'],
  },
  'cancellation-requested-safe': {
    fixtureKind: 'cancellation_requested_safe', gateStatus: 'review_required', preflightStatus: 'ready', controlStatus: 'review_required', intentStatus: 'ready', decisionStatus: 'review_required', abortStatus: 'pending', cancellationStatus: 'cancelled', snapshotStatus: 'ready', evidenceComplete: true, score: 68, blockingReasonCodes: ['CANCELLATION_REQUESTED'],
  },
  'abort-state-ready': {
    fixtureKind: 'abort_state_ready', gateStatus: 'ready', preflightStatus: 'ready', controlStatus: 'ready', intentStatus: 'ready', decisionStatus: 'ready', abortStatus: 'aborted', cancellationStatus: 'ready', snapshotStatus: 'ready', evidenceComplete: true, score: 86, blockingReasonCodes: ['ABORT_READY_STATE'],
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected', gateStatus: 'rejected', preflightStatus: 'blocked', controlStatus: 'rejected', intentStatus: 'rejected', decisionStatus: 'blocked', abortStatus: 'ready', cancellationStatus: 'ready', snapshotStatus: 'blocked', evidenceComplete: false, score: 0, blockingReasonCodes: ['UNSAFE_CAPABILITY_DETECTED'],
  },
  'documentation-review-required': {
    fixtureKind: 'documentation_review_required', gateStatus: 'review_required', preflightStatus: 'review_required', controlStatus: 'review_required', intentStatus: 'ready', decisionStatus: 'review_required', abortStatus: 'ready', cancellationStatus: 'pending', snapshotStatus: 'review_required', evidenceComplete: true, score: 62, blockingReasonCodes: ['DOCUMENTATION_REVIEW_REQUIRED'],
  },
};

export function buildManualConfirmDryRunControlFixture(
  input: BuildManualConfirmDryRunControlFixtureInput,
): ManualConfirmDryRunControlFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase77-${fixtureName}`;

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

  const dryRunGate = buildManualConfirmDryRunGate({
    dryRunGateId: `${fixtureId}-gate`,
    dryRunGateName: `phase77-gate-${fixtureName}`,
    dryRunGateKind: 'manual_confirm_dry_run_gate',
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.blockingReasonCodes,
  });

  const operatorIntent = buildManualConfirmOperatorIntent({
    intentId: `${fixtureId}-intent`,
    intentKind: 'manual_confirm_dry_run_intent',
    operatorIntentLabel: `Operator dry-run intent for ${fixtureName}`,
    intentStatus: blueprint.intentStatus,
  });

  const dryRunPreflight = buildManualConfirmDryRunPreflight({
    preflightId: `${fixtureId}-preflight`,
    sourceReadinessRefs: [`phase76:${phase76Ref}`],
    sourceCertificationRefs: [`phase75:${phase75Ref}`],
    sourceSmokeRefs: [`phase74:${phase74Ref}`, `phase69:${phase69Ref}`],
    preflightStatus: blueprint.preflightStatus,
  });

  const dryRunControl = buildManualConfirmDryRunControl({
    controlId: `${fixtureId}-control`,
    controlKind: 'manual_confirm_dry_run_control',
    controlStatus: blueprint.controlStatus,
  });

  const dispatchBlock = buildManualConfirmDispatchBlock({
    blockId: `${fixtureId}-dispatch-block`,
    blockKind: 'no_dispatch_block',
    reasonCodes: blueprint.blockingReasonCodes.length ? blueprint.blockingReasonCodes : ['DRY_RUN_ONLY_NO_DISPATCH'],
    safetyNotes: ['Dry-run contract only.', 'No transaction send.', 'No live network dispatch.'],
  });

  const abortContract = buildManualConfirmAbortContract({ abortId: `${fixtureId}-abort`, status: blueprint.abortStatus });
  const cancellationContract = buildManualConfirmCancellationContract({
    cancellationId: `${fixtureId}-cancellation`,
    status: blueprint.cancellationStatus,
  });

  const confirmationSnapshot = buildManualConfirmConfirmationSnapshot({
    snapshotId: `${fixtureId}-snapshot`,
    sourceManualConfirmReadinessRef: `phase76:${phase76Ref}`,
    phraseSnapshotRef: `phrase:${phase76Ref}`,
    roleSeparationSnapshotRef: `role-separation:${phase76Ref}`,
    coolingOffSnapshotRef: `cooling-off:${phase76Ref}`,
    snapshotStatus: blueprint.snapshotStatus,
  });

  const simulatedDecision = buildManualConfirmSimulatedDecision({
    decisionId: `${fixtureId}-decision`,
    decisionKind: 'dry_run_control_decision',
    decisionStatus: blueprint.decisionStatus,
  });

  const dryRunEvidence = buildManualConfirmDryRunEvidence({
    evidenceBundleId: `${fixtureId}-evidence`,
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
    ],
    sourceFixtureRefs: [`phase76-${phase76Ref}`, `phase75-${phase75Ref}`, `phase74-${phase74Ref}`],
    validationCommandRefs: [
      'corepack pnpm typecheck',
      'corepack pnpm lint',
      'corepack pnpm test',
      'corepack pnpm --filter @sonic/dashboard build',
      'corepack pnpm --filter @sonic/offline-intelligence build',
    ],
    safetyGrepRefs: [
      'grep -r privateKey apps/dashboard/src/manual-confirm-dry-run-control',
      'grep -r signTransaction apps/dashboard/src/manual-confirm-dry-run-control',
      'grep -r sendTransaction apps/dashboard/src/manual-confirm-dry-run-control',
    ],
    docsRefs: [
      'docs/MANUAL_CONFIRM_DRY_RUN_CONTROL.md',
      'docs/MANUAL_CONFIRM_LIVE_READINESS.md',
      'docs/PRE_LIVE_SAFETY_CERTIFICATION.md',
      'docs/CONTROLLED_LIVE_SMOKE_HARNESS.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  });

  const capabilityAudit = buildManualConfirmDryRunCapabilityAudit({
    auditId: `${fixtureId}-audit`,
    auditStatus: blueprint.gateStatus === 'ready' ? 'pass' : blueprint.gateStatus === 'rejected' ? 'fail' : 'warning',
  });

  const safetyInvariant = buildManualConfirmDryRunSafetyInvariant({
    invariantId: `${fixtureId}-invariant`,
    invariantKind: 'dry_run_fail_closed',
    invariantHolds: blueprint.gateStatus !== 'rejected',
    evidenceRef: dryRunEvidence.evidenceBundleId,
  });

  const readinessLinkage = buildManualConfirmDryRunReadinessLinkage({
    linkageId: `${fixtureId}-readiness-linkage`,
    phase76FixtureRef: phase76Ref,
    readinessLinked: blueprint.preflightStatus !== 'blocked',
  });

  const certificationLinkage = buildManualConfirmDryRunCertificationLinkage({
    linkageId: `${fixtureId}-certification-linkage`,
    phase75FixtureRef: phase75Ref,
    certificationLinked: blueprint.preflightStatus !== 'blocked',
  });

  const smokeLinkage = buildManualConfirmDryRunSmokeLinkage({
    linkageId: `${fixtureId}-smoke-linkage`,
    phase74FixtureRef: phase74Ref,
    phase69FixtureRef: phase69Ref,
    smokeLinked: blueprint.preflightStatus !== 'blocked',
  });

  const replayLinkage = buildManualConfirmDryRunReplayLinkage({
    linkageId: `${fixtureId}-replay-linkage`,
    phase73FixtureRef: phase73Ref,
    phase72FixtureRef: phase72Ref,
    phase70FixtureRef: phase70Ref,
    phase68FixtureRef: phase68Ref,
    replayLinked: blueprint.preflightStatus !== 'blocked',
  });

  const scorecard = buildManualConfirmDryRunScorecard({
    scorecardId: `${fixtureId}-scorecard`,
    score: blueprint.score,
    maxScore: 100,
    gateStatus: blueprint.gateStatus,
    preflightStatus: blueprint.preflightStatus,
    controlStatus: blueprint.controlStatus,
  });

  const dryRunReport = buildManualConfirmDryRunReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `Gate status: ${blueprint.gateStatus}.`,
    intentSummary: `Intent status: ${blueprint.intentStatus}. No order/transaction intent.`,
    preflightSummary: `Preflight status: ${blueprint.preflightStatus}. Fail-closed=${dryRunPreflight.failClosed}.`,
    controlSummary: `Control status: ${blueprint.controlStatus}. Dry-run only.`,
    dispatchBlockSummary: `Dispatch blocked: true. Transaction send blocked: true.`,
    abortSummary: `Abort=${abortContract.status}. Cancellation=${cancellationContract.status}.`,
    decisionSummary: `Simulated decision status: ${simulatedDecision.decisionStatus}.`,
    evidenceSummary: `Evidence complete: ${dryRunEvidence.evidenceComplete}.`,
    safetySummary: 'Contract-only dry-run. No unlock authority. No live execution authorization.',
  });

  const viewModel = buildManualConfirmDryRunViewModel({
    viewModelId: `${fixtureId}-view-model`,
    fixtureId,
    fixtureName,
    gateStatus: blueprint.gateStatus,
    preflightStatus: blueprint.preflightStatus,
    controlStatus: blueprint.controlStatus,
  });

  const apiContract = buildManualConfirmDryRunApiContract({ fixtureId, fixtureIds: [fixtureId] });
  const capabilityFlags = getManualConfirmDryRunControlCapabilities();
  const deterministicSeed = stableDeterministicManualConfirmDryRunControlChecksum(
    `phase77:${fixtureName}:${PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT}`,
  );

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

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
    schemaVersion: PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION,
    dryRunGate,
    operatorIntent,
    dryRunPreflight,
    dryRunControl,
    dispatchBlock,
    abortContract,
    cancellationContract,
    confirmationSnapshot,
    simulatedDecision,
    dryRunEvidence,
    capabilityAudit,
    safetyInvariant,
    readinessLinkage,
    certificationLinkage,
    smokeLinkage,
    replayLinkage,
    scorecard,
    dryRunReport,
    report: dryRunReport,
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
    },
    meta: {
      generatedAt: PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT,
      source: PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE,
      version: PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_VERSION,
      phase: MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
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
