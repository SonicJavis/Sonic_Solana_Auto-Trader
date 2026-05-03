import { z } from 'zod';

// Phase 3 allowed target modes — LIMITED_LIVE and FULL_AUTO are blocked at config level
export const PHASE3_ALLOWED_MODES = [
  'READ_ONLY',
  'PAPER',
  'MANUAL_CONFIRM',
  'PAUSED',
  'KILL_SWITCH',
] as const;

export type Phase3Mode = (typeof PHASE3_ALLOWED_MODES)[number];

const boolFromEnv = z.preprocess(
  (v) => v === 'true' || v === true,
  z.boolean(),
);

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  // APP_MODE: LIMITED_LIVE and FULL_AUTO are rejected at config level in Phase 3
  APP_MODE: z
    .enum(PHASE3_ALLOWED_MODES)
    .default('READ_ONLY'),
  APP_VERSION: z.string().default('0.1.0'),
  SAFETY_PROFILE: z.enum(['strict', 'default']).default('strict'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_IDS: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((id) => id.trim()).filter(Boolean) : [],
    ),
  DATABASE_URL: z.string().default('./data/sonic.db'),
  // Phase 4: local SQLite audit database path (not a secret — local filesystem path)
  DATABASE_PATH: z.string().default('./data/sonic-solana-autotrader.sqlite'),
  // Phase 4: audit retention settings
  // Bounds: retentionDays 1–365, maxEvents 100–1,000,000 (mirrored in packages/db/src/types.ts constants)
  AUDIT_RETENTION_DAYS: z
    .preprocess(
      (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
      z.number().int().min(1).max(365).default(30),
    ),
  AUDIT_MAX_EVENTS: z
    .preprocess(
      (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
      z.number().int().min(100).max(1_000_000).default(10_000),
    ),
  AUDIT_ROTATION_ENABLED: boolFromEnv.default(true),
  // Unsafe capability flags — all default false.
  // Even if set to true, they do NOT activate any unsafe functionality in Phase 3.
  // Prefer fail-closed: unsafe flags are detected, warned, and capabilities stay disabled.
  ENABLE_LIVE_TRADING: boolFromEnv.default(false),
  ENABLE_AUTO_TRADING: boolFromEnv.default(false),
  ENABLE_TRANSACTION_SIGNING: boolFromEnv.default(false),
  ENABLE_TRANSACTION_SENDING: boolFromEnv.default(false),
  ENABLE_WALLET_LOADING: boolFromEnv.default(false),
  ENABLE_SOLANA_RPC: boolFromEnv.default(false),
  ENABLE_JITO: boolFromEnv.default(false),
  ENABLE_PUMPFUN_TRADING: boolFromEnv.default(false),
  // Unlock flags — do NOT unlock modes in Phase 3. Detected and warned.
  FULL_AUTO_UNLOCKED: boolFromEnv.default(false),
  LIMITED_LIVE_UNLOCKED: boolFromEnv.default(false),
});

export type AppConfig = z.infer<typeof envSchema>;

/** Fields that should never be exposed in logs/summaries/errors */
export const SENSITIVE_FIELDS: ReadonlySet<string> = new Set([
  'TELEGRAM_BOT_TOKEN',
  'DATABASE_URL',
]);

/** Unsafe capability flag field names */
export const UNSAFE_FLAG_FIELDS: ReadonlyArray<string> = [
  'ENABLE_LIVE_TRADING',
  'ENABLE_AUTO_TRADING',
  'ENABLE_TRANSACTION_SIGNING',
  'ENABLE_TRANSACTION_SENDING',
  'ENABLE_WALLET_LOADING',
  'ENABLE_SOLANA_RPC',
  'ENABLE_JITO',
  'ENABLE_PUMPFUN_TRADING',
  'FULL_AUTO_UNLOCKED',
  'LIMITED_LIVE_UNLOCKED',
];
