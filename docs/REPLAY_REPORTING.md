# Replay Reporting — Phase 14

## Overview

`@sonic/replay-reporting` is a **read-only, fixture-only, analysis-only** reporting and diagnostics layer built on top of the Phase 13 Replay Lab (`@sonic/replay-lab`).

It provides deterministic JSON and Markdown export of replay analysis results, scenario indexing, run reports, comparison reports, and diagnostic summaries.

**This package is evidence-review only. It does not recommend, enable, or imply any trading action.**

---

## Phase Scope

Phase 14 adds:

1. Replay scenario index
2. Replay run report builder
3. Replay comparison report builder
4. Replay diagnostics builder
5. Deterministic JSON export
6. Deterministic safe Markdown export
7. Fixture-only report fixtures
8. Strict validation and safety checks
9. Public package barrel exports
10. Phase 14 test suite (150 tests)
11. Phase 14 documentation

---

## Package Structure

```
packages/replay-reporting/
  src/
    types.ts            — All Phase 14 type definitions
    errors.ts           — RrResult, rrOk, rrErr, ReplayReportingError
    validation.ts       — Safe text validation, capability validation, JSON safety checks
    scenario-index.ts   — buildScenarioIndex()
    run-report.ts       — buildReplayRunReport()
    comparison-report.ts — buildReplayComparisonReport()
    diagnostics.ts      — buildReplayDiagnostics()
    export-json.ts      — exportReplayReportJson()
    export-markdown.ts  — exportReplayReportMarkdown() and variants
    fixtures.ts         — Deterministic synthetic fixtures
    index.ts            — Public API barrel
  package.json
  tsconfig.json
```

---

## Capability Table

| Capability | Value |
|------------|-------|
| canUseLiveData | **false** |
| canUseSolanaRpc | **false** |
| canUseProviderApis | **false** |
| canAccessPrivateKeys | **false** |
| canCreateTradeIntents | **false** |
| canCreateExecutionPlans | **false** |
| canPaperTrade | **false** |
| canTrade | **false** |
| canExecute | **false** |
| canWriteToDatabase | **false** |
| canSendTelegramAlerts | **false** |
| fixtureOnly | **true** |

All unsafe capability flags are permanently `false`. This cannot be changed by configuration.

---

## Scenario Index

`buildScenarioIndex(scenarios: ReplayScenario[]): RrResult<ReplayScenarioIndex>`

Indexes a set of `ReplayScenario` objects into a deterministic, safe `ReplayScenarioIndex`.

**Output includes:**
- Scenario count and IDs (sorted alphabetically)
- Expected verdict distribution
- Total step count and step count per scenario
- Unique step types
- Per-scenario entries with `fixtureOnly: true`, `liveData: false`

**Validation:**
- Rejects any scenario where `liveData !== false`
- Rejects any scenario where `fixtureOnly !== true`
- Rejects unsafe action text in display names or descriptions

---

## Run Report

`buildReplayRunReport(run: ReplayRun): RrResult<ReplayRunReport>`

Converts a `ReplayRun` into a safe, structured `ReplayRunReport`.

**Output includes:**
- Run ID, scenario ID, final verdict
- Final risk score, average confidence
- Per-step report rows (verdict, warnings, risk score, confidence)
- Warning/failure/degraded/inconclusive counts
- Human-readable summary text (no trading instructions)

**Validation:**
- Rejects runs where `fixtureOnly !== true`
- Rejects runs where `liveData !== false`
- Rejects runs where `safeToDisplay !== true`

---

## Comparison Report

`buildReplayComparisonReport(comparison: ReplayComparison): RrResult<ReplayComparisonReport>`

Converts a `ReplayComparison` into a safe `ReplayComparisonReport` with regression detection.

**Output includes:**
- Baseline and candidate run IDs
- Verdict changed indicator
- Score delta and confidence delta
- Regression flag (true when scoreDelta > 0.05)
- Diagnostic findings (verdict change, regression, confidence shift)

**Regression definition:**
A candidate run is considered a regression when its risk score is more than 0.05 higher than the baseline. This is a purely analytical observation — it does not enable or recommend any action.

---

## Diagnostics

