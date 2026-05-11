/**
 * Phase 59 — Risk Explanation and Evidence Models v1: types.
 *
 * Deterministic, synthetic, local-only, read-only evidence/explanation surfaces.
 * Non-networked, non-wallet, non-executing, non-advisory.
 */

import type {
  LaunchRiskBand,
  LaunchRiskConfidenceLabel,
  LaunchRiskEngineAssessmentName,
} from '../launch-risk-engine/types.js';
import type {
  SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';
import type {
  SyntheticEventStreamReplayHarnessScenarioName,
} from '../synthetic-event-stream-replay-harness/types.js';

export const RISK_EXPLANATION_EVIDENCE_PHASE = 59 as const;

export const PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT =
  '2026-02-20T00:00:00.000Z' as const;

export const PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE =
  'phase59_risk_explanation_evidence_models_v1' as const;

export const PHASE_59_RISK_EXPLANATION_EVIDENCE_VERSION = '1.0.0' as const;

export const PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION = '1.0.0' as const;

export const RISK_EXPLANATION_EVIDENCE_NAMES = [
  'clean-launch-risk-explanation-evidence',
  'thin-liquidity-risk-explanation-evidence',
  'concentrated-holders-risk-explanation-evidence',
  'suspicious-creator-risk-explanation-evidence',
  'possible-bundle-cluster-risk-explanation-evidence',
  'metadata-incomplete-risk-explanation-evidence',
  'high-early-volume-risk-explanation-evidence',
  'safety-rejected-risk-explanation-evidence',
] as const;

export const RISK_EXPLANATION_EVIDENCE_KINDS = [
  'clean_launch_risk_explanation_evidence',
  'thin_liquidity_risk_explanation_evidence',
  'concentrated_holders_risk_explanation_evidence',
  'suspicious_creator_risk_explanation_evidence',
  'possible_bundle_cluster_risk_explanation_evidence',
  'metadata_incomplete_risk_explanation_evidence',
  'high_early_volume_risk_explanation_evidence',
  'safety_rejected_risk_explanation_evidence',
] as const;

export type RiskExplanationEvidenceName = (typeof RISK_EXPLANATION_EVIDENCE_NAMES)[number];
export type RiskExplanationEvidenceKind = (typeof RISK_EXPLANATION_EVIDENCE_KINDS)[number];

export const RISK_EVIDENCE_NODE_KINDS = [
  'lifecycle_event_evidence',
  'replay_snapshot_evidence',
  'risk_factor_evidence',
  'risk_assessment_evidence',
  'threshold_classification_evidence',
  'safety_rejection_evidence',
  'insufficient_evidence_marker',
  'explanation_summary_evidence',
] as const;

export type RiskEvidenceNodeKind = (typeof RISK_EVIDENCE_NODE_KINDS)[number];

export const RISK_EVIDENCE_EDGE_KINDS = [
  'event_supports_factor',
  'snapshot_supports_factor',
  'factor_supports_assessment',
  'threshold_supports_band',
  'assessment_supports_explanation',
  'safety_supports_rejection',
  'evidence_links_source',
] as const;

export type RiskEvidenceEdgeKind = (typeof RISK_EVIDENCE_EDGE_KINDS)[number];

export const RISK_EXPLANATION_TEMPLATE_KINDS = [
  'summary_template',
  'assessment_template',
  'factor_template',
  'confidence_template',
  'limitation_template',
  'safety_template',
] as const;

export type RiskExplanationTemplateKind = (typeof RISK_EXPLANATION_TEMPLATE_KINDS)[number];

export const RISK_EXPLANATION_CONFIDENCE_LABELS = [
  'high_confidence',
  'moderate_confidence',
  'low_confidence',
  'insufficient_evidence',
] as const;

export type RiskExplanationConfidenceLabel = (typeof RISK_EXPLANATION_CONFIDENCE_LABELS)[number];

export interface RiskExplanationEvidenceIdentity {
  readonly explanationId: string;
  readonly explanationName: RiskExplanationEvidenceName;
  readonly explanationKind: RiskExplanationEvidenceKind;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly schemaVersion: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
}

export interface RiskEvidenceNode {
  readonly nodeId: string;
  readonly nodeKind: RiskEvidenceNodeKind;
  readonly sourceType: 'phase56_lifecycle' | 'phase57_replay' | 'phase58_risk' | 'phase59_explanation';
  readonly sourceId: string;
  readonly sourceFixtureName: string;
  readonly label: string;
  readonly summary: string;
  readonly confidenceLabel: RiskExplanationConfidenceLabel;
  readonly evidenceWeight: number;
  readonly safetyNotes: readonly string[];
}

export interface RiskEvidenceEdge {
  readonly edgeId: string;
  readonly edgeKind: RiskEvidenceEdgeKind;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly relationshipLabel: string;
  readonly summary: string;
  readonly safetyNotes: readonly string[];
}

export interface RiskEvidenceSourceCoverageSummary {
  readonly lifecycleNodeCount: number;
  readonly replayNodeCount: number;
  readonly riskNodeCount: number;
  readonly explanationNodeCount: number;
  readonly linkedFactorCount: number;
}

export interface RiskEvidenceGraph {
  readonly graphId: string;
  readonly graphName: string;
  readonly graphKind: 'risk_explanation_evidence_graph';
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly nodes: readonly RiskEvidenceNode[];
  readonly edges: readonly RiskEvidenceEdge[];
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly sourceCoverageSummary: RiskEvidenceSourceCoverageSummary;
  readonly orphanNodeIds: readonly string[];
  readonly deterministicGraphChecksum: string;
  readonly safetySummary: string;
}

export interface RiskExplanationTemplate {
  readonly templateId: string;
  readonly templateKind: RiskExplanationTemplateKind;
  readonly variables: readonly string[];
  readonly template: string;
  readonly fixedOrder: number;
  readonly allowedWordingOnly: true;
}

export interface RiskFactorExplanation {
  readonly factorId: string;
  readonly factorKind: string;
  readonly confidenceLabel: RiskExplanationConfidenceLabel;
  readonly explanationText: string;
  readonly evidenceNodeIds: readonly string[];
  readonly templateId: string;
}

export interface RiskExplanationOutput {
  readonly explanationId: string;
  readonly explanationKind: RiskExplanationEvidenceKind;
  readonly summary: string;
  readonly assessmentSummary: string;
  readonly factorExplanations: readonly RiskFactorExplanation[];
  readonly evidenceReferenceIds: readonly string[];
  readonly confidenceSummary: string;
  readonly limitations: readonly string[];
  readonly nonGoals: readonly string[];
  readonly safetySummary: string;
  readonly meta: {
    readonly renderedFromTemplateIds: readonly string[];
    readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
    readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
    readonly deterministic: true;
  };
}

export interface RiskExplanationEvidenceViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly explanationName: RiskExplanationEvidenceName;
  readonly explanationKind: RiskExplanationEvidenceKind;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly riskBand: LaunchRiskBand;
  readonly confidenceLabel: RiskExplanationConfidenceLabel;
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly nonAdvisorySummary: string;
}

export interface RiskExplanationEvidenceApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
  readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface RiskExplanationEvidenceApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
  readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: RiskExplanationEvidenceViewModel;
}

export interface RiskExplanationEvidenceApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
  readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly explanationKind: RiskExplanationEvidenceKind;
    readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
    readonly riskBand: LaunchRiskBand;
  };
}

export interface RiskExplanationEvidenceApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
  readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'RISK_EXPLANATION_EVIDENCE_INVALID_REQUEST'
    | 'RISK_EXPLANATION_EVIDENCE_NOT_FOUND';
  readonly message: string;
}

export interface RiskExplanationEvidenceApiContracts {
  readonly list: RiskExplanationEvidenceApiListContract;
  readonly detail: RiskExplanationEvidenceApiDetailContract;
  readonly summary: RiskExplanationEvidenceApiSummaryContract;
  readonly errors: readonly [
    RiskExplanationEvidenceApiErrorContract,
    RiskExplanationEvidenceApiErrorContract,
  ];
}

export interface RiskExplanationEvidenceSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: RiskExplanationEvidenceName;
  readonly fixtureKind?: RiskExplanationEvidenceKind;
  readonly sourceRiskFixtureName?: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName?: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName?: SyntheticEventStreamLifecycleStreamName;
}

export interface RiskExplanationEvidenceSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: RiskExplanationEvidenceKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface RiskExplanationEvidenceCapabilities {
  readonly riskExplanationEvidenceModels: true;
  readonly riskExplanationEvidenceFixtures: true;
  readonly deterministicRiskExplanationEvidence: true;
  readonly localOnlyRiskExplanationEvidence: true;
  readonly readOnlyRiskExplanationEvidence: true;
  readonly fixtureDerivedRiskExplanationEvidence: true;
  readonly riskEvidenceNodes: true;
  readonly riskEvidenceEdges: true;
  readonly riskEvidenceGraphs: true;
  readonly riskExplanationTemplates: true;
  readonly riskExplanationOutputs: true;
  readonly riskExplanationViewModels: true;
  readonly riskExplanationApiContracts: true;
  readonly riskExplanationSelectors: true;
  readonly riskExplanationLiveData: false;
  readonly riskExplanationNetworkAccess: false;
  readonly riskExplanationRealProviders: false;
  readonly riskExplanationProviderAdapters: false;
  readonly riskExplanationSolanaRpc: false;
  readonly riskExplanationWebSocketAccess: false;
  readonly riskExplanationGeyserYellowstone: false;
  readonly riskExplanationPumpFunIntegration: false;
  readonly riskExplanationDexIntegration: false;
  readonly riskExplanationJitoIntegration: false;
  readonly riskExplanationPersistence: false;
  readonly riskExplanationFilesystemWrites: false;
  readonly riskExplanationDownloads: false;
  readonly riskExplanationRouteHandlers: false;
  readonly riskExplanationHttpServer: false;
  readonly riskExplanationRuntimeRequests: false;
  readonly riskExplanationUiRendering: false;
  readonly riskExplanationDomAccess: false;
  readonly riskExplanationBackgroundJobs: false;
  readonly riskExplanationScheduledJobs: false;
  readonly riskExplanationWalletLogic: false;
  readonly riskExplanationPrivateKeyHandling: false;
  readonly riskExplanationSigning: false;
  readonly riskExplanationTransactionSending: false;
  readonly riskExplanationExecution: false;
  readonly riskExplanationTradingSignals: false;
  readonly riskExplanationRecommendations: false;
  readonly riskExplanationInvestmentAdvice: false;
  readonly riskExplanationPaperSimulation: false;
  readonly riskExplanationLiveExecution: false;
  readonly riskExplanationStrategySelection: false;
}

export interface RiskExplanationEvidenceFixture {
  readonly fixtureId: string;
  readonly fixtureName: RiskExplanationEvidenceName;
  readonly fixtureKind: RiskExplanationEvidenceKind;
  readonly phase: typeof RISK_EXPLANATION_EVIDENCE_PHASE;
  readonly schemaVersion: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly explanationIdentity: RiskExplanationEvidenceIdentity;
  readonly evidenceGraph: RiskEvidenceGraph;
  readonly explanationTemplates: readonly RiskExplanationTemplate[];
  readonly explanationOutput: RiskExplanationOutput;
  readonly viewModel: RiskExplanationEvidenceViewModel;
  readonly apiContracts: RiskExplanationEvidenceApiContracts;
  readonly selectorExamples: readonly RiskExplanationEvidenceSelectorResult[];
  readonly capabilityFlags: RiskExplanationEvidenceCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
    readonly source: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
    readonly version: typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_VERSION;
    readonly phase: typeof RISK_EXPLANATION_EVIDENCE_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notASignal: true;
  };
}

export interface BuildRiskExplanationEvidenceFixtureInput {
  readonly fixtureName: RiskExplanationEvidenceName;
}

export interface BuildRiskEvidenceNodeInput {
  readonly nodeId: string;
  readonly nodeKind: RiskEvidenceNodeKind;
  readonly sourceType: RiskEvidenceNode['sourceType'];
  readonly sourceId: string;
  readonly sourceFixtureName: string;
  readonly label: string;
  readonly summary: string;
  readonly confidenceLabel: RiskExplanationConfidenceLabel;
  readonly evidenceWeight: number;
  readonly safetyNotes: readonly string[];
}

export interface BuildRiskEvidenceEdgeInput {
  readonly edgeId: string;
  readonly edgeKind: RiskEvidenceEdgeKind;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly relationshipLabel: string;
  readonly summary: string;
  readonly safetyNotes: readonly string[];
}

export interface BuildRiskEvidenceGraphInput {
  readonly fixtureId: string;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly nodes: readonly RiskEvidenceNode[];
  readonly edges: readonly RiskEvidenceEdge[];
}

export interface BuildRiskExplanationFromTemplateInput {
  readonly fixtureId: string;
  readonly fixtureKind: RiskExplanationEvidenceKind;
  readonly riskBand: LaunchRiskBand;
  readonly factorRows: readonly {
    readonly factorId: string;
    readonly factorKind: string;
    readonly confidenceLabel: LaunchRiskConfidenceLabel;
    readonly evidenceNodeIds: readonly string[];
  }[];
  readonly evidenceNodeIds: readonly string[];
}

export interface RiskExplanationEvidenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface RiskExplanationEvidenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly RiskExplanationEvidenceValidationIssue[];
}

export interface RiskExplanationEvidenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
