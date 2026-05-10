/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: normalization.
 */

import type {
  StrategyReviewExportAuditReportFixture,
  StrategyReviewExportAuditReportFixtureKind,
  StrategyReviewExportAuditReportFixtureName,
  StrategyReviewExportAuditReportSeverity,
  StrategyReviewExportAuditReportState,
} from './types.js';
import {
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT,
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES,
} from './types.js';

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, [key, next]) => {
        acc[key] = sortKeysDeep(next);
        return acc;
      }, {});
  }
  return value;
}

export function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function stableDeterministicChecksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function isValidStrategyReviewExportAuditReportFixtureName(
  value: unknown,
): value is StrategyReviewExportAuditReportFixtureName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportFixtureKind(
  value: unknown,
): value is StrategyReviewExportAuditReportFixtureKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportState(
  value: unknown,
): value is StrategyReviewExportAuditReportState {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportSeverity(
  value: unknown,
): value is StrategyReviewExportAuditReportSeverity {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportGeneratedAt(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value === PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT
  );
}

export function isValidStrategyReviewExportAuditReportSource(value: unknown): boolean {
  return typeof value === 'string' && value === PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE;
}

export function normalizeStrategyReviewExportAuditReportFixture(
  fixture: StrategyReviewExportAuditReportFixture,
): StrategyReviewExportAuditReportFixture {
  return {
    ...fixture,
    sections: [...fixture.sections].sort((a, b) => a.order - b.order),
    evidenceReferences: [...fixture.evidenceReferences].sort((a, b) =>
      a.evidenceReferenceId.localeCompare(b.evidenceReferenceId),
    ),
    limitations: [...fixture.limitations],
    nextPhaseNotes: [...fixture.nextPhaseNotes],
  };
}

export function serializeStrategyReviewExportAuditReportFixture(
  fixture: StrategyReviewExportAuditReportFixture,
): string {
  return stablePrettyJsonStringify(normalizeStrategyReviewExportAuditReportFixture(fixture));
}

export function areStrategyReviewExportAuditReportFixturesEqual(
  a: StrategyReviewExportAuditReportFixture,
  b: StrategyReviewExportAuditReportFixture,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportFixture(a) ===
    serializeStrategyReviewExportAuditReportFixture(b)
  );
}
