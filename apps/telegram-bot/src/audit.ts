import { randomUUID } from 'crypto';
import type { IAuditLogger } from '@sonic/db';
import type { AppMode } from '@sonic/shared';
import type { TelegramUserInfo } from './permissions.js';

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
  auditLogger: IAuditLogger,
  params: TelegramCommandAuditParams,
): Promise<void> {
  await auditLogger.log({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    eventType: 'TELEGRAM_COMMAND',
    severity: params.accepted ? 'info' : 'warn',
    details: {
      source: 'telegram',
      phase: params.phase ?? 'Phase 2',
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
  auditLogger: IAuditLogger,
  params: TelegramCallbackAuditParams,
): Promise<void> {
  await auditLogger.log({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    eventType: 'TELEGRAM_CALLBACK',
    severity: params.accepted ? 'info' : 'warn',
    details: {
      source: 'telegram',
      phase: params.phase ?? 'Phase 2',
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