`buildReplayDiagnostics(source: ReplayRun | ReplayRunReport): RrResult<ReplayDiagnostics>`

Produces a structured `ReplayDiagnostics` from either a raw `ReplayRun` or a `ReplayRunReport`.

**Output includes:**
- Finding count
- Severity counts (info, warning, risk, failure, inconclusive)
- Degraded reasons, failed reasons, inconclusive reasons
- Missing fixture data notes
- Plain-text summary

**Severity levels (analysis-only, no action-oriented names):**
- `info` — informational finding
- `warning` — elevated signal worth noting
- `risk` — elevated risk indicator
- `failure` — step failed (e.g. manipulation detected)
- `inconclusive` — insufficient fixture data

---

## JSON Export

`exportReplayReportJson(report, contentType?): RrResult<ReplayReportExport>`

Produces a deterministic, JSON-safe export of any safe report object.

**Safety guarantees:**
- Replaces `undefined` with `null`
- Removes functions
- Removes Error objects
- Validates all string fields for unsafe action text, secret patterns, and URL patterns
- Stable key ordering (alphabetical)

---

## Markdown Export

`exportReplayReportMarkdown(report): RrResult<string>`

Produces deterministic safe Markdown for any supported report type.

Specific exporters:
- `exportRunReportMarkdown(report: ReplayRunReport)`
- `exportComparisonReportMarkdown(report: ReplayComparisonReport)`
- `exportScenarioIndexMarkdown(index: ReplayScenarioIndex)`
- `exportDiagnosticsMarkdown(diagnostics: ReplayDiagnostics)`

**Safety guarantees:**
- No raw stack traces
- No secrets, private keys, seed phrases, RPC URLs, API keys
- No trading instructions, no action recommendations
- Safety footer included in all outputs
- All content lines checked for unsafe patterns (REDACTED if found)

---

## Example Usage

```typescript
import {
  buildScenarioIndex,
  buildReplayRunReport,
  buildReplayDiagnostics,
  exportReplayReportJson,
  exportRunReportMarkdown,
  getReplayReportingCapabilities,
  ALL_REPLAY_REPORT_FIXTURES,
} from '@sonic/replay-reporting';

import {
  runReplayScenario,
  CLEAN_TOKEN_REPLAY_SCENARIO,
} from '@sonic/replay-lab';

// Check capabilities
const caps = getReplayReportingCapabilities();
console.log(caps.canTrade); // false — always

// Build a scenario index
const indexResult = buildScenarioIndex([CLEAN_TOKEN_REPLAY_SCENARIO]);
if (indexResult.ok) {
  console.log(indexResult.value.scenarioCount); // 1
}

// Run a scenario and build a report
const runResult = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
if (runResult.ok) {
  const reportResult = buildReplayRunReport(runResult.value);
  if (reportResult.ok) {
    const mdResult = exportRunReportMarkdown(reportResult.value);
    if (mdResult.ok) console.log(mdResult.value);
  }
}
```

---

## Safety Invariants

1. **fixtureOnly must remain true** — all outputs carry `fixtureOnly: true`
2. **liveData must remain false** — all outputs carry `liveData: false`
3. **safeToDisplay must be true** — all outputs carry `safeToDisplay: true`
4. **All unsafe capability flags are permanently false** — no configuration can change this
5. **Reports do not recommend trading actions** — no buy, sell, execute, snipe, etc.
6. **Reports do not create trade intents** — outputs have no tradeIntent fields
7. **Reports do not create execution plans** — outputs have no executionPlan fields
8. **Reports do not enable paper trading** — no paperTrade fields or flags
9. **Reports do not include secrets** — private keys, seed phrases, API keys are forbidden
10. **Reports do not include RPC URLs** — wss://, provider endpoints are forbidden

---

## Explicit Statement

> **This package is fixture-only and analysis-only.**
>
> Reports produced by `@sonic/replay-reporting` are evidence review aids for human inspection of replay lab results. They describe analysis outcomes only.
>
> **Reports do not recommend or enable any trading action.** They must not be interpreted as buy/sell/execution signals.
>
> No live data is used. No Solana RPC is called. No provider APIs are accessed. No wallets are accessed. No transactions are constructed, simulated, signed, or sent.
