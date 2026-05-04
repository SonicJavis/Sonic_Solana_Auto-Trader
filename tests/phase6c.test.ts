/**
 * Phase 6C Tests — Disabled Pump SDK Wrapper Boundary
 *
 * Tests cover:
 * A. Wrapper types — status, config, capability shapes; all executable/live fields false
 * B. Disabled wrapper — status, capabilities, disabled reason, safety, forbidden methods
 * C. Factory — default returns disabled, missing config returns disabled, unsafe attempts fail closed
 * D. Forbidden methods — live quote, live bonding curve, real instruction; no account metas, no binary data
 * E. Safety capabilities — all 12 capability flags false
 * F. Error safety — disabled/forbidden errors safe to display, no secrets/stack traces/etc.
 * G. Regression — all Phase 1–6B tests still pass, FULL_AUTO/LIMITED_LIVE locked
 *
 * Requirements:
 * - No network
 * - No Solana RPC
 * - No Telegram token
 * - No wallet
 * - No private key
 * - No real Pump SDK
 * - No real Solana SDK
 * - No external DB beyond existing in-memory patterns
 */

import { describe, it, expect } from 'vitest';

// ── Phase 6C exports under test ───────────────────────────────────────────────
import {
  // Types/constants
  DISABLED_WRAPPER_CONFIG,
  PUMP_SDK_WRAPPER_CAPABILITIES,
  // Implementation
  DisabledPumpSdkWrapper,
  DISABLED_PUMP_SDK_WRAPPER,
  createDisabledSdkWrapper,
  // Factory
  createPumpSdkWrapper,
} from '../packages/pump-adapter/src/index.js';

// Type-only imports for shape assertions
import type {
  PumpSdkWrapperMode,
  PumpSdkWrapperStatus,
  PumpSdkWrapperConfig,
  PumpSdkWrapperCapabilities,
  PumpSdkWrapperErrorCode,
  PumpSdkWrapperDisabledResult,
  PumpSdkWrapper,
  PumpSdkWrapperFactoryInput,
} from '../packages/pump-adapter/src/index.js';

// Regression: shared safety locks
import { buildRuntimeSafetyStatus } from '../packages/shared/src/index.js';
// Regression: Phase 6A exports
import {
  PUMP_ADAPTER_CAPABILITIES,
  createDisabledMockAdapter,
  isPumpErr,
} from '../packages/pump-adapter/src/index.js';
// Regression: Phase 6B exports
import { PHASE_6B_BUILDER_CAPABILITIES } from '../packages/pump-adapter/src/index.js';

// ── A. Wrapper types ──────────────────────────────────────────────────────────

