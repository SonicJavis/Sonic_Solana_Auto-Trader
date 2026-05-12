/**
 * Phase 61 — Paper Execution Quality Metrics v1: validation.
 */

import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../launch-risk-engine/index.js';
import { PAPER_SNIPER_SIMULATION_NAMES } from '../paper-sniper-simulation/index.js';
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../risk-explanation-evidence/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../synthetic-event-stream-lifecycle/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../synthetic-event-stream-replay-harness/index.js';
import {
  isValidPaperExecutionQualityMetricKind,
  isValidPaperExecutionQualityMetricName,
  isValidPaperExecutionQualityMetricsGeneratedAt,
  isValidPaperExecutionQualityMetricsSchemaVersion,
  isValidPaperExecutionQualityMetricsSource,
} from './normalization.js';
import {
  PAPER_EXECUTION_CONFIRMATION_DELAY_BUCKETS,
  PAPER_EXECUTION_FILL_QUALITY_LABELS,
  PAPER_EXECUTION_FILL_STATUSES,
  PAPER_EXECUTION_LATENCY_BUCKETS,
  PAPER_EXECUTION_LATENCY_QUALITY_LABELS,
  PAPER_EXECUTION_MISSED_ENTRY_CLASSIFICATIONS,
  PAPER_EXECUTION_OBSERVATION_DELAY_BUCKETS,
  PAPER_EXECUTION_PRICE_IMPACT_BUCKETS,
  PAPER_EXECUTION_QUALITY_BANDS,
  PAPER_EXECUTION_QUALITY_METRICS_PHASE,
  PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS,
  PAPER_EXECUTION_SLIPPAGE_BUCKETS,
  PAPER_EXECUTION_SLIPPAGE_QUALITY_LABELS,
  PAPER_EXECUTION_SUBMISSION_DELAY_BUCKETS,
  type PaperExecutionQualityMetricFixture,
  type PaperExecutionQualityMetricValidationIssue,
  type PaperExecutionQualityMetricValidationResult,
  type PaperExecutionQualityMetricsSafetyResult,
} from './types.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|websocket|socket\.)/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_ORDER_PATTERN = /\b(?:real order|order id|real fill|fill id|submit order|place order)\b/i;
const FORBIDDEN_TX_PATTERN = /\b(?:transaction|tx\b|signature|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_PROVIDER_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|provider|solana\s*rpc)\b/i;
const FORBIDDEN_ADVISORY_PATTERN =
  /\b(?:buy now|sell now|enter now|exit now|ape now|snipe now|trade now|profit opportunity|pnl|recommendation|trading signals?|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'sourceSimulationFixtureName',
  'sourceEvidenceFixtureName',
  'sourceRiskFixtureName',
  'sourceReplayFixtureName',
  'sourceLifecycleFixtureName',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'contractId',
  'viewModelId',
  'metricsId',
  'metricSetId',
  'metricSetName',
  'metricSetKind',
  'scorecardId',
  'aggregateId',
  'source',
  'generatedAt',
  'errorCode',
]);

function pushIssue(
  issues: PaperExecutionQualityMetricValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: PaperExecutionQualityMetricValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  }
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  }
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  }
  if (FORBIDDEN_TIMER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime clock references are forbidden.');
  }
  if (FORBIDDEN_WALLET_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet references are forbidden.');
  }
  if (FORBIDDEN_ORDER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_ORDER_REFERENCE', fieldPath, 'Real-order/fill references are forbidden.');
  }
  if (FORBIDDEN_TX_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_TRANSACTION_REFERENCE', fieldPath, 'Transaction references are forbidden.');
  }
  if (FORBIDDEN_PROVIDER_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_PROVIDER_REFERENCE', fieldPath, 'Live provider references are forbidden.');
  }
  if (FORBIDDEN_ADVISORY_PATTERN.test(text)) {
    pushIssue(issues, 'UNSAFE_ADVISORY_LANGUAGE', fieldPath, 'Advisory/execution language is forbidden.');
  }
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: PaperExecutionQualityMetricValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const key = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(key)) {
      scanTextForUnsafeContent(value, fieldPath, issues);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanObjectRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) {
        scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
      }
    }
  }
}

