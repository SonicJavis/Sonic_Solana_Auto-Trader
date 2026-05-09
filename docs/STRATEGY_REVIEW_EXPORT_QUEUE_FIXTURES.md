# Strategy Review Export Queue Fixtures

Phase 44 — Strategy Review Export Queue Fixtures v1

## Purpose

Phase 44 creates **deterministic, synthetic export-queue fixtures** for future local review workflow orchestration. These fixtures model queued export-plan states based on Phase 43 strategy review export-planning fixtures.

This phase prepares the architecture for a future local export workflow without adding actual queue workers, scheduled jobs, background processors, filesystem writes, real exports, or any execution behavior.

## Safety Boundaries

This layer is **synthetic-only, local-only, read-only, deterministic, offline, in-memory, non-persistent, non-mutating, external-network-free, file-write-free, non-advisory, queue-worker-free, and non-executing**.

### What Phase 44 does NOT implement

- ❌ Actual queue workers (BullMQ, Redis, etc.)
- ❌ Scheduled jobs or cron jobs
- ❌ Background jobs or background processors
- ❌ Actual file exports or filesystem writes
- ❌ Browser downloads or Blob/URL.createObjectURL
- ❌ PDF, CSV, or HTML generation
- ❌ Real queue execution
- ❌ Live data or real market analysis
- ❌ Real scoring or ranking
- ❌ Trade signals or investment advice
- ❌ Recommendations
- ❌ Real replay, backtesting, paper trading, or live trading
- ❌ Solana RPC, Jito, MEV, or mempool integration
- ❌ Wallet access, private keys, or signing/sending
- ❌ Network calls (fetch/axios/websocket)
- ❌ Persistence or browser storage
- ❌ Real UI rendering
- ❌ Real PnL, balances, orders, or fills

## Architecture

### Module Location

```
apps/dashboard/src/strategy-review-export-queue/
├── types.ts         — All TypeScript types
├── builders.ts      — Pure deterministic builder functions
├── fixtures.ts      — 16 built fixture constants + Map + List
├── normalization.ts — Guard/normalize/serialize/equality helpers
├── validation.ts    — Validation and safety validation helpers
├── capabilities.ts  — Phase 44 capability flags
└── index.ts         — Barrel export
```

### Design Principles

1. **Deterministic**: All fixtures are built deterministically from fixed constants. No `Date.now`, `Math.random`, or timers.
2. **Synthetic**: All data is synthetic. No real wallet addresses, transaction hashes, or personal data.
3. **Fixture-backed**: Fixtures reference Phase 43 export-plan fixtures as their source of truth.
4. **Serializable**: All fixtures serialize cleanly to JSON for future report/export workflow orchestration.
5. **Immutable**: All fixture properties are `readonly`. Helpers do not mutate inputs.
6. **Safe**: Safety validation ensures no URL, local path, secret, execution term, network term, download term, timer term, or DOM term leaks into fixture strings.

## Queue States

| State | Meaning |
|-------|---------|
| `queued` | Ready for future local review workflow |
| `pending-review` | Requires manual review before processing |
| `reviewed` | Already reviewed and recorded |
| `skipped` | Skipped (e.g. insufficient data) |
| `safety-blocked` | Blocked by safety validation |

## Queue Priorities

| Priority | Meaning |
|----------|---------|
| `high` | High-priority fixture (creator, wallet, manipulation, positive, dashboard) |
| `normal` | Normal-priority fixture |
| `low` | Low-priority fixture (safety-blocked, skipped, malformed) |

## Supported Fixtures (16 total)

| Name | Kind | State | Priority | Source Plan |
|------|------|-------|----------|-------------|
| `defensive-vs-aggressive-export-queued` | `comparison-export-queued` | `queued` | `normal` | `defensive-vs-aggressive-export-plan` |
| `creator-led-export-queued` | `creator-export-queued` | `queued` | `high` | `creator-led-export-plan` |
| `wallet-led-export-queued` | `wallet-export-queued` | `queued` | `high` | `wallet-led-export-plan` |
| `manipulation-avoidance-export-queued` | `manipulation-export-queued` | `queued` | `high` | `manipulation-avoidance-export-plan` |
| `no-action-safety-export-queued` | `safety-export-queued` | `safety-blocked` | `low` | `no-action-safety-export-plan` |
| `insufficient-data-export-queued` | `insufficient-data-export-queued` | `skipped` | `low` | `insufficient-data-export-plan` |
| `high-score-positive-export-queued` | `positive-export-queued` | `queued` | `high` | `high-score-positive-export-plan` |
| `high-score-false-positive-export-queued` | `false-positive-export-queued` | `pending-review` | `normal` | `high-score-positive-export-plan` |
| `missed-opportunity-export-queued` | `missed-opportunity-export-queued` | `reviewed` | `normal` | `mixed-signal-watchlist-export-plan` |
| `drawdown-contained-export-queued` | `drawdown-export-queued` | `queued` | `normal` | `defensive-vs-aggressive-export-plan` |
| `mixed-signal-watchlist-export-queued` | `watchlist-export-queued` | `pending-review` | `normal` | `mixed-signal-watchlist-export-plan` |
| `false-positive-protection-export-queued` | `protection-export-queued` | `safety-blocked` | `low` | `malformed-input-safe-export-plan` |
| `malformed-input-safe-export-queued` | `safe-export-queued` | `safety-blocked` | `low` | `malformed-input-safe-export-plan` |
| `dashboard-ready-export-queue` | `dashboard-ready-export-queue` | `queued` | `high` | `dashboard-ready-export-plan` |
| `serialization-ready-export-queue` | `serialization-ready-export-queue` | `queued` | `high` | `report-ready-export-plan` |
| `safety-boundary-export-queue` | `safety-boundary-export-queue` | `safety-blocked` | `low` | `safety-boundary-export-plan` |

