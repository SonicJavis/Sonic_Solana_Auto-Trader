/**
 * Phase 45 — Strategy Review Export Audit Fixtures v1: builders.
 *
 * Deterministic, pure builders for strategy review export-audit fixtures.
 * No mutation, no timers, no randomness, no network, no filesystem, no persistence,
 * no real audit logs, no real queue workers, no scheduled jobs, no background jobs.
 */

import {
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES,
} from '../strategy-review-export-queue/index.js';
import {
  areStrategyReviewExportAuditFixturesEqual,
  isStrategyReviewExportAuditFixtureSerializable,
  isValidStrategyReviewExportAuditFixtureKind,
  isValidStrategyReviewExportAuditFixtureName,
  isValidStrategyReviewExportAuditSeverity,
  isValidStrategyReviewExportAuditState,
  normalizeStrategyReviewExportAuditFixture,
  serializeStrategyReviewExportAuditFixture,
} from './normalization.js';
import {
  validateStrategyReviewExportAuditFixture,
  validateStrategyReviewExportAuditSafety,
} from './validation.js';
import {
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES,
  type StrategyReviewExportAuditBuildInput,
  type StrategyReviewExportAuditBuildResult,
  type StrategyReviewExportAuditFixture,
  type StrategyReviewExportAuditFixtureKind,
  type StrategyReviewExportAuditFixtureName,
  type StrategyReviewExportAuditItemFixture,
  type StrategyReviewExportAuditMeta,
  type StrategyReviewExportAuditSafetyBoundary,
  type StrategyReviewExportAuditSeverity,
  type StrategyReviewExportAuditState,
  type StrategyReviewExportAuditSummary,
  type StrategyReviewExportQueueReference,
} from './types.js';
import type { StrategyReviewExportQueueFixtureName } from '../strategy-review-export-queue/types.js';

// ---------------------------------------------------------------------------
// Name → kind mapping
// ---------------------------------------------------------------------------

export const EXPORT_AUDIT_NAME_TO_KIND: Readonly<
  Record<StrategyReviewExportAuditFixtureName, StrategyReviewExportAuditFixtureKind>
> = {
  'defensive-vs-aggressive-export-audited': 'comparison-export-audited',
  'creator-led-export-audited': 'creator-export-audited',
  'wallet-led-export-audited': 'wallet-export-audited',
  'manipulation-avoidance-export-audited': 'manipulation-export-audited',
  'no-action-safety-export-audited': 'safety-export-audited',
  'insufficient-data-export-audited': 'insufficient-data-export-audited',
  'high-score-positive-export-audited': 'positive-export-audited',
  'high-score-false-positive-export-audited': 'false-positive-export-audited',
  'missed-opportunity-export-audited': 'missed-opportunity-export-audited',
  'drawdown-contained-export-audited': 'drawdown-export-audited',
  'mixed-signal-watchlist-export-audited': 'watchlist-export-audited',
  'false-positive-protection-export-audited': 'protection-export-audited',
  'malformed-input-safe-export-audited': 'safe-export-audited',
  'dashboard-ready-export-audit': 'dashboard-ready-export-audit',
  'serialization-ready-export-audit': 'serialization-ready-export-audit',
  'safety-boundary-export-audit': 'safety-boundary-export-audit',
};

// ---------------------------------------------------------------------------
// Name → source queue fixture mapping
// ---------------------------------------------------------------------------

export const EXPORT_AUDIT_NAME_TO_QUEUE: Readonly<
  Record<StrategyReviewExportAuditFixtureName, StrategyReviewExportQueueFixtureName>
