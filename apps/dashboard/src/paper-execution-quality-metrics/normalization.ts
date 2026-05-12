/**
 * Phase 61 — Paper Execution Quality Metrics v1: normalization.
 */

import {
  PAPER_EXECUTION_QUALITY_METRIC_KINDS,
  PAPER_EXECUTION_QUALITY_METRIC_NAMES,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
  type PaperExecutionQualityMetricFixture,
  type PaperExecutionQualityMetricKind,
  type PaperExecutionQualityMetricName,
} from './types.js';

export function stableDeterministicPaperExecutionQualityMetricsChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nextValue]) => {
        acc[key] = sortKeysDeep(nextValue);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidPaperExecutionQualityMetricName(
  value: unknown,
): value is PaperExecutionQualityMetricName {
  return (
    typeof value === 'string' &&
    (PAPER_EXECUTION_QUALITY_METRIC_NAMES as readonly string[]).includes(value)
  );
}

export function isValidPaperExecutionQualityMetricKind(
  value: unknown,
): value is PaperExecutionQualityMetricKind {
  return (
    typeof value === 'string' &&
    (PAPER_EXECUTION_QUALITY_METRIC_KINDS as readonly string[]).includes(value)
  );
}

export function isValidPaperExecutionQualityMetricsGeneratedAt(
  value: unknown,
): value is typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT {
  return value === PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
}

export function isValidPaperExecutionQualityMetricsSource(
  value: unknown,
): value is typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE {
  return value === PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
}

export function isValidPaperExecutionQualityMetricsSchemaVersion(
  value: unknown,
): value is typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION {
  return value === PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION;
}

export function normalizePaperExecutionQualityMetricFixture(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricFixture {
  return {
    ...fixture,
    scorecard: {
      ...fixture.scorecard,
      qualityWarnings: [...fixture.scorecard.qualityWarnings].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
      limitationNotes: [...fixture.scorecard.limitationNotes].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
      sourceEvidenceReferenceIds: [...fixture.scorecard.sourceEvidenceReferenceIds].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
    },
    selectorExamples: [...fixture.selectorExamples].sort((a, b) =>
      a.selectorId.localeCompare(b.selectorId, 'en-US'),
    ),
  };
}

export function serializePaperExecutionQualityMetricFixture(
  fixture: PaperExecutionQualityMetricFixture,
): string {
  return stablePrettyJsonStringify(normalizePaperExecutionQualityMetricFixture(fixture));
}

export function arePaperExecutionQualityMetricFixturesEqual(
  left: PaperExecutionQualityMetricFixture,
  right: PaperExecutionQualityMetricFixture,
): boolean {
  return (
    stableDeterministicPaperExecutionQualityMetricsChecksum(
      serializePaperExecutionQualityMetricFixture(left),
    ) ===
    stableDeterministicPaperExecutionQualityMetricsChecksum(
      serializePaperExecutionQualityMetricFixture(right),
    )
  );
}
