/**
 * Phase 44 — Strategy Review Export Queue Fixtures v1: builders.
 *
 * Deterministic, pure builders for strategy review export-queue fixtures.
 * No mutation, no timers, no randomness, no network, no filesystem, no persistence,
 * no real queue workers, no scheduled jobs, no background jobs.
 */

import {
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
} from '../strategy-review-export-planning/index.js';
import type { StrategyReviewExportPlanFixture } from '../strategy-review-export-planning/types.js';
import {
  areStrategyReviewExportQueueFixturesEqual,
  isStrategyReviewExportQueueFixtureSerializable,
  isValidStrategyReviewExportQueueFixtureKind,
  isValidStrategyReviewExportQueueFixtureName,
  isValidStrategyReviewExportQueuePriority,
  isValidStrategyReviewExportQueueState,
  normalizeStrategyReviewExportQueueFixture,
  serializeStrategyReviewExportQueueFixture,
} from './normalization.js';
import {
  validateStrategyReviewExportQueueFixture,
  validateStrategyReviewExportQueueSafety,
} from './validation.js';
import {
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES,
  type StrategyReviewExportQueueBuildInput,
  type StrategyReviewExportQueueBuildResult,
  type StrategyReviewExportQueueFixture,
  type StrategyReviewExportQueueFixtureKind,
  type StrategyReviewExportQueueFixtureName,
  type StrategyReviewExportQueueItemFixture,
  type StrategyReviewExportQueueMeta,
  type StrategyReviewExportQueuePriority,
  type StrategyReviewExportQueueSafetyBoundary,
  type StrategyReviewExportQueueState,
  type StrategyReviewExportQueueSummary,
  type StrategyReviewExportPlanReference,
} from './types.js';

// ---------------------------------------------------------------------------
// Name → kind mapping
// ---------------------------------------------------------------------------

export const EXPORT_QUEUE_NAME_TO_KIND: Readonly<
  Record<StrategyReviewExportQueueFixtureName, StrategyReviewExportQueueFixtureKind>
> = {
  'defensive-vs-aggressive-export-queued': 'comparison-export-queued',
  'creator-led-export-queued': 'creator-export-queued',
  'wallet-led-export-queued': 'wallet-export-queued',
  'manipulation-avoidance-export-queued': 'manipulation-export-queued',
  'no-action-safety-export-queued': 'safety-export-queued',
  'insufficient-data-export-queued': 'insufficient-data-export-queued',
  'high-score-positive-export-queued': 'positive-export-queued',
  'high-score-false-positive-export-queued': 'false-positive-export-queued',
  'missed-opportunity-export-queued': 'missed-opportunity-export-queued',
  'drawdown-contained-export-queued': 'drawdown-export-queued',
  'mixed-signal-watchlist-export-queued': 'watchlist-export-queued',
  'false-positive-protection-export-queued': 'protection-export-queued',
  'malformed-input-safe-export-queued': 'safe-export-queued',
  'dashboard-ready-export-queue': 'dashboard-ready-export-queue',
  'serialization-ready-export-queue': 'serialization-ready-export-queue',
  'safety-boundary-export-queue': 'safety-boundary-export-queue',
};

// ---------------------------------------------------------------------------
// Name → source plan mapping
// ---------------------------------------------------------------------------

export const EXPORT_QUEUE_NAME_TO_PLAN: Readonly<
  Record<StrategyReviewExportQueueFixtureName, StrategyReviewExportPlanFixture['name']>
> = {
  'defensive-vs-aggressive-export-queued': 'defensive-vs-aggressive-export-plan',
  'creator-led-export-queued': 'creator-led-export-plan',
  'wallet-led-export-queued': 'wallet-led-export-plan',
  'manipulation-avoidance-export-queued': 'manipulation-avoidance-export-plan',
  'no-action-safety-export-queued': 'no-action-safety-export-plan',
  'insufficient-data-export-queued': 'insufficient-data-export-plan',
  'high-score-positive-export-queued': 'high-score-positive-export-plan',
  'high-score-false-positive-export-queued': 'high-score-positive-export-plan',
  'missed-opportunity-export-queued': 'mixed-signal-watchlist-export-plan',
  'drawdown-contained-export-queued': 'defensive-vs-aggressive-export-plan',
  'mixed-signal-watchlist-export-queued': 'mixed-signal-watchlist-export-plan',
  'false-positive-protection-export-queued': 'malformed-input-safe-export-plan',
  'malformed-input-safe-export-queued': 'malformed-input-safe-export-plan',
  'dashboard-ready-export-queue': 'dashboard-ready-export-plan',
  'serialization-ready-export-queue': 'report-ready-export-plan',
  'safety-boundary-export-queue': 'safety-boundary-export-plan',
};