## Phase 43 Export-Plan References

Each fixture contains a `queueItem.planReference` that references a Phase 43 export-plan fixture:

```typescript
interface StrategyReviewExportPlanReference {
  readonly sourcePhase: 43;
  readonly sourcePlanFixtureName: StrategyReviewExportPlanFixtureName;
  readonly sourcePlanFixtureKind: StrategyReviewExportPlanFixtureKind;
  readonly sourcePlanTargetFormat: StrategyReviewExportPlanTarget;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}
```

## Queue Item / State / Priority Fixture Examples

### Building a fixture

```typescript
import { buildStrategyReviewExportQueueFixture } from './strategy-review-export-queue';

const result = buildStrategyReviewExportQueueFixture({
  name: 'creator-led-export-queued',
  kind: 'creator-export-queued',
  state: 'queued',
  priority: 'high',
  sourcePlanFixtureName: 'creator-led-export-plan',
});

if (result.success && result.fixture) {
  console.log(result.fixture.name);     // 'creator-led-export-queued'
  console.log(result.fixture.meta.phase); // 44
  console.log(result.fixture.queueItem.state); // 'queued'
}
```

### Accessing pre-built fixtures

```typescript
import {
  CREATOR_LED_EXPORT_QUEUED_FIXTURE,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
} from './strategy-review-export-queue';

// Get a specific fixture
const f = CREATOR_LED_EXPORT_QUEUED_FIXTURE;
console.log(f.queueItem.state);    // 'queued'
console.log(f.queueItem.priority); // 'high'

// Get all 16 fixtures in stable order
for (const fixture of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
  console.log(fixture.name, fixture.queueItem.state);
}
```

## Validation Examples

```typescript
import {
  validateStrategyReviewExportQueueFixture,
  CREATOR_LED_EXPORT_QUEUED_FIXTURE,
} from './strategy-review-export-queue';

// Valid fixture
const result = validateStrategyReviewExportQueueFixture(CREATOR_LED_EXPORT_QUEUED_FIXTURE);
console.log(result.valid);           // true
console.log(result.issues.length);   // 0

// Invalid input
const bad = validateStrategyReviewExportQueueFixture({ name: 'bad-name' });
console.log(bad.valid);              // false
console.log(bad.issues[0]?.code);   // 'INVALID_KIND'
```

## Safety Validation Examples

```typescript
import { validateStrategyReviewExportQueueSafety } from './strategy-review-export-queue';

// Safe fixture
const safe = validateStrategyReviewExportQueueSafety(CREATOR_LED_EXPORT_QUEUED_FIXTURE);
console.log(safe.safe);              // true
console.log(safe.violations.length); // 0

// Unsafe string
const unsafe = validateStrategyReviewExportQueueSafety({ notes: ['call signTransaction'] });
console.log(unsafe.safe);            // false
console.log(unsafe.violations[0]);   // 'String contains execution-like term: ...'
```

## How Phase 44 Prepares Future Local Export Workflow Orchestration

Phase 44 establishes:

1. **Queue item types** — typed models for queued export-plan states
2. **Queue state machine** — queued, pending-review, reviewed, skipped, safety-blocked
3. **Priority system** — high, normal, low
4. **Phase 43 plan references** — synthetic links from queue items to export plans
5. **Queue summary builders** — aggregations by state, priority, kind
6. **Validation layer** — structural and safety validation for queue items
7. **Serialization** — deterministic JSON serialization for future orchestration

Future phases can use these fixtures as the basis for a local-only, read-only export workflow orchestrator that processes queued items without actual file writes, downloads, or execution.

## Phase 45 Preview

Phase 45 — Strategy Review Export Audit Fixtures v1 — will build upon Phase 44 to add deterministic audit trail fixtures for export queue processing records.

**Phase 45 is not implemented in this phase.**

## Future Sniper/Live Execution Note

Sniper-bot / live execution functionality belongs much later in the blueprint, after replay, paper trading, manual trading, and limited-live gates have been proven. No execution logic is implemented in this phase or any phase up to and including Phase 44. See `docs/SAFETY_RULES.md` for safety boundary details.

## Capability Flags

```typescript
{
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
}
```
