/**
 * Phase 59 — Risk Explanation and Evidence Models v1: builders.
 */

import {
  LAUNCH_RISK_ENGINE_FIXTURES,
  type LaunchRiskEngineFixture,
} from '../launch-risk-engine/index.js';
import { getRiskExplanationEvidenceCapabilities } from './capabilities.js';
import { buildRiskExplanationEvidenceApiContract } from './contracts.js';
import { buildRiskEvidenceEdge } from './evidence-edges.js';
import { buildRiskEvidenceNode } from './evidence-nodes.js';
import { RISK_EXPLANATION_TEMPLATES } from './explanation-templates.js';
import { buildRiskEvidenceGraph } from './graphs.js';
import { stableDeterministicRiskExplanationEvidenceChecksum } from './normalization.js';
import { renderRiskExplanationTemplate } from './renderers.js';
import { buildRiskExplanationEvidenceViewModel } from './view-models.js';
import type {
  BuildRiskExplanationEvidenceFixtureInput,
  BuildRiskExplanationFromTemplateInput,
  RiskExplanationEvidenceFixture,
  RiskExplanationEvidenceKind,
  RiskExplanationEvidenceName,
  RiskExplanationOutput,
} from './types.js';
import {
  PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_VERSION,
  RISK_EXPLANATION_EVIDENCE_PHASE,
} from './types.js';

interface ExplanationScenarioDefinition {
  readonly fixtureKind: RiskExplanationEvidenceKind;
  readonly sourceRiskFixtureName: LaunchRiskEngineFixture['fixtureName'];
}

const EXPLANATION_SCENARIOS: Readonly<Record<RiskExplanationEvidenceName, ExplanationScenarioDefinition>> = {
  'clean-launch-risk-explanation-evidence': {
    fixtureKind: 'clean_launch_risk_explanation_evidence',
    sourceRiskFixtureName: 'clean-launch-risk-assessment',
  },
  'thin-liquidity-risk-explanation-evidence': {
    fixtureKind: 'thin_liquidity_risk_explanation_evidence',
    sourceRiskFixtureName: 'thin-liquidity-risk-assessment',
  },
  'concentrated-holders-risk-explanation-evidence': {
    fixtureKind: 'concentrated_holders_risk_explanation_evidence',
    sourceRiskFixtureName: 'concentrated-holders-risk-assessment',
  },
  'suspicious-creator-risk-explanation-evidence': {
    fixtureKind: 'suspicious_creator_risk_explanation_evidence',
    sourceRiskFixtureName: 'suspicious-creator-risk-assessment',
  },
  'possible-bundle-cluster-risk-explanation-evidence': {
    fixtureKind: 'possible_bundle_cluster_risk_explanation_evidence',
    sourceRiskFixtureName: 'possible-bundle-cluster-risk-assessment',
  },
  'metadata-incomplete-risk-explanation-evidence': {
    fixtureKind: 'metadata_incomplete_risk_explanation_evidence',
    sourceRiskFixtureName: 'metadata-incomplete-risk-assessment',
  },
  'high-early-volume-risk-explanation-evidence': {
    fixtureKind: 'high_early_volume_risk_explanation_evidence',
    sourceRiskFixtureName: 'high-early-volume-risk-assessment',
  },
  'safety-rejected-risk-explanation-evidence': {
    fixtureKind: 'safety_rejected_risk_explanation_evidence',
    sourceRiskFixtureName: 'safety-rejected-risk-assessment',
  },
} as const;

function getSourceRiskFixture(name: LaunchRiskEngineFixture['fixtureName']): LaunchRiskEngineFixture {
  const fixture = LAUNCH_RISK_ENGINE_FIXTURES.find(candidate => candidate.fixtureName === name);
  if (!fixture) {
    throw new Error(`Phase 59 source risk fixture not found: ${name}`);
  }
  return fixture;
}

function normalizeConfidence(
  value: LaunchRiskEngineFixture['factorOutputs'][number]['confidenceLabel'],
): 'high_confidence' | 'moderate_confidence' | 'low_confidence' | 'insufficient_evidence' {
  if (value === 'high_confidence') return value;
  if (value === 'moderate_confidence') return value;
  if (value === 'low_confidence') return value;
  return 'insufficient_evidence';
}