// ---------------------------------------------------------------------------
// Name → state mapping
// ---------------------------------------------------------------------------

export const EXPORT_QUEUE_NAME_TO_STATE: Readonly<
  Record<StrategyReviewExportQueueFixtureName, StrategyReviewExportQueueState>
> = {
  'defensive-vs-aggressive-export-queued': 'queued',
  'creator-led-export-queued': 'queued',
  'wallet-led-export-queued': 'queued',
  'manipulation-avoidance-export-queued': 'queued',
  'no-action-safety-export-queued': 'safety-blocked',
  'insufficient-data-export-queued': 'skipped',
  'high-score-positive-export-queued': 'queued',
  'high-score-false-positive-export-queued': 'pending-review',
  'missed-opportunity-export-queued': 'reviewed',
  'drawdown-contained-export-queued': 'queued',
  'mixed-signal-watchlist-export-queued': 'pending-review',
  'false-positive-protection-export-queued': 'safety-blocked',
  'malformed-input-safe-export-queued': 'safety-blocked',
  'dashboard-ready-export-queue': 'queued',
  'serialization-ready-export-queue': 'queued',
  'safety-boundary-export-queue': 'safety-blocked',
};

// ---------------------------------------------------------------------------
// Name → priority mapping
// ---------------------------------------------------------------------------

export const EXPORT_QUEUE_NAME_TO_PRIORITY: Readonly<
  Record<StrategyReviewExportQueueFixtureName, StrategyReviewExportQueuePriority>
> = {
  'defensive-vs-aggressive-export-queued': 'normal',
  'creator-led-export-queued': 'high',
  'wallet-led-export-queued': 'high',
  'manipulation-avoidance-export-queued': 'high',
  'no-action-safety-export-queued': 'low',
  'insufficient-data-export-queued': 'low',
  'high-score-positive-export-queued': 'high',
  'high-score-false-positive-export-queued': 'normal',
  'missed-opportunity-export-queued': 'normal',
  'drawdown-contained-export-queued': 'normal',
  'mixed-signal-watchlist-export-queued': 'normal',
  'false-positive-protection-export-queued': 'low',
  'malformed-input-safe-export-queued': 'low',
  'dashboard-ready-export-queue': 'high',
  'serialization-ready-export-queue': 'high',
  'safety-boundary-export-queue': 'low',
};

// ---------------------------------------------------------------------------
// Name → title mapping
// ---------------------------------------------------------------------------

const EXPORT_QUEUE_NAME_TO_TITLE: Readonly<Record<StrategyReviewExportQueueFixtureName, string>> = {
  'defensive-vs-aggressive-export-queued':
    'Defensive vs. Aggressive Strategy Export — Queued for Review',
  'creator-led-export-queued': 'Creator-Led Strategy Export — Queued for Review',
  'wallet-led-export-queued': 'Wallet-Led Strategy Export — Queued for Review',
  'manipulation-avoidance-export-queued': 'Manipulation-Avoidance Strategy Export — Queued for Review',
  'no-action-safety-export-queued': 'No-Action Safety Strategy Export — Safety Blocked',
  'insufficient-data-export-queued': 'Insufficient-Data Strategy Export — Skipped',
  'high-score-positive-export-queued': 'High-Score Positive Strategy Export — Queued for Review',
  'high-score-false-positive-export-queued':
    'High-Score False-Positive Strategy Export — Pending Review',
  'missed-opportunity-export-queued': 'Missed-Opportunity Strategy Export — Reviewed',
  'drawdown-contained-export-queued': 'Drawdown-Contained Strategy Export — Queued for Review',
  'mixed-signal-watchlist-export-queued': 'Mixed-Signal Watchlist Strategy Export — Pending Review',
  'false-positive-protection-export-queued':
    'False-Positive Protection Strategy Export — Safety Blocked',
  'malformed-input-safe-export-queued': 'Malformed-Input Safe Strategy Export — Safety Blocked',
  'dashboard-ready-export-queue': 'Dashboard-Ready Export Queue — Queued for Review',
  'serialization-ready-export-queue': 'Serialization-Ready Export Queue — Queued for Review',
  'safety-boundary-export-queue': 'Safety-Boundary Export Queue — Safety Blocked',
};

