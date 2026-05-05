import type { ReplayErrorCode, ReplayLabError, RlResult } from './types.js';

export function rlErr(code: ReplayErrorCode, message: string): ReplayLabError {
  return { ok: false, code, message };
}

export function rlOk<T>(value: T): RlResult<T> {
  return { ok: true, value };
}

export function isSafeErrorMessage(msg: string): boolean {
  const forbidden = [
    'PRIVATE_KEY',
    'SECRET_KEY',
    'MNEMONIC',
    'SEED_PHRASE',
    'apiKey',
    'rpcUrl',
    'wss://',
    'https://',
    'password',
  ];
  return !forbidden.some(f => msg.toUpperCase().includes(f.toUpperCase()));
}
