# Read-Only Solana Provider Boundary

## Phase 64 — Read-Only Solana Provider Adapter Mock-to-Real Boundary v1

### Purpose

Phase 64 adds `apps/dashboard/src/read-only-solana-provider-boundary/` as a deterministic, local-only, read-only, fixture-derived boundary-contract layer that models mock-to-real shape parity for a future Solana read-only provider adapter.

### Relationship to prior provider phases

- Phase 63 gate linkage: every Phase 64 fixture references a Phase 63 gate fixture name and remains gate-aware/fail-closed.
- Phase 55 mock linkage: every Phase 64 fixture references a Phase 55 mock adapter name.
- Phase 54 contract linkage: every Phase 64 fixture references a Phase 54 provider contract name.

### Why mock-to-real boundary matters

This phase defines explicit mapping, normalization, and conformance rules now so future real provider work can be validated against deterministic local contracts before any runtime/live integration is introduced.

### Boundary state model

State kinds:

- `boundary_not_live`
- `mock_contract_parity_ready`
- `mock_contract_parity_failed`
- `field_mapping_ready`
- `field_mapping_incomplete`
- `error_mapping_ready`
- `conformance_ready_for_future_provider`
- `future_real_provider_blocked_by_gate`

### Mock-to-real mapping model

Each fixture includes deterministic mapping metadata, source references, mapped/unmapped required fields, and mapping readiness status.

### Field mapping model

Deterministic mapping rules cover:

- account address
- mint address
- token metadata reference
- owner/program reference
- mint/freeze authority status
- holder distribution snapshot
- liquidity snapshot
- risk/source evidence reference
- provider health metadata
- response freshness metadata
- error code/category mapping

### Error normalization model

Deterministic normalization categories:

- `provider_unavailable_future`
- `rate_limited_future`
- `malformed_response_future`
- `missing_required_field`
- `unsupported_write_capability`
- `network_access_blocked`
- `gate_closed`
- `unknown_future_provider_error`

### Conformance check model

Deterministic checks cover mock-to-contract conformance, future-placeholder conformance, required-field coverage, nullability handling, error normalization coverage, gate compatibility, and no-live-readiness claims.

### Boundary report model

Each fixture builds a deterministic report with mapping coverage, conformance summary, error normalization summary, gate compatibility summary, unsafe capability summary, and future-only notes.

### No live provider / no SDK / no network / no wallet / no execution

Phase 64 remains synthetic and boundary-only. It does **not** add:

- live data
- real provider adapters/clients
- provider SDK imports
- API keys/secrets
- Solana RPC
- WebSockets/Geyser/Yellowstone
- Pump.fun/Jupiter/Raydium/Orca/Meteora/Jito integrations
- wallet/private keys/signing/sending
- transaction building
- execution
- real orders
- real funds
- real PnL
- recommendations/trading signals/investment advice
- live strategy selection
- endpoints/routes/handlers/runtime request handling
- UI rendering/DOM
- persistence/filesystem writes/downloads/background jobs

### View model / API contract / selector overview

Phase 64 includes deterministic fixture-derived view models, list/detail/summary/error API contract fixtures, and pure local selectors over in-memory fixtures only.

### Capability flags

Positive flags enable boundary fixtures, mapping rules, normalization rules, conformance checks, reports, view models, API contracts, and selectors. Negative flags keep all live/network/provider/sdk/key/rpc/wallet/signing/sending/execution/advisory/write capabilities fixed to `false`.

### Validation behavior

Validation rejects missing source references, invalid states, unmapped-required-field inconsistencies, live placeholders, network endpoints, provider SDK references, API key requirements, write capability flags, wallet/signing/sending flags, unsafe text, and unsafe capability toggles.

### Testing summary

`tests/phase64.test.ts` covers exports, fixture linkage/count/shape, builders, mapping rules, normalization rules, conformance checks, reports, view models, API contracts, selectors, normalization/serialization/equality, validation success/failure, safety rejection, capability propagation, determinism, immutability, and safety scans.

### Explicit non-goals

Phase 64 is boundary-contract-only. It does not implement real adapters, runtime handlers, network calls, wallets, signing/sending, execution logic, strategy selection, or advisory output.

### Next milestone guidance

**Phase 65 — First Real Read-Only Provider Adapter v1** is next guidance only and is **not implemented** in Phase 64.

