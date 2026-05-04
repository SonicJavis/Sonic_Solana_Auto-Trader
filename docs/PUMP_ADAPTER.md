# Pump Adapter — Phase 6A

## Overview

`packages/pump-adapter` is a safe TypeScript adapter boundary for future Pump.fun/PumpSwap quote support.

**Phase 6A is adapter-design and quote-model infrastructure only.**

## What this phase implements

- TypeScript interfaces and models (venues, quote requests/results, bonding curve state)
- Safe result/error types with display-safe error codes
- Input validation helpers (structural only, no Solana library)
- Safety capability guard (`PUMP_ADAPTER_CAPABILITIES` — all false)
- Mock adapter implementation for tests

## What this phase does NOT implement

| Prohibited capability | Status |
|---|---|
| Solana RPC | ❌ Not implemented |
| Helius / QuickNode / Triton / Alchemy clients | ❌ Not implemented |
| Pump SDK runtime integration | ❌ Not implemented |
| `@solana/web3.js` | ❌ Not imported |
| Wallet / keypair handling | ❌ Not implemented |
| Private keys / seed phrases / mnemonics | ❌ Not implemented |
| Transaction instruction building | ❌ Not implemented |
| Transaction construction | ❌ Not implemented |
| Transaction simulation | ❌ Not implemented |
| Transaction signing | ❌ Not implemented |
| Transaction sending | ❌ Not implemented |
| Pump.fun buying/selling | ❌ Not implemented |
| PumpSwap buying/selling | ❌ Not implemented |
| Jito | ❌ Not implemented |
| Jupiter / Raydium / Orca / Meteora swaps | ❌ Not implemented |
| Market data ingestion | ❌ Not implemented |
| Live or auto trading | ❌ Not implemented |
| FULL_AUTO or LIMITED_LIVE unlock | ❌ Remain locked |
| Telegram trade/quote commands | ❌ Not added |

## Safety capability guard

```typescript
import { PUMP_ADAPTER_CAPABILITIES } from '@sonic/pump-adapter';

// All values are permanently false in Phase 6A:
PUMP_ADAPTER_CAPABILITIES.canSignTransactions   // false
PUMP_ADAPTER_CAPABILITIES.canSendTransactions   // false
PUMP_ADAPTER_CAPABILITIES.canExecuteTrades      // false
PUMP_ADAPTER_CAPABILITIES.canAccessPrivateKeys  // false
PUMP_ADAPTER_CAPABILITIES.canUseLiveRpc         // false
PUMP_ADAPTER_CAPABILITIES.canUseJito            // false
PUMP_ADAPTER_CAPABILITIES.canBuildTransactions  // false
PUMP_ADAPTER_CAPABILITIES.canBuildInstructions  // false
```

## Mock adapter

The `MockPumpAdapter` is for tests and local development only.

```typescript
import { createDisabledMockAdapter, createAvailableMockAdapter } from '@sonic/pump-adapter';

// Default Phase 6A adapter — always disabled
const disabled = createDisabledMockAdapter();
disabled.getStatus(); // { status: 'disabled', isLiveCapable: false, executionForbidden: true, ... }

// Available mock for testing non-disabled paths
const available = createAvailableMockAdapter({ venue: 'pump_curve', curveProgress: 0.5 });
available.getBuyQuote(request); // returns { isMockResult: true, safeToDisplay: true, ... }
```

## Adapter status

In Phase 6A the adapter must always report:
- `isLiveCapable: false`
- `hasLiveRpc: false`
- `executionForbidden: true`

```typescript
const status = adapter.getStatus();
// status.isLiveCapable === false (always)
// status.hasLiveRpc === false (always)
// status.executionForbidden === true (always)
```

## Quote models

Quotes are estimates only — no trade is executed, no transaction is built.

```typescript
// PumpQuoteResult fields use "estimated" language:
result.estimatedOutputAmount  // not "filled" or "executed"
result.estimatedPrice
result.estimatedFees
result.isMockResult           // always true in Phase 6A
result.safeToDisplay          // always true
```

## Bonding curve state

The `BondingCurveState` model is local only — no chain data is fetched.

```typescript
state.isMockState  // always true in Phase 6A
state.modelledAt   // timestamp of when mock state was created, not fetched from chain
```

## Error codes

All errors have `safeToDisplay: true` — no raw secrets, no stack traces.

| Code | Meaning |
|---|---|
| `ADAPTER_DISABLED` | Adapter is explicitly disabled (Phase 6A default) |
| `ADAPTER_UNAVAILABLE` | Adapter is not reachable or configured |
| `UNSUPPORTED_VENUE` | Venue not supported in current phase |
| `INVALID_TOKEN_MINT` | Token mint fails structural validation |
| `INVALID_AMOUNT` | Amount is not a positive number |
| `INVALID_SLIPPAGE` | Slippage outside 0–10000 bps |
| `QUOTE_UNAVAILABLE` | Quote cannot be generated |
| `NETWORK_NOT_IMPLEMENTED` | Network/RPC calls are not implemented |
| `EXECUTION_FORBIDDEN` | Trade execution is forbidden |
| `SIGNING_FORBIDDEN` | Transaction signing is forbidden |
| `SENDING_FORBIDDEN` | Transaction sending is forbidden |
| `WALLET_ACCESS_FORBIDDEN` | Wallet/private key access is forbidden |

## Package dependencies

`packages/pump-adapter` has **no dependencies** on other workspace packages.

It does not import: `@sonic/shared`, `@sonic/config`, `@sonic/db`, `@sonic/state`, `apps/worker`, `apps/telegram-bot`.

It does not import: `@solana/web3.js`, any Pump SDK, any wallet library, any RPC client.

## What comes next (Phase 6B — not this phase)

Phase 6B may later add:
- A safe instruction-builder boundary (still without signing or sending)

Phase 6B must still NOT:
- Sign transactions
- Send transactions
- Execute trades
- Unlock FULL_AUTO or LIMITED_LIVE
