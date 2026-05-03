import { pino } from 'pino';
import { LOG_CONTEXT } from '@sonic/shared';

export interface LoggerOptions {
  level?: string;
  name?: string;
}

export function createLogger(options: LoggerOptions = {}) {
  return pino({
    name: options.name ?? LOG_CONTEXT,
    level: options.level ?? 'info',
    redact: {
      paths: ['*.token', '*.secret', '*.password', '*.privateKey', '*.apiKey'],
      censor: '[REDACTED]',
    },
  });
}

export type Logger = ReturnType<typeof createLogger>;

export function createChildLogger(parent: Logger, context: string, bindings?: Record<string, unknown>) {
  return parent.child({ context, ...bindings });
}