describe('Phase 6C — A. Wrapper types', () => {
  it('PumpSdkWrapperMode type accepts only allowed literal values', () => {
    // Type-level check: ensure only valid literals compile
    const disabled: PumpSdkWrapperMode = 'disabled';
    const mock: PumpSdkWrapperMode = 'mock';
    const future: PumpSdkWrapperMode = 'future_live_not_available';
    expect(['disabled', 'mock', 'future_live_not_available']).toContain(disabled);
    expect(['disabled', 'mock', 'future_live_not_available']).toContain(mock);
    expect(['disabled', 'mock', 'future_live_not_available']).toContain(future);
  });

  it('PumpSdkWrapperStatus type accepts only allowed literal values', () => {
    const statuses: PumpSdkWrapperStatus[] = [
      'disabled',
      'unavailable',
      'unsupported',
      'mock_only',
    ];
    expect(statuses).toHaveLength(4);
  });

  it('DISABLED_WRAPPER_CONFIG has all live/executable permissions false', () => {
    const config: PumpSdkWrapperConfig = DISABLED_WRAPPER_CONFIG;
    expect(config.enabled).toBe(false);
    expect(config.allowLiveRpc).toBe(false);
    expect(config.allowInstructionBuilding).toBe(false);
    expect(config.allowExecutableInstructions).toBe(false);
    expect(config.allowSigning).toBe(false);
    expect(config.allowSending).toBe(false);
    expect(config.allowWalletAccess).toBe(false);
  });

  it('DISABLED_WRAPPER_CONFIG has exactly the expected shape', () => {
    const keys = Object.keys(DISABLED_WRAPPER_CONFIG).sort();
    expect(keys).toEqual([
      'allowExecutableInstructions',
      'allowInstructionBuilding',
      'allowLiveRpc',
      'allowSending',
      'allowSigning',
      'allowWalletAccess',
      'enabled',
    ]);
  });

  it('PUMP_SDK_WRAPPER_CAPABILITIES has all 12 capability flags false', () => {
    const caps: PumpSdkWrapperCapabilities = PUMP_SDK_WRAPPER_CAPABILITIES;
    expect(caps.hasPumpSdkRuntime).toBe(false);
    expect(caps.hasSolanaSdkRuntime).toBe(false);
    expect(caps.canUseLiveRpc).toBe(false);
    expect(caps.canBuildRealInstructions).toBe(false);
    expect(caps.canReturnAccountMetas).toBe(false);
    expect(caps.canReturnBinaryInstructionData).toBe(false);
    expect(caps.canSimulateTransactions).toBe(false);
    expect(caps.canSignTransactions).toBe(false);
    expect(caps.canSendTransactions).toBe(false);
    expect(caps.canExecuteTrades).toBe(false);
    expect(caps.canAccessWallets).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('PUMP_SDK_WRAPPER_CAPABILITIES has exactly 12 fields', () => {
    expect(Object.keys(PUMP_SDK_WRAPPER_CAPABILITIES)).toHaveLength(12);
  });

  it('PumpSdkWrapperErrorCode covers all required error codes', () => {
    // Type-level check: ensure all required error codes compile
    const codes: PumpSdkWrapperErrorCode[] = [
      'SDK_WRAPPER_DISABLED',
      'SDK_RUNTIME_NOT_INSTALLED',
      'SOLANA_SDK_FORBIDDEN',
      'LIVE_RPC_FORBIDDEN',
      'REAL_INSTRUCTION_BUILDING_FORBIDDEN',
      'ACCOUNT_METAS_FORBIDDEN',
      'BINARY_DATA_FORBIDDEN',
      'WALLET_ACCESS_FORBIDDEN',
      'SIGNING_FORBIDDEN',
      'SENDING_FORBIDDEN',
      'EXECUTION_FORBIDDEN',
    ];
    expect(codes).toHaveLength(11);
  });

  it('PumpSdkWrapperDisabledResult shape has required safe fields', () => {
    const result: PumpSdkWrapperDisabledResult = {
      ok: false,
      code: 'SDK_WRAPPER_DISABLED',
      message: 'test',
      safeToDisplay: true,
      wrapperMode: 'disabled',
    };
    expect(result.ok).toBe(false);
    expect(result.safeToDisplay).toBe(true);
    expect(result.wrapperMode).toBe('disabled');
  });
});

// ── B. Disabled wrapper ───────────────────────────────────────────────────────

describe('Phase 6C — B. Disabled wrapper', () => {
  it('createDisabledSdkWrapper returns a DisabledPumpSdkWrapper instance', () => {
    const wrapper = createDisabledSdkWrapper();
    expect(wrapper).toBeInstanceOf(DisabledPumpSdkWrapper);
  });

  it('DISABLED_PUMP_SDK_WRAPPER is a DisabledPumpSdkWrapper instance', () => {
    expect(DISABLED_PUMP_SDK_WRAPPER).toBeInstanceOf(DisabledPumpSdkWrapper);
  });

  it('getStatus returns "disabled"', () => {
    const wrapper = createDisabledSdkWrapper();
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('getCapabilities returns all 12 capability flags false', () => {
    const wrapper = createDisabledSdkWrapper();
    const caps = wrapper.getCapabilities();
    expect(caps.hasPumpSdkRuntime).toBe(false);
    expect(caps.hasSolanaSdkRuntime).toBe(false);
    expect(caps.canUseLiveRpc).toBe(false);
    expect(caps.canBuildRealInstructions).toBe(false);
    expect(caps.canReturnAccountMetas).toBe(false);
    expect(caps.canReturnBinaryInstructionData).toBe(false);
    expect(caps.canSimulateTransactions).toBe(false);
    expect(caps.canSignTransactions).toBe(false);
    expect(caps.canSendTransactions).toBe(false);
    expect(caps.canExecuteTrades).toBe(false);
    expect(caps.canAccessWallets).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('getConfig returns all live/executable permission fields false', () => {
    const wrapper = createDisabledSdkWrapper();
    const config = wrapper.getConfig();
    expect(config.enabled).toBe(false);
    expect(config.allowLiveRpc).toBe(false);
    expect(config.allowInstructionBuilding).toBe(false);
    expect(config.allowExecutableInstructions).toBe(false);
    expect(config.allowSigning).toBe(false);
    expect(config.allowSending).toBe(false);
    expect(config.allowWalletAccess).toBe(false);
  });

  it('assertDisabled returns a safe disabled result with ok: false', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.assertDisabled();
    expect(result.ok).toBe(false);
    expect(result.safeToDisplay).toBe(true);
    expect(result.code).toBe('SDK_WRAPPER_DISABLED');
    expect(result.wrapperMode).toBe('disabled');
    expect(typeof result.message).toBe('string');
    expect(result.message.length).toBeGreaterThan(0);
  });

  it('explainDisabledReason returns a non-empty human-readable string', () => {
    const wrapper = createDisabledSdkWrapper();
    const reason = wrapper.explainDisabledReason();
    expect(typeof reason).toBe('string');
    expect(reason.length).toBeGreaterThan(20);
  });

  it('explainDisabledReason mentions key disabled capabilities', () => {
    const wrapper = createDisabledSdkWrapper();
    const reason = wrapper.explainDisabledReason();
    expect(reason.toLowerCase()).toContain('disabled');
    expect(reason.toLowerCase()).toContain('forbidden');
  });

  it('explainDisabledReason does not contain secrets, keys, or URLs', () => {
    const wrapper = createDisabledSdkWrapper();
    const reason = wrapper.explainDisabledReason();
    expect(reason).not.toMatch(/private[_\s]key/i);
    expect(reason).not.toMatch(/secret/i);
    expect(reason).not.toMatch(/mnemonic/i);
    expect(reason).not.toMatch(/https?:\/\//i);
    expect(reason).not.toMatch(/rpc\..*\.(com|io|dev)/i);
  });

  it('wrapper never reports Pump SDK runtime loaded', () => {
    const wrapper = createDisabledSdkWrapper();
    expect(wrapper.getCapabilities().hasPumpSdkRuntime).toBe(false);
  });

  it('wrapper never reports Solana SDK runtime loaded', () => {
    const wrapper = createDisabledSdkWrapper();
    expect(wrapper.getCapabilities().hasSolanaSdkRuntime).toBe(false);
  });

  it('wrapper never reports live capability', () => {
    const wrapper = createDisabledSdkWrapper();
    const caps = wrapper.getCapabilities();
    const capValues = Object.values(caps);
    expect(capValues.every((v) => v === false)).toBe(true);
  });
});

// ── C. Factory ────────────────────────────────────────────────────────────────

describe('Phase 6C — C. Factory', () => {
  it('createPumpSdkWrapper with no args returns disabled wrapper', () => {
    const wrapper = createPumpSdkWrapper();
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('createPumpSdkWrapper with undefined returns disabled wrapper', () => {
    const wrapper = createPumpSdkWrapper(undefined);
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('createPumpSdkWrapper with null returns disabled wrapper', () => {
    const wrapper = createPumpSdkWrapper(null);
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('createPumpSdkWrapper with empty config returns disabled wrapper', () => {
    const wrapper = createPumpSdkWrapper({});
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('createPumpSdkWrapper with enabled:true is coerced to disabled (fail-closed)', () => {
    // enabled:true is unsafe — factory must ignore it and return disabled
    const input: PumpSdkWrapperFactoryInput = { enabled: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canExecuteTrades).toBe(false);
  });

  it('createPumpSdkWrapper with allowLiveRpc:true is coerced to disabled (fail-closed)', () => {
    const input: PumpSdkWrapperFactoryInput = { allowLiveRpc: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canUseLiveRpc).toBe(false);
  });

  it('createPumpSdkWrapper with allowInstructionBuilding:true is coerced to disabled', () => {
    const input: PumpSdkWrapperFactoryInput = { allowInstructionBuilding: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canBuildRealInstructions).toBe(false);
  });

  it('createPumpSdkWrapper with allowExecutableInstructions:true is coerced to disabled', () => {
    const input: PumpSdkWrapperFactoryInput = { allowExecutableInstructions: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
  });

  it('createPumpSdkWrapper with allowSigning:true is coerced to disabled', () => {
    const input: PumpSdkWrapperFactoryInput = { allowSigning: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canSignTransactions).toBe(false);
  });

  it('createPumpSdkWrapper with allowSending:true is coerced to disabled', () => {
    const input: PumpSdkWrapperFactoryInput = { allowSending: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canSendTransactions).toBe(false);
  });

  it('createPumpSdkWrapper with allowWalletAccess:true is coerced to disabled', () => {
    const input: PumpSdkWrapperFactoryInput = { allowWalletAccess: true } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    expect(wrapper.getCapabilities().canAccessWallets).toBe(false);
  });

  it('createPumpSdkWrapper with all unsafe flags set returns disabled', () => {
    const input: PumpSdkWrapperFactoryInput = {
      enabled: true,
      allowLiveRpc: true,
      allowInstructionBuilding: true,
      allowExecutableInstructions: true,
      allowSigning: true,
      allowSending: true,
      allowWalletAccess: true,
    } as PumpSdkWrapperFactoryInput;
    const wrapper = createPumpSdkWrapper(input);
    expect(wrapper.getStatus()).toBe('disabled');
    const caps = wrapper.getCapabilities();
    const capValues = Object.values(caps);
    expect(capValues.every((v) => v === false)).toBe(true);
  });

  it('factory-returned wrapper satisfies PumpSdkWrapper interface', () => {
    const wrapper: PumpSdkWrapper = createPumpSdkWrapper();
    expect(typeof wrapper.getStatus).toBe('function');
    expect(typeof wrapper.getCapabilities).toBe('function');
    expect(typeof wrapper.getConfig).toBe('function');
    expect(typeof wrapper.assertDisabled).toBe('function');
    expect(typeof wrapper.explainDisabledReason).toBe('function');
    expect(typeof wrapper.getLiveQuote).toBe('function');
    expect(typeof wrapper.getLiveBondingCurveState).toBe('function');
    expect(typeof wrapper.buildRealInstruction).toBe('function');
  });
});

// ── D. Forbidden methods ──────────────────────────────────────────────────────

describe('Phase 6C — D. Forbidden methods', () => {
  it('getLiveQuote returns a forbidden error result (ok: false)', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveQuote('TokenMint111111111111111111111111', 'buy');
    expect(result.ok).toBe(false);
  });

  it('getLiveQuote error is safe to display', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveQuote('TokenMint111111111111111111111111', 'buy');
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('getLiveQuote does not return account metas', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveQuote('TokenMint111111111111111111111111', 'buy');
    // The result is an error — there is no value with account metas
    expect(result.ok).toBe(false);
    if (result.ok) {
      // TypeScript ensures this branch is unreachable, but guard anyway
      const val = result.value as Record<string, unknown>;
      expect(val).not.toHaveProperty('accountMetas');
      expect(val).not.toHaveProperty('accounts');
    }
  });

  it('getLiveQuote does not return binary instruction data', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveQuote('TokenMint111111111111111111111111', 'buy');
    expect(result.ok).toBe(false);
    if (result.ok) {
      const val = result.value as Record<string, unknown>;
      expect(val).not.toHaveProperty('data');
      expect(val).not.toHaveProperty('instructionData');
    }
  });

  it('getLiveBondingCurveState returns a forbidden error result (ok: false)', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveBondingCurveState('TokenMint111111111111111111111111');
    expect(result.ok).toBe(false);
  });

  it('getLiveBondingCurveState error is safe to display', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.getLiveBondingCurveState('TokenMint111111111111111111111111');
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('buildRealInstruction returns a forbidden error result (ok: false)', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.buildRealInstruction('buy_intent');
    expect(result.ok).toBe(false);
  });

  it('buildRealInstruction error is safe to display', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.buildRealInstruction('buy_intent');
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('buildRealInstruction does not return account metas', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.buildRealInstruction('buy_intent');
    expect(result.ok).toBe(false);
    if (result.ok) {
      const val = result.value as Record<string, unknown>;
      expect(val).not.toHaveProperty('accountMetas');
      expect(val).not.toHaveProperty('accounts');
    }
  });

  it('buildRealInstruction does not return binary instruction data', () => {
    const wrapper = createDisabledSdkWrapper();
    const result = wrapper.buildRealInstruction('buy_intent');
    expect(result.ok).toBe(false);
    if (result.ok) {
      const val = result.value as Record<string, unknown>;
      expect(val).not.toHaveProperty('data');
      expect(val).not.toHaveProperty('instructionData');
      expect(val).not.toHaveProperty('serialized');
    }
  });
});

// ── E. Safety capabilities ────────────────────────────────────────────────────

describe('Phase 6C — E. Safety capabilities', () => {
  it('wrapper cannot use live RPC', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canUseLiveRpc).toBe(false);
  });

  it('wrapper cannot build real instructions', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canBuildRealInstructions).toBe(false);
  });

  it('wrapper cannot return account metas', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canReturnAccountMetas).toBe(false);
  });

  it('wrapper cannot return binary instruction data', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canReturnBinaryInstructionData).toBe(false);
  });

  it('wrapper cannot simulate transactions', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canSimulateTransactions).toBe(false);
  });

  it('wrapper cannot sign transactions', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canSignTransactions).toBe(false);
  });

  it('wrapper cannot send transactions', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canSendTransactions).toBe(false);
  });

  it('wrapper cannot execute trades', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canExecuteTrades).toBe(false);
  });

  it('wrapper cannot access wallets', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canAccessWallets).toBe(false);
  });

  it('wrapper cannot access private keys', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('wrapper has no Pump SDK runtime', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.hasPumpSdkRuntime).toBe(false);
  });

  it('wrapper has no Solana SDK runtime', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps.hasSolanaSdkRuntime).toBe(false);
  });

  it('all capability values are false', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    const values = Object.values(caps);
    expect(values.every((v) => v === false)).toBe(true);
  });

  it('PUMP_SDK_WRAPPER_CAPABILITIES constant matches instance capabilities', () => {
    const caps = createDisabledSdkWrapper().getCapabilities();
    expect(caps).toEqual(PUMP_SDK_WRAPPER_CAPABILITIES);
  });
});