> = {
  'defensive-vs-aggressive-export-audited': 'defensive-vs-aggressive-export-queued',
  'creator-led-export-audited': 'creator-led-export-queued',
  'wallet-led-export-audited': 'wallet-led-export-queued',
  'manipulation-avoidance-export-audited': 'manipulation-avoidance-export-queued',
  'no-action-safety-export-audited': 'no-action-safety-export-queued',
  'insufficient-data-export-audited': 'insufficient-data-export-queued',
  'high-score-positive-export-audited': 'high-score-positive-export-queued',
  'high-score-false-positive-export-audited': 'high-score-false-positive-export-queued',
  'missed-opportunity-export-audited': 'missed-opportunity-export-queued',
  'drawdown-contained-export-audited': 'drawdown-contained-export-queued',
  'mixed-signal-watchlist-export-audited': 'mixed-signal-watchlist-export-queued',
  'false-positive-protection-export-audited': 'false-positive-protection-export-queued',
  'malformed-input-safe-export-audited': 'malformed-input-safe-export-queued',
  'dashboard-ready-export-audit': 'dashboard-ready-export-queue',
  'serialization-ready-export-audit': 'serialization-ready-export-queue',
  'safety-boundary-export-audit': 'safety-boundary-export-queue',
};

// ---------------------------------------------------------------------------
// Name → state mapping
// ---------------------------------------------------------------------------

export const EXPORT_AUDIT_NAME_TO_STATE: Readonly<
  Record<StrategyReviewExportAuditFixtureName, StrategyReviewExportAuditState>
> = {
  'defensive-vs-aggressive-export-audited': 'audit-passed',
  'creator-led-export-audited': 'audit-passed',
  'wallet-led-export-audited': 'audit-passed',
  'manipulation-avoidance-export-audited': 'audit-passed',
  'no-action-safety-export-audited': 'audit-blocked',
  'insufficient-data-export-audited': 'audit-skipped',
  'high-score-positive-export-audited': 'audit-passed',
  'high-score-false-positive-export-audited': 'audit-pending',
  'missed-opportunity-export-audited': 'audit-passed',
  'drawdown-contained-export-audited': 'audit-passed',
  'mixed-signal-watchlist-export-audited': 'audit-pending',
  'false-positive-protection-export-audited': 'audit-blocked',
  'malformed-input-safe-export-audited': 'audit-failed',
  'dashboard-ready-export-audit': 'audit-passed',
  'serialization-ready-export-audit': 'audit-passed',
  'safety-boundary-export-audit': 'audit-blocked',
};

// ---------------------------------------------------------------------------
// Name → severity mapping
// ---------------------------------------------------------------------------

export const EXPORT_AUDIT_NAME_TO_SEVERITY: Readonly<
  Record<StrategyReviewExportAuditFixtureName, StrategyReviewExportAuditSeverity>
> = {
  'defensive-vs-aggressive-export-audited': 'info',
  'creator-led-export-audited': 'info',
  'wallet-led-export-audited': 'info',
  'manipulation-avoidance-export-audited': 'warning',
  'no-action-safety-export-audited': 'critical',
  'insufficient-data-export-audited': 'warning',
  'high-score-positive-export-audited': 'info',
  'high-score-false-positive-export-audited': 'warning',
  'missed-opportunity-export-audited': 'info',
  'drawdown-contained-export-audited': 'info',
  'mixed-signal-watchlist-export-audited': 'warning',
  'false-positive-protection-export-audited': 'error',
  'malformed-input-safe-export-audited': 'error',
  'dashboard-ready-export-audit': 'info',
  'serialization-ready-export-audit': 'info',
  'safety-boundary-export-audit': 'critical',
};

// ---------------------------------------------------------------------------
// Name → title mapping
// ---------------------------------------------------------------------------

const EXPORT_AUDIT_NAME_TO_TITLE: Readonly<
  Record<StrategyReviewExportAuditFixtureName, string>
