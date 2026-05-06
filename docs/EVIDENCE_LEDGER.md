# Evidence Ledger

## Overview

The Evidence Ledger (`@sonic/evidence-ledger`) is a Phase 17 package that provides a safe, deterministic, fixture-only, append-only audit-style reasoning record layer for the Sonic Solana Auto-Trader intelligence system.

Its purpose is to record safe explanations for why Replay Lab, Replay Reporting, Strategy Intent, and Strategy Evaluation outputs reached their conclusions — enabling explainability, traceability, and audit-style reasoning.

**EvidenceLedger is NOT a trading system.**  
It does not produce trading advice, trading signals, live candidates, auto candidates, executable actions, or permission to trade.  
It does not enable any form of live execution, paper trading, or transaction construction.

---

## Phase Scope

Phase 17 scope:
- Create a local-only package that records safe explanations for prior analysis outputs
- Explainability, traceability, and audit-style reasoning only
- fixture-only, analysis-only, non-executable, append-only
- No live data, no paper trading, no real trade intents, no executable trade signals

---

## Package Structure

```
packages/evidence-ledger/
├── src/
│   ├── types.ts            — All Phase 17 type definitions
│   ├── errors.ts           — ElResult<T>, elOk, elErr, EvidenceLedgerError
│   ├── capabilities.ts     — getEvidenceLedgerCapabilities()
│   ├── source-reference.ts — buildEvidenceSourceReference()
│   ├── evidence-entry.ts   — buildEvidenceEntry()
│   ├── decision-trace.ts   — buildDecisionTrace()
│   ├── trace-summary.ts    — buildDecisionTraceSummary()
│   ├── integrity.ts        — checkEvidenceIntegrity()
│   ├── ledger-builder.ts   — buildEvidenceLedger()
│   ├── export-json.ts      — exportEvidenceLedgerJson()
│   ├── export-markdown.ts  — exportEvidenceLedgerMarkdown()
│   ├── validation.ts       — validateEvidenceLedger(), validateEvidenceEntry(), etc.
│   ├── fixtures.ts         — 6 deterministic synthetic fixtures
│   └── index.ts            — Public API barrel
├── package.json
└── tsconfig.json
```

---

## Capability Table

| Capability | Value |
|---|---|
| canUseLiveData | false |
| canUseSolanaRpc | false |
| canUseProviderApis | false |
| canAccessPrivateKeys | false |
| canCreateTradeIntents | false |
| canCreateExecutionPlans | false |
| canPaperTrade | false |
| canTrade | false |
| canExecute | false |
| canWriteToDatabase | false |
| canSendTelegramAlerts | false |
| canConstructTransactions | false |
| canSimulateTransactions | false |
| canCreateOrders | false |
| canCreatePositions | false |
| canCalculateLivePnl | false |
| canMutatePriorEvidence | false |
| fixtureOnly | true |
| analysisOnly | true |
| nonExecutable | true |
| appendOnly | true |

---

## Source Reference

An `EvidenceSourceReference` is a safe, deterministic reference to a prior-phase output (replay run, replay report, strategy intent, or strategy evaluation). It contains no raw URLs, no private data, no live data, and no mutable external pointers.

### EvidenceSourceKind values

| Kind | Description |
|---|---|
| `replay_run` | A fixture-only replay lab run |
| `replay_report` | A fixture-only replay report |
| `strategy_intent` | A fixture-only strategy intent |
| `strategy_evaluation` | A fixture-only strategy evaluation |
| `fixture_only_source` | A generic fixture-only source |

Build with `buildEvidenceSourceReference(input)`.

---

## Evidence Entry

An `EvidenceEntry` is a single audit-style evidence record explaining one reasoning step. It carries:

- `id` — unique identifier
- `sourceRef` — EvidenceSourceReference
- `kind` — EvidenceEntryKind
- `severity` — EvidenceEntrySeverity
- `title` / `summary` / `reasons` — safe text fields
- `timestamp` — deterministic ISO string
- All safety flags set to required values

### EvidenceEntryKind values

| Kind | Description |
|---|---|
| `source_snapshot` | A snapshot of a source output |
| `classification_reason` | Explains a classification result |
| `safety_gate_reason` | Explains a safety gate decision |
| `evidence_quality_reason` | Explains evidence quality assessment |
| `rejection_reason` | Explains why a fixture was rejected |
| `warning_reason` | Explains a warning finding |
| `inconclusive_reason` | Explains why evidence was inconclusive |
| `fixture_only_reason` | Generic fixture-only annotation |

### EvidenceEntrySeverity values

`info` | `warning` | `risk` | `failure` | `inconclusive`

Build with `buildEvidenceEntry(input)`.

---

## Decision Trace

A `DecisionTrace` is a safe, fixture-only, append-only trace of reasoning steps derived from one or more evidence entries. It carries:

- `id` — unique trace ID
- `sourceIds` — deduplicated source reference IDs
- `entries` — readonly EvidenceEntry array
- `steps` — derived DecisionTraceStep array
- `classification` — DecisionTraceClassification (non-actionable analysis label)
- `summary` — safe text summary
- All safety flags

### DecisionTraceClassification values

| Classification | Description |
|---|---|
| `rejected_by_evidence` | Evidence analysis indicates rejection |
| `watch_only_by_evidence` | Evidence analysis indicates watch-only status |
| `analysis_only_by_evidence` | Evidence analysis indicates analysis-only status |
| `insufficient_evidence` | Not enough evidence for classification |
| `fixture_only_trace` | Generic fixture-only trace |