function deriveEvidenceRows(sourceRiskFixture: LaunchRiskEngineFixture, fixtureId: string) {
  const nodes = [] as ReturnType<typeof buildRiskEvidenceNode>[];
  const edges = [] as ReturnType<typeof buildRiskEvidenceEdge>[];

  const explanationNodeId = `${fixtureId}-node-summary`;
  const assessmentNodeId = `${fixtureId}-node-assessment`;
  const thresholdNodeId = `${fixtureId}-node-threshold`;

  nodes.push(
    buildRiskEvidenceNode({
      nodeId: explanationNodeId,
      nodeKind: 'explanation_summary_evidence',
      sourceType: 'phase59_explanation',
      sourceId: sourceRiskFixture.assessment.assessmentId,
      sourceFixtureName: sourceRiskFixture.fixtureName,
      label: 'Explanation summary evidence',
      summary: 'Summary evidence derived from linked risk assessment and factor evidence.',
      confidenceLabel: 'moderate_confidence',
      evidenceWeight: 1,
      safetyNotes: ['Fixture-only summary evidence. Not a signal.'],
    }),
  );

  nodes.push(
    buildRiskEvidenceNode({
      nodeId: assessmentNodeId,
      nodeKind: 'risk_assessment_evidence',
      sourceType: 'phase58_risk',
      sourceId: sourceRiskFixture.assessment.assessmentId,
      sourceFixtureName: sourceRiskFixture.fixtureName,
      label: 'Risk assessment evidence',
      summary: sourceRiskFixture.assessment.summary,
      confidenceLabel: 'moderate_confidence',
      evidenceWeight: 1,
      safetyNotes: ['Fixture-only assessment evidence. Non-actionable.'],
    }),
  );

  nodes.push(
    buildRiskEvidenceNode({
      nodeId: thresholdNodeId,
      nodeKind: 'threshold_classification_evidence',
      sourceType: 'phase58_risk',
      sourceId: `${sourceRiskFixture.assessment.assessmentId}-threshold`,
      sourceFixtureName: sourceRiskFixture.fixtureName,
      label: 'Threshold classification evidence',
      summary: `Threshold classification supports risk band ${sourceRiskFixture.assessment.riskBand}.`,
      confidenceLabel: 'high_confidence',
      evidenceWeight: 1,
      safetyNotes: ['Threshold classification is a deterministic fixture-derived model.'],
    }),
  );

  edges.push(
    buildRiskEvidenceEdge({
      edgeId: `${fixtureId}-edge-assessment-to-summary`,
      edgeKind: 'assessment_supports_explanation',
      fromNodeId: assessmentNodeId,
      toNodeId: explanationNodeId,
      relationshipLabel: 'assessment supports explanation',
      summary: 'Assessment evidence supports explanation summary evidence.',
      safetyNotes: ['Fixture-derived evidence relationship only.'],
    }),
  );

  edges.push(
    buildRiskEvidenceEdge({
      edgeId: `${fixtureId}-edge-threshold-to-assessment`,
      edgeKind: 'threshold_supports_band',
      fromNodeId: thresholdNodeId,
      toNodeId: assessmentNodeId,
      relationshipLabel: 'threshold supports band',
      summary: 'Threshold classification supports assessment band evidence.',
      safetyNotes: ['Deterministic threshold linkage.'],
    }),
  );

  for (const factor of sourceRiskFixture.factorOutputs) {
    const factorNodeId = `${fixtureId}-node-factor-${factor.factorKind}`;
    const lifecycleNodeId = `${fixtureId}-node-lifecycle-${factor.factorId}`;
    const replayNodeId = `${fixtureId}-node-replay-${factor.factorId}`;

    nodes.push(
      buildRiskEvidenceNode({
        nodeId: factorNodeId,
        nodeKind: 'risk_factor_evidence',
        sourceType: 'phase58_risk',
        sourceId: factor.factorId,
        sourceFixtureName: sourceRiskFixture.fixtureName,
        label: `Risk factor evidence ${factor.factorKind}`,
        summary: factor.summary,
        confidenceLabel: normalizeConfidence(factor.confidenceLabel),
        evidenceWeight: factor.weight,
        safetyNotes: [...factor.safetyNotes],
      }),
    );

    nodes.push(
      buildRiskEvidenceNode({
        nodeId: lifecycleNodeId,
        nodeKind: 'lifecycle_event_evidence',
        sourceType: 'phase56_lifecycle',
        sourceId: factor.sourceLifecycleEventIds[0] ?? `${factor.factorId}-lifecycle`,
        sourceFixtureName: sourceRiskFixture.sourceLifecycleFixtureName,
        label: 'Lifecycle event evidence',
        summary: `Lifecycle evidence supports factor ${factor.factorKind}.`,
        confidenceLabel: normalizeConfidence(factor.confidenceLabel),
        evidenceWeight: 0.8,
        safetyNotes: ['Derived from synthetic lifecycle fixture events only.'],
      }),
    );

    nodes.push(
      buildRiskEvidenceNode({
        nodeId: replayNodeId,
        nodeKind: 'replay_snapshot_evidence',
        sourceType: 'phase57_replay',
        sourceId: factor.sourceReplaySnapshotIds[0] ?? `${factor.factorId}-replay`,
        sourceFixtureName: sourceRiskFixture.sourceReplayFixtureName,
        label: 'Replay snapshot evidence',
        summary: `Replay snapshot evidence supports factor ${factor.factorKind}.`,
        confidenceLabel: normalizeConfidence(factor.confidenceLabel),
        evidenceWeight: 0.7,
        safetyNotes: ['Derived from synthetic replay fixture snapshots only.'],
      }),
    );

    edges.push(
      buildRiskEvidenceEdge({
        edgeId: `${fixtureId}-edge-lifecycle-to-factor-${factor.factorKind}`,
        edgeKind: 'event_supports_factor',
        fromNodeId: lifecycleNodeId,
        toNodeId: factorNodeId,
        relationshipLabel: 'event supports factor',
        summary: 'Lifecycle event evidence supports factor evidence.',
        safetyNotes: ['Deterministic evidence edge only.'],
      }),
    );

    edges.push(
      buildRiskEvidenceEdge({
        edgeId: `${fixtureId}-edge-replay-to-factor-${factor.factorKind}`,
        edgeKind: 'snapshot_supports_factor',
        fromNodeId: replayNodeId,
        toNodeId: factorNodeId,
        relationshipLabel: 'snapshot supports factor',
        summary: 'Replay snapshot evidence supports factor evidence.',
        safetyNotes: ['Deterministic evidence edge only.'],
      }),
    );

    edges.push(
      buildRiskEvidenceEdge({
        edgeId: `${fixtureId}-edge-factor-to-assessment-${factor.factorKind}`,
        edgeKind: 'factor_supports_assessment',
        fromNodeId: factorNodeId,
        toNodeId: assessmentNodeId,
        relationshipLabel: 'factor supports assessment',
        summary: 'Risk factor evidence supports assessment evidence.',
        safetyNotes: ['Deterministic evidence edge only.'],
      }),
    );

    edges.push(
      buildRiskEvidenceEdge({
        edgeId: `${fixtureId}-edge-factor-to-summary-${factor.factorKind}`,
        edgeKind: 'evidence_links_source',
        fromNodeId: factorNodeId,
        toNodeId: explanationNodeId,
        relationshipLabel: 'evidence links source',
        summary: 'Factor evidence links source references into explanation summary.',
        safetyNotes: ['Deterministic source linkage only.'],
      }),
    );
  }

  if (sourceRiskFixture.assessment.assessmentStatus === 'safety_rejected') {
    const safetyNodeId = `${fixtureId}-node-safety-rejection`;
    nodes.push(
      buildRiskEvidenceNode({
        nodeId: safetyNodeId,
        nodeKind: 'safety_rejection_evidence',
        sourceType: 'phase58_risk',
        sourceId: `${sourceRiskFixture.assessment.assessmentId}-safety`,
        sourceFixtureName: sourceRiskFixture.fixtureName,
        label: 'Safety rejection evidence',
        summary: 'Safety rejection evidence supports rejected risk classification.',
        confidenceLabel: 'high_confidence',
        evidenceWeight: 1,
        safetyNotes: ['Safety rejection is a classification only, not an action guide.'],
      }),
    );
    edges.push(
      buildRiskEvidenceEdge({
        edgeId: `${fixtureId}-edge-safety-to-assessment`,
        edgeKind: 'safety_supports_rejection',
        fromNodeId: safetyNodeId,
        toNodeId: assessmentNodeId,
        relationshipLabel: 'safety supports rejection',
        summary: 'Safety rejection evidence supports rejected assessment.',
        safetyNotes: ['Safety classification only.'],
      }),
    );
  }

  return { nodes, edges };
}