> = {
  'defensive-vs-aggressive-export-audited':
    'Defensive vs. Aggressive Strategy Export — Audit Passed',
  'creator-led-export-audited': 'Creator-Led Strategy Export — Audit Passed',
  'wallet-led-export-audited': 'Wallet-Led Strategy Export — Audit Passed',
  'manipulation-avoidance-export-audited': 'Manipulation-Avoidance Strategy Export — Audit Passed',
  'no-action-safety-export-audited': 'No-Action Safety Strategy Export — Audit Blocked',
  'insufficient-data-export-audited': 'Insufficient-Data Strategy Export — Audit Skipped',
  'high-score-positive-export-audited': 'High-Score Positive Strategy Export — Audit Passed',
  'high-score-false-positive-export-audited':
    'High-Score False-Positive Strategy Export — Audit Pending',
  'missed-opportunity-export-audited': 'Missed-Opportunity Strategy Export — Audit Passed',
  'drawdown-contained-export-audited': 'Drawdown-Contained Strategy Export — Audit Passed',
  'mixed-signal-watchlist-export-audited': 'Mixed-Signal Watchlist Strategy Export — Audit Pending',
  'false-positive-protection-export-audited':
    'False-Positive Protection Strategy Export — Audit Blocked',
  'malformed-input-safe-export-audited': 'Malformed-Input Safe Strategy Export — Audit Failed',
  'dashboard-ready-export-audit': 'Dashboard-Ready Export Audit — Audit Passed',
  'serialization-ready-export-audit': 'Serialization-Ready Export Audit — Audit Passed',
  'safety-boundary-export-audit': 'Safety-Boundary Export Audit — Audit Blocked',
};

// ---------------------------------------------------------------------------
// Name → description mapping
// ---------------------------------------------------------------------------

const EXPORT_AUDIT_NAME_TO_DESCRIPTION: Readonly<
  Record<StrategyReviewExportAuditFixtureName, string>
> = {
  'defensive-vs-aggressive-export-audited':
    'Synthetic audit record for defensive-vs-aggressive strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'creator-led-export-audited':
    'Synthetic audit record for creator-led strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'wallet-led-export-audited':
    'Synthetic audit record for wallet-led strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'manipulation-avoidance-export-audited':
    'Synthetic audit record for manipulation-avoidance strategy export queue item. Audit passed with warning. No real audit logs, persistence, or file writes.',
  'no-action-safety-export-audited':
    'Synthetic audit record for no-action-safety strategy export queue item. Audit blocked — safety boundary enforced. No real audit logs, persistence, or file writes.',
  'insufficient-data-export-audited':
    'Synthetic audit record for insufficient-data strategy export queue item. Audit skipped — insufficient data. No real audit logs, persistence, or file writes.',
  'high-score-positive-export-audited':
    'Synthetic audit record for high-score-positive strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'high-score-false-positive-export-audited':
    'Synthetic audit record for high-score-false-positive strategy export queue item. Audit pending — awaiting review. No real audit logs, persistence, or file writes.',
  'missed-opportunity-export-audited':
    'Synthetic audit record for missed-opportunity strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'drawdown-contained-export-audited':
    'Synthetic audit record for drawdown-contained strategy export queue item. Audit passed. No real audit logs, persistence, or file writes.',
  'mixed-signal-watchlist-export-audited':
    'Synthetic audit record for mixed-signal-watchlist strategy export queue item. Audit pending — mixed signals detected. No real audit logs, persistence, or file writes.',
  'false-positive-protection-export-audited':
    'Synthetic audit record for false-positive protection strategy export queue item. Audit blocked — false-positive risk detected. No real audit logs, persistence, or file writes.',
  'malformed-input-safe-export-audited':
    'Synthetic audit record for malformed-input scenario. Audit failed — input validation error. No real audit logs, persistence, or file writes.',
  'dashboard-ready-export-audit':
    'Synthetic audit record for dashboard-ready export queue. Audit passed. No real audit logs, persistence, or file writes.',
  'serialization-ready-export-audit':
    'Synthetic audit record for serialization-ready export queue. Audit passed. No real audit logs, persistence, or file writes.',
  'safety-boundary-export-audit':
    'Synthetic audit record for safety-boundary enforcement. Audit blocked — all safety boundaries active. No real audit logs, persistence, or file writes.',
};

// ---------------------------------------------------------------------------
// Name → findings mapping
// ---------------------------------------------------------------------------

const EXPORT_AUDIT_NAME_TO_FINDINGS: Readonly<
  Record<
    StrategyReviewExportAuditFixtureName,
    readonly { findingId: string; severity: StrategyReviewExportAuditSeverity; category: string; description: string }[]
  >