// ---------------------------------------------------------------------------
// Name → description mapping
// ---------------------------------------------------------------------------

const EXPORT_QUEUE_NAME_TO_DESCRIPTION: Readonly<
  Record<StrategyReviewExportQueueFixtureName, string>
> = {
  'defensive-vs-aggressive-export-queued':
    'Synthetic queue item for defensive-vs-aggressive strategy export plan. Queued state pending future local review workflow. No actual queuing, export, or execution.',
  'creator-led-export-queued':
    'Synthetic queue item for creator-led strategy export plan. High-priority queued state pending future local review workflow. No actual queuing, export, or execution.',
  'wallet-led-export-queued':
    'Synthetic queue item for wallet-led strategy export plan. High-priority queued state pending future local review workflow. No actual queuing, export, or execution.',
  'manipulation-avoidance-export-queued':
    'Synthetic queue item for manipulation-avoidance strategy export plan. High-priority queued state pending future local review workflow. No actual queuing, export, or execution.',
  'no-action-safety-export-queued':
    'Synthetic queue item for no-action-safety strategy export plan. Safety-blocked state — export queue blocked by safety validation. No actual queuing, export, or execution.',
  'insufficient-data-export-queued':
    'Synthetic queue item for insufficient-data strategy export plan. Skipped state — insufficient data to proceed. No actual queuing, export, or execution.',
  'high-score-positive-export-queued':
    'Synthetic queue item for high-score-positive strategy export plan. High-priority queued state pending future local review workflow. No actual queuing, export, or execution.',
  'high-score-false-positive-export-queued':
    'Synthetic queue item for high-score-false-positive scenario. Pending-review state — awaiting manual review before queue processing. No actual queuing, export, or execution.',
  'missed-opportunity-export-queued':
    'Synthetic queue item for missed-opportunity scenario. Reviewed state — already reviewed and recorded. No actual queuing, export, or execution.',
  'drawdown-contained-export-queued':
    'Synthetic queue item for drawdown-contained scenario. Normal-priority queued state pending future local review workflow. No actual queuing, export, or execution.',
  'mixed-signal-watchlist-export-queued':
    'Synthetic queue item for mixed-signal-watchlist strategy export plan. Pending-review state — mixed signals require manual review. No actual queuing, export, or execution.',
  'false-positive-protection-export-queued':
    'Synthetic queue item for false-positive protection scenario. Safety-blocked state — false-positive risk detected. No actual queuing, export, or execution.',
  'malformed-input-safe-export-queued':
    'Synthetic queue item for malformed-input scenario. Safety-blocked state — input failed safety validation. No actual queuing, export, or execution.',
  'dashboard-ready-export-queue':
    'Synthetic queue representing a dashboard-ready export queue. High-priority queued state. No actual queuing, export, or execution.',
  'serialization-ready-export-queue':
    'Synthetic queue representing a serialization-ready export queue. High-priority queued state. No actual queuing, export, or execution.',
  'safety-boundary-export-queue':
    'Synthetic queue representing safety-boundary enforcement. Safety-blocked state — all safety boundaries active. No actual queuing, export, or execution.',
};

// ---------------------------------------------------------------------------
// Deterministic queue item ID generator (no randomness, no Date.now)
// ---------------------------------------------------------------------------