export function buildRiskExplanationFromTemplate(
  input: BuildRiskExplanationFromTemplateInput,
): RiskExplanationOutput {
  const summary = renderRiskExplanationTemplate('phase59-template-summary', {
    riskBand: input.riskBand,
  });
  const assessmentSummary = renderRiskExplanationTemplate('phase59-template-assessment', {
    factorCount: input.factorRows.length,
  });

  const factorExplanations = input.factorRows.map(row => ({
    factorId: row.factorId,
    factorKind: row.factorKind,
    confidenceLabel: normalizeConfidence(row.confidenceLabel),
    explanationText: renderRiskExplanationTemplate('phase59-template-factor', {
      factorKind: row.factorKind,
      confidenceLabel: normalizeConfidence(row.confidenceLabel),
    }),
    evidenceNodeIds: [...row.evidenceNodeIds],
    templateId: 'phase59-template-factor',
  }));

  const confidenceSummary = renderRiskExplanationTemplate('phase59-template-confidence', {
    label:
      factorExplanations.find(item => item.confidenceLabel === 'high_confidence')
        ?.confidenceLabel ?? factorExplanations[0]?.confidenceLabel ?? 'insufficient_evidence',
  });

  return {
    explanationId: `${input.fixtureId}-output`,
    explanationKind: input.fixtureKind,
    summary,
    assessmentSummary,
    factorExplanations,
    evidenceReferenceIds: [...input.evidenceNodeIds],
    confidenceSummary,
    limitations: [
      renderRiskExplanationTemplate('phase59-template-limitation', {}),
      'Limitations: synthetic risk fixtures may include insufficient evidence markers in constrained scenarios.',
    ],
    nonGoals: [
      'Non-goal: no action guidance outputs are produced.',
      'Non-goal: no execution, paper simulation, or strategy selection is performed.',
    ],
    safetySummary: renderRiskExplanationTemplate('phase59-template-safety', {}),
    meta: {
      renderedFromTemplateIds: [
        'phase59-template-summary',
        'phase59-template-assessment',
        'phase59-template-factor',
        'phase59-template-confidence',
        'phase59-template-limitation',
        'phase59-template-safety',
      ],
      generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
      source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
      deterministic: true,
    },
  };
}

