# Pump Adapter — Phase 6A/6B/6C

## Overview

`packages/pump-adapter` is a safe TypeScript adapter boundary for future Pump.fun/PumpSwap support.

**Phase 6A** added adapter-design and quote-model infrastructure.
**Phase 6B** adds local-only instruction intent and transaction plan placeholder models.
**Phase 6C** adds a disabled Pump SDK wrapper boundary — defines where a future Pump SDK could plug in.

None of the phases perform any network calls, RPC queries, transaction building, signing, sending, or trade execution.

## Phase 6C: Disabled Pump SDK Wrapper Boundary

Phase 6C creates a disabled-by-default wrapper that defines where a future Pump SDK integration could be inserted.

**This is a safety boundary only.** It must not and does not add real Pump SDK runtime integration, Solana SDK integration, Solana RPC, live quote fetching, real instruction building, account metas, binary instruction data, simulation, signing, sending, wallet access, or execution.

### What Phase 6C implements

- `PumpSdkWrapperMode` type: `disabled` | `mock` | `future_live_not_available`
- `PumpSdkWrapperStatus` type: `disabled` | `unavailable` | `unsupported` | `mock_only`
- `PumpSdkWrapperConfig` — all live/executable permission fields permanently `false`
- `PumpSdkWrapperCapabilities` — 12 capability flags, all permanently `false`
- `PumpSdkWrapperErrorCode` — 11 safe error codes
- `PumpSdkWrapper` interface — getStatus, getCapabilities, getConfig, assertDisabled, explainDisabledReason, boundary placeholders for live methods
- `DisabledPumpSdkWrapper` — always returns disabled/forbidden results; never imports SDK
- `createPumpSdkWrapper` factory — always returns disabled wrapper; unsafe enable/live attempts coerced to disabled (fail-closed)
- `DISABLED_WRAPPER_CONFIG`, `PUMP_SDK_WRAPPER_CAPABILITIES` constants

### What Phase 6C does NOT implement

| Prohibited capability | Status |
|---|---|
| Real Pump SDK runtime | ❌ Not installed or imported |
| `@solana/web3.js` | ❌ Not imported |
| Solana SDK runtime | ❌ Not present |
| Live RPC access | ❌ Forbidden |
| Real instruction building | ❌ Forbidden |
| Account metas | ❌ Not returned |
| Binary instruction data | ❌ Not returned |
| Transaction construction | ❌ Not implemented |
| Transaction simulation | ❌ Forbidden |
| Transaction signing | ❌ Forbidden |
| Transaction sending | ❌ Forbidden |
| Wallet / keypair handling | ❌ Not implemented |
| Private keys / seed phrases | ❌ Not implemented |
| Jito | ❌ Not implemented |
| Live or auto trading | ❌ Not implemented |
| FULL_AUTO or LIMITED_LIVE unlock | ❌ Remain locked |
| Telegram trade/quote commands | ❌ Not added |

### Phase 6C safety capability guard

All 12 wrapper capability flags are permanently `false`:

```typescript
import { PUMP_SDK_WRAPPER_CAPABILITIES } from '@sonic/pump-adapter';

PUMP_SDK_WRAPPER_CAPABILITIES.hasPumpSdkRuntime           // false
PUMP_SDK_WRAPPER_CAPABILITIES.hasSolanaSdkRuntime         // false
PUMP_SDK_WRAPPER_CAPABILITIES.canUseLiveRpc               // false
PUMP_SDK_WRAPPER_CAPABILITIES.canBuildRealInstructions    // false
PUMP_SDK_WRAPPER_CAPABILITIES.canReturnAccountMetas       // false
PUMP_SDK_WRAPPER_CAPABILITIES.canReturnBinaryInstructionData // false
PUMP_SDK_WRAPPER_CAPABILITIES.canSimulateTransactions     // false
PUMP_SDK_WRAPPER_CAPABILITIES.canSignTransactions         // false
PUMP_SDK_WRAPPER_CAPABILITIES.canSendTransactions         // false
PUMP_SDK_WRAPPER_CAPABILITIES.canExecuteTrades            // false
PUMP_SDK_WRAPPER_CAPABILITIES.canAccessWallets            // false
PUMP_SDK_WRAPPER_CAPABILITIES.canAccessPrivateKeys        // false
```

### Phase 6C wrapper config

All live/executable permissions are permanently `false`:

```typescript
import { DISABLED_WRAPPER_CONFIG } from '@sonic/pump-adapter';

DISABLED_WRAPPER_CONFIG.enabled                    // false
DISABLED_WRAPPER_CONFIG.allowLiveRpc               // false
DISABLED_WRAPPER_CONFIG.allowInstructionBuilding   // false
DISABLED_WRAPPER_CONFIG.allowExecutableInstructions // false
DISABLED_WRAPPER_CONFIG.allowSigning               // false
DISABLED_WRAPPER_CONFIG.allowSending               // false
DISABLED_WRAPPER_CONFIG.allowWalletAccess          // false
```

### Phase 6C factory — fail-closed

```typescript
import { createPumpSdkWrapper } from '@sonic/pump-adapter';

// Default: returns disabled wrapper
const wrapper = createPumpSdkWrapper();

// Unsafe config is coerced to disabled (fail-closed):
const unsafe = createPumpSdkWrapper({ enabled: true, allowLiveRpc: true, allowSigning: true });
unsafe.getStatus(); // 'disabled' — unsafe attempts are ignored
```

### Phase 6C disabled wrapper

```typescript
import { createDisabledSdkWrapper } from '@sonic/pump-adapter';

const wrapper = createDisabledSdkWrapper();

wrapper.getStatus();           // 'disabled'
wrapper.assertDisabled();      // { ok: false, code: 'SDK_WRAPPER_DISABLED', safeToDisplay: true, ... }
wrapper.explainDisabledReason(); // human-readable explanation, safe to display

// Optional live methods — always return forbidden results:
wrapper.getLiveQuote('TokMint', 'buy');            // { ok: false, error: { code: 'EXECUTION_FORBIDDEN', ... } }
wrapper.getLiveBondingCurveState('TokMint');       // { ok: false, error: { code: 'EXECUTION_FORBIDDEN', ... } }
wrapper.buildRealInstruction('buy_intent');        // { ok: false, error: { code: 'EXECUTION_FORBIDDEN', ... } }
```

### Phase 6C error codes

All errors have `safeToDisplay: true` — no raw secrets, no stack traces.

| Code | Meaning |
|---|---|
| `SDK_WRAPPER_DISABLED` | Wrapper is disabled (Phase 6C default) |
| `SDK_RUNTIME_NOT_INSTALLED` | Pump SDK runtime is not installed |
| `SOLANA_SDK_FORBIDDEN` | Solana SDK usage is forbidden |
| `LIVE_RPC_FORBIDDEN` | Live RPC access is forbidden |
| `REAL_INSTRUCTION_BUILDING_FORBIDDEN` | Real instruction building is forbidden |
| `ACCOUNT_METAS_FORBIDDEN` | Account metas cannot be returned |
| `BINARY_DATA_FORBIDDEN` | Binary instruction data cannot be returned |
| `WALLET_ACCESS_FORBIDDEN` | Wallet/private key access is forbidden |
| `SIGNING_FORBIDDEN` | Transaction signing is forbidden |
| `SENDING_FORBIDDEN` | Transaction sending is forbidden |
| `EXECUTION_FORBIDDEN` | Trade execution is forbidden |

---

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