function validateMetricEnums(
  fixture: PaperExecutionQualityMetricFixture,
  issues: PaperExecutionQualityMetricValidationIssue[],
): void {
  if (!(PAPER_EXECUTION_LATENCY_BUCKETS as readonly string[]).includes(fixture.latencyMetrics.latencyBucket)) {
    pushIssue(issues, 'INVALID_LATENCY_BUCKET', 'latencyMetrics.latencyBucket', 'Invalid latency bucket.');
  }
  if (
    !(PAPER_EXECUTION_OBSERVATION_DELAY_BUCKETS as readonly string[]).includes(
      fixture.latencyMetrics.observationDelayBucket,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_OBSERVATION_DELAY_BUCKET',
      'latencyMetrics.observationDelayBucket',
      'Invalid observation delay bucket.',
    );
  }
  if (
    !(PAPER_EXECUTION_SUBMISSION_DELAY_BUCKETS as readonly string[]).includes(
      fixture.latencyMetrics.simulatedSubmissionDelayBucket,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_SUBMISSION_DELAY_BUCKET',
      'latencyMetrics.simulatedSubmissionDelayBucket',
      'Invalid submission delay bucket.',
    );
  }
  if (
    !(PAPER_EXECUTION_CONFIRMATION_DELAY_BUCKETS as readonly string[]).includes(
      fixture.latencyMetrics.simulatedConfirmationDelayBucket,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_CONFIRMATION_DELAY_BUCKET',
      'latencyMetrics.simulatedConfirmationDelayBucket',
      'Invalid confirmation delay bucket.',
    );
  }
  if (
    !(PAPER_EXECUTION_LATENCY_QUALITY_LABELS as readonly string[]).includes(
      fixture.latencyMetrics.latencyQualityLabel,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_LATENCY_QUALITY_LABEL',
      'latencyMetrics.latencyQualityLabel',
      'Invalid latency quality label.',
    );
  }

  if (
    !(PAPER_EXECUTION_FILL_STATUSES as readonly string[]).includes(
      fixture.fillQualityMetrics.hypotheticalFillStatus,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_FILL_STATUS',
      'fillQualityMetrics.hypotheticalFillStatus',
      'Invalid fill status.',
    );
  }
  if (
    !(PAPER_EXECUTION_FILL_QUALITY_LABELS as readonly string[]).includes(
      fixture.fillQualityMetrics.simulatedFillQualityLabel,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_FILL_QUALITY_LABEL',
      'fillQualityMetrics.simulatedFillQualityLabel',
      'Invalid fill quality label.',
    );
  }
  if (
    !(PAPER_EXECUTION_MISSED_ENTRY_CLASSIFICATIONS as readonly string[]).includes(
      fixture.fillQualityMetrics.simulatedMissedEntryClassification,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_MISSED_ENTRY_CLASSIFICATION',
      'fillQualityMetrics.simulatedMissedEntryClassification',
      'Invalid missed-entry classification.',
    );
  }

  if (
    !(PAPER_EXECUTION_SLIPPAGE_BUCKETS as readonly string[]).includes(
      fixture.slippageMetrics.simulatedSlippageBucket,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_SLIPPAGE_BUCKET',
      'slippageMetrics.simulatedSlippageBucket',
      'Invalid slippage bucket.',
    );
  }
  if (
    !(PAPER_EXECUTION_PRICE_IMPACT_BUCKETS as readonly string[]).includes(
      fixture.slippageMetrics.syntheticPriceImpactBucket,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_PRICE_IMPACT_BUCKET',
      'slippageMetrics.syntheticPriceImpactBucket',
      'Invalid price impact bucket.',
    );
  }
  if (
    !(PAPER_EXECUTION_SLIPPAGE_QUALITY_LABELS as readonly string[]).includes(
      fixture.slippageMetrics.slippageQualityLabel,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_SLIPPAGE_QUALITY_LABEL',
      'slippageMetrics.slippageQualityLabel',
      'Invalid slippage quality label.',
    );
  }

  if (
    !(PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS as readonly string[]).includes(
      fixture.rejectionMetrics.rejectionTaxonomyKind,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_REJECTION_TAXONOMY',
      'rejectionMetrics.rejectionTaxonomyKind',
      'Invalid rejection taxonomy.',
    );
  }

  if (
    !(PAPER_EXECUTION_QUALITY_BANDS as readonly string[]).includes(
      fixture.scorecard.aggregateQualityBand,
    )
  ) {
    pushIssue(
      issues,
      'INVALID_AGGREGATE_QUALITY_BAND',
      'scorecard.aggregateQualityBand',
      'Invalid aggregate quality band.',
    );
  }
}