function deterministicQueueItemId(name: string): string {
  let hash = 2166136261;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `queue-item-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

// ---------------------------------------------------------------------------
// Safety boundary (constant, shared)
// ---------------------------------------------------------------------------

const SAFETY_BOUNDARY: StrategyReviewExportQueueSafetyBoundary = {
  strategyReviewExportQueueFixtures: true,
  syntheticStrategyReviewExportQueues: true,
  strategyReviewExportQueueBuilders: true,
  strategyReviewExportQueueSafetyValidation: true,
  strategyReviewExportPlanReferences: true,
  strategyReviewActualQueueWorkers: false,
  strategyReviewScheduledJobs: false,
  strategyReviewBackgroundJobs: false,
  strategyReviewActualFileExport: false,
  strategyReviewDownloadSupport: false,
  strategyReviewPdfGeneration: false,
  strategyReviewCsvGeneration: false,
  strategyReviewHtmlGeneration: false,
  strategyReviewExportQueueExternalNetwork: false,
  strategyReviewExportQueuePersistence: false,
  strategyReviewExportQueueExecution: false,
  strategyReviewExportQueueTradingSignals: false,
  strategyReviewExportQueueInvestmentAdvice: false,
};

// ---------------------------------------------------------------------------
// Core builder
// ---------------------------------------------------------------------------

export function buildStrategyReviewExportQueueFixture(
  input: StrategyReviewExportQueueBuildInput,
): StrategyReviewExportQueueBuildResult {
  const safetyCheck = validateStrategyReviewExportQueueSafety(input);
  if (!safetyCheck.safe) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: safetyCheck.violations.map(v => ({
          code: 'SAFETY_VIOLATION',
          field: 'input',
          message: v,
          severity: 'error' as const,
        })),
      },
      safety: safetyCheck,
    };
  }

  const name = isValidStrategyReviewExportQueueFixtureName(input.name)
    ? input.name
    : null;

  if (!name) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'INVALID_NAME',
            field: 'name',
            message: `Invalid fixture name: ${String(input.name)}`,
            severity: 'error',
          },
        ],
      },
      safety: safetyCheck,
    };
  }

  const kind = isValidStrategyReviewExportQueueFixtureKind(input.kind)
    ? input.kind
    : EXPORT_QUEUE_NAME_TO_KIND[name];

  const state = isValidStrategyReviewExportQueueState(input.state)
    ? input.state
    : EXPORT_QUEUE_NAME_TO_STATE[name];

  const priority = isValidStrategyReviewExportQueuePriority(input.priority)
    ? input.priority
    : EXPORT_QUEUE_NAME_TO_PRIORITY[name];

  const planFixtureName = STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES.includes(input.sourcePlanFixtureName)
    ? input.sourcePlanFixtureName
    : EXPORT_QUEUE_NAME_TO_PLAN[name];

  const planFixture = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES.get(planFixtureName);
  if (!planFixture) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_PLAN',
            field: 'sourcePlanFixtureName',
            message: `Phase 43 plan fixture not found: ${planFixtureName}`,
            severity: 'error',
          },
        ],
      },
      safety: safetyCheck,
    };
  }

  const planReference: StrategyReviewExportPlanReference = {
    sourcePhase: 43,
    sourcePlanFixtureName: planFixture.name,
    sourcePlanFixtureKind: planFixture.kind,
    sourcePlanTargetFormat: planFixture.targetFormat,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: [
      `References Phase 43 export plan fixture: ${planFixture.name}`,
      'Synthetic-only. No actual export plan execution.',
    ],
  };

  const queueItem: StrategyReviewExportQueueItemFixture = {
    queueItemId: deterministicQueueItemId(name),
    state,
    priority,
    planReference,
    queuedAt: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: [
      `Synthetic queue item for: ${name}`,
      'No actual queue worker, scheduler, or background job.',
    ],
  };

  const summary: StrategyReviewExportQueueSummary = {
    phase: 44,
    fixtureName: name,
    fixtureKind: kind,
    state,
    priority,
    sourcePlanFixtureName: planFixture.name,
    sourcePlanTargetFormat: planFixture.targetFormat,
    itemCount: 1,
    queuedAt: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    serializable: true,
    generatedAt: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
    notes: [
      'Synthetic Phase 44 export queue summary.',
      'No actual file export, queue workers, or execution.',
    ],
  };

  const meta: StrategyReviewExportQueueMeta = {
    phase: 44,
    sourcePlanPhase: 43,
    sourcePhases: [40, 41, 42, 43, 44],
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    inMemoryOnly: true,
    queueExecutionDisabled: true,
    generatedAt: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
    source: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE,
    sourcePlanFixtureName: planFixture.name,
    actualQueueWorkers: false,
    scheduledJobs: false,
    backgroundJobs: false,
    actualFileExport: false,
    filesystemWrites: false,
    downloadSupport: false,
    pdfGeneration: false,
    csvGeneration: false,
    htmlGeneration: false,
    externalNetwork: false,
    persistence: false,
    execution: false,
    tradingSignals: false,
    investmentAdvice: false,
    notes: [
      'Phase 44 export queue fixture metadata.',
      'Synthetic-only. No real queue execution.',
    ],
  };

  const title =
    typeof input.title === 'string' && input.title.trim() !== ''
      ? input.title.trim()
      : EXPORT_QUEUE_NAME_TO_TITLE[name];

  const description =
    typeof input.description === 'string' && input.description.trim() !== ''
      ? input.description.trim()
      : EXPORT_QUEUE_NAME_TO_DESCRIPTION[name];

  const safeNotes: readonly string[] =
    Array.isArray(input.safeNotes) && input.safeNotes.length > 0
      ? input.safeNotes
      : [
          'Fixture-only. No real queue workers, scheduled jobs, or background jobs.',
          'No actual file export, filesystem writes, or download behavior.',
          'No trade signals, investment advice, or execution logic.',
        ];

  const fixture: StrategyReviewExportQueueFixture = {
    name,
    kind,
    title,
    description,
    queueItem,
    summary,
    meta,
    safetyBoundary: SAFETY_BOUNDARY,
    safeNotes,
  };

  const validation = validateStrategyReviewExportQueueFixture(fixture);
  const safety = validateStrategyReviewExportQueueSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}

// ---------------------------------------------------------------------------
// Summary builder
// ---------------------------------------------------------------------------

export function buildStrategyReviewExportQueueSummary(
  fixtures: readonly StrategyReviewExportQueueFixture[],
): {
  readonly totalFixtures: number;
  readonly byState: Readonly<Record<string, number>>;
  readonly byPriority: Readonly<Record<string, number>>;
  readonly byKind: Readonly<Record<string, number>>;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly generatedAt: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT;
} {
  const byState: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byKind: Record<string, number> = {};

  for (const f of fixtures) {
    byState[f.queueItem.state] = (byState[f.queueItem.state] ?? 0) + 1;
    byPriority[f.queueItem.priority] = (byPriority[f.queueItem.priority] ?? 0) + 1;
    byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
  }

  return {
    totalFixtures: fixtures.length,
    byState,
    byPriority,
    byKind,
    fixtureOnly: true,
    syntheticOnly: true,
    generatedAt: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
  };
}

// ---------------------------------------------------------------------------
// List/get helpers
// ---------------------------------------------------------------------------

export function listStrategyReviewExportQueueFixtures(
  fixtures: ReadonlyMap<StrategyReviewExportQueueFixtureName, StrategyReviewExportQueueFixture>,
): readonly StrategyReviewExportQueueFixture[] {
  return [...STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES].map(name => {
    const f = fixtures.get(name);
    if (!f) {
      throw new Error(`Missing Phase 44 export queue fixture: ${name}`);
    }
    return f;
  });
}

export function getStrategyReviewExportQueueFixture(
  fixtures: ReadonlyMap<StrategyReviewExportQueueFixtureName, StrategyReviewExportQueueFixture>,
  name: string,
): StrategyReviewExportQueueFixture | null {
  if (!isValidStrategyReviewExportQueueFixtureName(name)) {
    return null;
  }
  return fixtures.get(name) ?? null;
}

// Re-export normalization helpers for convenience
export {
  areStrategyReviewExportQueueFixturesEqual,
  isStrategyReviewExportQueueFixtureSerializable,
  normalizeStrategyReviewExportQueueFixture,
  serializeStrategyReviewExportQueueFixture,
};