These values are **analysis-only labels — NOT recommendations to act.**

Build with `buildDecisionTrace(input)`.

---

## Trace Summary

A `DecisionTraceSummary` provides aggregate statistics for a `DecisionTrace`:

- `totalEntries` / `totalSteps`
- `severityCounts` — per-severity entry counts
- `sourceKindCounts` — per-source-kind entry counts
- `blockedReasonCount` / `warningReasonCount` / `inconclusiveReasonCount`
- `classification` / `summaryText`
- All safety flags

Build with `buildDecisionTraceSummary(trace)`.

---

## Integrity Check

`checkEvidenceIntegrity(ledgerOrTrace)` runs a comprehensive integrity scan that detects:

- Duplicate IDs
- Unsafe text fields (action text, secrets, URLs)
- liveData violations
- Unsafe source references
- Secret-like patterns
- URL/RPC-like patterns
- Mutation capability markers

Returns an `EvidenceIntegrityCheck` with `valid: boolean` and detailed issue lists.

---

## JSON Export

`exportEvidenceLedgerJson(ledger)` returns a deterministic, JSON-safe `EvidenceLedgerExport` with:

- `exportKind: 'evidence_ledger_export'`
- Complete ledger data with all safety fields set
- Sorted sourceIds for determinism
- No undefined, functions, Error objects, circular data, secrets

---

## Markdown Export

`exportEvidenceLedgerMarkdown(ledger)` returns a deterministic Markdown string suitable for human review with:

- Ledger summary with severity/source-kind tables
- Integrity check section
- Decision traces and entries
- Safety flags section
- **Mandatory safety footer**

The safety footer reads:
> ⚠️ SAFETY NOTICE: This report is fixture-only, analysis-only, non-executable, and append-only. It does not recommend or enable trading. It does not create real trade intents, execution plans, orders, or any actionable output. Prior evidence cannot be mutated.

---

## Example Usage

```typescript
import {
  buildEvidenceSourceReference,
  buildEvidenceEntry,
  buildDecisionTrace,
  buildEvidenceLedger,
  exportEvidenceLedgerMarkdown,
} from '@sonic/evidence-ledger';

// Build a source reference
const refResult = buildEvidenceSourceReference({
  referenceId: 'my_eval_ref',
  sourceKind: 'strategy_evaluation',
  label: 'My Evaluation Reference',
  description: 'A fixture-only strategy evaluation reference.',
  fixtureOnly: true,
  liveData: false,
});
if (!refResult.ok) throw new Error(refResult.message);

// Build an evidence entry
const entryResult = buildEvidenceEntry({
  id: 'my_entry_001',
  sourceRef: refResult.value,
  kind: 'classification_reason',
  severity: 'info',
  title: 'Analysis-only classification observed',
  summary: 'The fixture evaluation reached analysis_only classification.',
  reasons: ['Evidence quality is strong.'],
  fixtureOnly: true,
  liveData: false,
});
if (!entryResult.ok) throw new Error(entryResult.message);

// Build a decision trace
const traceResult = buildDecisionTrace({
  id: 'my_trace_001',
  entries: [entryResult.value],
  fixtureOnly: true,
  liveData: false,
});
if (!traceResult.ok) throw new Error(traceResult.message);

// Build a ledger
const ledgerResult = buildEvidenceLedger({
  id: 'my_ledger_001',
  traces: [traceResult.value],
  fixtureOnly: true,
  liveData: false,
});
if (!ledgerResult.ok) throw new Error(ledgerResult.message);

// Export as Markdown
const markdown = exportEvidenceLedgerMarkdown(ledgerResult.value);
console.log(markdown);
```

---

## Safety Invariants

All EvidenceLedger outputs must satisfy:

- `fixtureOnly: true`
- `liveData: false`
- `safeToDisplay: true`
- `analysisOnly: true`
- `nonExecutable: true`
- `appendOnly: true`

Validation (`validateEvidenceLedger`) rejects any output that violates these invariants.

Validation also rejects:

- Unsafe action text (buy, sell, execute, snipe, etc.)
- Secret-like patterns (private_key, seed phrase, api_key, etc.)
- URL/RPC-like patterns (wss://, helius.dev, mainnet-beta.solana.com, etc.)
- Any integrity failures

---

## Fixture-Only / Analysis-Only / Non-Executable / Append-Only Statement

The Evidence Ledger package is permanently:

- **Fixture-Only:** All data is synthetic. No real token mints, wallet addresses, private data, or real URLs are used.
- **Analysis-Only:** All outputs are audit-style reasoning records. No trade signals, no recommendations to act.
- **Non-Executable:** No output can be used to place trades, construct transactions, or enable any execution.
- **Append-Only:** Prior evidence cannot be mutated. New entries can only be added; existing records cannot be modified.

**EvidenceLedger is not trading advice and creates no real trade intents.**  
**Outputs do not recommend or enable trading.**  
**Prior evidence cannot be mutated.**

---

## Future Phase Notes

> ⚠️ **FUTURE PHASES ONLY** — the following are not implemented in Phase 17:

- A future phase may introduce a more structured ledger persistence layer (still fixture-only).
- A future phase may introduce richer evidence cross-referencing between phases.
- Any live data, paper trading, or execution features remain permanently forbidden unless explicitly approved through the full safety, audit, and review process described in SAFETY_RULES.md.

---

*This document is part of the Sonic Solana Auto-Trader Phase 17 documentation.*