export function validatePaperExecutionQualityMetricFixture(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricValidationResult {
  const issues: PaperExecutionQualityMetricValidationIssue[] = [];

  if (!isValidPaperExecutionQualityMetricName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidPaperExecutionQualityMetricKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PAPER_EXECUTION_QUALITY_METRICS_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${PAPER_EXECUTION_QUALITY_METRICS_PHASE}.`);
  }
  if (!isValidPaperExecutionQualityMetricsSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }

  if (!(PAPER_SNIPER_SIMULATION_NAMES as readonly string[]).includes(fixture.sourceSimulationFixtureName)) {
    pushIssue(
      issues,
      'MISSING_SOURCE_SIMULATION_FIXTURE',
      'sourceSimulationFixtureName',
      'Must reference Phase 60 simulation fixture name.',
    );
  }
  if (!(RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[]).includes(fixture.sourceEvidenceFixtureName)) {
    pushIssue(
      issues,
      'MISSING_SOURCE_EVIDENCE_FIXTURE',
      'sourceEvidenceFixtureName',
      'Must reference Phase 59 evidence fixture name.',
    );
  }
  if (!(LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[]).includes(fixture.sourceRiskFixtureName)) {
    pushIssue(
      issues,
      'MISSING_SOURCE_RISK_FIXTURE',
      'sourceRiskFixtureName',
      'Must reference Phase 58 risk fixture name.',
    );
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[]).includes(
      fixture.sourceReplayFixtureName,
    )
  ) {
    pushIssue(
      issues,
      'MISSING_SOURCE_REPLAY_FIXTURE',
      'sourceReplayFixtureName',
      'Must reference Phase 57 replay fixture name.',
    );
  }
  if (
    !(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(
      fixture.sourceLifecycleFixtureName,
    )
  ) {
    pushIssue(
      issues,
      'MISSING_SOURCE_LIFECYCLE_FIXTURE',
      'sourceLifecycleFixtureName',
      'Must reference Phase 56 lifecycle fixture name.',
    );
  }

  validateMetricEnums(fixture, issues);

  if (!isValidPaperExecutionQualityMetricsGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  }
  if (!isValidPaperExecutionQualityMetricsSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');
  }

  if (fixture.metricsIdentity.sourceSimulationFixtureName !== fixture.sourceSimulationFixtureName) {
    pushIssue(
      issues,
      'IDENTITY_SOURCE_MISMATCH',
      'metricsIdentity.sourceSimulationFixtureName',
      'metricsIdentity source simulation reference must match fixture source.',
    );
  }

  if (fixture.scorecard.sourceSimulationFixtureName !== fixture.sourceSimulationFixtureName) {
    pushIssue(
      issues,
      'SCORECARD_SOURCE_MISMATCH',
      'scorecard.sourceSimulationFixtureName',
      'scorecard source simulation reference must match fixture source.',
    );
  }

  if (fixture.capabilityFlags.paperExecutionQualityExecution !== false) {
    pushIssue(
      issues,
      'UNSAFE_CAPABILITY_FLAG',
      'capabilityFlags.paperExecutionQualityExecution',
      'paperExecutionQualityExecution must be false.',
    );
  }
  if (fixture.capabilityFlags.paperExecutionQualityRecommendations !== false) {
    pushIssue(
      issues,
      'UNSAFE_CAPABILITY_FLAG',
      'capabilityFlags.paperExecutionQualityRecommendations',
      'paperExecutionQualityRecommendations must be false.',
    );
  }
  if (fixture.capabilityFlags.paperExecutionQualityRealOrders !== false) {
    pushIssue(
      issues,
      'UNSAFE_CAPABILITY_FLAG',
      'capabilityFlags.paperExecutionQualityRealOrders',
      'paperExecutionQualityRealOrders must be false.',
    );
  }

  if (
    fixture.safety.fixtureOnly !== true ||
    fixture.safety.hypotheticalOnly !== true ||
    fixture.safety.nonAdvisory !== true
  ) {
    pushIssue(
      issues,
      'INVALID_SAFETY_FIELDS',
      'safety',
      'Safety fields must stay fixture-only, hypothetical-only, and non-advisory.',
    );
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    issues,
  };
}

export function validatePaperExecutionQualityMetricsSafety(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsSafetyResult {
  const violations: string[] = [];

  if (fixture.capabilityFlags.paperExecutionQualityLiveData !== false) {
    violations.push('paperExecutionQualityLiveData must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityNetworkAccess !== false) {
    violations.push('paperExecutionQualityNetworkAccess must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityExecution !== false) {
    violations.push('paperExecutionQualityExecution must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityTradingSignals !== false) {
    violations.push('paperExecutionQualityTradingSignals must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityRecommendations !== false) {
    violations.push('paperExecutionQualityRecommendations must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityInvestmentAdvice !== false) {
    violations.push('paperExecutionQualityInvestmentAdvice must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityStrategySelection !== false) {
    violations.push('paperExecutionQualityStrategySelection must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityRealOrders !== false) {
    violations.push('paperExecutionQualityRealOrders must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityRealFunds !== false) {
    violations.push('paperExecutionQualityRealFunds must be false');
  }
  if (fixture.capabilityFlags.paperExecutionQualityRealPnL !== false) {
    violations.push('paperExecutionQualityRealPnL must be false');
  }
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.safety.hypotheticalOnly !== true) violations.push('safety.hypotheticalOnly must be true');
  if (fixture.safety.nonAdvisory !== true) violations.push('safety.nonAdvisory must be true');
  if (fixture.safety.notASignal !== true) violations.push('safety.notASignal must be true');

  return {
    safe: violations.length === 0,
    violations,
  };
}
