import { z } from 'zod';
import { ActionEnvelopeSchema } from './action-envelope.js';
import type { AuditEvent, PendingAction, Receipt } from './approval-store.js';

/**
 * Server-owned governed-stream wire contract. Each event is one JSON object followed
 * by a newline (NDJSON, `application/x-ndjson`); the order on the wire is the order
 * the browser must render. This deliberately is not an AI SDK UI-message protocol.
 */
export type GovernedMessagePart =
  | { type: 'text'; text: string; state: 'streaming' | 'complete' }
  | { type: 'tool-call'; toolName: string }
  | { type: 'tool-result'; result: unknown }
  | { type: 'action-proposed'; action: PendingAction }
  | { type: 'approval-decision'; action: PendingAction }
  | { type: 'action-executing'; action: PendingAction }
  | { type: 'action-executed'; action: PendingAction; receipt: Receipt; auditEvents: AuditEvent[] }
  | { type: 'action-rejected'; action: PendingAction; reason: string }
  | { type: 'action-failed'; action: PendingAction; receipt: Receipt; auditEvents: AuditEvent[]; message: string }
  | { type: 'action-expired'; action: PendingAction; message: string }
  | { type: 'error'; message: string; backendDetail?: string };

const PendingActionSchema = ActionEnvelopeSchema.extend({
  state: z.enum(['proposed', 'approved', 'rejected', 'expired', 'executed', 'failed']),
  bindingHash: z.string().regex(/^[a-f0-9]{64}$/),
  approvedBy: z.string().optional(), approvedAt: z.string().datetime({ offset: true }).optional(),
  rejectedBy: z.string().optional(), rejectedAt: z.string().datetime({ offset: true }).optional(), reason: z.string().optional(),
}).strict();
const ReceiptSchema = z.object({
  actionId: z.string(), tenantId: z.string(), approvedBy: z.string().optional(), approvedAt: z.string().datetime({ offset: true }).optional(),
  executedAt: z.string().datetime({ offset: true }), toolName: z.literal('proposeCoverageChange'), bindingHash: z.string().regex(/^[a-f0-9]{64}$/),
  backendReference: z.string().optional(), outcome: z.enum(['success', 'failure']), error: z.string().optional(),
}).strict();
const AuditEventSchema = z.object({ actionId: z.string(), event: z.enum(['proposed', 'approved', 'rejected', 'expired', 'executed', 'failed']), at: z.string().datetime({ offset: true }), actorId: z.string().optional(), reason: z.string().optional() }).strict();

export const GovernedMessagePartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string(), state: z.enum(['streaming', 'complete']) }).strict(),
  z.object({ type: z.literal('tool-call'), toolName: z.string() }).strict(),
  z.object({ type: z.literal('tool-result'), result: z.unknown() }).strict(),
  z.object({ type: z.literal('action-proposed'), action: PendingActionSchema }).strict(),
  z.object({ type: z.literal('approval-decision'), action: PendingActionSchema }).strict(),
  z.object({ type: z.literal('action-executing'), action: PendingActionSchema }).strict(),
  z.object({ type: z.literal('action-executed'), action: PendingActionSchema, receipt: ReceiptSchema, auditEvents: z.array(AuditEventSchema) }).strict(),
  z.object({ type: z.literal('action-rejected'), action: PendingActionSchema, reason: z.string() }).strict(),
  z.object({ type: z.literal('action-failed'), action: PendingActionSchema, receipt: ReceiptSchema, auditEvents: z.array(AuditEventSchema), message: z.string() }).strict(),
  z.object({ type: z.literal('action-expired'), action: PendingActionSchema, message: z.string() }).strict(),
  z.object({ type: z.literal('error'), message: z.string(), backendDetail: z.string().optional() }).strict(),
]);

export function encodeStreamPart(part: GovernedMessagePart): string { return `${JSON.stringify(part)}\n`; }

/** Decodes complete NDJSON records. A blank trailing line is allowed; malformed records fail closed. */
export function decodeStream(text: string): GovernedMessagePart[] {
  return text.split('\n').filter(Boolean).map(line => GovernedMessagePartSchema.parse(JSON.parse(line)) as GovernedMessagePart);
}

/** Reject impossible governed-action transition sequences for each action id. */
export function assertLegalLifecycle(parts: GovernedMessagePart[]): void {
  const states = new Map<string, 'proposed' | 'approved' | 'executing' | 'terminal'>();
  for (const part of parts) {
    if (!('action' in part)) continue;
    const id = part.action.actionId;
    const previous = states.get(id);
    const next = part.type === 'action-proposed' ? 'proposed'
      : part.type === 'approval-decision' ? 'approved'
      : part.type === 'action-executing' ? 'executing' : 'terminal';
    const valid = (next === 'proposed' && previous === undefined)
      || (next === 'approved' && previous === 'proposed')
      || (next === 'executing' && previous === 'approved')
      || (next === 'terminal' && (previous === 'proposed' || previous === 'approved' || previous === 'executing'));
    if (!valid) throw new Error(`Illegal governed lifecycle transition for ${id}: ${previous ?? 'none'} -> ${next}`);
    states.set(id, next);
  }
}
