# Synthetic Launch Intelligence

**Phase 53 — Synthetic Launch Intelligence Foundation v1**

## Purpose

Phase 53 introduces a deterministic synthetic launch intelligence foundation for future gated read-only provider, replay, risk, and paper-simulation work.

## Relationship to Phase 52 aggressive-safe policy

Phase 53 follows `docs/AGGRESSIVE_SAFE_PHASE_POLICY.md` by shipping one complete vertical slice (fixtures, view models, contracts, selectors, validation, docs, tests) instead of another derivative wrapper layer.

## Why this is sniper-bot-relevant but still safe

The models cover launch-timeline, liquidity, holder, creator, cluster, and risk-review context that future sniper-intelligence phases can consume, but all data is static synthetic fixture data and non-actionable.

## Fixture design

Top-level fixture fields include deterministic IDs, phase metadata, token profile, launch events, pool/liquidity snapshots, creator profile, holder snapshots, wallet-cluster indicators, risk-factor summaries, risk review, view model, API contracts, selector examples, capabilities, meta, and safety envelopes.

## Scenario overview

Phase 53 provides 8 deterministic scenarios:

- clean launch baseline
- low liquidity launch
- concentrated holders launch
- suspicious creator history launch
- possible bundle cluster launch
- metadata incomplete launch
- high velocity early volume launch
- safety rejected launch

## Token profile model

Synthetic token profile fields include placeholder mint ID, symbol/name, decimals, synthetic supply, launch timestamp constant, metadata completeness fields, and synthetic source markers.

## Launch event model

Launch events cover: launch detected, pool created, initial liquidity added, early volume burst, creator activity observed, holder distribution snapshot captured, suspicious bundle pattern observed, and risk review completed.

## Pool/liquidity model

Pool snapshots provide deterministic pool fixture IDs, synthetic liquidity levels, concentration labels, and initial/change event markers.

## Creator profile model

Creator profiles use synthetic creator fixture IDs with synthetic launch history counts, synthetic reputation labels, and synthetic risk flags only.

## Holder distribution model

Holder snapshots include deterministic synthetic holder count, top-holder concentration, HHI, Gini approximation, and synthetic cluster flags.

## Wallet cluster model

Wallet-cluster indicators include synthetic cluster IDs, leader/follower labels, timing windows, and concentration labels.

## Risk factor model

Risk factors include deterministic IDs, categories, severities, labels, descriptions, evidence references, rejection markers, and explicit `nonAdvisory: true` posture.

## View model / API contract / selector overview

- View model: display-friendly summary model for dashboard/read-only surfaces.
- API contracts: deterministic list/detail/summary/error fixture contracts.
- Selectors: pure local selection helper over fixture data.

## Capability flags

Positive flags enable synthetic fixture-derived launch intelligence, view models, contracts, and selectors. Live/network/provider/RPC/persistence/filesystem/route/runtime/UI/DOM/background/wallet/signing/execution/signal/recommendation/advice flags remain false.

## Safety constraints

- No live data
- No provider adapters
- No Solana RPC
- No Pump.fun/Jupiter/Raydium/Orca/Meteora integrations
- No wallet/private keys/signing/sending
- No execution
- No recommendations/trading signals/investment advice
- No real endpoints/routes/handlers
- No runtime request handling
- No UI rendering/DOM
- No persistence/background jobs

## Validation behavior

`validateSyntheticLaunchIntelligenceFixture` enforces structural, deterministic, capability, and phase constraints. `validateSyntheticLaunchIntelligenceSafety` rejects unsafe network/filesystem/runtime/wallet/execution/advisory content patterns.

## Testing summary

`tests/phase53.test.ts` covers constants, fixtures, builders, contracts, selectors, normalization/serialization/equality, validation success/failure paths, capability propagation, deterministic behavior, source immutability, and unsafe-pattern absence checks.

## Explicit non-goals

Phase 53 does not implement live providers, RPC integrations, endpoints, runtime handlers, persistence, UI rendering, wallet logic, signing/sending, execution, recommendations, trading signals, or investment advice.

## Next milestone guidance

**Phase 54 — Read-Only Provider Interface Contracts v1** should define deterministic read-only provider interface contracts only, without implementing live adapters.
