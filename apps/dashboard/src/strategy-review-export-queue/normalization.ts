/**
 * Phase 44 — Strategy Review Export Queue Fixtures v1: normalization.
 *
 * Pure, side-effect-free normalization helpers. No mutation, no timers,
 * no randomness, no network, no filesystem, no persistence.
 */

import type {
  StrategyReviewExportQueueFixture,
  StrategyReviewExportQueueFixtureKind,
  StrategyReviewExportQueueFixtureName,
  StrategyReviewExportQueuePriority,
  StrategyReviewExportQueueState,
} from './types.js';
import {
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES,
  STRATEGY_REVIEW_EXPORT_QUEUE_STATES,
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

export function isValidStrategyReviewExportQueueFixtureName(
  value: unknown,
): value is StrategyReviewExportQueueFixtureName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportQueueFixtureKind(
  value: unknown,
): value is StrategyReviewExportQueueFixtureKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportQueueState(
  value: unknown,
): value is StrategyReviewExportQueueState {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_QUEUE_STATES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportQueuePriority(
  value: unknown,
): value is StrategyReviewExportQueuePriority {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportQueueGeneratedAt(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value === PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT
  );
}

export function isValidStrategyReviewExportQueueSource(value: unknown): boolean {
  return (
    typeof value === 'string' && value === PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE
  );
}

export function normalizeStrategyReviewExportQueueFixture(
  fixture: StrategyReviewExportQueueFixture,
): StrategyReviewExportQueueFixture {
  // Return a new object with properties in stable order. No mutation.
  return {
    name: fixture.name,
    kind: fixture.kind,
    title: fixture.title,
    description: fixture.description,
    queueItem: {
      queueItemId: fixture.queueItem.queueItemId,
      state: fixture.queueItem.state,
      priority: fixture.queueItem.priority,
      planReference: {
        sourcePhase: fixture.queueItem.planReference.sourcePhase,
        sourcePlanFixtureName: fixture.queueItem.planReference.sourcePlanFixtureName,
        sourcePlanFixtureKind: fixture.queueItem.planReference.sourcePlanFixtureKind,
        sourcePlanTargetFormat: fixture.queueItem.planReference.sourcePlanTargetFormat,
        fixtureOnly: fixture.queueItem.planReference.fixtureOnly,
        syntheticOnly: fixture.queueItem.planReference.syntheticOnly,
        notes: fixture.queueItem.planReference.notes,
      },
      queuedAt: fixture.queueItem.queuedAt,
      fixtureOnly: fixture.queueItem.fixtureOnly,
      syntheticOnly: fixture.queueItem.syntheticOnly,
      notes: fixture.queueItem.notes,
    },
    summary: {
      phase: fixture.summary.phase,
      fixtureName: fixture.summary.fixtureName,
      fixtureKind: fixture.summary.fixtureKind,
      state: fixture.summary.state,
      priority: fixture.summary.priority,
      sourcePlanFixtureName: fixture.summary.sourcePlanFixtureName,
      sourcePlanTargetFormat: fixture.summary.sourcePlanTargetFormat,
      itemCount: fixture.summary.itemCount,
      queuedAt: fixture.summary.queuedAt,
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
      sourcePlanPhase: fixture.meta.sourcePlanPhase,
      sourcePhases: fixture.meta.sourcePhases,
      fixtureOnly: fixture.meta.fixtureOnly,
      syntheticOnly: fixture.meta.syntheticOnly,
      deterministic: fixture.meta.deterministic,
      localOnly: fixture.meta.localOnly,
      readOnly: fixture.meta.readOnly,
      inMemoryOnly: fixture.meta.inMemoryOnly,
      queueExecutionDisabled: fixture.meta.queueExecutionDisabled,
      generatedAt: fixture.meta.generatedAt,
      source: fixture.meta.source,
      sourcePlanFixtureName: fixture.meta.sourcePlanFixtureName,
      actualQueueWorkers: fixture.meta.actualQueueWorkers,
      scheduledJobs: fixture.meta.scheduledJobs,
      backgroundJobs: fixture.meta.backgroundJobs,
      actualFileExport: fixture.meta.actualFileExport,
      filesystemWrites: fixture.meta.filesystemWrites,
      downloadSupport: fixture.meta.downloadSupport,
      pdfGeneration: fixture.meta.pdfGeneration,
      csvGeneration: fixture.meta.csvGeneration,
      htmlGeneration: fixture.meta.htmlGeneration,
      externalNetwork: fixture.meta.externalNetwork,
      persistence: fixture.meta.persistence,
      execution: fixture.meta.execution,
      tradingSignals: fixture.meta.tradingSignals,
      investmentAdvice: fixture.meta.investmentAdvice,
      notes: fixture.meta.notes,
    },
    safetyBoundary: {
      strategyReviewExportQueueFixtures: fixture.safetyBoundary.strategyReviewExportQueueFixtures,
      syntheticStrategyReviewExportQueues:
        fixture.safetyBoundary.syntheticStrategyReviewExportQueues,
      strategyReviewExportQueueBuilders: fixture.safetyBoundary.strategyReviewExportQueueBuilders,
      strategyReviewExportQueueSafetyValidation:
        fixture.safetyBoundary.strategyReviewExportQueueSafetyValidation,
      strategyReviewExportPlanReferences:
        fixture.safetyBoundary.strategyReviewExportPlanReferences,
      strategyReviewActualQueueWorkers: fixture.safetyBoundary.strategyReviewActualQueueWorkers,
      strategyReviewScheduledJobs: fixture.safetyBoundary.strategyReviewScheduledJobs,
      strategyReviewBackgroundJobs: fixture.safetyBoundary.strategyReviewBackgroundJobs,
      strategyReviewActualFileExport: fixture.safetyBoundary.strategyReviewActualFileExport,
      strategyReviewDownloadSupport: fixture.safetyBoundary.strategyReviewDownloadSupport,
      strategyReviewPdfGeneration: fixture.safetyBoundary.strategyReviewPdfGeneration,
      strategyReviewCsvGeneration: fixture.safetyBoundary.strategyReviewCsvGeneration,
      strategyReviewHtmlGeneration: fixture.safetyBoundary.strategyReviewHtmlGeneration,
      strategyReviewExportQueueExternalNetwork:
        fixture.safetyBoundary.strategyReviewExportQueueExternalNetwork,
      strategyReviewExportQueuePersistence:
        fixture.safetyBoundary.strategyReviewExportQueuePersistence,
      strategyReviewExportQueueExecution:
        fixture.safetyBoundary.strategyReviewExportQueueExecution,
      strategyReviewExportQueueTradingSignals:
        fixture.safetyBoundary.strategyReviewExportQueueTradingSignals,
      strategyReviewExportQueueInvestmentAdvice:
        fixture.safetyBoundary.strategyReviewExportQueueInvestmentAdvice,
    },
    safeNotes: fixture.safeNotes,
  };
}

export function serializeStrategyReviewExportQueueFixture(
  fixture: StrategyReviewExportQueueFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areStrategyReviewExportQueueFixturesEqual(
  a: StrategyReviewExportQueueFixture,
  b: StrategyReviewExportQueueFixture,
): boolean {
  return (
    serializeStrategyReviewExportQueueFixture(a) ===
    serializeStrategyReviewExportQueueFixture(b)
  );
}

export function isStrategyReviewExportQueueFixtureSerializable(
  fixture: StrategyReviewExportQueueFixture,
): boolean {
  try {
    JSON.stringify(fixture);
    return true;
  } catch {
    return false;
  }
}
