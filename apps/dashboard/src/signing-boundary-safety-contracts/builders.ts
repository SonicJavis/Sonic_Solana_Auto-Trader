import { CONTROLLED_LIVE_SMOKE_HARNESS_NAMES } from '../controlled-live-smoke-harness/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES } from '../live-snapshot-fixture-promotion-review/index.js';
import { LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES } from '../live-snapshot-replay-parity-audit/index.js';
import { MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES } from '../manual-confirm-dry-run-control/index.js';
import { MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES } from '../manual-confirm-execution-boundary/index.js';
import { MANUAL_CONFIRM_LIVE_READINESS_NAMES } from '../manual-confirm-live-readiness/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PRE_LIVE_SAFETY_CERTIFICATION_NAMES } from '../pre-live-safety-certification/index.js';
import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES } from '../provider-aware-replay-import-contracts/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES } from '../read-only-live-snapshot-capture/index.js';
import { TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES } from '../transaction-construction-contract-mocks/index.js';
import { buildSigningAbortContract } from './abort-contracts.js';
import { buildSigningApprovalBoundary } from './approval-boundaries.js';
import { buildSigningBoundaryBlocker } from './blocker-taxonomy.js';
import { buildSigningCapabilityAudit } from './capability-audits.js';
import { getSigningBoundarySafetyCapabilities } from './capabilities.js';
import { buildSigningBoundaryApiContract } from './contracts.js';
import { buildSigningConstructionLinkage } from './construction-linkage.js';
import { buildSigningDryRunLinkage } from './dry-run-linkage.js';
import { buildSigningExecutionBoundaryLinkage } from './execution-boundary-linkage.js';
import { buildKeyMaterialDenial } from './key-material-denials.js';
import {
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE,
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_VERSION,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
  type BuildSigningBoundarySafetyFixtureInput,
  type SigningBoundarySafetyContractKind,
  type SigningBoundarySafetyContractName,
  type SigningBoundarySafetyFixture,
} from './types.js';
import { stableDeterministicSigningBoundarySafetyChecksum } from './normalization.js';
import { buildSigningOperatorAcknowledgement } from './operator-acknowledgements.js';
import { buildSigningRollbackContract } from './rollback-contracts.js';
import { buildSigningSafetyInvariants } from './safety-invariants.js';
import { buildSignerIdentityPlaceholder } from './signer-identity-placeholders.js';
import { buildSigningBoundaryGate } from './signing-boundary-gates.js';
import { buildSigningBoundaryReport } from './signing-reports.js';
import { buildSigningScorecard } from './signing-scorecards.js';
import { buildSigningRequestDenial } from './signing-request-denials.js';
import { buildSignatureOutputDenial } from './signature-output-denials.js';
import { buildSigningBoundaryViewModel } from './view-models.js';
import { buildWalletPromptDenial } from './wallet-prompt-denials.js';

interface Blueprint {
  readonly fixtureKind: SigningBoundarySafetyContractKind;
  readonly gateStatus: 'ready' | 'blocked' | 'review_required' | 'rejected';
  readonly approvalStatus: 'required' | 'pending' | 'recorded' | 'rejected';
  readonly linkageStatus: 'linked' | 'warning' | 'blocked';
  readonly blockerCode: string;
  readonly blockerSeverity: 'low' | 'medium' | 'high' | 'critical';
  readonly blockerReason: string;
  readonly boundaryScore: number;
  readonly classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  readonly evidenceComplete: boolean;
  readonly acknowledgementRecorded: boolean;
}

