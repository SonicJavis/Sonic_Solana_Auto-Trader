import { z } from 'zod';
import { ALL_MODES } from '@sonic/shared';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  APP_MODE: z.enum(ALL_MODES).default('READ_ONLY'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_IDS: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((id) => id.trim()).filter(Boolean) : [])),
  DATABASE_URL: z.string().default('./data/sonic.db'),
});

export type AppConfig = z.infer<typeof envSchema>;