> = {
  'defensive-vs-aggressive-export-audited': [
    {
      findingId: 'finding-dav-001',
      severity: 'info',
      category: 'structure-check',
      description: 'Export queue item structure validated successfully.',
    },
  ],
  'creator-led-export-audited': [
    {
      findingId: 'finding-cl-001',
      severity: 'info',
      category: 'structure-check',
      description: 'Creator-led export queue item structure validated successfully.',
    },
  ],
  'wallet-led-export-audited': [
    {
      findingId: 'finding-wl-001',
      severity: 'info',
      category: 'structure-check',
      description: 'Wallet-led export queue item structure validated successfully.',
    },
  ],
  'manipulation-avoidance-export-audited': [
    {
      findingId: 'finding-ma-001',
      severity: 'warning',
      category: 'safety-check',
      description: 'Manipulation-avoidance flag detected. Additional review recommended.',
    },
  ],
  'no-action-safety-export-audited': [
    {
      findingId: 'finding-nas-001',
      severity: 'critical',
      category: 'safety-boundary',
      description: 'Safety boundary enforced. No-action policy active. Audit blocked.',
    },
  ],
  'insufficient-data-export-audited': [
    {
      findingId: 'finding-id-001',
      severity: 'warning',
      category: 'data-check',
      description: 'Insufficient data to complete audit. Skipped.',
    },
  ],
  'high-score-positive-export-audited': [
    {
      findingId: 'finding-hsp-001',
      severity: 'info',
      category: 'score-check',
      description: 'High-score positive export validated successfully.',
    },
  ],
  'high-score-false-positive-export-audited': [
    {
      findingId: 'finding-hsfp-001',
      severity: 'warning',
      category: 'false-positive-check',
      description: 'Potential false-positive detected. Manual review pending.',
    },
  ],
  'missed-opportunity-export-audited': [
    {
      findingId: 'finding-mo-001',
      severity: 'info',
      category: 'opportunity-check',
      description: 'Missed-opportunity scenario recorded. Audit passed.',
    },
  ],
  'drawdown-contained-export-audited': [
    {
      findingId: 'finding-dc-001',
      severity: 'info',
      category: 'drawdown-check',
      description: 'Drawdown contained within bounds. Audit passed.',
    },
  ],
  'mixed-signal-watchlist-export-audited': [
    {
      findingId: 'finding-msw-001',
      severity: 'warning',
      category: 'signal-check',
      description: 'Mixed signals detected. Watchlist review pending.',
    },
  ],
  'false-positive-protection-export-audited': [
    {
      findingId: 'finding-fpp-001',
      severity: 'error',
      category: 'protection-check',
      description: 'False-positive protection triggered. Audit blocked.',
    },
  ],
  'malformed-input-safe-export-audited': [
    {
      findingId: 'finding-mis-001',
      severity: 'error',
      category: 'input-validation',
      description: 'Input validation failure detected. Audit failed safely.',
    },
  ],
  'dashboard-ready-export-audit': [
    {
      findingId: 'finding-dre-001',
      severity: 'info',
      category: 'readiness-check',
      description: 'Dashboard-ready export audit passed all checks.',
    },
  ],
  'serialization-ready-export-audit': [
    {
      findingId: 'finding-sre-001',
      severity: 'info',
      category: 'serialization-check',
      description: 'Serialization-ready export audit passed all checks.',
    },
  ],
  'safety-boundary-export-audit': [
    {
      findingId: 'finding-sbe-001',
      severity: 'critical',
      category: 'safety-boundary',
      description: 'All safety boundaries active. Audit blocked by safety policy.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Deterministic audit item ID generator (no randomness, no Date.now)
// ---------------------------------------------------------------------------

function deterministicAuditItemId(name: string): string {
  let hash = 2166136261;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `audit-item-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

// ---------------------------------------------------------------------------
// Safety boundary (constant, shared)
// ---------------------------------------------------------------------------

const SAFETY_BOUNDARY: StrategyReviewExportAuditSafetyBoundary = {
  strategyReviewExportAuditFixtures: true,
  syntheticStrategyReviewExportAudits: true,
  strategyReviewExportAuditBuilders: true,
  strategyReviewExportAuditSafetyValidation: true,
  strategyReviewExportQueueReferences: true,
  strategyReviewActualAuditLogs: false,
  strategyReviewAuditPersistence: false,
  strategyReviewAuditFileWrites: false,
  strategyReviewAuditExternalNetwork: false,
  strategyReviewAuditQueueWorkers: false,
  strategyReviewAuditScheduledJobs: false,
  strategyReviewAuditBackgroundJobs: false,
  strategyReviewAuditActualFileExport: false,
  strategyReviewAuditDownloadSupport: false,
  strategyReviewAuditExecution: false,
  strategyReviewAuditTradingSignals: false,
  strategyReviewAuditInvestmentAdvice: false,
};

// ---------------------------------------------------------------------------
// Core builder
// ---------------------------------------------------------------------------

export function buildStrategyReviewExportAuditFixture(
  input: StrategyReviewExportAuditBuildInput,
): StrategyReviewExportAuditBuildResult {
  const safetyCheck = validateStrategyReviewExportAuditSafety(input);
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

  const name = isValidStrategyReviewExportAuditFixtureName(input.name) ? input.name : null;

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

  const kind = isValidStrategyReviewExportAuditFixtureKind(input.kind)
    ? input.kind
    : EXPORT_AUDIT_NAME_TO_KIND[name];

  const state = isValidStrategyReviewExportAuditState(input.state)
    ? input.state
    : EXPORT_AUDIT_NAME_TO_STATE[name];

  const severity = isValidStrategyReviewExportAuditSeverity(input.severity)
    ? input.severity
    : EXPORT_AUDIT_NAME_TO_SEVERITY[name];

  const queueFixtureName = STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES.includes(
    input.sourceQueueFixtureName,
  )
    ? input.sourceQueueFixtureName
    : EXPORT_AUDIT_NAME_TO_QUEUE[name];

  const queueFixture = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.get(queueFixtureName);
  if (!queueFixture) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_QUEUE',
            field: 'sourceQueueFixtureName',
            message: `Phase 44 queue fixture not found: ${queueFixtureName}`,
            severity: 'error',
          },
        ],
      },
      safety: safetyCheck,
    };
  }

  const queueReference: StrategyReviewExportQueueReference = {
    sourcePhase: 44,
    sourceQueueFixtureName: queueFixture.name,
    sourceQueueFixtureKind: queueFixture.kind,
    sourceQueueState: queueFixture.queueItem.state,
    sourceQueuePriority: queueFixture.queueItem.priority,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: [
      `References Phase 44 export queue fixture: ${queueFixture.name}`,
      'Synthetic-only. No actual queue execution or audit log writes.',
    ],
  };

  const rawFindings = EXPORT_AUDIT_NAME_TO_FINDINGS[name];
  const findings = rawFindings.map(f => ({
    ...f,
    fixtureOnly: true as const,
    syntheticOnly: true as const,
  }));

  const auditItem: StrategyReviewExportAuditItemFixture = {
    auditItemId: deterministicAuditItemId(name),
    state,
    severity,
    queueReference,
    findings,
    auditedAt: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: [
      `Synthetic audit item for: ${name}`,
      'No actual audit log, persistence, or file writes.',
    ],
  };

  const summary: StrategyReviewExportAuditSummary = {
    phase: 45,
    fixtureName: name,
    fixtureKind: kind,
    state,
    severity,
    sourceQueueFixtureName: queueFixture.name,
    findingCount: findings.length,
    auditedAt: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    serializable: true,
    generatedAt: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
    notes: [
      'Synthetic Phase 45 export audit summary.',
      'No actual audit logs, file writes, or execution.',
    ],
  };

  const meta: StrategyReviewExportAuditMeta = {
    phase: 45,
    sourceQueuePhase: 44,
    sourcePhases: [40, 41, 42, 43, 44, 45],
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    inMemoryOnly: true,
    auditExecutionDisabled: true,
    generatedAt: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
    source: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE,
    sourceQueueFixtureName: queueFixture.name,
    actualAuditLogs: false,
    auditPersistence: false,
    auditFileWrites: false,
    auditExternalNetwork: false,
    actualQueueWorkers: false,
    scheduledJobs: false,
    backgroundJobs: false,
    actualFileExport: false,
    filesystemWrites: false,
    downloadSupport: false,
    externalNetwork: false,
    persistence: false,
    execution: false,
    tradingSignals: false,
    investmentAdvice: false,
    notes: [
      'Phase 45 export audit fixture metadata.',
      'Synthetic-only. No real audit execution.',
    ],
  };

  const title =
    typeof input.title === 'string' && input.title.trim() !== ''
      ? input.title.trim()
      : EXPORT_AUDIT_NAME_TO_TITLE[name];

  const description =
    typeof input.description === 'string' && input.description.trim() !== ''
      ? input.description.trim()
      : EXPORT_AUDIT_NAME_TO_DESCRIPTION[name];

  const safeNotes: readonly string[] =
    Array.isArray(input.safeNotes) && input.safeNotes.length > 0
      ? input.safeNotes
      : [
          'Fixture-only. No real audit logs, persistence, or file writes.',
          'No actual file export, filesystem writes, or download behavior.',
          'No trade signals, investment advice, or execution logic.',
        ];

  const fixture: StrategyReviewExportAuditFixture = {
    name,
    kind,
    title,
    description,
    auditItem,
    summary,
    meta,
    safetyBoundary: SAFETY_BOUNDARY,
    safeNotes,
  };

  const validation = validateStrategyReviewExportAuditFixture(fixture);
  const safety = validateStrategyReviewExportAuditSafety(fixture);

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

export function buildStrategyReviewExportAuditSummary(
  fixtures: readonly StrategyReviewExportAuditFixture[],
): {
  readonly totalFixtures: number;
  readonly byState: Readonly<Record<string, number>>;
  readonly bySeverity: Readonly<Record<string, number>>;
  readonly byKind: Readonly<Record<string, number>>;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly generatedAt: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT;
} {
  const byState: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byKind: Record<string, number> = {};

  for (const f of fixtures) {
    byState[f.auditItem.state] = (byState[f.auditItem.state] ?? 0) + 1;
    bySeverity[f.auditItem.severity] = (bySeverity[f.auditItem.severity] ?? 0) + 1;
    byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
  }

  return {
    totalFixtures: fixtures.length,
    byState,
    bySeverity,
    byKind,
    fixtureOnly: true,
    syntheticOnly: true,
    generatedAt: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
  };
}

// ---------------------------------------------------------------------------
// List/get helpers
// ---------------------------------------------------------------------------

export function listStrategyReviewExportAuditFixtures(
  fixtures: ReadonlyMap<StrategyReviewExportAuditFixtureName, StrategyReviewExportAuditFixture>,
): readonly StrategyReviewExportAuditFixture[] {
  return [...STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES].map(name => {
    const f = fixtures.get(name);
    if (!f) {
      throw new Error(`Missing Phase 45 export audit fixture: ${name}`);
    }
    return f;
  });
}

export function getStrategyReviewExportAuditFixture(
  fixtures: ReadonlyMap<StrategyReviewExportAuditFixtureName, StrategyReviewExportAuditFixture>,
  name: string,
): StrategyReviewExportAuditFixture | null {
  if (!isValidStrategyReviewExportAuditFixtureName(name)) {
    return null;
  }
  return fixtures.get(name) ?? null;
}

// Re-export normalization helpers for convenience
export {
  areStrategyReviewExportAuditFixturesEqual,
  isStrategyReviewExportAuditFixtureSerializable,
  normalizeStrategyReviewExportAuditFixture,
  serializeStrategyReviewExportAuditFixture,
};