const BLUEPRINTS: Record<SigningBoundarySafetyContractName, Blueprint> = {
  'signing-boundary-design-ready': {
    fixtureKind: 'signing_boundary_design_ready',
    gateStatus: 'ready',
    approvalStatus: 'required',
    linkageStatus: 'linked',
    blockerCode: 'NONE',
    blockerSeverity: 'low',
    blockerReason: 'Signing boundary design contract is complete and fail-closed.',
    boundaryScore: 100,
    classification: 'ready',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'missing-transaction-construction-mock-blocked': {
    fixtureKind: 'missing_transaction_construction_mock_blocked',
    gateStatus: 'blocked',
    approvalStatus: 'pending',
    linkageStatus: 'blocked',
    blockerCode: 'MISSING_TRANSACTION_CONSTRUCTION_MOCK',
    blockerSeverity: 'high',
    blockerReason: 'Phase 82 transaction construction mock prerequisite is missing.',
    boundaryScore: 35,
    classification: 'blocked',
    evidenceComplete: true,
    acknowledgementRecorded: false,
  },
  'signing-request-denied': {
    fixtureKind: 'signing_request_denied',
    gateStatus: 'review_required',
    approvalStatus: 'required',
    linkageStatus: 'warning',
    blockerCode: 'SIGNING_REQUEST_DENIED',
    blockerSeverity: 'medium',
    blockerReason: 'Signing request remains denied by fail-closed boundary.',
    boundaryScore: 80,
    classification: 'warning',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'wallet-prompt-denied': {
    fixtureKind: 'wallet_prompt_denied',
    gateStatus: 'review_required',
    approvalStatus: 'required',
    linkageStatus: 'warning',
    blockerCode: 'WALLET_PROMPT_DENIED',
    blockerSeverity: 'medium',
    blockerReason: 'Wallet prompt is denied by default.',
    boundaryScore: 78,
    classification: 'warning',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'key-material-request-denied': {
    fixtureKind: 'key_material_request_denied',
    gateStatus: 'review_required',
    approvalStatus: 'required',
    linkageStatus: 'warning',
    blockerCode: 'KEY_MATERIAL_DENIED',
    blockerSeverity: 'high',
    blockerReason: 'Key-material access request is denied by design.',
    boundaryScore: 70,
    classification: 'warning',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'signature-output-denied': {
    fixtureKind: 'signature_output_denied',
    gateStatus: 'review_required',
    approvalStatus: 'required',
    linkageStatus: 'warning',
    blockerCode: 'SIGNATURE_OUTPUT_DENIED',
    blockerSeverity: 'high',
    blockerReason: 'Signature output generation is denied by design.',
    boundaryScore: 68,
    classification: 'warning',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'approval-does-not-authorize-signing': {
    fixtureKind: 'approval_does_not_authorize_signing',
    gateStatus: 'review_required',
    approvalStatus: 'recorded',
    linkageStatus: 'linked',
    blockerCode: 'APPROVAL_NOT_SIGNING_AUTHORITY',
    blockerSeverity: 'medium',
    blockerReason: 'Manual approval is recorded but cannot authorize signing.',
    boundaryScore: 82,
    classification: 'warning',
    evidenceComplete: true,
    acknowledgementRecorded: true,
  },
  'unsafe-capability-rejected': {
    fixtureKind: 'unsafe_capability_rejected',
    gateStatus: 'rejected',
    approvalStatus: 'rejected',
    linkageStatus: 'blocked',
    blockerCode: 'UNSAFE_CAPABILITY_DETECTED',
    blockerSeverity: 'critical',
    blockerReason: 'Unsafe capability claim was detected and rejected.',
    boundaryScore: 0,
    classification: 'rejected',
    evidenceComplete: false,
    acknowledgementRecorded: false,
  },
};

export function buildSigningBoundarySafetyFixture(
  input: BuildSigningBoundarySafetyFixtureInput,
): SigningBoundarySafetyFixture {
  const fixtureName = input.fixtureName;
  const blueprint = BLUEPRINTS[fixtureName];
  const sourceIndex = SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE + Object.keys(BLUEPRINTS).indexOf(fixtureName);
  const fixtureId = `phase83-${fixtureName}`;

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
  const phase80Ref = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES[sourceIndex % LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES.length]!;
  const phase81Ref = MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES[sourceIndex % MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES.length]!;
  const phase82Ref = TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES[sourceIndex % TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES.length]!;

  const reasonCodes = blueprint.gateStatus === 'ready' ? ['DESIGN_ONLY_SIGNING_BOUNDARY'] : [blueprint.blockerCode];

  const boundaryGate = buildSigningBoundaryGate({
    signingBoundaryGateId: `${fixtureId}-gate`,
    signingBoundaryGateName: `phase83-signing-boundary-${fixtureName}`,
    gateStatus: blueprint.gateStatus,
    blockingReasonCodes: blueprint.gateStatus === 'ready' ? [] : [blueprint.blockerCode],
  });

  const signingRequestDenial = buildSigningRequestDenial({ signingRequestDenialId: `${fixtureId}-signing-request`, reasonCodes });
  const walletPromptDenial = buildWalletPromptDenial({ walletPromptDenialId: `${fixtureId}-wallet-prompt`, reasonCodes });
  const keyMaterialDenial = buildKeyMaterialDenial({ keyMaterialDenialId: `${fixtureId}-key-material`, reasonCodes });
  const signatureOutputDenial = buildSignatureOutputDenial({ signatureOutputDenialId: `${fixtureId}-signature-output`, reasonCodes });
  const signerIdentityPlaceholder = buildSignerIdentityPlaceholder({
    signerIdentityPlaceholderId: `${fixtureId}-signer-placeholder`,
    signerLabel: `placeholder:${fixtureName}`,
  });

  const approvalBoundary = buildSigningApprovalBoundary({ approvalBoundaryId: `${fixtureId}-approval`, approvalStatus: blueprint.approvalStatus });
  const operatorAcknowledgement = buildSigningOperatorAcknowledgement({
    operatorAcknowledgementId: `${fixtureId}-operator-ack`,
    acknowledgementRecorded: blueprint.acknowledgementRecorded,
  });

  const constructionLinkage = buildSigningConstructionLinkage({
    constructionLinkageId: `${fixtureId}-construction-linkage`,
    sourceTransactionConstructionMockRef: `phase82-${phase82Ref}`,
    linkageStatus: fixtureName === 'missing-transaction-construction-mock-blocked' ? 'blocked' : blueprint.linkageStatus,
  });
  const executionBoundaryLinkage = buildSigningExecutionBoundaryLinkage({
    executionBoundaryLinkageId: `${fixtureId}-execution-linkage`,
    sourceExecutionBoundaryRef: `phase81-${phase81Ref}`,
    linkageStatus: blueprint.linkageStatus,
  });
  const dryRunLinkage = buildSigningDryRunLinkage({
    dryRunLinkageId: `${fixtureId}-dry-run-linkage`,
    sourceDryRunControlRef: `phase77-${phase77Ref}`,
    linkageStatus: blueprint.linkageStatus,
  });

  const abortContract = buildSigningAbortContract({ abortContractId: `${fixtureId}-abort`, status: blueprint.gateStatus === 'blocked' ? 'blocked' : 'ready' });
  const rollbackContract = buildSigningRollbackContract({ rollbackContractId: `${fixtureId}-rollback`, status: blueprint.gateStatus === 'blocked' ? 'blocked' : 'ready' });
  const safetyInvariants = buildSigningSafetyInvariants({ safetyInvariantId: `${fixtureId}-safety-invariants` });

  const sourcePhaseRefs = ['phase65','phase66','phase67','phase68','phase69','phase70','phase72','phase73','phase74','phase75','phase76','phase77','phase78','phase79','phase80','phase81','phase82'] as const;
  const sourceFixtureRefs = [`phase65-${phase65Ref}`,`phase66-${phase66Ref}`,`phase67-${phase67Ref}`,`phase68-${phase68Ref}`,`phase69-${phase69Ref}`,`phase70-${phase70Ref}`,`phase72-${phase72Ref}`,`phase73-${phase73Ref}`,`phase74-${phase74Ref}`,`phase75-${phase75Ref}`,`phase76-${phase76Ref}`,`phase77-${phase77Ref}`,`phase78-${phase78Ref}`,`phase79-${phase79Ref}`,`phase80-${phase80Ref}`,`phase81-${phase81Ref}`,`phase82-${phase82Ref}`] as const;

  const evidenceBundle = {
    evidenceBundleId: `${fixtureId}-evidence`,
    sourcePhaseRefs,
    sourceFixtureRefs,
    validationCommandRefs: [
      'corepack pnpm@10.17.0 typecheck',
      'corepack pnpm@10.17.0 lint',
      'corepack pnpm@10.17.0 test',
      'corepack pnpm@10.17.0 --filter @sonic/dashboard build',
      'corepack pnpm@10.17.0 --filter @sonic/offline-intelligence build',
    ],
    safetyGrepRefs: [
      'rg "privateKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction|wallet" apps/dashboard/src/signing-boundary-safety-contracts tests/phase83.test.ts docs/SIGNING_BOUNDARY_SAFETY_CONTRACTS.md',
      'rg "execute|swap|buy|sell|trade|order|RPC|fetch\\(|WebSocket|axios|request|fs\\.|writeFile|setInterval|setTimeout|cron|worker|queue|route|handler|server|listen|recommendation|signal|profit|PnL|providerSdk|postinstall|drainer" apps/dashboard/src/signing-boundary-safety-contracts',
    ],
    docsRefs: [
      'docs/SIGNING_BOUNDARY_SAFETY_CONTRACTS.md',
      'docs/TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS.md',
      'docs/MANUAL_CONFIRM_EXECUTION_BOUNDARY.md',
      'docs/MANUAL_CONFIRM_DRY_RUN_CONTROL.md',
      'docs/SAFETY_RULES.md',
    ],
    evidenceComplete: blueprint.evidenceComplete,
  } as const;

  const blocker = buildSigningBoundaryBlocker({ blockerId: `${fixtureId}-blocker`, blockerCode: blueprint.blockerCode, severity: blueprint.blockerSeverity, blocking: blueprint.gateStatus !== 'ready', reason: blueprint.blockerReason });
  const capabilityAudit = buildSigningCapabilityAudit({ capabilityAuditId: `${fixtureId}-capability-audit`, unsafeCapabilityDetected: fixtureName === 'unsafe-capability-rejected' });
  const scorecard = buildSigningScorecard({ scorecardId: `${fixtureId}-scorecard`, boundaryScore: blueprint.boundaryScore, classification: blueprint.classification, reviewRequired: blueprint.gateStatus !== 'ready' });

  const report = buildSigningBoundaryReport({
    reportId: `${fixtureId}-report`,
    gateSummary: `gate=${boundaryGate.gateStatus}; failClosed=${boundaryGate.failClosed}; signingAllowed=${boundaryGate.signingAllowed}`,
    signingRequestSummary: `signingRequestBlocked=${signingRequestDenial.signingRequestBlocked}; signTransactionBlocked=${signingRequestDenial.signTransactionBlocked}`,
    walletPromptSummary: `walletPromptBlocked=${walletPromptDenial.walletPromptBlocked}; walletAdapterAllowed=${walletPromptDenial.walletAdapterAllowed}`,
    keyMaterialSummary: `privateKeyAccessAllowed=${keyMaterialDenial.privateKeyAccessAllowed}; keypairAccessAllowed=${keyMaterialDenial.keypairAccessAllowed}; seedPhraseAccessAllowed=${keyMaterialDenial.seedPhraseAccessAllowed}`,
    signatureOutputSummary: `signatureBytesProduced=${signatureOutputDenial.signatureBytesProduced}; signedTransactionProduced=${signatureOutputDenial.signedTransactionProduced}; signedMessageProduced=${signatureOutputDenial.signedMessageProduced}`,
    signerIdentitySummary: `placeholderOnly=${signerIdentityPlaceholder.placeholderOnly}; signerAuthorityGranted=${signerIdentityPlaceholder.signerAuthorityGranted}`,
    approvalSummary: `manualApprovalRequired=${approvalBoundary.manualApprovalRequired}; approvalAuthorizesSigning=${approvalBoundary.approvalAuthorizesSigning}`,
    abortRollbackSummary: `abortModeled=${abortContract.abortModeled}; rollbackModeled=${rollbackContract.rollbackModeled}; runtimeSideEffectsAllowed=false`,
    evidenceSummary: `evidenceComplete=${evidenceBundle.evidenceComplete}; sourceRefs=${evidenceBundle.sourceFixtureRefs.length}`,
    safetySummary: 'Signing boundary remains read-only, non-signing, non-wallet, non-dispatching, non-executing, and fail-closed.',
  });

  const viewModel = buildSigningBoundaryViewModel({ viewModelId: `${fixtureId}-view-model`, fixtureId, fixtureName, gateStatus: boundaryGate.gateStatus, approvalStatus: approvalBoundary.approvalStatus });
  const capabilities = getSigningBoundarySafetyCapabilities();
  const selectorExamples = [{ selectorId: `${fixtureId}-selector-id`, selectedFixtureId: fixtureId, selectedFixtureKind: blueprint.fixtureKind, matched: true, source: 'deterministic_fixture_only' as const }] as const;
  const apiContract = buildSigningBoundaryApiContract({ fixtureId, fixtureIds: [fixtureId] });

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

  const checksumInput = [fixtureId, fixtureName, blueprint.fixtureKind, boundaryGate.gateStatus, approvalBoundary.approvalStatus, blocker.blockerCode, sourceFixtureRefs.join('|')].join('::');

  return {
    fixtureId,
    fixtureName,
    fixtureKind: blueprint.fixtureKind,
    phase: SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
    schemaVersion: PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SCHEMA_VERSION,
    boundaryGate,
    signingRequestDenial,
    walletPromptDenial,
    keyMaterialDenial,
    signatureOutputDenial,
    signerIdentityPlaceholder,
    approvalBoundary,
    operatorAcknowledgement,
    constructionLinkage,
    executionBoundaryLinkage,
    dryRunLinkage,
    abortContract,
    rollbackContract,
    safetyInvariants,
    evidenceBundle,
    blocker,
    capabilityAudit,
    scorecard,
    report,
    viewModel,
    apiContract,
    selectorExamples,
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
    sourcePhase80FixtureSnapshot,
    sourcePhase81FixtureSnapshot,
    sourcePhase82FixtureSnapshot,
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
      phase80FixtureId: `phase80-${phase80Ref}`,
      phase81FixtureId: `phase81-${phase81Ref}`,
      phase82FixtureId: `phase82-${phase82Ref}`,
    },
    meta: {
      generatedAt: PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT,
      source: PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_SOURCE,
      version: PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_VERSION,
      phase: SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
      deterministicSeed: stableDeterministicSigningBoundarySafetyChecksum(checksumInput),
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveNetwork: true,
      noSigning: true,
      noSignatureOutput: true,
      noWalletPrompt: true,
      noSending: true,
      noDispatchOrExecution: true,
      noFilesystemWrites: true,
      noPersistence: true,
      noRuntimeCaptureOrReplay: true,
      noScheduledJobs: true,
      nonAdvisory: true,
    },
  };
}