// ── F. Error safety ───────────────────────────────────────────────────────────

describe('Phase 6C — F. Error safety', () => {
  it('assertDisabled result is safe to display (no stack traces)', () => {
    const result = createDisabledSdkWrapper().assertDisabled();
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('at Object.');
    expect(serialized).not.toContain('at Function.');
    expect(serialized).not.toContain('stack');
  });

  it('assertDisabled result does not contain env values', () => {
    const result = createDisabledSdkWrapper().assertDisabled();
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
    expect(serialized).not.toMatch(/DATABASE_URL/i);
    expect(serialized).not.toMatch(/process\.env/i);
  });

  it('assertDisabled result does not contain RPC URLs', () => {
    const result = createDisabledSdkWrapper().assertDisabled();
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/https?:\/\/.*rpc/i);
    expect(serialized).not.toMatch(/helius|quicknode|triton|alchemy/i);
  });

  it('assertDisabled result does not contain secrets or credentials', () => {
    const result = createDisabledSdkWrapper().assertDisabled();
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/private[_\s]key/i);
    expect(serialized).not.toMatch(/mnemonic/i);
    expect(serialized).not.toMatch(/seed[_\s]phrase/i);
    expect(serialized).not.toMatch(/secret/i);
    expect(serialized).not.toMatch(/bearer/i);
  });

  it('assertDisabled result does not contain wallet data', () => {
    const result = createDisabledSdkWrapper().assertDisabled();
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/keypair/i);
    expect(serialized).not.toMatch(/fromSecretKey/i);
    expect(serialized).not.toMatch(/wallet/i);
  });

  it('getLiveQuote error is safe (no stack traces)', () => {
    const result = createDisabledSdkWrapper().getLiveQuote('TokMint', 'buy');
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('at Object.');
    expect(serialized).not.toContain('stack');
  });

  it('getLiveBondingCurveState error is safe (no secrets)', () => {
    const result = createDisabledSdkWrapper().getLiveBondingCurveState('TokMint');
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/private[_\s]key/i);
    expect(serialized).not.toMatch(/secret/i);
    expect(serialized).not.toMatch(/mnemonic/i);
  });

  it('buildRealInstruction error is safe (no binary or account meta data)', () => {
    const result = createDisabledSdkWrapper().buildRealInstruction('buy_intent');
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('accountMetas');
    expect(serialized).not.toContain('instructionData');
    expect(result.ok).toBe(false);
  });

  it('explainDisabledReason is safe to display (no secrets)', () => {
    const reason = createDisabledSdkWrapper().explainDisabledReason();
    expect(reason).not.toMatch(/private[_\s]key/i);
    expect(reason).not.toMatch(/secret/i);
    expect(reason).not.toMatch(/mnemonic/i);
    expect(reason).not.toMatch(/bearer/i);
    expect(reason).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
  });

  it('isPumpErr returns true for wrapper forbidden error results', () => {
    const wrapper = createDisabledSdkWrapper();
    const liveQuoteResult = wrapper.getLiveQuote('TokMint', 'buy');
    expect(isPumpErr(liveQuoteResult)).toBe(true);
  });
});

