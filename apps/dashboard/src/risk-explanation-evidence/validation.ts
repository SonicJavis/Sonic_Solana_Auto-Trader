/**
 * Phase 59 — Risk Explanation and Evidence Models v1: validation.
 */

import {
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  LAUNCH_RISK_ENGINE_FIXTURES,
} from '../launch-risk-engine/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../synthetic-event-stream-lifecycle/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../synthetic-event-stream-replay-harness/index.js';
import { RISK_EXPLANATION_TEMPLATE_MAP } from './explanation-templates.js';
import {
  isValidRiskExplanationEvidenceGeneratedAt,
  isValidRiskExplanationEvidenceKind,
  isValidRiskExplanationEvidenceName,
  isValidRiskExplanationEvidenceSchemaVersion,
  isValidRiskExplanationEvidenceSource,
} from './normalization.js';
import { renderRiskExplanationTemplate } from './renderers.js';
import {
  PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_PHASE,
  RISK_EVIDENCE_EDGE_KINDS,
  RISK_EVIDENCE_NODE_KINDS,
  RISK_EXPLANATION_CONFIDENCE_LABELS,
  type RiskExplanationEvidenceFixture,
  type RiskExplanationEvidenceSafetyResult,
  type RiskExplanationEvidenceValidationIssue,
  type RiskExplanationEvidenceValidationResult,
} from './types.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC|request\()/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route\b|handler\b|server\b|listen\()/i;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|ape|snipe now)\b/i;
const FORBIDDEN_PROVIDER_REFERENCE_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|solana\s*rpc)\b/i;
const FORBIDDEN_ADVISORY_PATTERN =
  /\b(?:recommendation|signal|investment advice|profit opportunity)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'sourceRiskFixtureName',
  'sourceReplayFixtureName',
  'sourceLifecycleFixtureName',
  'explanationId',
  'explanationName',
  'explanationKind',
  'contractId',
  'contractName',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'viewModelId',
  'generatedAt',
  'source',
  'errorCode',
  'templateId',
  'factorId',
]);

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: RiskExplanationEvidenceValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_URL_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a live URL reference which is forbidden in fixtures.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_NETWORK_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a network API reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_FILESYSTEM_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a filesystem reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_RUNTIME_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_RUNTIME_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a runtime route/server reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_WALLET_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_WALLET_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a wallet/key reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_EXECUTION_LANGUAGE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains execution language which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_PROVIDER_REFERENCE_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_PROVIDER_REFERENCE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains a live provider reference which is forbidden.`,
      severity: 'error',
    });
  }
  if (FORBIDDEN_ADVISORY_PATTERN.test(text)) {
    issues.push({
      code: 'UNSAFE_ADVISORY_LANGUAGE',
      field: fieldPath,
      message: `Field "${fieldPath}" contains advisory language which is forbidden.`,
      severity: 'error',
    });
  }
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: RiskExplanationEvidenceValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const lastKey = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(lastKey)) {
      scanTextForUnsafeContent(value, fieldPath, issues);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      scanObjectRecursive(item, `${fieldPath}[${index}]`, issues, depth + 1);
    });
  } else if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) {
        scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
      }
    }
  }
}

function ensureTemplateBasedOutput(
  fixture: RiskExplanationEvidenceFixture,
  issues: RiskExplanationEvidenceValidationIssue[],
): void {
  const summary = renderRiskExplanationTemplate('phase59-template-summary', {
    riskBand: fixture.viewModel.riskBand,
  });
  if (fixture.explanationOutput.summary !== summary) {
    issues.push({
      code: 'DYNAMIC_TEXT_OUTSIDE_TEMPLATE',
      field: 'explanationOutput.summary',
      message: 'summary must be generated from known template output.',
      severity: 'error',
    });
  }

  const assessmentSummary = renderRiskExplanationTemplate('phase59-template-assessment', {
    factorCount: fixture.explanationOutput.factorExplanations.length,
  });
  if (fixture.explanationOutput.assessmentSummary !== assessmentSummary) {
    issues.push({
      code: 'DYNAMIC_TEXT_OUTSIDE_TEMPLATE',
      field: 'explanationOutput.assessmentSummary',
      message: 'assessmentSummary must be generated from known template output.',
      severity: 'error',
    });
  }

  for (const [index, factor] of fixture.explanationOutput.factorExplanations.entries()) {
    const expected = renderRiskExplanationTemplate('phase59-template-factor', {
      factorKind: factor.factorKind,
      confidenceLabel: factor.confidenceLabel,
    });
    if (factor.explanationText !== expected) {
      issues.push({
        code: 'DYNAMIC_TEXT_OUTSIDE_TEMPLATE',
        field: `explanationOutput.factorExplanations[${index}].explanationText`,
        message: 'factor explanation text must be generated from known template output.',
        severity: 'error',
      });
    }
  }
}

export function validateRiskExplanationEvidenceFixture(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceValidationResult {
  const issues: RiskExplanationEvidenceValidationIssue[] = [];

  if (!fixture.fixtureId || typeof fixture.fixtureId !== 'string') {
    issues.push({
      code: 'MISSING_FIXTURE_ID',
      field: 'fixtureId',
      message: 'fixtureId is required.',
      severity: 'error',
    });
  }
  if (!isValidRiskExplanationEvidenceName(fixture.fixtureName)) {
    issues.push({
      code: 'INVALID_FIXTURE_NAME',
      field: 'fixtureName',
      message: `fixtureName "${String(fixture.fixtureName)}" is invalid.`,
      severity: 'error',
    });
  }
  if (!isValidRiskExplanationEvidenceKind(fixture.fixtureKind)) {
    issues.push({
      code: 'INVALID_FIXTURE_KIND',
      field: 'fixtureKind',
      message: `fixtureKind "${String(fixture.fixtureKind)}" is invalid.`,
      severity: 'error',
    });
  }
  if (fixture.phase !== PHASE_59_RISK_EXPLANATION_EVIDENCE_PHASE) {
    issues.push({
      code: 'INVALID_PHASE',
      field: 'phase',
      message: `phase must be ${PHASE_59_RISK_EXPLANATION_EVIDENCE_PHASE}.`,
      severity: 'error',
    });
  }
  if (!isValidRiskExplanationEvidenceSchemaVersion(fixture.schemaVersion)) {
    issues.push({
      code: 'INVALID_SCHEMA_VERSION',
      field: 'schemaVersion',
      message: 'schemaVersion is invalid.',
      severity: 'error',
    });
  }

  if (!(LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[]).includes(fixture.sourceRiskFixtureName)) {
    issues.push({
      code: 'MISSING_SOURCE_RISK_FIXTURE',
      field: 'sourceRiskFixtureName',
      message: 'sourceRiskFixtureName must reference a valid Phase 58 fixture.',
      severity: 'error',
    });
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[]).includes(
      fixture.sourceReplayFixtureName,
    )
  ) {
    issues.push({
      code: 'MISSING_SOURCE_REPLAY_FIXTURE',
      field: 'sourceReplayFixtureName',
      message: 'sourceReplayFixtureName must reference a valid Phase 57 fixture.',
      severity: 'error',
    });
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(
      fixture.sourceLifecycleFixtureName,
    )
  ) {
    issues.push({
      code: 'MISSING_SOURCE_LIFECYCLE_FIXTURE',
      field: 'sourceLifecycleFixtureName',
      message: 'sourceLifecycleFixtureName must reference a valid Phase 56 fixture.',
      severity: 'error',
    });
  }

  if (!isValidRiskExplanationEvidenceGeneratedAt(fixture.explanationIdentity.generatedAt)) {
    issues.push({
      code: 'INVALID_GENERATED_AT',
      field: 'explanationIdentity.generatedAt',
      message: 'generatedAt must be the deterministic constant.',
      severity: 'error',
    });
  }
  if (!fixture.explanationIdentity.deterministicSeed) {
    issues.push({
      code: 'MISSING_DETERMINISTIC_SEED',
      field: 'explanationIdentity.deterministicSeed',
      message: 'deterministicSeed is required.',
      severity: 'error',
    });
  }

  const sourceRisk = LAUNCH_RISK_ENGINE_FIXTURES.find(
    source => source.fixtureName === fixture.sourceRiskFixtureName,
  );
  if (!sourceRisk) {
    issues.push({
      code: 'MISSING_SOURCE_RISK_FIXTURE',
      field: 'sourceRiskFixtureName',
      message: 'source risk fixture linkage is missing.',
      severity: 'error',
    });
  }

  if (!Array.isArray(fixture.explanationTemplates) || fixture.explanationTemplates.length === 0) {
    issues.push({
      code: 'MISSING_EXPLANATION_TEMPLATES',
      field: 'explanationTemplates',
      message: 'explanationTemplates must be non-empty.',
      severity: 'error',
    });
  } else {
    for (const [index, template] of fixture.explanationTemplates.entries()) {
      if (!RISK_EXPLANATION_TEMPLATE_MAP.has(template.templateId)) {
        issues.push({
          code: 'UNKNOWN_TEMPLATE_ID',
          field: `explanationTemplates[${index}].templateId`,
          message: 'templateId must be a known deterministic template.',
          severity: 'error',
        });
      }
    }
  }

  if (!(RISK_EVIDENCE_NODE_KINDS as readonly string[]).every(kind => typeof kind === 'string')) {
    issues.push({
      code: 'INVALID_NODE_KIND_SET',
      field: 'RISK_EVIDENCE_NODE_KINDS',
      message: 'Node kind constants must be valid strings.',
      severity: 'error',
    });
  }

  const nodeIds = fixture.evidenceGraph.nodes.map(node => node.nodeId);
  const edgeIds = fixture.evidenceGraph.edges.map(edge => edge.edgeId);
  if (new Set(nodeIds).size !== nodeIds.length) {
    issues.push({
      code: 'DUPLICATE_NODE_ID',
      field: 'evidenceGraph.nodes',
      message: 'Evidence node IDs must be unique.',
      severity: 'error',
    });
  }
  if (new Set(edgeIds).size !== edgeIds.length) {
    issues.push({
      code: 'DUPLICATE_EDGE_ID',
      field: 'evidenceGraph.edges',
      message: 'Evidence edge IDs must be unique.',
      severity: 'error',
    });
  }

  const nodeIdSet = new Set(nodeIds);
  for (const [index, node] of fixture.evidenceGraph.nodes.entries()) {
    if (!(RISK_EVIDENCE_NODE_KINDS as readonly string[]).includes(node.nodeKind)) {
      issues.push({
        code: 'INVALID_NODE_KIND',
        field: `evidenceGraph.nodes[${index}].nodeKind`,
        message: `Invalid node kind: ${node.nodeKind}.`,
        severity: 'error',
      });
    }
    if (
      !(RISK_EXPLANATION_CONFIDENCE_LABELS as readonly string[]).includes(node.confidenceLabel)
    ) {
      issues.push({
        code: 'INVALID_CONFIDENCE_LABEL',
        field: `evidenceGraph.nodes[${index}].confidenceLabel`,
        message: `Invalid confidence label: ${node.confidenceLabel}.`,
        severity: 'error',
      });
    }
  }

  for (const [index, edge] of fixture.evidenceGraph.edges.entries()) {
    if (!(RISK_EVIDENCE_EDGE_KINDS as readonly string[]).includes(edge.edgeKind)) {
      issues.push({
        code: 'INVALID_EDGE_KIND',
        field: `evidenceGraph.edges[${index}].edgeKind`,
        message: `Invalid edge kind: ${edge.edgeKind}.`,
        severity: 'error',
      });
    }
    if (!nodeIdSet.has(edge.fromNodeId) || !nodeIdSet.has(edge.toNodeId)) {
      issues.push({
        code: 'MISSING_EVIDENCE_EDGE_NODE',
        field: `evidenceGraph.edges[${index}]`,
        message: 'Every evidence edge must reference existing node IDs.',
        severity: 'error',
      });
    }
  }

  if (fixture.evidenceGraph.orphanNodeIds.length > 0) {
    issues.push({
      code: 'ORPHAN_EVIDENCE_NODE',
      field: 'evidenceGraph.orphanNodeIds',
      message: 'Normal fixtures cannot include orphan evidence nodes.',
      severity: 'error',
    });
  }

  for (const [index, explanation] of fixture.explanationOutput.factorExplanations.entries()) {
    if (explanation.evidenceNodeIds.length === 0) {
      issues.push({
        code: 'MISSING_FACTOR_EVIDENCE_REFERENCE',
        field: `explanationOutput.factorExplanations[${index}].evidenceNodeIds`,
        message: 'Each factor explanation must reference at least one evidence node.',
        severity: 'error',
      });
    }
    for (const nodeId of explanation.evidenceNodeIds) {
      if (!nodeIdSet.has(nodeId)) {
        issues.push({
          code: 'MISSING_FACTOR_EVIDENCE_REFERENCE',
          field: `explanationOutput.factorExplanations[${index}].evidenceNodeIds`,
          message: `Missing evidence node reference: ${nodeId}.`,
          severity: 'error',
        });
      }
    }
  }

  ensureTemplateBasedOutput(fixture, issues);

  const expectedChecksum = stableDeterministicChecksumForGraph(fixture);
  if (fixture.evidenceGraph.deterministicGraphChecksum !== expectedChecksum) {
    issues.push({
      code: 'GRAPH_CHECKSUM_MISMATCH',
      field: 'evidenceGraph.deterministicGraphChecksum',
      message: 'deterministicGraphChecksum does not match deterministic graph content.',
      severity: 'error',
    });
  }

  if (!isValidRiskExplanationEvidenceGeneratedAt(fixture.meta.generatedAt)) {
    issues.push({
      code: 'INVALID_META_GENERATED_AT',
      field: 'meta.generatedAt',
      message: 'meta.generatedAt must be deterministic constant.',
      severity: 'error',
    });
  }
  if (!isValidRiskExplanationEvidenceSource(fixture.meta.source)) {
    issues.push({
      code: 'INVALID_META_SOURCE',
      field: 'meta.source',
      message: 'meta.source must be deterministic constant.',
      severity: 'error',
    });
  }

  if (fixture.capabilityFlags.riskExplanationLiveData !== false) {
    issues.push({
      code: 'UNSAFE_CAPABILITY_FLAG',
      field: 'capabilityFlags.riskExplanationLiveData',
      message: 'riskExplanationLiveData must be false.',
      severity: 'error',
    });
  }
  if (fixture.capabilityFlags.riskExplanationExecution !== false) {
    issues.push({
      code: 'UNSAFE_CAPABILITY_FLAG',
      field: 'capabilityFlags.riskExplanationExecution',
      message: 'riskExplanationExecution must be false.',
      severity: 'error',
    });
  }
  if (fixture.capabilityFlags.riskExplanationRecommendations !== false) {
    issues.push({
      code: 'UNSAFE_CAPABILITY_FLAG',
      field: 'capabilityFlags.riskExplanationRecommendations',
      message: 'riskExplanationRecommendations must be false.',
      severity: 'error',
    });
  }

  if (fixture.safety.fixtureOnly !== true || fixture.safety.nonAdvisory !== true) {
    issues.push({
      code: 'INVALID_SAFETY_FIELDS',
      field: 'safety',
      message: 'Safety fields must remain fixture-only and non-advisory.',
      severity: 'error',
    });
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}

function stableDeterministicChecksumForGraph(fixture: RiskExplanationEvidenceFixture): string {
  const serialized = JSON.stringify(
    {
      graphId: fixture.evidenceGraph.graphId,
      sourceRiskFixtureName: fixture.sourceRiskFixtureName,
      sourceReplayFixtureName: fixture.sourceReplayFixtureName,
      sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
      nodes: fixture.evidenceGraph.nodes.map(node => [node.nodeId, node.nodeKind, node.sourceId]),
      edges: fixture.evidenceGraph.edges.map(edge => [
        edge.edgeId,
        edge.edgeKind,
        edge.fromNodeId,
        edge.toNodeId,
      ]),
    },
    null,
    2,
  );

  let hash = 2166136261;
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function validateRiskExplanationEvidenceSafety(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceSafetyResult {
  const violations: string[] = [];

  if (fixture.capabilityFlags.riskExplanationLiveData !== false) {
    violations.push('riskExplanationLiveData must be false');
  }
  if (fixture.capabilityFlags.riskExplanationNetworkAccess !== false) {
    violations.push('riskExplanationNetworkAccess must be false');
  }
  if (fixture.capabilityFlags.riskExplanationExecution !== false) {
    violations.push('riskExplanationExecution must be false');
  }
  if (fixture.capabilityFlags.riskExplanationTradingSignals !== false) {
    violations.push('riskExplanationTradingSignals must be false');
  }
  if (fixture.capabilityFlags.riskExplanationRecommendations !== false) {
    violations.push('riskExplanationRecommendations must be false');
  }
  if (fixture.capabilityFlags.riskExplanationInvestmentAdvice !== false) {
    violations.push('riskExplanationInvestmentAdvice must be false');
  }
  if (fixture.capabilityFlags.riskExplanationPaperSimulation !== false) {
    violations.push('riskExplanationPaperSimulation must be false');
  }
  if (fixture.capabilityFlags.riskExplanationStrategySelection !== false) {
    violations.push('riskExplanationStrategySelection must be false');
  }
  if (fixture.safety.fixtureOnly !== true) {
    violations.push('safety.fixtureOnly must be true');
  }
  if (fixture.safety.nonAdvisory !== true) {
    violations.push('safety.nonAdvisory must be true');
  }
  if (fixture.safety.notASignal !== true) {
    violations.push('safety.notASignal must be true');
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
