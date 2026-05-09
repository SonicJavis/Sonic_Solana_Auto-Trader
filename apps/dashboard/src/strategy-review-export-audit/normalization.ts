/**
 * Phase 45 — Strategy Review Export Audit Fixtures v1: normalization.
 *
 * Pure, side-effect-free normalization helpers. No mutation, no timers,
 * no randomness, no network, no filesystem, no persistence.
 */

import type {
  StrategyReviewExportAuditFixture,
  StrategyReviewExportAuditFixtureKind,
  StrategyReviewExportAuditFixtureName,
  StrategyReviewExportAuditSeverity,
  StrategyReviewExportAuditState,
} from './types.js';
import {
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_STATES,
} from './types.js';

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return entries.reduce<Record<string, unknown>>((acc, [key, entry]) => {
      acc[key] = sortKeysDeep(entry);
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

export function isValidStrategyReviewExportAuditFixtureName(
  value: unknown,
): value is StrategyReviewExportAuditFixtureName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditFixtureKind(
  value: unknown,
): value is StrategyReviewExportAuditFixtureKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditState(
  value: unknown,
): value is StrategyReviewExportAuditState {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_STATES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditSeverity(
  value: unknown,
): value is StrategyReviewExportAuditSeverity {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditGeneratedAt(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value === PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT
  );
}

export function isValidStrategyReviewExportAuditSource(value: unknown): boolean {
  return (
    typeof value === 'string' && value === PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE
  );
}

export function normalizeStrategyReviewExportAuditFixture(
  fixture: StrategyReviewExportAuditFixture,
): StrategyReviewExportAuditFixture {
  return {
    name: fixture.name,
    kind: fixture.kind,
    title: fixture.title,
    description: fixture.description,
    auditItem: {
      auditItemId: fixture.auditItem.auditItemId,
      state: fixture.auditItem.state,
      severity: fixture.auditItem.severity,
      queueReference: {
        sourcePhase: fixture.auditItem.queueReference.sourcePhase,
        sourceQueueFixtureName: fixture.auditItem.queueReference.sourceQueueFixtureName,
        sourceQueueFixtureKind: fixture.auditItem.queueReference.sourceQueueFixtureKind,
        sourceQueueState: fixture.auditItem.queueReference.sourceQueueState,
        sourceQueuePriority: fixture.auditItem.queueReference.sourceQueuePriority,
        fixtureOnly: fixture.auditItem.queueReference.fixtureOnly,
        syntheticOnly: fixture.auditItem.queueReference.syntheticOnly,
        notes: fixture.auditItem.queueReference.notes,
      },
      findings: fixture.auditItem.findings.map(f => ({
        findingId: f.findingId,
        severity: f.severity,
        category: f.category,
        description: f.description,
        fixtureOnly: f.fixtureOnly,
        syntheticOnly: f.syntheticOnly,
      })),
      auditedAt: fixture.auditItem.auditedAt,
      fixtureOnly: fixture.auditItem.fixtureOnly,
      syntheticOnly: fixture.auditItem.syntheticOnly,
      notes: fixture.auditItem.notes,
    },
    summary: {
      phase: fixture.summary.phase,
      fixtureName: fixture.summary.fixtureName,
      fixtureKind: fixture.summary.fixtureKind,
      state: fixture.summary.state,
      severity: fixture.summary.severity,
      sourceQueueFixtureName: fixture.summary.sourceQueueFixtureName,
      findingCount: fixture.summary.findingCount,
      auditedAt: fixture.summary.auditedAt,
      fixtureOnly: fixture.summary.fixtureOnly,
      syntheticOnly: fixture.summary.syntheticOnly,
      localOnly: fixture.summary.localOnly,
      readOnly: fixture.summary.readOnly,
      serializable: fixture.summary.serializable,
      generatedAt: fixture.summary.generatedAt,
      notes: fixture.summary.notes,
    },
    meta: {
      phase: fixture.meta.phase,
      sourceQueuePhase: fixture.meta.sourceQueuePhase,
      sourcePhases: fixture.meta.sourcePhases,
      fixtureOnly: fixture.meta.fixtureOnly,
      syntheticOnly: fixture.meta.syntheticOnly,
      deterministic: fixture.meta.deterministic,
      localOnly: fixture.meta.localOnly,
      readOnly: fixture.meta.readOnly,
      inMemoryOnly: fixture.meta.inMemoryOnly,
      auditExecutionDisabled: fixture.meta.auditExecutionDisabled,
      generatedAt: fixture.meta.generatedAt,
      source: fixture.meta.source,
      sourceQueueFixtureName: fixture.meta.sourceQueueFixtureName,
      actualAuditLogs: fixture.meta.actualAuditLogs,
      auditPersistence: fixture.meta.auditPersistence,
      auditFileWrites: fixture.meta.auditFileWrites,
      auditExternalNetwork: fixture.meta.auditExternalNetwork,
      actualQueueWorkers: fixture.meta.actualQueueWorkers,
      scheduledJobs: fixture.meta.scheduledJobs,
      backgroundJobs: fixture.meta.backgroundJobs,
      actualFileExport: fixture.meta.actualFileExport,
      filesystemWrites: fixture.meta.filesystemWrites,
      downloadSupport: fixture.meta.downloadSupport,
      externalNetwork: fixture.meta.externalNetwork,
      persistence: fixture.meta.persistence,
      execution: fixture.meta.execution,
      tradingSignals: fixture.meta.tradingSignals,
      investmentAdvice: fixture.meta.investmentAdvice,
      notes: fixture.meta.notes,
    },
    safetyBoundary: {
      strategyReviewExportAuditFixtures: fixture.safetyBoundary.strategyReviewExportAuditFixtures,
      syntheticStrategyReviewExportAudits:
        fixture.safetyBoundary.syntheticStrategyReviewExportAudits,
      strategyReviewExportAuditBuilders: fixture.safetyBoundary.strategyReviewExportAuditBuilders,
      strategyReviewExportAuditSafetyValidation:
        fixture.safetyBoundary.strategyReviewExportAuditSafetyValidation,
      strategyReviewExportQueueReferences:
        fixture.safetyBoundary.strategyReviewExportQueueReferences,
      strategyReviewActualAuditLogs: fixture.safetyBoundary.strategyReviewActualAuditLogs,
      strategyReviewAuditPersistence: fixture.safetyBoundary.strategyReviewAuditPersistence,
      strategyReviewAuditFileWrites: fixture.safetyBoundary.strategyReviewAuditFileWrites,
      strategyReviewAuditExternalNetwork:
        fixture.safetyBoundary.strategyReviewAuditExternalNetwork,
      strategyReviewAuditQueueWorkers: fixture.safetyBoundary.strategyReviewAuditQueueWorkers,
      strategyReviewAuditScheduledJobs: fixture.safetyBoundary.strategyReviewAuditScheduledJobs,
      strategyReviewAuditBackgroundJobs: fixture.safetyBoundary.strategyReviewAuditBackgroundJobs,
      strategyReviewAuditActualFileExport:
        fixture.safetyBoundary.strategyReviewAuditActualFileExport,
      strategyReviewAuditDownloadSupport:
        fixture.safetyBoundary.strategyReviewAuditDownloadSupport,
      strategyReviewAuditExecution: fixture.safetyBoundary.strategyReviewAuditExecution,
      strategyReviewAuditTradingSignals: fixture.safetyBoundary.strategyReviewAuditTradingSignals,
      strategyReviewAuditInvestmentAdvice:
        fixture.safetyBoundary.strategyReviewAuditInvestmentAdvice,
    },
    safeNotes: fixture.safeNotes,
  };
}

export function serializeStrategyReviewExportAuditFixture(
  fixture: StrategyReviewExportAuditFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areStrategyReviewExportAuditFixturesEqual(
  a: StrategyReviewExportAuditFixture,
  b: StrategyReviewExportAuditFixture,
): boolean {
  return (
    serializeStrategyReviewExportAuditFixture(a) ===
    serializeStrategyReviewExportAuditFixture(b)
  );
}

export function isStrategyReviewExportAuditFixtureSerializable(
  fixture: StrategyReviewExportAuditFixture,
): boolean {
  try {
    JSON.stringify(fixture);
    return true;
  } catch {
    return false;
  }
}
