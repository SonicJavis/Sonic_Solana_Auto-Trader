/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: fixtures.
 */

import {
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
} from '../strategy-review-export-audit/index.js';
import { buildStrategyReviewExportAuditReportFixture } from './builders.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
  type StrategyReviewExportAuditReportFixture,
  type StrategyReviewExportAuditReportFixtureName,
} from './types.js';

function buildFixtureOrThrow(
  sourceAuditFixture: (typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST)[number],
): StrategyReviewExportAuditReportFixture {
  const result = buildStrategyReviewExportAuditReportFixture({ sourceAuditFixture });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 46 export audit report fixture: ${sourceAuditFixture.name}`);
  }
  return result.fixture;
}

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES: readonly StrategyReviewExportAuditReportFixture[] =
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.map(sourceAuditFixture =>
    buildFixtureOrThrow(sourceAuditFixture),
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportFixtureName,
  StrategyReviewExportAuditReportFixture
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.map(fixture => [fixture.reportName, fixture]),
);

if (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size !== PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.size) {
  throw new Error(
    `Phase 46 fixture count mismatch: expected ${PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.size}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size}`,
  );
}

export function listStrategyReviewExportAuditReportFixtures(): readonly StrategyReviewExportAuditReportFixture[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.map(name => {
    const fixture = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.get(name);
    if (!fixture) {
      throw new Error(`Missing Phase 46 export audit report fixture: ${name}`);
    }
    return fixture;
  });
}

export function getStrategyReviewExportAuditReportFixture(
  name: string,
): StrategyReviewExportAuditReportFixture | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.get(
    name as StrategyReviewExportAuditReportFixtureName,
  ) ?? null;
}
