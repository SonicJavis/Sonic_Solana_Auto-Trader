# Pump Adapter — Phase 6A/6B

## Overview

`packages/pump-adapter` is a safe TypeScript adapter boundary for future Pump.fun/PumpSwap support.

**Phase 6A** added adapter-design and quote-model infrastructure.
**Phase 6B** adds local-only instruction intent and transaction plan placeholder models.

Neither phase performs any network calls, RPC queries, transaction building, signing, sending, or trade execution.

## What Phase 6B implements

- Instruction intent types (`PumpInstructionIntent`, `PumpInstructionIntentType`, `PumpTradeSide`)
- Transaction plan placeholder types (`PumpTransactionPlan`, `PumpTransactionPlanType`)
- Builder request/result types (`PumpInstructionBuilderRequest`, `PumpInstructionBuilderResult`)
- Warning and error codes (`Phase6BWarningCode`, `Phase6BErrorCode`, `Phase6BErrorResult`)
- Builder interface (`PumpInstructionIntentBuilder`)
- Phase 6B safety capability guard (`PHASE_6B_BUILDER_CAPABILITIES` — 12 flags, all false)
- Mock instruction builder (`MockInstructionBuilder`, `createMockInstructionBuilder`)
- Input validation helpers

## What Phase 6B does NOT implement

| Prohibited capability | Status |
|---|---|
| Real Solana instructions | ❌ Not implemented |
| AccountMeta / account metas | ❌ Not returned |
| Binary instruction data | ❌ Not returned |
| `@solana/web3.js` | ❌ Not imported |
| Pump SDK runtime integration | ❌ Not implemented |
| Wallet / keypair handling | ❌ Not implemented |
| Private keys / seed phrases | ❌ Not implemented |
| Transaction construction | ❌ Not implemented |
| Transaction simulation | ❌ Not implemented |
| Transaction signing | ❌ Not implemented |
| Transaction sending | ❌ Not implemented |
| Solana RPC | ❌ Not implemented |
| Jito | ❌ Not implemented |
| Live or auto trading | ❌ Not implemented |
| FULL_AUTO or LIMITED_LIVE unlock | ❌ Remain locked |
| Telegram trade/quote commands | ❌ Not added |

## Phase 6B safety flags

Every `PumpInstructionIntent` carries:
```typescript
executionForbidden: true   // always
isExecutable: false        // always
safeToDisplay: true        // always
```

Every `PumpTransactionPlan` carries:
```typescript
executionForbidden: true   // always
isExecutable: false        // always
requiresWallet: false      // always
requiresSignature: false   // always
requiresRpc: false         // always
```

Builder requests require:
```typescript
allowExecutableInstructions: false  // literal type + runtime guard
```

## Phase 6B safety capability guard

```typescript
import { PHASE_6B_BUILDER_CAPABILITIES } from '@sonic/pump-adapter';

// All 12 values are permanently false in Phase 6B:
PHASE_6B_BUILDER_CAPABILITIES.canSignTransactions          // false
PHASE_6B_BUILDER_CAPABILITIES.canSendTransactions          // false
PHASE_6B_BUILDER_CAPABILITIES.canExecuteTrades             // false
PHASE_6B_BUILDER_CAPABILITIES.canAccessPrivateKeys         // false
PHASE_6B_BUILDER_CAPABILITIES.canUseLiveRpc                // false
PHASE_6B_BUILDER_CAPABILITIES.canUseJito                   // false
PHASE_6B_BUILDER_CAPABILITIES.canBuildTransactions         // false
PHASE_6B_BUILDER_CAPABILITIES.canBuildInstructions         // false
PHASE_6B_BUILDER_CAPABILITIES.canBuildExecutableInstructions // false
PHASE_6B_BUILDER_CAPABILITIES.canSimulateTransactions      // false
PHASE_6B_BUILDER_CAPABILITIES.canReturnAccountMetas        // false
PHASE_6B_BUILDER_CAPABILITIES.canReturnBinaryInstructionData // false
```

## Mock instruction builder

```typescript
import { createMockInstructionBuilder, pumpOk } from '@sonic/pump-adapter';

const builder = createMockInstructionBuilder();

// Build a buy intent from a successful Phase 6A quote result:
const result = builder.buildBuyIntent({
  quote: availableAdapter.getBuyQuote(request),  // must be PumpAdapterOk<PumpQuoteResult>
  requestedAt: new Date().toISOString(),
  allowExecutableInstructions: false,            // must be false — type + runtime enforced
});
// result.plan.executionForbidden === true
// result.plan.isExecutable === false
// result.warnings includes 'MODEL_ONLY', 'EXECUTION_FORBIDDEN', etc.
// result.safety — all 12 capability flags false
```

## Phase 6B error codes

All errors have `safeToDisplay: true` — no raw secrets, no stack traces.

| Code | Meaning |
|---|---|
| `INSTRUCTION_BUILDING_FORBIDDEN` | Real instruction building is forbidden |
| `EXECUTABLE_INSTRUCTIONS_FORBIDDEN` | `allowExecutableInstructions` must be false |
| `TRANSACTION_BUILDING_FORBIDDEN` | Real transaction building is forbidden |
| `SIMULATION_FORBIDDEN` | Transaction simulation is forbidden |
| `QUOTE_REQUIRED` | A successful quote is required |
| `UNSAFE_QUOTE_RESULT` | Quote was not successful |
| `UNSUPPORTED_INTENT` | Intent side does not match quote side |
| `UNSUPPORTED_VENUE` | Venue not supported for intent building |
| `ACCOUNT_METAS_FORBIDDEN` | Account metas cannot be returned |
| `BINARY_DATA_FORBIDDEN` | Binary instruction data cannot be returned |
| `LIVE_RPC_FORBIDDEN` | Live RPC access is forbidden |
| `WALLET_ACCESS_FORBIDDEN` | Wallet/private key access is forbidden |

---

## Phase 6A content



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