// ── G. Regression ─────────────────────────────────────────────────────────────

describe('Phase 6C — G. Regression', () => {
  it('FULL_AUTO and LIMITED_LIVE remain locked (RuntimeSafetyStatus)', () => {
    const status = buildRuntimeSafetyStatus({
      currentMode: 'READ_ONLY',
      fullAutoLocked: true,
      limitedLiveLocked: true,
      liveTradingEnabled: false,
      jito: false,
      pumpFun: false,
      pumpSwap: false,
      solanaRpc: false,
      walletAccess: false,
      privateKeyAccess: false,
    });
    expect(status.fullAutoLocked).toBe(true);
    expect(status.limitedLiveLocked).toBe(true);
    expect(status.liveTradingEnabled).toBe(false);
  });

  it('Phase 6A PUMP_ADAPTER_CAPABILITIES all false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canSignTransactions).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canSendTransactions).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canExecuteTrades).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canUseLiveRpc).toBe(false);
  });

  it('Phase 6A disabled mock adapter still works', () => {
    const adapter = createDisabledMockAdapter();
    expect(adapter.getStatus().status).toBe('disabled');
    expect(adapter.getStatus().executionForbidden).toBe(true);
    expect(adapter.getStatus().isLiveCapable).toBe(false);
  });

  it('Phase 6B PHASE_6B_BUILDER_CAPABILITIES all false', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSignTransactions).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSendTransactions).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canExecuteTrades).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canBuildExecutableInstructions).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canReturnAccountMetas).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canReturnBinaryInstructionData).toBe(false);
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSimulateTransactions).toBe(false);
  });

  it('Phase 6C does not break Phase 6A/6B exports', () => {
    // All key exports still exist
    const wrapper = createPumpSdkWrapper();
    expect(wrapper).toBeDefined();
    expect(DISABLED_WRAPPER_CONFIG).toBeDefined();
    expect(PUMP_SDK_WRAPPER_CAPABILITIES).toBeDefined();
    expect(DISABLED_PUMP_SDK_WRAPPER).toBeDefined();
  });

  it('Phase 6C wrapper is safe to create multiple times', () => {
    const w1 = createDisabledSdkWrapper();
    const w2 = createDisabledSdkWrapper();
    const w3 = createPumpSdkWrapper();
    expect(w1.getStatus()).toBe('disabled');
    expect(w2.getStatus()).toBe('disabled');
    expect(w3.getStatus()).toBe('disabled');
  });
});
