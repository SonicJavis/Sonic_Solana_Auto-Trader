import { randomUUID } from 'crypto';
import type { IAuditRepository } from '@sonic/db';
import type { AppMode } from '@sonic/shared';
import type { TelegramUserInfo } from './permissions.js';
import { PHASE } from '@sonic/shared';

export interface TelegramCommandAuditParams {
  info: TelegramUserInfo;
  command: string;
  accepted: boolean;
  reason?: string | undefined;
  modeBefore?: AppMode | undefined;
  modeAfter?: AppMode | undefined;
  phase?: string | undefined;
}

export interface TelegramCallbackAuditParams {
  info: TelegramUserInfo;
  callbackId: string;
  accepted: boolean;
  reason?: string | undefined;
  modeBefore?: AppMode | undefined;
  modeAfter?: AppMode | undefined;
  phase?: string | undefined;
}

export async function auditTelegramCommand(
  auditLogger: IAuditRepository,
  params: TelegramCommandAuditParams,
): Promise<void> {
  auditLogger.record({
    eventType: 'TELEGRAM_COMMAND',
    severity: params.accepted ? 'info' : 'warn',
    source: 'telegram',
    mode: params.modeBefore,
    phase: params.phase ?? `Phase ${PHASE}`,
    message: `Telegram command ${params.command} — ${params.accepted ? 'accepted' : 'rejected'}`,
    details: {
      command: params.command,
      userId: params.info.userId,
      username: params.info.username,
      chatId: params.info.chatId,
      accepted: params.accepted,
      reason: params.reason,
      modeBefore: params.modeBefore,
      modeAfter: params.modeAfter,
    },
  });
}

export async function auditTelegramCallback(
  auditLogger: IAuditRepository,
  params: TelegramCallbackAuditParams,
): Promise<void> {
  auditLogger.record({
    eventType: 'TELEGRAM_CALLBACK',
    severity: params.accepted ? 'info' : 'warn',
    source: 'telegram',
    mode: params.modeBefore,
    phase: params.phase ?? `Phase ${PHASE}`,
    message: `Telegram callback ${params.callbackId} — ${params.accepted ? 'accepted' : 'rejected'}`,
    details: {
      callbackId: params.callbackId,
      userId: params.info.userId,
      username: params.info.username,
      chatId: params.info.chatId,
      accepted: params.accepted,
      reason: params.reason,
      modeBefore: params.modeBefore,
      modeAfter: params.modeAfter,
    },
  });
}

/** Synthesize a legacy AuditEvent UUID for backward compat */
export function makeAuditId(): string {
  return randomUUID();
}
