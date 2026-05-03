import { envSchema, UNSAFE_FLAG_FIELDS, type AppConfig } from './schema.js';
import { redactObject } from './redact.js';

let _config: AppConfig | null = null;

export interface ConfigLoadResult {
  readonly config: AppConfig;
  readonly valid: boolean;
  readonly unsafeFlagsDetected: boolean;
  readonly unsafeFlags: string[];
  readonly warnings: string[];
}

function detectUnsafeFlags(config: AppConfig): string[] {
  return collectUnsafeFlags(config);
}

export function collectUnsafeFlags(config: AppConfig): string[] {
  const detected: string[] = [];
  for (const field of UNSAFE_FLAG_FIELDS) {
    const val = (config as unknown as Record<string, unknown>)[field];
    if (val === true) {
      detected.push(field);
    }
  }
  return detected;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return loadConfigWithResult(env).config;
}

export function loadConfigWithResult(
  env: NodeJS.ProcessEnv = process.env,
): ConfigLoadResult {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    // Redact any sensitive values from error messages before logging
    const safeErrors = result.error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
      code: issue.code,
    }));
    const warnings: string[] = [
      'Config validation failed — safe defaults applied',
      ...safeErrors.map((e) => `${e.path.join('.')}: ${e.message}`),
    ];
    const defaults = envSchema.parse({});
    const unsafeFlags = detectUnsafeFlags(defaults);
    return {
      config: defaults,
      valid: false,
      unsafeFlagsDetected: unsafeFlags.length > 0,
      unsafeFlags,
      warnings,
    };
  }

  const config = result.data;
  const unsafeFlags = detectUnsafeFlags(config);
  const warnings: string[] = [];

  if (unsafeFlags.length > 0) {
    warnings.push(
      `Unsafe flags detected: ${unsafeFlags.join(', ')} — all unsafe capabilities remain DISABLED in Phase 3`,
    );
  }

  return {
    config,
    valid: true,
    unsafeFlagsDetected: unsafeFlags.length > 0,
    unsafeFlags,
    warnings,
  };
}

export function getConfig(): AppConfig {
  if (!_config) {
    _config = loadConfig();
  }
  return _config;
}

export function resetConfig(): void {
  _config = null;
}

/**
 * Returns a safe, redacted summary of the config — never exposes raw secrets.
 */
export function safeConfigSummary(config: AppConfig): Record<string, unknown> {
  const raw: Record<string, unknown> = {
    NODE_ENV: config.NODE_ENV,
    LOG_LEVEL: config.LOG_LEVEL,
    APP_MODE: config.APP_MODE,
    APP_VERSION: config.APP_VERSION,
    SAFETY_PROFILE: config.SAFETY_PROFILE,
    TELEGRAM_BOT_TOKEN: config.TELEGRAM_BOT_TOKEN !== undefined ? '[REDACTED]' : 'not set',
    TELEGRAM_ADMIN_IDS: config.TELEGRAM_ADMIN_IDS.length > 0 ? `[${config.TELEGRAM_ADMIN_IDS.length} configured]` : 'none',
    DATABASE_URL: '[REDACTED]',
    ENABLE_LIVE_TRADING: config.ENABLE_LIVE_TRADING,
    ENABLE_AUTO_TRADING: config.ENABLE_AUTO_TRADING,
    ENABLE_TRANSACTION_SIGNING: config.ENABLE_TRANSACTION_SIGNING,
    ENABLE_TRANSACTION_SENDING: config.ENABLE_TRANSACTION_SENDING,
    ENABLE_WALLET_LOADING: config.ENABLE_WALLET_LOADING,
    ENABLE_SOLANA_RPC: config.ENABLE_SOLANA_RPC,
    ENABLE_JITO: config.ENABLE_JITO,
    ENABLE_PUMPFUN_TRADING: config.ENABLE_PUMPFUN_TRADING,
    FULL_AUTO_UNLOCKED: config.FULL_AUTO_UNLOCKED,
    LIMITED_LIVE_UNLOCKED: config.LIMITED_LIVE_UNLOCKED,
  };
  return redactObject(raw);
}