export function buildRiskExplanationEvidenceFixture(
  input: BuildRiskExplanationEvidenceFixtureInput,
): RiskExplanationEvidenceFixture {
  const scenario = EXPLANATION_SCENARIOS[input.fixtureName];
  const sourceRiskFixture = getSourceRiskFixture(scenario.sourceRiskFixtureName);
  const fixtureId = `phase59-fixture-${input.fixtureName}`;
  const explanationId = `phase59-explanation-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicRiskExplanationEvidenceChecksum(
    `phase59-${input.fixtureName}-seed`,
  );

  const { nodes, edges } = deriveEvidenceRows(sourceRiskFixture, fixtureId);
  const evidenceGraph = buildRiskEvidenceGraph({
    fixtureId,
    sourceRiskFixtureName: sourceRiskFixture.fixtureName,
    sourceReplayFixtureName: sourceRiskFixture.sourceReplayFixtureName,
    sourceLifecycleFixtureName: sourceRiskFixture.sourceLifecycleFixtureName,
    nodes,
    edges,
  });

  const explanationOutput = buildRiskExplanationFromTemplate({
    fixtureId,
    fixtureKind: scenario.fixtureKind,
    riskBand: sourceRiskFixture.assessment.riskBand,
    factorRows: sourceRiskFixture.factorOutputs.map(factor => ({
      factorId: factor.factorId,
      factorKind: factor.factorKind,
      confidenceLabel: factor.confidenceLabel,
      evidenceNodeIds: evidenceGraph.nodes
        .filter(node => node.sourceId === factor.factorId || node.summary.includes(factor.factorKind))
        .map(node => node.nodeId),
    })),
    evidenceNodeIds: evidenceGraph.nodes.map(node => node.nodeId),
  });

  const explanationIdentity = {
    explanationId,
    explanationName: input.fixtureName,
    explanationKind: scenario.fixtureKind,
    sourceRiskFixtureName: sourceRiskFixture.fixtureName,
    sourceReplayFixtureName: sourceRiskFixture.sourceReplayFixtureName,
    sourceLifecycleFixtureName: sourceRiskFixture.sourceLifecycleFixtureName,
    schemaVersion: PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION,
    deterministicSeed,
    generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  } as const;

  const selectorExamples = [
    {
      selectorId: `phase59-selector-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: scenario.fixtureKind,
      matched: true,
      source: 'synthetic_fixture_only' as const,
    },
  ] as const;

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: RISK_EXPLANATION_EVIDENCE_PHASE,
    schemaVersion: PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION,
    sourceRiskFixtureName: sourceRiskFixture.fixtureName,
    sourceReplayFixtureName: sourceRiskFixture.sourceReplayFixtureName,
    sourceLifecycleFixtureName: sourceRiskFixture.sourceLifecycleFixtureName,
    explanationIdentity,
    evidenceGraph,
    explanationTemplates: RISK_EXPLANATION_TEMPLATES,
    explanationOutput,
    viewModel: undefined as unknown as RiskExplanationEvidenceFixture['viewModel'],
    apiContracts: undefined as unknown as RiskExplanationEvidenceFixture['apiContracts'],
    selectorExamples,
    capabilityFlags: getRiskExplanationEvidenceCapabilities(),
    meta: {
      generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
      source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
      version: PHASE_59_RISK_EXPLANATION_EVIDENCE_VERSION,
      phase: RISK_EXPLANATION_EVIDENCE_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      nonAdvisory: true as const,
      notASignal: true as const,
    },
  };

  const viewModel = buildRiskExplanationEvidenceViewModel(
    partialFixture as unknown as RiskExplanationEvidenceFixture,
  );

  const fixture = {
    ...partialFixture,
    viewModel,
  } as RiskExplanationEvidenceFixture;

  return {
    ...fixture,
    apiContracts: buildRiskExplanationEvidenceApiContract(fixture),
  };
}
