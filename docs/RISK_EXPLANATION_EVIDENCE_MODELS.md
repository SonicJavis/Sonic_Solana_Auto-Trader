
### Phase 87 Linkage Note

Phase 87 outcome-to-risk feedback loop contracts consume Phase 59 explanation/evidence fixture identifiers as immutable lineage references only. No runtime feedback ingestion, no live risk updates, and no advisory behavior are introduced.

# RISK_EXPLANATION_EVIDENCE_MODELS.md

## Phase 59 — Risk Explanation and Evidence Models v1

### Purpose

Phase 59 introduces deterministic, synthetic, local-only, read-only risk explanation and evidence models in `apps/dashboard/src/risk-explanation-evidence/`.

This phase explains Phase 58 risk assessments through explicit evidence chains linked to Phase 56 lifecycle events and Phase 57 replay snapshots.

### Relationship to Phase 58 Risk Engine

Each Phase 59 fixture references one Phase 58 risk fixture and preserves:

- risk fixture identity
- risk classification context
- factor evidence linkage
- non-advisory output boundaries

### Relationship to Phase 57 Replay Reports

Each Phase 59 fixture references one Phase 57 replay fixture name as replay evidence context.

Replay snapshot evidence nodes and snapshot-support edges keep replay provenance explicit in the graph.

### Relationship to Phase 56 Lifecycle Events

Each Phase 59 fixture references one Phase 56 lifecycle fixture name as lifecycle event evidence context.

Lifecycle event evidence nodes and event-support edges keep lifecycle provenance explicit in the graph.

### Why Evidence Graphs Matter

Evidence graphs provide deterministic traceability:

- lifecycle/replay/risk/explanation evidence nodes
- deterministic evidence relationships (edges)
- source coverage summary
- orphan-node detection
- deterministic graph checksums

This keeps explanation output auditable and reproducible.

### Evidence Node Model

Node kinds:

- `lifecycle_event_evidence`
- `replay_snapshot_evidence`
- `risk_factor_evidence`
- `risk_assessment_evidence`
- `threshold_classification_evidence`
- `safety_rejection_evidence`
- `insufficient_evidence_marker`
- `explanation_summary_evidence`

### Evidence Edge Model

Edge kinds:

- `event_supports_factor`
- `snapshot_supports_factor`
- `factor_supports_assessment`
- `threshold_supports_band`
- `assessment_supports_explanation`
- `safety_supports_rejection`
- `evidence_links_source`

### Evidence Graph Model

Each graph includes:

- deterministic graph identity
- source fixture references (Phase 58/57/56)
- nodes and edges
- node and edge counts
- source coverage summary
- orphan node list
- deterministic checksum
- safety summary

### Explanation Template Model

Template rendering is fixed and deterministic:

- fixed template IDs and kinds
- fixed variable substitution
- fixed output order
- no dynamic prose generation

### Explanation Output Model

Each explanation output includes:

- summary
- assessment summary
- factor explanations
- evidence reference IDs
- confidence summary
- limitations
- non-goals
- safety summary

Language is non-advisory and non-actionable.

### Rejection vs Recommendation Distinction

A rejected classification is a risk classification only.

It is not a recommendation, trading signal, or investment advice.

### View Models / API Contracts / Selectors

Phase 59 adds deterministic fixture-derived:

- dashboard/API-friendly view models
- list/detail/summary/error API contract fixtures
- pure local selectors over fixtures/graphs/nodes/edges/contracts

No endpoints, route handlers, or runtime request handling are introduced.

### Capability Flags

Positive capability flags indicate deterministic evidence/explanation surfaces.

All unsafe flags remain false, including live data, network access, real providers, Solana RPC, WebSocket/Geyser/Yellowstone, Pump.fun/Jupiter/Raydium/Orca/Meteora/Jito integrations, persistence/filesystem/downloads, route/server/runtime handling, UI/DOM, background jobs, wallet/private key/signing/sending, execution, recommendations/signals/investment advice, paper simulation, live execution, and strategy selection.

### Safety Constraints

Phase 59 remains:

- synthetic
- local-only
- read-only
- deterministic
- fixture-derived
- explanation-only
- non-networked
- non-wallet
- non-executing
- non-advisory

### Validation Behavior

Validation enforces:

- required fields and stable phase/schema metadata
- valid source fixture references (Phase 58/57/56)
- valid node/edge kinds and uniqueness
- valid edge-to-node references
- orphan-node rejection for normal fixtures
- template-only explanation rendering
- valid confidence labels
- stable graph checksum
- capability and safety constraints
- unsafe text/reference rejection

### Testing Summary

`tests/phase59.test.ts` covers:

- file existence and exports
- fixture count/map/list/get
- source linkage to Phase 58/57/56 fixtures
- evidence node/edge/graph integrity
- builders, templates, view models, contracts, selectors
- normalization/serialization/equality/determinism
- validation success and negative corruption/advisory/template cases
- capability propagation to dashboard and read-only API surfaces
- safety scans and immutability checks

### Explicit Non-Goals

Phase 59 does not include:

- live data
- real provider adapters
- Solana RPC
- WebSockets/Geyser/Yellowstone
- Pump.fun/Jupiter/Raydium/Orca/Meteora integrations
- wallet/private keys/signing/sending
- execution
- recommendations/trading signals/investment advice
- strategy selection
- real endpoints/routes/handlers
- runtime request handling
- UI rendering/DOM
- persistence/background jobs
- paper simulation

### Next Milestone Guidance

**Phase 60 — Paper Sniper Simulation Foundation v1** is the next milestone.

Phase 60 is implemented in the repository as `apps/dashboard/src/paper-sniper-simulation/` and documented in `docs/PAPER_SNIPER_SIMULATION.md`.
